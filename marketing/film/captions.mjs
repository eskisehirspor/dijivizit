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

const MARK = `<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="2" y="2" width="20" height="20" rx="6" fill="#0d0d0e"/><circle cx="8.6" cy="12" r="1.35" fill="#fff"/><g fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4"/><path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2"/></g></svg>`;

const CSS = `
@font-face{font-family:IT;src:url(${F("inter-tight-latin-ext-wght-normal.woff2")}) format("woff2");font-weight:100 900;unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:IT;src:url(${F("inter-tight-latin-wght-normal.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:Corm;src:url(${F("cormorant-garamond-latin-ext-500-italic.woff2")}) format("woff2");font-style:italic;font-weight:500;unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:Corm;src:url(${F("cormorant-garamond-latin-500-italic.woff2")}) format("woff2");font-style:italic;font-weight:500}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;background:transparent;font-family:IT;color:#0d0d0e;-webkit-font-smoothing:antialiased}
.wrap{position:absolute;left:80px;right:80px;top:330px;text-align:center}
.h{font-weight:650;font-size:92px;line-height:1.02;letter-spacing:-.035em}
.it{font-family:Corm;font-style:italic;font-weight:500;letter-spacing:-.01em;font-size:1.12em}
.w{color:#fff}
.s{margin-top:26px;font-size:34px;font-weight:450;letter-spacing:-.005em;color:#1c1c1e;opacity:.8}
.pill{display:inline-flex;align-items:center;gap:16px;margin-top:44px;background:#0d0d0e;color:#fff;border-radius:999px;padding:24px 42px;font-size:34px;font-weight:600;letter-spacing:-.01em}
.brand{display:inline-flex;align-items:center;gap:20px;font-size:64px;font-weight:700;letter-spacing:-.04em}
.brand i{display:block;width:76px;height:76px}
`;

const CAPS = {
  "01": `<div class="h w">Kâğıt kartvizit<br><span class="it">eskidi.</span></div>`,
  "02": `<div class="h">Tanışın:<br><span class="it">Dijivizit.</span></div>`,
  "03": `<div class="h">NFC akıllı<br><span class="it">kartvizit.</span></div>`,
  "04": `<div class="h">Siyah. Gold.<br>Gümüş. <span class="it">Ahşap.</span></div>`,
  "05": `<div class="h">Telefona<br><span class="it">dokundurun.</span></div>`,
  "06": `<div class="h">Profiliniz<br><span class="it">anında açılsın.</span></div>`,
  "07": `<div class="h">Tek dokunuşla<br><span class="it">rehberde.</span></div>`,
  "08": `<div class="h">Uygulama yok.<br><span class="it">Bekleme yok.</span></div>`,
  "09": `<div class="brand"><i>${MARK}</i>Dijivizit</div><div class="s">NFC akıllı kartvizit · Metal ve ahşap</div><div><span class="pill">Bizimle iletişime geçin · dijivizit.com</span></div>`,
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
