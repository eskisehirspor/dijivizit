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

function page({ theme = "paper", bg, fg, label = "", body, mute, metaColor, footColor, footBg }) {
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
// ------------------------------------------------------------------ layouts

// Type only; the arcs carry the image.
function statement({ num, label, h, b, theme = "paper", cls = "d1", arcs = true, top = 360 }) {
  const dark = theme === "dark";
  const stroke = dark ? "rgba(243,242,238,.2)" : "#CBC8C0";
  return page({
    num,
    label,
    theme,
    body: `${arcs ? `<div class="abs" style="left:0;top:0;width:1080px;height:1170px;overflow:hidden;-webkit-mask-image:linear-gradient(#000 1040px,transparent 1150px)"><div class="abs" style="right:-340px;top:500px;width:900px;height:900px">${ARCS(stroke, 1.6)}</div></div>` : ""}
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

// Renders are placed as <img> at an exact width so tap points can be located
// (fx, fy are fractions of the render). Anything reaching the footer fades out
// above it: the lock-up and the URL always sit on clean ground.
const FOOT_FADE = [1150, 1212];
function rimg(name, { left, top, width, fade = FOOT_FADE, filter = "", z = 1 }) {
  const h = width * 1.25;
  const f0 = fade[0] - top;
  const f1 = fade[1] - top;
  const mask =
    top + h > fade[0]
      ? `-webkit-mask-image:linear-gradient(#000 ${f0}px,transparent ${f1}px);`
      : "";
  return `<img src="${R(name)}" style="position:absolute;left:${left}px;top:${top}px;width:${width}px;${mask}${filter ? `filter:${filter};` : ""}z-index:${z}">`;
}
const at = ({ left, top, width }, fx, fy) => [left + fx * width, top + fy * width * 1.25];

// A tight card crop (prep.py), placed by width; ratio of the crop is ~1.367.
const card = (fin, { left, top, width, rot = 0, filter = "" }) =>
  `<img src="${R(`card-${fin}`)}" style="position:absolute;left:${left}px;top:${top}px;width:${width}px;transform:rotate(${rot}deg);${filter ? `filter:${filter};` : ""}z-index:1">`;
const GOLD = "brightness(1.08) saturate(1.06)";

function headBlock(h, b, { cls = "d2", top = 168, width = 936, left = 72 } = {}) {
  return `<div class="abs" style="left:${left}px;width:${width}px;top:${top}px;z-index:4">${head(h, cls)}${b ? `<p class="t" style="margin-top:28px;max-width:700px">${b}</p>` : ""}</div>`;
}

const P = {};

P["kagit-eskir"] = (num) =>
  page({
    num,
    label: "Dijivizit",
    body: `${headBlock(lines("Kâğıt eskir.", "İzlenim kalır."), "NFC ve QR ile çalışan, her zaman güncel kalan akıllı kartvizit.", { cls: "d1" })}
${card("black", { left: 150, top: 610, width: 780 })}`,
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

// Material: the finish's colour field; the card lies across its edge.
for (const fin of ORDER) {
  P[`koleksiyon-${fin}`] = (num) =>
    page({
      num,
      label: MAT[fin].name,
      metaColor: MAT[fin].fg,
      body: `<div class="abs" style="left:0;top:0;width:1080px;height:640px;background:${MAT[fin].bg}"></div>
${card(fin, { left: 150, top: 300, width: 780, filter: fin === "gold" ? GOLD : "" })}
${headBlock(FINCOPY[fin][0], FINCOPY[fin][1], { cls: "d3", top: 940 })}`,
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
${rimg(`lux-lean-${fin}`, { left: -40, top: 260, width: 1160, fade: [1060, 1120], filter: fin === "gold" ? GOLD : "" })}
<div class="abs" style="left:72px;right:72px;top:1110px">${head(MAT[fin].name, "d4")}</div>`,
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
  page({
    num,
    label: "Dijivizit",
    body: `${headBlock(lines("Bir isim. Bir dokunuş.", "Bir bağlantı."), "", { cls: "d3" })}
${rimg("lux-float-black", { left: 70, top: 190, width: 900 })}`,
  });

P["detay-her-seydir"] = (num) =>
  page({
    num,
    label: "Lazer kazıma",
    metaColor: C.paper,
    body: `${rimg("lux-macro-black", { left: 0, top: -380, width: 1080, fade: [860, 960] })}
${headBlock(lines("Detay,", "her şeydir."), "Her harf, her çizgi lazerle yüzeye işlenir.", { cls: "d3", top: 960 })}`,
  });

P["teknik"] = (num) =>
  page({
    num,
    label: "Teknik özellikler",
    body: `${headBlock(lines("Küçük bir kart.", "Büyük bir sistem."), "", { cls: "d3", width: 560 })}
${card("silver", { left: 600, top: 170, width: 420, rot: 4 })}
<div class="abs" style="left:72px;right:72px;top:560px;border-top:3px solid ${C.ink}">
${[
  ["Bağlantı", "NFC çip ve yedek QR"],
  ["Uyumluluk", "iPhone ve Android, uygulama gerekmez"],
  ["Enerji", "Pil ve şarj gerektirmez"],
  ["Profil", "Dilediğiniz an güncellenir"],
]
  .map(
    ([k, v]) =>
      `<div style="display:grid;grid-template-columns:260px 1fr;padding:40px 0;border-bottom:1px solid ${C.line};align-items:baseline"><span class="k" style="color:${C.ink2}">${k}</span><span style="font-size:38px;letter-spacing:-.02em;font-weight:500">${v}</span></div>`,
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
  page({
    num,
    label: "Paylaşım",
    body: `${headBlock(lines("Dokunun.", "Profiliniz açılsın."))}
${rimg("lux-ui-profile", { left: 30, top: 110, width: 1100 })}`,
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
    body: `${headBlock(lines("Beş kaplama.", "Tek imza."), "")}
<div class="abs" style="left:72px;right:72px;top:400px;display:flex;gap:14px;align-items:center;z-index:4">
${ORDER.map((f) => `<span style="width:30px;height:30px;border-radius:99px;background:${MAT[f].bg};box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)"></span>`).join("")}
<span class="t" style="font-size:28px;margin-left:12px">Siyah metal, gümüş, gold, koyu ve açık ahşap.</span></div>
${rimg("lux-stack", { left: -20, top: 300, width: 1120 })}`,
  });

P["masaya-birakilan"] = (num) =>
  page({
    num,
    label: "İlk izlenim",
    metaColor: C.paper,
    body: `${rimg("lux-edge-black", { left: 0, top: -120, width: 1080, fade: [820, 940] })}
${headBlock(lines("Masaya bırakılan", "ilk imza."), "", { cls: "d3", top: 960 })}`,
  });

P["kenarina-kadar"] = (num) =>
  page({
    num,
    label: "Kenar işçiliği",
    body: `${rimg("lux-edge-gold", { left: 0, top: -120, width: 1080, fade: [820, 940], filter: GOLD })}
${headBlock(lines("Kenarına kadar", "özen."), "", { cls: "d3", top: 960 })}`,
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
    body: `${headBlock(lines("Size yakışanı", "seçin."), "")}
<div class="abs" style="left:72px;right:72px;top:440px;border-top:3px solid ${C.ink}">
${ORDER.map(
  (f, i) =>
    `<div style="display:flex;align-items:center;gap:34px;height:142px;border-bottom:1px solid ${C.line}">
<span class="k" style="width:44px;color:${C.ink2}">0${i + 1}</span>
<span style="width:170px;height:120px;background:url('${R(`card-${f}`)}') center/contain no-repeat;${f === "gold" ? `filter:${GOLD}` : ""}"></span>
<span style="font-size:42px;letter-spacing:-.028em;font-weight:540">${MAT[f].name}</span></div>`,
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
    body: `${rimg("lux-macro-wood", { left: 0, top: -200, width: 1080, fade: [760, 920] })}
${headBlock(lines("Her kartın dokusu", "kendine özgü."), "", { cls: "d3", top: 960 })}`,
  });

P["on-yuz-arka-yuz"] = (num) =>
  page({
    num,
    label: "İki yüz",
    body: `${headBlock(lines("Önde dokunuş.", "Arkada imzamız."))}
${rimg("lux-duo-black-gold", { left: -10, top: 260, width: 1100, filter: GOLD })}`,
  });

P["isigi-yakalayan"] = (num) =>
  page({
    num,
    label: "Mat Fırçalanmış Gold",
    bg: "#EDE6DA",
    body: `${headBlock(lines("Işığı yakalayan", "bir kartvizit."))}
${rimg("lux-float-gold", { left: 0, top: 230, width: 1080, filter: GOLD })}`,
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
    metaColor: C.paper,
    body: `<div class="abs" style="left:0;top:0;width:540px;height:640px;background:${MAT.wood.bg}"></div>
<div class="abs" style="left:540px;top:0;width:540px;height:640px;background:${MAT["wood-light"].bg}"></div>
${rimg("lux-duo-wood", { left: 0, top: 120, width: 1080, fade: [900, 960] })}
${headBlock(lines("Ahşabın", "iki tonu."), "Koyu ve açık; ikisi de gerçek ahşap, ikisi de NFC.", { cls: "d3", top: 960 })}`,
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
      body: `${card(fin, { left: 110, top: 230, width: 860, rot: -4, filter: `${fin === "gold" ? GOLD : ""} drop-shadow(0 40px 50px rgba(0,0,0,.28))` })}
${headBlock(FINCOPY[fin][0], "", { cls: "d3", top: 1000 })}`,
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
    body: `<div class="abs" style="left:72px;right:72px;top:200px">
${[
  ["0", "kâğıt", "Baskı, kesim, atık yok."],
  ["1", "dokunuş", "Profiliniz anında açılır."],
  ["∞", "güncelleme", "Kart aynı, bilgileriniz hep güncel."],
]
  .map(
    ([a, b, c], i) =>
      `<div style="display:grid;grid-template-columns:300px 1fr;align-items:end;padding:${i ? 44 : 0}px 0 44px;border-bottom:1px solid rgba(243,242,238,.18)">
<span style="font:600 230px/0.8 Geist;letter-spacing:-.06em;color:${i === 2 ? "#C7A877" : C.paper}">${a}</span>
<span><span style="display:block;font-size:58px;font-weight:600;letter-spacing:-.035em">${b}</span><span class="t" style="display:block;margin-top:10px;font-size:30px">${c}</span></span></div>`,
  )
  .join("")}</div>`,
  });

P["her-yerde"] = (num) =>
  page({
    num,
    label: "Her an, her yerde",
    body: `${headBlock(lines("Toplantıda. Fuarda.<br>Kafede.", "Yolda."), "", { cls: "d3" })}
${[
  ["handover", "50% 50%"],
  ["tap", "50% 40%"],
  ["wallet", "50% 35%"],
]
  .map(
    ([n, pos], i) =>
      `<div class="ph" style="left:${72 + i * 320}px;top:500px;width:296px;height:660px;background-image:url('${LIFE(n)}');background-position:${pos}"></div>`,
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
  page({
    num,
    label: "Kurumsal",
    body: `${headBlock(lines("Tüm ekip,", "tek imza."), "Ekibiniz için aynı tasarım; biri ayrıldığında kart değil, profil değişir.")}
${rimg("lux-stack", { left: -40, top: 0, width: 1160 })}`,
  });

P["atolye"] = (num) =>
  page({
    num,
    label: "Atölye",
    body: `<div class="abs" style="right:-260px;top:-180px;width:900px;height:900px">${ARCS("#CBC8C0", 1.6)}</div>
${headBlock(lines("Eskişehir'den,", "özenle."), "", { top: 400 })}
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
    body: `${headBlock(lines("Kartınızı", "seçin."), "", { cls: "d1" })}
${card("gold", { left: 330, top: 470, width: 700, rot: -8, filter: `${GOLD} drop-shadow(0 40px 50px rgba(0,0,0,.5))` })}
<div class="abs" style="left:72px;top:1080px;display:inline-flex;align-items:center;gap:16px;background:${C.paper};color:${C.ink};border-radius:99px;padding:24px 36px;font-size:34px;font-weight:560;letter-spacing:-.02em;z-index:4">dijivizit.com/siparis <span>→</span></div>`,
  });

// Tap moments: the phone big, the real profile on screen, rings at the touch.
function tapPost({
  num,
  label,
  h,
  b,
  shot,
  ring = [0.6, 0.235],
  box = { left: -150, top: 250, width: 1300 },
  cls = "d2",
}) {
  const [x, y] = at(box, ring[0], ring[1]);
  return page({
    num,
    label,
    body: `${headBlock(h, b, { cls })}
${rimg(shot, box)}
${SIGNAL(x, y, { r: 230 })}`,
  });
}

P["dokundurun"] = (num) =>
  tapPost({
    num,
    label: "Nasıl çalışır",
    h: lines("Dokundurun.", "Profiliniz açılsın."),
    shot: "lux-tap-black",
  });

P["ahsapta-da-ayni"] = (num) =>
  tapPost({
    num,
    label: "Ceviz",
    h: lines("Ahşapta da", "aynı tek dokunuş."),
    shot: "lux-tap-wood",
  });

P["yaklastirin"] = (num) => {
  const box = { left: -40, top: 120, width: 1160 };
  const [x, y] = at(box, 0.385, 0.56);
  return page({
    num,
    label: "NFC",
    body: `${headBlock(lines("Yaklaştırın.", "Gerisi kendiliğinden."), "Kartınız telefona değdiği an profiliniz açılır.", { cls: "d3" })}
${rimg("lux-phone-gold-saved", box)}
${SIGNAL(x, y, { r: 200 })}`,
  });
};

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
    body: `${device(UI("profil"), { x: 385, y: 520, w: 310 })}
<div class="abs" style="left:72px;right:72px;top:168px;text-align:center">${head(lines("Rehbere", "kaydedildi."), "d2")}<p class="t" style="margin:28px auto 0;max-width:640px">Karşınızdaki tek dokunuşla sizi rehberine ekler.</p></div>`,
  });

P["kilit-ekrani"] = (num) =>
  page({
    num,
    label: "Uygulama gerekmez",
    body: `${headBlock(lines("Telefonun kilidi açık,", "bu kadar."), "", { cls: "d3" })}
${rimg("lux-ui-saved", { left: 30, top: 130, width: 1100 })}`,
  });

P["rehbere-kaydet"] = (num) =>
  page({
    num,
    label: "Arayüz",
    body: `${headBlock(lines("Rehbere Kaydet.", "Hepsi bu."))}
<div class="abs" style="left:0;top:0;width:1080px;height:1180px;overflow:hidden;-webkit-mask-image:linear-gradient(#000 1060px,transparent 1170px)">${device(UI("profil"), { x: 260, y: 400, w: 560 })}</div>`,
  });

P["uc-adim"] = (num) => {
  const panel = (inner, n, t) =>
    `<div><div style="position:relative;height:540px;border-radius:28px;overflow:hidden;background:#fff;box-shadow:0 0 0 1px ${C.line}">${inner}</div>
<div style="display:flex;gap:14px;align-items:baseline;margin-top:24px"><span class="k" style="color:${C.brass}">${n}</span><span style="font-size:30px;font-weight:540;letter-spacing:-.02em">${t}</span></div></div>`;
  const tapIn = (shot, ring) => {
    const box = { left: -190, top: -40, width: 660 };
    const [x, y] = at(box, ring[0], ring[1]);
    return `<img src="${R(shot)}" style="position:absolute;left:${box.left}px;top:${box.top}px;width:${box.width}px">${SIGNAL(x, y, { r: 90 })}`;
  };
  return page({
    num,
    label: "Nasıl çalışır",
    body: `${headBlock(lines("Üç adımda", "tanışın."))}
<div class="abs" style="left:72px;right:72px;top:480px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
${panel(tapIn("lux-tap-wood", [0.6, 0.235]), "01", "Yaklaştırın")}
${panel(tapIn("lux-tap-black", [0.6, 0.235]), "02", "Profil açılır")}
${panel(`<img src="${UI("profil")}" style="position:absolute;left:0;top:-20px;width:100%">`, "03", "Rehbere kaydedin")}
</div>`,
  });
};

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
