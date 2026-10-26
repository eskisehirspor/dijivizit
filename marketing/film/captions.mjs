// Renders the film's type overlays as transparent 1080x1920 PNGs, in the
// Instagram series' "Temas" system: Geist, ink on paper, second line in grey,
// mono label above. Type stays in the top of the frame (y 250-720), clear of the Reels UI and
// the bottom third where Meta lays its caption and call to action.
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

const INK = "#121213";
const INK2 = "#5E5D59";
const PAPER = "#F3F2EE";
const BRASS = "#9A7743";

const MARK = `<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="2" y="2" width="20" height="20" rx="6" fill="${INK}"/><circle cx="8.6" cy="12" r="1.35" fill="${PAPER}"/><g fill="none" stroke="${PAPER}" stroke-width="1.6" stroke-linecap="round"><path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4"/><path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2"/></g></svg>`;

const CSS = `
@font-face{font-family:Geist;src:url(${F("Geist-Variable.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:GeistMono;src:url(${F("GeistMono-Variable.woff2")}) format("woff2");font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;background:transparent;font-family:Geist;color:${INK};-webkit-font-smoothing:antialiased}
.wrap{position:absolute;left:84px;right:84px;top:250px}
.k{font:500 26px/1 GeistMono;letter-spacing:.14em;text-transform:uppercase;color:${INK2}}
.k b{color:${BRASS};font-weight:500;margin-right:18px}
.h{margin-top:34px;font-weight:620;font-size:108px;line-height:.96;letter-spacing:-.048em}
.h span{color:${INK2}}
.lock{display:flex;align-items:center;gap:18px;font-weight:560;font-size:52px;letter-spacing:-.035em}
.lock i{display:block;width:60px;height:60px}
.pill{position:absolute;left:84px;top:652px;display:inline-flex;align-items:center;gap:20px;background:${INK};color:${PAPER};border-radius:999px;padding:26px 42px;font-size:38px;font-weight:560;letter-spacing:-.02em}
`;

const cap = (label, a, b) =>
  `<div class="wrap"><div class="k">${label}</div><div class="h">${a}<br><span>${b}</span></div></div>`;

const CAPS = {
  "01": cap("Dijivizit", "Kâğıt eskir.", "İzlenim kalır."),
  "02": cap("Akıllı kartvizit", "Uygulama yok.", "Sadece dokunuş."),
  "03": cap("<b>01</b>Nasıl çalışır", "Kartı telefona", "yaklaştırın."),
  "04": cap("<b>02</b>Nasıl çalışır", "Profiliniz", "anında açılsın."),
  "05": cap("<b>03</b>Nasıl çalışır", "Rehbere Kaydet.", "Hepsi bu."),
  "06": cap("Koleksiyon", "Beş kaplama.", "Tek imza."),
  "07": `<div class="wrap"><div class="lock"><i>${MARK}</i>Dijivizit</div><div class="h" style="margin-top:56px">Kartınızı<br><span>seçin.</span></div></div>
<div class="pill">dijivizit.com/siparis <span>→</span></div>`,
};

const b = await chromium.launch({
  executablePath: process.env.CHROMIUM || undefined,
});
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [id, body] of Object.entries(CAPS)) {
  const tmp = path.join(FONTS, `_cap.html`);
  fs.writeFileSync(
    tmp,
    `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`,
  );
  await p.goto(`file://${tmp}`);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(OUT, `${id}.png`), omitBackground: true });
}
await b.close();
fs.rmSync(path.join(FONTS, "_cap.html"), { force: true });
console.log("captions", Object.keys(CAPS).length);
