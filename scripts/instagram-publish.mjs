// Publishes today's Dijivizit Instagram post (and story) from
// marketing/instagram/schedule.json via the Instagram API with Instagram Login.
//
// Env:
//   IG_USER_ID       Instagram professional account ID
//   IG_ACCESS_TOKEN  long-lived Instagram User access token
//   DRY_RUN=1        only print what would be published
//   FORCE_INDEX=n    publish entry n instead of today's
//   SKIP_STORY=1     post only
//
// Images are fetched by Instagram from public URLs under MEDIA_BASE
// (default https://dijivizit.com/ig), so they must be deployed first.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schedule = JSON.parse(
  fs.readFileSync(path.join(ROOT, "marketing/instagram/schedule.json"), "utf8"),
);

const API = `https://graph.instagram.com/${process.env.GRAPH_VERSION || "v26.0"}`;
const MEDIA_BASE = (process.env.MEDIA_BASE || "https://dijivizit.com/ig").replace(/\/$/, "");
const { IG_USER_ID, IG_ACCESS_TOKEN, DRY_RUN, FORCE_INDEX, SKIP_STORY } = process.env;

/** Day number since the series start, in Istanbul time. */
function todayIndex() {
  const day = (d) =>
    Math.floor(
      new Date(d.toLocaleString("en-US", { timeZone: "Europe/Istanbul" })).setHours(0, 0, 0, 0) /
        86400000,
    );
  return day(new Date()) - day(new Date(`${schedule.start}T12:00:00+03:00`));
}

async function call(method, pathname, params) {
  const url = new URL(`${API}${pathname}`);
  const body = new URLSearchParams({ ...params, access_token: IG_ACCESS_TOKEN });
  const res = method === "GET" ? await fetch(`${url}?${body}`) : await fetch(url, { method, body });
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(`${method} ${pathname}: ${JSON.stringify(json.error ?? json)}`);
  }
  return json;
}

async function waitReady(containerId) {
  for (let i = 0; i < 30; i++) {
    const { status_code } = await call("GET", `/${containerId}`, { fields: "status_code" });
    if (status_code === "FINISHED") return;
    if (status_code === "ERROR" || status_code === "EXPIRED") {
      throw new Error(`container ${containerId} ${status_code}`);
    }
    await new Promise((r) => setTimeout(r, 4000));
  }
  throw new Error(`container ${containerId} not ready in time`);
}

async function publish(params, label) {
  const { id } = await call("POST", `/${IG_USER_ID}/media`, params);
  await waitReady(id);
  const res = await call("POST", `/${IG_USER_ID}/media_publish`, { creation_id: id });
  console.log(`published ${label}: ${res.id}`);
  return res.id;
}

const index = FORCE_INDEX !== undefined && FORCE_INDEX !== "" ? Number(FORCE_INDEX) : todayIndex();
const entry = schedule.posts[index];

if (index < 0) {
  console.log(`series starts ${schedule.start}; nothing to publish yet`);
  process.exit(0);
}
if (!entry) {
  console.log(`series finished (day ${index}, ${schedule.posts.length} posts); nothing to publish`);
  process.exit(0);
}

const caption = [entry.caption, "", schedule.footer, "", (entry.tags ?? schedule.tags).join(" ")]
  .join("\n")
  .trim();
const imageUrl = `${MEDIA_BASE}/posts/${entry.id}.jpg`;
const storyUrl = `${MEDIA_BASE}/stories/${entry.id}.jpg`;

console.log(`day ${index}: ${entry.id}\n${imageUrl}\n---\n${caption}\n---`);

if (DRY_RUN) {
  const res = await fetch(imageUrl, { method: "HEAD" });
  console.log(`image reachable: ${res.status}`);
  process.exit(res.ok ? 0 : 1);
}
if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
  throw new Error("IG_USER_ID and IG_ACCESS_TOKEN are required");
}

await publish({ image_url: imageUrl, caption }, "post");
if (!SKIP_STORY) {
  await publish({ image_url: storyUrl, media_type: "STORIES" }, "story");
}
