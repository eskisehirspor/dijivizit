// Shares a Dijivizit schedule entry (image + caption) on LinkedIn.
//
// Env:
//   LINKEDIN_ACCESS_TOKEN  OAuth token with w_organization_social (company page)
//                          or w_member_social (personal profile)
//   LINKEDIN_AUTHOR        urn:li:organization:<id> or urn:li:person:<id>
//   FORCE_INDEX=n          entry number in marketing/instagram/schedule.json
//   DRY_RUN=1              only print what would be shared
//
// Without a token or author it exits quietly, so the Instagram workflow can
// call it before LinkedIn is connected.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schedule = JSON.parse(
  fs.readFileSync(path.join(ROOT, "marketing/instagram/schedule.json"), "utf8"),
);
const { LINKEDIN_ACCESS_TOKEN: TOKEN, LINKEDIN_AUTHOR: AUTHOR, FORCE_INDEX, DRY_RUN } = process.env;
const VERSION = process.env.LINKEDIN_VERSION || "202510";
const API = "https://api.linkedin.com/rest";

if (!TOKEN || !AUTHOR) {
  console.log(
    "::notice::LinkedIn not connected (LINKEDIN_ACCESS_TOKEN / LINKEDIN_AUTHOR missing); skipping",
  );
  process.exit(0);
}

const entry = schedule.posts[Number(FORCE_INDEX)];
if (!entry) throw new Error(`no schedule entry ${FORCE_INDEX}`);

// LinkedIn has no hashtag discovery worth chasing; keep 3 relevant tags.
const tags = (entry.tags ?? schedule.tags)
  .filter((t) => !/eskişehir|girişimci/.test(t))
  .slice(0, 3);
const commentary = [entry.caption, "", schedule.footer, "", tags.join(" ")].join("\n").trim();
const image = path.join(ROOT, "public/ig/posts", `${entry.id}.jpg`);

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "LinkedIn-Version": VERSION,
  "X-Restli-Protocol-Version": "2.0.0",
};

async function call(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { ...headers, "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${url}: ${res.status} ${await res.text()}`);
  return res;
}

console.log(`LinkedIn ${AUTHOR}: ${entry.id}\n---\n${commentary}\n---`);
if (DRY_RUN) {
  const me = await fetch(`${API}/me`, { headers }).catch(() => null);
  console.log(`::notice::token check: ${me ? me.status : "no response"}`);
  process.exit(0);
}

const init = await call("POST", `${API}/images?action=initializeUpload`, {
  initializeUploadRequest: { owner: AUTHOR },
}).then((r) => r.json());
const { uploadUrl, image: imageUrn } = init.value;

const put = await fetch(uploadUrl, {
  method: "PUT",
  headers: { Authorization: `Bearer ${TOKEN}` },
  body: fs.readFileSync(image),
});
if (!put.ok) throw new Error(`image upload: ${put.status} ${await put.text()}`);

const post = await call("POST", `${API}/posts`, {
  author: AUTHOR,
  commentary: commentary.replace(/[(){}[\]<>@|~_*#\\]/g, (c) => `\\${c}`),
  visibility: "PUBLIC",
  distribution: {
    feedDistribution: "MAIN_FEED",
    targetEntities: [],
    thirdPartyDistributionChannels: [],
  },
  content: { media: { id: imageUrn, altText: entry.caption.split("\n")[0].slice(0, 120) } },
  lifecycleState: "PUBLISHED",
  isReshareDisabledByAuthor: false,
});
console.log(`published LinkedIn post: ${post.headers.get("x-restli-id")}`);
