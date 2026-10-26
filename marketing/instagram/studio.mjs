// Dijivizit Instagram series, "Temas" art direction (see DESIGN.md).
//
//   node marketing/instagram/studio.mjs <renders-dir> <out-dir> [slug,slug,...]
//
// <renders-dir> holds lux.py --theme light renders (transparent PNGs).
// Output: NN-slug.png at 1080x1350, numbered by schedule.json, which is what
// export.py turns into posts and stories.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const [, , RENDERS = "", OUT = "out", ONLY = ""] = process.argv;
const url = (p) => `file://${p}`;
const F = (n) => url(path.join(HERE, "fonts", n));
const R = (n) => url(path.resolve(RENDERS, `${n}.png`));
const LIFE = (n) => url(path.join(ROOT, "public/landing/lifestyle", `${n}.webp`));
const UI = (n) => url(path.join(ROOT, "public/landing/ui", `${n}.webp`));

const C = {
  paper: "#F3F2EE",
  ink: "#121213",
  ink2: "#5E5D59",
  line: "#D9D7D1",
  graphite: "#17171A",
  brass: "#9A7743",
};
// Finish colours, sampled from the renders; they carry the colour in the feed.
const MAT = {
  black: { bg: "#1C1C1F", fg: "#F3F2EE", name: "Mat Siyah Metal" },
  silver: { bg: "#C9CBCD", fg: "#121213", name: "Mat Fırçalanmış Gümüş" },
  gold: { bg: "#C7A877", fg: "#121213", name: "Mat Fırçalanmış Gold" },
  wood: { bg: "#6E4632", fg: "#F3F2EE", name: "Koyu Ahşap" },
  "wood-light": { bg: "#DCC8A6", fg: "#121213", name: "Açık Ahşap" },
};
const ORDER = ["black", "silver", "gold", "wood", "wood-light"];

const MARK = (fg, cut) =>
  `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="${fg}"/><circle cx="8.6" cy="12" r="1.35" fill="${cut}"/><g fill="none" stroke="${cut}" stroke-width="1.6" stroke-linecap="round"><path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4"/><path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2"/></g></svg>`;

// "Temas halkaları": the contactless arcs of the mark, drawn as a large line
// figure. The brand's one graphic device beyond the logo itself.
const ARCS = (color, w = 2) =>
  `<svg viewBox="0 0 200 200" width="100%" height="100%" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"><path d="M52 70a42 42 0 0 1 0 60"/><path d="M86 40a84 84 0 0 1 0 120"/><path d="M120 10a126 126 0 0 1 0 180"/></svg>`;

// Signal rings at the tap point: where card meets phone, the field spreads out.
const SIGNAL = (x, y, { r = 300, color = C.brass, rings = 4 } = {}) =>
  `<div class="abs" style="left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px;pointer-events:none;z-index:3">
<div class="abs" style="inset:0;border-radius:50%;background:radial-gradient(circle,${color}38 0%,${color}14 35%,${color}00 70%)"></div>
<svg viewBox="0 0 200 200" width="100%" height="100%" style="position:absolute;inset:0">${Array.from(
    { length: rings },
    (_, i) => {
      const rr = 18 + i * (78 / rings);
      return `<circle cx="100" cy="100" r="${rr.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${(1.6 - i * 0.25).toFixed(2)}" opacity="${(0.95 - i * 0.2).toFixed(2)}"/>`;
    },
  ).join("")}<circle cx="100" cy="100" r="6" fill="${color}"/></svg></div>`;

