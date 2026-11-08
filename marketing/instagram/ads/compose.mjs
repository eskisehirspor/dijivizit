// Lays the ad typography over the cinematic renders from render/ads.py.
// node marketing/instagram/ads/compose.mjs <renders dir> <out dir>
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const font = (w) => `file://${root}/node_modules/geist/dist/fonts/geist-sans/Geist-${w}.woff2`;
const [renders, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });

const MARK = `<svg viewBox="0 0 24 24" width="44" height="44"><rect x="2" y="2" width="20" height="20" rx="6" fill="#f4f1ea"/><circle cx="8.6" cy="12" r="1.35" fill="#0b0a09"/><g fill="none" stroke="#0b0a09" stroke-width="1.6" stroke-linecap="round"><path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4"/><path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2"/></g></svg>`;

// posts.json: render posts ({scene}), real-photo posts ({photo}) and type
// posts that sit on a blurred render ({bg}).
const ADS = JSON.parse(fs.readFileSync(path.join(here, "posts.json"), "utf8"));
const only = process.env.ONLY ? new Set(process.env.ONLY.split(",")) : null;

const html = (ad, img) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:G;src:url(${font("Medium")});font-weight:500}
@font-face{font-family:G;src:url(${font("SemiBold")});font-weight:600}
@font-face{font-family:G;src:url(${font("Bold")});font-weight:700}
@font-face{font-family:G;src:url(${font("Black")});font-weight:900}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1350px;position:relative;overflow:hidden;background:#0b0a09;font-family:G;color:#f4f1ea}
.bg{position:absolute;inset:0;background:url(${img}) center/cover}
.type .bg{filter:blur(28px) brightness(.55) saturate(1.2);transform:scale(1.12)}
.type h1{top:auto;bottom:250px;font-size:112px}
.type .ghost{top:auto;bottom:480px;font-size:420px}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,7,6,.82) 0%,rgba(8,7,6,.35) 30%,rgba(8,7,6,0) 48%,rgba(8,7,6,0) 72%,rgba(8,7,6,.75) 100%)}
.ghost{position:absolute;left:-12px;top:150px;font-weight:900;font-size:300px;letter-spacing:-.06em;line-height:.8;color:transparent;-webkit-text-stroke:1.5px rgba(244,241,234,.13);white-space:nowrap}
.top{position:absolute;left:72px;right:72px;top:64px;display:flex;justify-content:space-between;align-items:center}
.brand{display:flex;align-items:center;gap:14px;font-weight:600;font-size:30px;letter-spacing:-.03em}
.tag{font-weight:500;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:rgba(244,241,234,.7);display:flex;align-items:center;gap:14px}
.tag:before{content:"";width:48px;height:1px;background:rgba(244,241,234,.5)}
h1{position:absolute;left:72px;top:170px;font-weight:700;font-size:118px;line-height:.94;letter-spacing:-.055em}
h1 em{font-style:normal;color:#d9a650}
.foot{position:absolute;left:72px;right:72px;bottom:64px;display:flex;justify-content:space-between;align-items:flex-end;gap:40px}
.foot p{max-width:560px;font-weight:500;font-size:26px;line-height:1.35;color:rgba(244,241,234,.82)}
.cta{flex:none;border:1.5px solid rgba(244,241,234,.6);border-radius:999px;padding:18px 30px;font-weight:600;font-size:24px;letter-spacing:-.01em;background:rgba(11,10,9,.35);backdrop-filter:blur(6px)}
.grain{position:absolute;inset:0;opacity:.07;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>")}
</style></head><body class="${ad.bg ? "type" : ""}">
<div class="bg"></div><div class="shade"></div>
<div class="ghost">${ad.ghost}</div>
<div class="top"><div class="brand">${MARK}Dijivizit</div><div class="tag">${ad.eyebrow}</div></div>
<h1>${ad.title}</h1>
<div class="foot"><p>${ad.body}</p><div class="cta">dijivizit.com</div></div>
<div class="grain"></div>
</body></html>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome",
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
for (const ad of ADS) {
  if (only && !only.has(ad.id)) continue;
  const img = ad.photo
    ? path.join(root, ad.photo)
    : path.join(renders, `${ad.bg ?? ad.id}.png`);
  if (!fs.existsSync(img)) continue;
  const tmp = path.join(out, `${ad.id}.html`);
  fs.writeFileSync(tmp, html(ad, `file://${path.resolve(img)}`));
  await page.goto(`file://${path.resolve(tmp)}`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(out, `${ad.id}.jpg`), type: "jpeg", quality: 92 });
  fs.unlinkSync(tmp);
  console.log("composed", ad.id);
}
await browser.close();
