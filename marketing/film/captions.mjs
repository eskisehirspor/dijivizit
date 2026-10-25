// Renders the film's caption overlays as transparent 1080x1920 PNGs.
// node marketing/film/captions.mjs  -> marketing/film/captions/<id>.png
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FONTS = path.resolve(HERE, "../instagram/fonts");
const F = (n) => `file://${path.join(FONTS, n)}`;
const OUT = path.join(HERE, "captions");
fs.mkdirSync(OUT, { recursive: true });

const MARK = `<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="2" y="2" width="20" height="20" rx="6" fill="#f4efe6"/><circle cx="8.6" cy="12" r="1.35" fill="#141210"/><g fill="none" stroke="#141210" stroke-width="1.6" stroke-linecap="round"><path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4"/><path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2"/></g></svg>`;

const CSS = `
@font-face{font-family:IT;src:url(${F("inter-tight-latin-ext-wght-normal.woff2")}) format("woff2");font-weight:100 900;unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:IT;src:url(${F("inter-tight-latin-wght-normal.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:Corm;src:url(${F("cormorant-garamond-latin-ext-500-italic.woff2")}) format("woff2");font-style:italic;font-weight:500;unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:Corm;src:url(${F("cormorant-garamond-latin-500-italic.woff2")}) format("woff2");font-style:italic;font-weight:500}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;background:transparent;font-family:IT;color:#f4efe6;-webkit-font-smoothing:antialiased}
.wrap{position:absolute;left:70px;right:70px;top:300px;text-align:center}
.h{font-weight:600;font-size:96px;line-height:1.02;letter-spacing:-.035em;text-shadow:0 2px 40px rgba(0,0,0,.55)}
.it{font-family:Corm;font-style:italic;font-weight:500;letter-spacing:-.01em;font-size:1.14em;color:#d8b98a}
.s{margin-top:28px;font-size:36px;font-weight:450;letter-spacing:.01em;color:#cfc6b8}
.pill{display:inline-flex;align-items:center;gap:16px;margin-top:46px;background:#d8b98a;color:#141210;border-radius:999px;padding:26px 46px;font-size:36px;font-weight:650;letter-spacing:-.01em}
.url{margin-top:26px;font-size:34px;font-weight:500;letter-spacing:.06em;color:#f4efe6}
.brand{display:inline-flex;align-items:center;gap:22px;font-size:80px;font-weight:700;letter-spacing:-.04em}
.brand i{display:block;width:92px;height:92px}
`;

const CAPS = {
  "01": `<div class="h">Kâğıt kartvizit<br><span class="it">çekmecede kaybolur.</span></div>`,
  "02": `<div class="h">Dijivizit ise<br><span class="it">rehberde kalır.</span></div>`,
  "03": `<div class="h">Kartı telefona<br><span class="it">yaklaştırın,</span></div>`,
  "04": `<div class="h">profiliniz<br><span class="it">anında açılsın.</span></div>`,
  "05": `<div class="h">Tek dokunuşla<br><span class="it">rehbere kaydedilsin.</span></div>`,
  "06": `<div class="h">Metal ve ahşap,<br><span class="it">beş kaplama.</span></div>`,
  "07": `<div class="brand"><i>${MARK}</i>Dijivizit</div><div class="s">NFC akıllı kartvizit</div><div><span class="pill">Bizimle iletişime geçin</span></div><div class="url">dijivizit.com</div>`,
};

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [id, body] of Object.entries(CAPS)) {
  const tmp = path.join(FONTS, `_cap.html`);
  fs.writeFileSync(
    tmp,
    `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="wrap">${body}</div></body></html>`,
  );
  await p.goto(`file://${tmp}`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(OUT, `${id}.png`), omitBackground: true });
}
await b.close();
fs.rmSync(path.join(FONTS, "_cap.html"), { force: true });
console.log("captions", Object.keys(CAPS).length);