const CSS = `
@font-face{font-family:Geist;src:url(${F("Geist-Variable.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:GeistMono;src:url(${F("GeistMono-Variable.woff2")}) format("woff2");font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;overflow:hidden}
body{background:${C.paper};color:${C.ink};font-family:Geist;-webkit-font-smoothing:antialiased;position:relative;font-feature-settings:"ss01","cv11"}
.abs{position:absolute}
.meta{position:absolute;top:64px;left:72px;right:72px;display:flex;justify-content:space-between;align-items:center;font:500 20px/1 GeistMono;letter-spacing:.12em;text-transform:uppercase;z-index:5}
.foot{position:absolute;bottom:60px;left:72px;right:72px;display:flex;justify-content:space-between;align-items:center;z-index:5}
.lock{display:flex;align-items:center;gap:12px;font:500 30px/1 Geist;letter-spacing:-.035em}
.lock svg{width:36px;height:36px;display:block}
.url{font:500 20px/1 GeistMono;letter-spacing:.06em}
.k{font:500 20px/1.2 GeistMono;letter-spacing:.12em;text-transform:uppercase}
.d1{font-weight:620;font-size:128px;line-height:.93;letter-spacing:-.052em}
.d2{font-weight:620;font-size:100px;line-height:.95;letter-spacing:-.048em}
.d3{font-weight:620;font-size:78px;line-height:.98;letter-spacing:-.042em}
.d4{font-weight:600;font-size:56px;line-height:1.02;letter-spacing:-.035em}
.m{color:var(--mute)}
.t{font-size:32px;line-height:1.4;letter-spacing:-.008em;color:var(--mute);font-weight:420}
.rule{height:3px;width:64px;background:currentColor}
.img{position:absolute;background-repeat:no-repeat}
.ph{position:absolute;background-size:cover;background-repeat:no-repeat}
`;

function page({
  theme = "paper",
  bg,
  fg,
  label = "",
  num,
  body,
  mute,
  metaColor,
  footColor,
  footBg,
}) {
  const dark = theme === "dark";
  const B = bg || (dark ? C.graphite : C.paper);
  const T = fg || (dark ? C.paper : C.ink);
  const M = mute || (dark ? "rgba(243,242,238,.66)" : C.ink2);
  const FT = footColor || T;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head>
<body style="background:${B};color:${T};--mute:${M}">
${body}
<div class="meta" style="color:${metaColor || T}"><span>${label}</span></div>
<div class="foot" style="color:${FT}"><div class="lock">${MARK(FT, footBg || B)}Dijivizit</div><div class="url">dijivizit.com</div></div>
</body></html>`;
}

const head = (h, cls = "d2") => `<div class="${cls}">${h}</div>`;
const lines = (a, b) => `${a}<br><span class="m">${b}</span>`;
const img = (
  src,
  { x = 0, y = 0, w = 1080, h = 1350, size = "contain", pos = "center", extra = "" } = {},
) =>
  `<div class="img" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background-image:url('${src}');background-size:${size};background-position:${pos};${extra}"></div>`;

// ------------------------------------------------------------------ layouts

// Product on paper, headline above it. The render owns the lower two thirds.
function hero({ num, label, h, b, src, box, theme, cls = "d2", textTop = 168 }) {
  return page({
    num,
    label,
    theme,
    body: `${img(src, box)}
<div class="abs" style="left:72px;right:72px;top:${textTop}px">${head(h, cls)}${b ? `<p class="t" style="margin-top:32px;max-width:640px">${b}</p>` : ""}</div>`,
  });
}

// Finish colour field over the top; the card crosses the edge of the field.
function material({ num, fin, h, b, src, box }) {
  const m = MAT[fin];
  return page({
    num,
    label: m.name,
    metaColor: m.fg,
    body: `<div class="abs" style="left:0;top:0;width:1080px;height:760px;background:${m.bg}"></div>
${img(src, box)}
<div class="abs" style="left:72px;right:72px;top:930px">${head(h, "d3")}<p class="t" style="margin-top:26px;max-width:760px">${b}</p></div>`,
  });
}

// Type only; the arcs carry the image.
function statement({ num, label, h, b, theme = "paper", cls = "d1", arcs = true, top = 360 }) {
  const dark = theme === "dark";
  const stroke = dark ? "rgba(243,242,238,.2)" : "#CBC8C0";
  return page({
    num,
    label,
    theme,
    body: `${arcs ? `<div class="abs" style="right:-260px;bottom:-200px;width:900px;height:900px">${ARCS(stroke, 1.6)}</div>` : ""}
<div class="abs" style="left:72px;right:72px;top:${top}px">${head(h, cls)}${b ? `<div class="rule" style="margin:56px 0 34px"></div><p class="t" style="max-width:700px">${b}</p>` : ""}</div>`,
  });
}

// Lifestyle photograph, full bleed in the top part; message on paper below.
function photo({ num, label, h, b, src, pos = "center", height = 820, cls = "d3" }) {
  return page({
    num,
    label: "",
    body: `<div class="ph" style="left:0;top:0;width:1080px;height:${height}px;background-image:url('${src}');background-position:${pos}"></div>
<div class="abs k" style="left:72px;top:${height + 64}px;color:${C.ink2}">${label}</div>
<div class="abs" style="left:72px;right:72px;top:${height + 112}px">${head(h, cls)}${b ? `<p class="t" style="margin-top:22px">${b}</p>` : ""}</div>`,
    metaColor: "#fff",
  });
}

// Real app screenshot in a device outline, with numbered notes.
function device(src, { x, y, w = 430, pos = "top" }) {
  const h = Math.round(w * 2.164);
  return `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${w * 0.13}px;background:#0d0d0f;padding:${w * 0.03}px;box-shadow:0 40px 80px -30px rgba(18,18,19,.45)">
<div style="width:100%;height:100%;border-radius:${w * 0.105}px;background:#fff url('${src}') ${pos}/100% auto no-repeat;position:relative;overflow:hidden">
<span style="position:absolute;top:${w * 0.03}px;left:50%;transform:translateX(-50%);width:${w * 0.27}px;height:${w * 0.075}px;border-radius:99px;background:#0d0d0f"></span></div></div>`;
}

function ui({ num, label, h, b, shot, notes = [], x = 578, y = 230, w = 430 }) {
  return page({
    num,
    label,
    body: `${device(UI(shot), { x, y, w })}
<div class="abs" style="left:72px;width:470px;top:200px">${head(h, "d4")}${b ? `<p class="t" style="margin-top:28px">${b}</p>` : ""}
${notes.length ? `<div style="margin-top:56px;border-top:2px solid ${C.ink}">${notes.map((n, i) => `<div style="display:flex;gap:22px;align-items:baseline;padding:20px 0;border-bottom:1px solid ${C.line}"><span class="k" style="color:${C.brass}">0${i + 1}</span><span style="font-size:30px;letter-spacing:-.015em;font-weight:480">${n}</span></div>`).join("")}</div>` : ""}</div>`,
  });
}

// Questions people ask before buying.
function faq({ num, q, a, label = "Sık sorulan" }) {
  return page({
    num,
    label,
    body: `<div class="abs" style="left:72px;top:250px;font:600 300px/0.8 Geist;letter-spacing:-.06em;color:${C.line}">?</div>
<div class="abs" style="left:72px;right:72px;top:560px">${head(q, "d2")}<div class="rule" style="margin:52px 0 34px"></div><p class="t" style="font-size:34px;max-width:860px;color:${C.ink}">${a}</p></div>`,
  });
}

// ------------------------------------------------------------------ posts

const P = {};

P["kagit-eskir"] = (num) =>
  hero({
    num,
    label: "Dijivizit",
    h: lines("Kâğıt eskir.", "İzlenim kalır."),
    b: "NFC ve QR ile çalışan, her zaman güncel kalan akıllı kartvizit.",
    src: R("lux-top-black"),
    box: { x: 40, y: 560, w: 1000, h: 760, size: "118%", pos: "50% 52%" },
    cls: "d1",
  });

const FINCOPY = {
  black: [lines("Siyah.", "Sessiz bir güç."), "Mat siyah yüzey, ince açık gri lazer kazıma."],
  gold: [lines("Altının", "sakin hali."), "Parlamaz, ışıldar. Gösterişsiz bir ayrıcalık."],
  silver: [
    lines("Işıkla", "konuşan metal."),
    "İnce fırça izleri, ışığın açısıyla değişen bir yüzey.",
  ],
  wood: [
    lines("Doğanın", "imzası."),
    "Gerçek ahşap, lazerle yakılmış logo. Her kartın dokusu kendine özgü.",
  ],
  "wood-light": [
    lines("Sade. Sıcak.", "Doğal."),
    "Açık tonlu ahşap; yumuşak, davetkâr bir ilk izlenim.",
  ],
};
for (const fin of ORDER) {
  P[`koleksiyon-${fin}`] = (num) =>
    material({
      num,
      fin,
      h: FINCOPY[fin][0],
      b: FINCOPY[fin][1],
      src: R(`lux-hero-${fin}`),
      box: { x: -60, y: 200, w: 1200, h: 820, size: "150%", pos: "50% 58%" },
    });
}

// Collection index: one finish per post, numbered like an edition.
ORDER.forEach((fin, i) => {
  P[`koleksiyon-no-${fin}`] = (num) =>
    page({
      num,
      label: "Koleksiyon",
      body: `<div class="abs" style="left:58px;top:150px;font:620 360px/0.78 Geist;letter-spacing:-.07em;color:${MAT[fin].bg}">0${i + 1}</div>
<div class="abs k" style="right:72px;top:160px;color:${C.ink2}">0${i + 1} / 05</div>
${img(R(`lux-lean-${fin}`), { x: 0, y: 470, w: 1080, h: 720, size: "104%", pos: "50% 60%" })}
<div class="abs" style="left:72px;right:72px;top:1140px">${head(MAT[fin].name, "d4")}</div>`,
    });
});

P["az-soz"] = (num) =>
  statement({
    num,
    label: "Felsefemiz",
    h: lines("Az söz.", "Kalıcı etki."),
    theme: "dark",
    top: 420,
  });

P["bir-isim"] = (num) =>
  hero({
    num,
    label: "Dijivizit",
    h: lines("Bir isim. Bir dokunuş.", "Bir bağlantı."),
    src: R("lux-float-black"),
    box: { x: 0, y: 420, w: 1080, h: 900, size: "112%", pos: "50% 45%" },
    cls: "d3",
  });

P["detay-her-seydir"] = (num) =>
  page({
    num,
    label: "Lazer kazıma",
    body: `${img(R("lux-macro-gold"), { x: 0, y: 0, w: 1080, h: 900, size: "cover", pos: "50% 50%" })}
<div class="abs" style="left:0;top:0;width:1080px;height:900px;background:linear-gradient(${C.paper}00 70%,${C.paper})"></div>
<div class="abs" style="left:72px;right:72px;top:930px">${head(lines("Detay,", "her şeydir."), "d3")}<p class="t" style="margin-top:24px">Her harf, her çizgi lazerle yüzeye işlenir.</p></div>`,
  });

P["teknik"] = (num) =>
  page({
    num,
    label: "Teknik özellikler",
    body: `${img(R("lux-top-silver"), { x: 520, y: 120, w: 600, h: 520, size: "150%", pos: "45% 50%" })}
<div class="abs" style="left:72px;width:560px;top:200px">${head(lines("Küçük bir kart.", "Büyük bir sistem."), "d3")}</div>
<div class="abs" style="left:72px;right:72px;top:680px;border-top:3px solid ${C.ink}">
${[
  ["Bağlantı", "NFC çip ve yedek QR"],
  ["Uyumluluk", "iPhone ve Android, uygulama gerekmez"],
  ["Enerji", "Pil ve şarj gerektirmez"],
  ["Profil", "Dilediğiniz an güncellenir"],
]
  .map(
    ([k, v]) =>
      `<div style="display:grid;grid-template-columns:260px 1fr;padding:30px 0;border-bottom:1px solid ${C.line};align-items:baseline"><span class="k" style="color:${C.ink2}">${k}</span><span style="font-size:36px;letter-spacing:-.02em;font-weight:500">${v}</span></div>`,
  )
  .join("")}</div>`,
  });

P["bilgilerin-degisir"] = (num) =>
  ui({
    num,
    label: "Her zaman güncel",
    h: lines("Bilgileriniz değişir.", "Kartınız değişmez."),
    b: "Numara, unvan, adres. Panelden güncelleyin; kartınız aynı anda güncellensin.",
    shot: "panel",
  });

P["dokun"] = (num) =>
  hero({
    num,
    label: "Paylaşım",
    h: lines("Dokunun.", "Profiliniz açılsın."),
    src: R("lux-phone-black"),
    box: { x: -40, y: 400, w: 1160, h: 950, size: "118%", pos: "50% 62%" },
  });

P["kaydedildi"] = (num) =>
  photo({
    num,
    label: "Tek dokunuşla",
    h: lines("Rehbere kaydedildi.", "Siz hatırlandınız."),
    src: LIFE("tap"),
    pos: "50% 46%",
  });

P["bes-kaplama"] = (num) =>
  page({
    num,
    label: "Koleksiyon",
    body: `<div class="abs" style="left:72px;right:72px;top:168px">${head(lines("Beş kaplama.", "Tek imza."), "d2")}</div>
${img(R("lux-stack"), { x: -40, y: 470, w: 1160, h: 700, size: "122%", pos: "50% 55%" })}
<div class="abs" style="left:72px;right:72px;top:1150px;display:flex;gap:14px;align-items:center">
${ORDER.map((f) => `<span style="width:30px;height:30px;border-radius:99px;background:${MAT[f].bg};box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)"></span>`).join("")}
<span class="t" style="font-size:26px;margin-left:12px">Siyah metal, gümüş, gold, koyu ve açık ahşap.</span></div>`,
  });

P["masaya-birakilan"] = (num) =>
  page({
    num,
    label: "İlk izlenim",
    body: `${img(R("lux-edge-black"), { x: 0, y: 0, w: 1080, h: 1350, size: "cover", pos: "50% 50%" })}
<div class="abs" style="left:0;right:0;bottom:0;height:520px;background:linear-gradient(${C.paper}00,${C.paper} 55%)"></div>
<div class="abs" style="left:72px;right:72px;top:960px">${head(lines("Masaya bırakılan", "ilk imza."), "d3")}</div>`,
  });

P["kenarina-kadar"] = (num) =>
  page({
    num,
    label: "Kenar işçiliği",
    body: `${img(R("lux-edge-gold"), { x: 0, y: 0, w: 1080, h: 1350, size: "cover", pos: "50% 50%" })}
<div class="abs" style="left:0;right:0;bottom:0;height:520px;background:linear-gradient(${C.paper}00,${C.paper} 55%)"></div>
<div class="abs" style="left:72px;right:72px;top:960px">${head(lines("Kenarına kadar", "özen."), "d3")}</div>`,
  });

P["tanismak"] = (num) =>
  photo({
    num,
    label: "Bağlantı",
    h: lines("Tanışmak bir an.", "Hatırlanmak, bir tercih."),
    src: LIFE("handover"),
    pos: "50% 50%",
  });

P["koleksiyon-liste"] = (num) =>
  page({
    num,
    label: "Koleksiyon",
    body: `<div class="abs" style="left:72px;right:72px;top:168px">${head(lines("Size yakışanı", "seçin."), "d2")}</div>
<div class="abs" style="left:72px;right:72px;top:470px;border-top:3px solid ${C.ink}">
${ORDER.map(
  (f, i) =>
    `<div style="display:flex;align-items:center;gap:30px;height:132px;border-bottom:1px solid ${C.line}">
<span class="k" style="width:60px;color:${C.ink2}">0${i + 1}</span>
<span style="width:178px;height:112px;background:url('${R(`lux-top-${f}`)}') 50% 50%/240% no-repeat"></span>
<span style="font-size:40px;letter-spacing:-.025em;font-weight:520">${MAT[f].name}</span></div>`,
).join("")}</div>`,
  });

P["uygulama-yok"] = (num) =>
  statement({
    num,
    label: "Deneyim",
    h: lines("Uygulama yok.<br>Bekleme yok.", "Sadece dokunuş."),
    b: "Profiliniz, karşınızdakinin telefonunda tarayıcıda açılır. NFC olmayan telefonlarda QR yeterli.",
    cls: "d2",
    top: 300,
  });

P["dogal-doku"] = (num) =>
  page({
    num,
    label: "Koyu Ahşap",
    theme: "dark",
    bg: MAT.wood.bg,
    body: `${img(R("lux-macro-wood"), { x: 0, y: 0, w: 1080, h: 1350, size: "cover", pos: "50% 40%" })}
<div class="abs" style="left:0;right:0;bottom:0;height:640px;background:linear-gradient(${MAT.wood.bg}00,${MAT.wood.bg}f2 60%)"></div>
<div class="abs" style="left:72px;right:72px;top:960px">${head(lines("Her kartın dokusu", "kendine özgü."), "d3")}</div>`,
  });

P["on-yuz-arka-yuz"] = (num) =>
  hero({
    num,
    label: "İki yüz",
    h: lines("Önde dokunuş.", "Arkada imzamız."),
    src: R("lux-duo-black-gold"),
    box: { x: -40, y: 420, w: 1160, h: 900, size: "118%", pos: "50% 55%" },
  });

P["isigi-yakalayan"] = (num) =>
  page({
    num,
    label: "Mat Fırçalanmış Gold",
    bg: "#EDE6DA",
    body: `${img(R("lux-float-gold"), { x: 0, y: 260, w: 1080, h: 1000, size: "112%", pos: "50% 45%" })}
<div class="abs" style="left:72px;right:72px;top:168px">${head(lines("Işığı yakalayan", "bir kartvizit."), "d2")}</div>`,
  });

P["nfc-nedir"] = (num) =>
  faq({
    num,
    q: "NFC nedir?",
    a: "Telefonların temassız ödemede kullandığı yakın alan iletişimi. Dijivizit kartın içindeki küçük çip, telefona dokunduğunda profilinizi açar. Pil yok, şarj yok, uygulama yok.",
  });

P["kaydedilen-aranir"] = (num) =>
  photo({
    num,
    label: "Hatırlanmak",
    h: lines("Kaydedilen", "aranır."),
    src: LIFE("hand"),
    pos: "50% 52%",
  });

P["ahsabin-iki-tonu"] = (num) =>
  page({
    num,
    label: "Ahşap koleksiyonu",
    body: `<div class="abs" style="left:0;top:0;width:540px;height:760px;background:${MAT.wood.bg}"></div>
<div class="abs" style="left:540px;top:0;width:540px;height:760px;background:${MAT["wood-light"].bg}"></div>
${img(R("lux-duo-wood"), { x: -60, y: 180, w: 1200, h: 820, size: "140%", pos: "50% 55%" })}
<div class="abs" style="left:72px;right:72px;top:960px">${head(lines("Ahşabın", "iki tonu."), "d3")}<p class="t" style="margin-top:24px">Koyu ve açık; ikisi de gerçek ahşap, ikisi de NFC.</p></div>`,
    metaColor: C.paper,
  });

P["baglanti"] = (num) =>
  photo({
    num,
    label: "Bağlantı",
    h: lines("Bir dokunuş", "uzağınızda."),
    src: LIFE("wallet"),
    pos: "50% 38%",
  });

for (const fin of ["gold", "black", "wood"]) {
  P[`edisyon-${fin}`] = (num) =>
    page({
      num,
      label: "Edisyon",
      bg: MAT[fin].bg,
      fg: MAT[fin].fg,
      mute: fin === "gold" ? "rgba(18,18,19,.62)" : "rgba(243,242,238,.7)",
      body: `${img(R(`lux-top-${fin}`), { x: -120, y: 200, w: 1320, h: 900, size: "120%", pos: "50% 50%", extra: "filter:drop-shadow(0 30px 40px rgba(0,0,0,.25))" })}
<div class="abs" style="left:72px;right:72px;top:1000px">${head(FINCOPY[fin][0], "d3")}</div>`,
    });
}

P["qr-yedegi"] = (num) =>
  statement({
    num,
    label: "Her telefonda",
    h: lines("NFC yoksa,", "QR var."),
    b: "Her kartın arkasında yedek bir QR kod bulunur. Kamera yeterli.",
    top: 380,
  });

P["dijital-kartvizit-nedir"] = (num) =>
  faq({
    num,
    q: "Akıllı kartvizit<br>nedir?",
    a: "Telefonunuzu, e-postanızı, sosyal hesaplarınızı ve belgelerinizi tek bir sayfada toplayan, NFC ve QR ile paylaşılan dijital kartvizit. Kâğıt bitmez, bilgi eskimez.",
  });

P["sayilarla"] = (num) =>
  page({
    num,
    label: "Sayılarla Dijivizit",
    theme: "dark",
    body: `<div class="abs" style="left:72px;right:72px;top:190px">
${[
  ["0", "kâğıt", "Baskı, kesim, atık yok."],
  ["1", "dokunuş", "Profiliniz anında açılır."],
  ["∞", "güncelleme", "Kart aynı, bilgileriniz hep güncel."],
]
  .map(
    ([a, b, c], i) =>
      `<div style="display:grid;grid-template-columns:300px 1fr;align-items:end;padding:${i ? 40 : 0}px 0 40px;border-bottom:1px solid rgba(243,242,238,.18)">
<span style="font:600 230px/0.8 Geist;letter-spacing:-.06em;color:${i === 2 ? C.brass : C.paper}">${a}</span>
<span><span style="display:block;font-size:56px;font-weight:600;letter-spacing:-.035em">${b}</span><span class="t" style="display:block;margin-top:10px;font-size:30px">${c}</span></span></div>`,
  )
  .join("")}</div>`,
  });

P["her-yerde"] = (num) =>
  page({
    num,
    label: "Her an, her yerde",
    body: `<div class="abs" style="left:72px;right:72px;top:168px">${head(lines("Toplantıda. Fuarda.<br>Kafede.", "Yolda."), "d3")}</div>
${[
  ["handover", "50% 50%"],
  ["tap", "50% 40%"],
  ["wallet", "50% 35%"],
]
  .map(
    ([n, pos], i) =>
      `<div class="ph" style="left:${72 + i * 320}px;top:520px;width:296px;height:640px;background-image:url('${LIFE(n)}');background-position:${pos}"></div>`,
  )
  .join("")}`,
  });

P["ilk-izlenim"] = (num) =>
  statement({
    num,
    label: "İlk izlenim",
    h: lines("İkinci bir şansı", "yoktur."),
    b: "O yüzden ilk dokunuşu özenle tasarladık.",
    theme: "dark",
    top: 400,
  });

P["kurumsal"] = (num) =>
  hero({
    num,
    label: "Kurumsal",
    h: lines("Tüm ekip,", "tek imza."),
    b: "Ekibiniz için aynı tasarım; biri ayrıldığında kart değil, profil değişir.",
    src: R("lux-stack"),
    box: { x: -40, y: 560, w: 1160, h: 700, size: "122%", pos: "50% 55%" },
  });

P["atolye"] = (num) =>
  page({
    num,
    label: "Atölye",
    body: `<div class="abs" style="right:-260px;top:-180px;width:900px;height:900px">${ARCS("#CBC8C0", 1.6)}</div>
<div class="abs" style="left:72px;right:72px;top:400px">${head(lines("Eskişehir'den,", "özenle."), "d2")}</div>
<div class="abs" style="left:72px;right:72px;top:820px;border-top:3px solid ${C.ink}">
${[
  ["Adres", "Osmangazi Mah. Basın Şehitleri Cad. No:174<br>Odunpazarı / Eskişehir"],
  ["Telefon", "0540 626 19 65"],
  ["E-posta", "talep@dijivizit.com"],
]
  .map(
    ([k, v]) =>
      `<div style="display:grid;grid-template-columns:220px 1fr;padding:24px 0;border-bottom:1px solid ${C.line};align-items:baseline"><span class="k" style="color:${C.ink2}">${k}</span><span style="font-size:30px;line-height:1.35;letter-spacing:-.015em;font-weight:480">${v}</span></div>`,
  )
  .join("")}</div>`,
  });

P["siparis"] = (num) =>
  page({
    num,
    label: "Sipariş",
    theme: "dark",
    body: `${img(R("lux-hero-gold"), { x: -80, y: 400, w: 1240, h: 820, size: "140%", pos: "50% 58%" })}
<div class="abs" style="left:72px;right:72px;top:168px">${head(lines("Kartınızı", "seçin."), "d1")}</div>
<div class="abs" style="left:72px;top:1090px;display:inline-flex;align-items:center;gap:16px;background:${C.paper};color:${C.ink};border-radius:99px;padding:22px 34px;font-size:32px;font-weight:560;letter-spacing:-.02em">dijivizit.com/siparis <span style="font-size:30px">→</span></div>`,
  });

P["dokundurun"] = (num) =>
  hero({
    num,
    label: "Nasıl çalışır",
    h: lines("Dokundurun.", "Profiliniz açılsın."),
    src: R("lux-tap-black"),
    box: { x: 260, y: 330, w: 820, h: 1020, size: "128%", pos: "52% 40%" },
    textTop: 168,
  });

P["yaklastirin"] = (num) =>
  page({
    num,
    label: "NFC",
    body: `${img(R("lux-tap-gold-idle"), { x: -40, y: 80, w: 760, h: 1270, size: "142%", pos: "52% 34%" })}
<div class="abs" style="left:620px;right:72px;top:470px">${head(lines("Yaklaştırın.", "Gerisi kendiliğinden."), "d4")}<p class="t" style="margin-top:26px;font-size:30px">Kartınız telefonun üst kısmına değdiği an bağlantı kurulur.</p></div>`,
  });

P["profil-boyle-gorunur"] = (num) =>
  ui({
    num,
    label: "Arayüz",
    h: lines("Profiliniz,", "onun ekranında."),
    shot: "profil",
    notes: [
      "Fotoğraf, ad ve unvan",
      "Rehbere Kaydet",
      "Telefon ve WhatsApp",
      "LinkedIn, e-posta, web",
      "IBAN ve belgeler",
    ],
  });

P["rehberde"] = (num) =>
  page({
    num,
    label: "Tek dokunuşla",
    body: `${device(UI("profil"), { x: 300, y: 560, w: 480 })}
<div class="abs" style="left:72px;right:72px;top:168px;text-align:center">${head(lines("Rehbere", "kaydedildi."), "d2")}<p class="t" style="margin:28px auto 0;max-width:640px">Karşınızdaki tek dokunuşla sizi rehberine ekler.</p></div>`,
  });

P["kilit-ekrani"] = (num) =>
  hero({
    num,
    label: "Uygulama gerekmez",
    h: lines("Telefonun kilidi açık,", "bu kadar."),
    src: R("lux-ui-idle"),
    box: { x: -40, y: 440, w: 1160, h: 900, size: "118%", pos: "50% 55%" },
    cls: "d3",
  });

P["rehbere-kaydet"] = (num) =>
  page({
    num,
    label: "Arayüz",
    body: `<div class="abs" style="left:72px;right:72px;top:168px">${head(lines("Rehbere Kaydet.", "Hepsi bu."), "d2")}</div>
<div class="abs" style="left:72px;right:72px;top:470px;height:700px;border-radius:44px;overflow:hidden;background:#fff url('${UI("profil")}') 50% 22%/118% auto no-repeat;box-shadow:0 0 0 1px ${C.line}"></div>`,
  });

P["ahsapta-da-ayni"] = (num) =>
  hero({
    num,
    label: "Ceviz",
    h: lines("Ahşapta da", "aynı tek dokunuş."),
    src: R("lux-tap-wood"),
    box: { x: 260, y: 330, w: 820, h: 1020, size: "128%", pos: "52% 40%" },
  });

P["uc-adim"] = (num) =>
  page({
    num,
    label: "Nasıl çalışır",
    body: `<div class="abs" style="left:72px;right:72px;top:168px">${head(lines("Üç adımda", "tanışın."), "d2")}</div>
<div class="abs" style="left:72px;right:72px;top:520px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
${[
  [R("lux-tap-gold-idle"), "50% 30%", "180%", "01", "Yaklaştırın"],
  [R("lux-tap-black"), "50% 34%", "180%", "02", "Profil açılır"],
  [UI("profil"), "50% 26%", "150%", "03", "Rehbere kaydedin"],
]
  .map(
    ([src, pos, size, n, t]) =>
      `<div><div style="height:520px;border-radius:28px;background:#fff url('${src}') ${pos}/${size} no-repeat;box-shadow:0 0 0 1px ${C.line}"></div>
<div style="display:flex;gap:14px;align-items:baseline;margin-top:24px"><span class="k" style="color:${C.brass}">${n}</span><span style="font-size:30px;font-weight:540;letter-spacing:-.02em">${t}</span></div></div>`,
  )
  .join("")}</div>`,
  });

// ------------------------------------------------------------------ build

const sched = JSON.parse(fs.readFileSync(path.join(HERE, "schedule.json"), "utf8"));
const missing = sched.posts.filter((e) => !P[e.source]).map((e) => e.source);
if (missing.length) throw new Error(`no design for: ${missing.join(", ")}`);
const only = ONLY ? new Set(ONLY.split(",")) : null;
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome",
  args: ["--allow-file-access-from-files"],
});
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 } });
let n = 0;
for (const e of sched.posts) {
  if (only && !only.has(e.source)) continue;
  const num = e.id.slice(0, 2);
  const pg = await ctx.newPage();
  const file = path.join(OUT, `${num}-${e.source}.html`);
  fs.writeFileSync(file, P[e.source](num));
  await pg.goto(url(path.resolve(file)));
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(150);
  await pg.screenshot({ path: path.join(OUT, `${num}-${e.source}.png`) });
  fs.unlinkSync(file);
  await pg.close();
  n += 1;
}
await browser.close();
console.log(`built ${n}`);
