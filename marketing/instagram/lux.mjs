// Dijivizit Instagram — luxury editorial set (1080x1350).
//
//   node marketing/instagram/lux.mjs <assets-dir> <out-dir> [id,id,...]
//
// Assets: render/lux.py stills (lux-*.png) plus a few real lifestyle photos
// (life-*.png). Type: Cormorant Garamond (serif) + Inter Tight, both OFL.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const [, , ASSETS = "", OUT = "out", ONLY = ""] = process.argv;
const F = (n) => `file://${path.join(HERE, "fonts", n)}`;
const A = (n) => `file://${path.resolve(ASSETS, n + ".png")}`;

const GOLD = "#c8a97e";

const MARK = (fg, cut) =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="2" y="2" width="20" height="20" rx="6" fill="${fg}"/><circle cx="8.6" cy="12" r="1.35" fill="${cut}"/><g fill="none" stroke="${cut}" stroke-width="1.6" stroke-linecap="round"><path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4"/><path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2"/></g></svg>`;

const CSS = `
@font-face{font-family:Corm;src:url(${F("cormorant-garamond-latin-ext-500-normal.woff2")}) format("woff2");font-weight:500;unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20CF}
@font-face{font-family:Corm;src:url(${F("cormorant-garamond-latin-500-normal.woff2")}) format("woff2");font-weight:500}
@font-face{font-family:Corm;src:url(${F("cormorant-garamond-latin-ext-500-italic.woff2")}) format("woff2");font-weight:500;font-style:italic;unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:Corm;src:url(${F("cormorant-garamond-latin-500-italic.woff2")}) format("woff2");font-weight:500;font-style:italic}
@font-face{font-family:Corm;src:url(${F("cormorant-garamond-latin-ext-400-normal.woff2")}) format("woff2");font-weight:400;unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:Corm;src:url(${F("cormorant-garamond-latin-400-normal.woff2")}) format("woff2");font-weight:400}
@font-face{font-family:InterT;src:url(${F("inter-tight-latin-ext-wght-normal.woff2")}) format("woff2");font-weight:100 900;unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:InterT;src:url(${F("inter-tight-latin-wght-normal.woff2")}) format("woff2");font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;overflow:hidden}
body{background:#0a0a0b;color:#efe9df;font-family:InterT;-webkit-font-smoothing:antialiased;position:relative}
body.ivory{background:#f1ece3;color:#141312}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.grain{position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.vt{position:absolute;inset:0 0 auto 0;height:560px;background:linear-gradient(#0a0a0bee,#0a0a0b00)}
.vb{position:absolute;inset:auto 0 0 0;height:620px;background:linear-gradient(#0a0a0b00,#0a0a0bf2)}
.label{font-family:InterT;font-size:19px;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:${GOLD}}
.ivory .label{color:#8a6a3c}
.serif{font-family:Corm;font-weight:500;letter-spacing:-.01em}
.h1{font-family:Corm;font-weight:500;font-size:112px;line-height:.96;letter-spacing:-.015em}
.h2{font-family:Corm;font-weight:500;font-size:86px;line-height:1;letter-spacing:-.01em}
.h3{font-family:Corm;font-weight:500;font-size:64px;line-height:1.04}
.it{font-style:italic;font-weight:500}
.g{color:${GOLD}}
.ivory .g{color:#8a6a3c}
.body{font-family:InterT;font-size:27px;line-height:1.55;font-weight:350;color:rgba(239,233,223,.72);letter-spacing:.005em}
.ivory .body{color:rgba(20,19,18,.68)}
.rule{height:1px;background:linear-gradient(90deg,${GOLD}cc,${GOLD}00);width:220px}
.rule.c{background:linear-gradient(90deg,${GOLD}00,${GOLD}cc,${GOLD}00);width:300px;margin:0 auto}
.frame{position:absolute;inset:40px;border:1px solid ${GOLD}55;pointer-events:none}
.ivory .frame{border-color:#8a6a3c55}
.foot{position:absolute;left:72px;right:72px;bottom:62px;display:flex;align-items:center;justify-content:space-between;font-size:17px;letter-spacing:.3em;text-transform:uppercase;color:rgba(239,233,223,.55)}
.ivory .foot{color:rgba(20,19,18,.5)}
.brand{display:flex;align-items:center;gap:14px;color:#efe9df;letter-spacing:.42em;font-size:18px;font-weight:600}
.ivory .brand{color:#141312}
.brand i{display:block;width:30px;height:30px}
.abs{position:absolute;left:72px;right:72px}
.center{text-align:center}
.spec{display:grid;grid-template-columns:200px 1fr;row-gap:0;font-size:24px}
.spec div{padding:20px 0;border-top:1px solid rgba(200,169,126,.25)}
.spec .k{letter-spacing:.24em;text-transform:uppercase;font-size:16px;color:${GOLD};padding-top:26px}
.num{font-family:Corm;font-size:340px;line-height:.8;font-weight:400;color:transparent;-webkit-text-stroke:1.2px ${GOLD}aa}
`;

function page({
  img,
  ivory = false,
  pos = "center",
  scale = 1,
  vt = true,
  vb = true,
  frame = false,
  num,
  body,
  grade = false,
  fx = "",
}) {
  const bg = img
    ? `<div class="bg" style="background-image:url('${A(img)}');background-position:${pos};transform:scale(${scale});${fx}${grade ? "filter:grayscale(1) sepia(.18) contrast(1.12) brightness(.72)" : ""}"></div>`
    : "";
  const markFg = ivory ? "#141312" : "#efe9df";
  const markCut = ivory ? "#f1ece3" : "#0a0a0b";
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head>
<body class="${ivory ? "ivory" : ""}">${bg}${img && vt ? '<div class="vt"></div>' : ""}${img && vb ? '<div class="vb"></div>' : ""}<div class="grain"></div>
${frame ? '<div class="frame"></div>' : ""}${body}
<div class="foot"><div class="brand"><i>${MARK(markFg, markCut)}</i>DIJIVIZIT</div><div>${num ? `No. ${num}` : "dijivizit.com"}</div></div>
</body></html>`;
}

const top = (label, title, sub = "", cls = "h1") =>
  `<div class="abs" style="top:110px"><div class="label">${label}</div><div class="${cls}" style="margin-top:30px">${title}</div>${sub ? `<div class="rule" style="margin:38px 0 30px"></div><div class="body" style="max-width:720px">${sub}</div>` : ""}</div>`;

const bottom = (label, title, sub = "", cls = "h1") =>
  `<div class="abs" style="bottom:150px"><div class="label">${label}</div><div class="${cls}" style="margin-top:26px">${title}</div>${sub ? `<div class="rule" style="margin:34px 0 26px"></div><div class="body" style="max-width:760px">${sub}</div>` : ""}</div>`;

const centerTop = (label, title, cls = "h2") =>
  `<div class="abs center" style="top:120px"><div class="label">${label}</div><div class="${cls}" style="margin-top:28px">${title}</div><div class="rule c" style="margin-top:36px"></div></div>`;

const FIN = {
  black: [
    "Mat Siyah Metal",
    "Siyah.<br><span class='it g'>Sessiz bir güç.</span>",
    "Mat siyah yüzey, ince açık gri lazer kazıma.",
  ],
  silver: [
    "Mat Fırçalanmış Gümüş",
    "Işıkla<br><span class='it g'>konuşan metal.</span>",
    "İnce fırça izleri, ışığın açısıyla değişen bir yüzey.",
  ],
  gold: [
    "Mat Fırçalanmış Gold",
    "Altının<br><span class='it g'>sakin hali.</span>",
    "Parlamaz, ışıldar. Gösterişsiz bir ayrıcalık.",
  ],
  wood: [
    "Koyu Ahşap",
    "Doğanın<br><span class='it g'>imzası.</span>",
    "Gerçek ahşap, lazerle yakılmış logo. Her kartın dokusu kendine özgü.",
  ],
  "wood-light": [
    "Açık Ahşap",
    "Sade. Sıcak.<br><span class='it g'>Doğal.</span>",
    "Açık tonlu ahşap; yumuşak, davetkâr bir ilk izlenim.",
  ],
};

const P = {};
const LIST = [];
const add = (id, fn) => LIST.push([id, fn]);

// 1 — opening statement
add("kagit-eskir", (num) =>
  page({
    num,
    frame: true,
    body: `<div class="abs" style="top:330px"><div class="label">Dijivizit</div><div class="h1" style="margin-top:40px;font-size:136px">Kâğıt eskir.<br><span class="it g">İzlenim kalır.</span></div><div class="rule" style="margin:56px 0 34px"></div><div class="body" style="max-width:640px">NFC ve QR ile çalışan, her zaman güncel kalan akıllı kartvizit.</div></div>`,
  }),
);

// Heroes for the five finishes
for (const f of ["black", "gold", "silver", "wood", "wood-light"]) {
  const [label, title, sub] = FIN[f];
  add(`koleksiyon-${f}`, (num) =>
    page({ num, img: `lux-hero-${f}`, pos: "50% 60%", body: top(label, title, sub) }),
  );
}

add("az-soz", (num) =>
  page({
    num,
    ivory: true,
    frame: true,
    body: `<div class="abs center" style="top:420px"><div class="label">Felsefemiz</div><div class="h1" style="margin-top:40px;font-size:150px">Az söz.<br><span class="it">Kalıcı etki.</span></div></div>`,
  }),
);

// Leaning cards: collection numbering
const order = ["black", "silver", "gold", "wood", "wood-light"];
order.forEach((f, i) => {
  add(`koleksiyon-no-${f}`, (num) =>
    page({
      num,
      img: `lux-lean-${f}`,
      pos: "50% 55%",
      vt: true,
      body: centerTop(
        `Koleksiyon · 0${i + 1} / 05`,
        {
          black: "Mat Siyah<br><span class='it g'>Metal</span>",
          silver: "Fırçalanmış<br><span class='it g'>Gümüş</span>",
          gold: "Fırçalanmış<br><span class='it g'>Gold</span>",
          wood: "Koyu<br><span class='it g'>Ahşap</span>",
          "wood-light": "Açık<br><span class='it g'>Ahşap</span>",
        }[f],
        "h2",
      ),
    }),
  );
});

add("bir-isim", (num) =>
  page({
    num,
    img: "lux-float-black",
    pos: "50% 75%",
    vb: false,
    body: top(
      "Dijivizit",
      "Bir isim. Bir dokunuş.<br><span class='it g'>Bir bağlantı.</span>",
      "",
      "h2",
    ),
  }),
);

add("detay-her-seydir", (num) =>
  page({
    num,
    img: "lux-macro-gold",
    vt: false,
    body: bottom(
      "Lazer kazıma",
      "Detay,<br><span class='it g'>her şeydir.</span>",
      "Her harf, her çizgi lazerle yüzeye işlenir.",
    ),
  }),
);

add("teknik", (num) =>
  page({
    num,
    frame: true,
    body: `<div class="abs" style="top:150px"><div class="label">Teknik özellikler</div><div class="h2" style="margin:26px 0 40px">Küçük bir kart.<br><span class="it g">Büyük bir sistem.</span></div>
      <div class="spec" style="font-size:30px"><div class="k">Bağlantı</div><div>NFC çip ve yedek QR</div><div class="k">Uyumluluk</div><div>iPhone ve Android, uygulama gerekmez</div><div class="k">Enerji</div><div>Pil ve şarj gerektirmez</div><div class="k">Profil</div><div>Dilediğiniz an güncellenir</div></div></div>`,
  }),
);

add("bilgilerin-degisir", (num) =>
  page({
    num,
    frame: true,
    body: `<div class="num" style="position:absolute;right:40px;top:120px">∞</div><div class="abs" style="top:470px"><div class="label">Her zaman güncel</div><div class="h1" style="margin-top:34px">Bilgileriniz değişir.<br><span class="it g">Kartınız değişmez.</span></div><div class="rule" style="margin:50px 0 30px"></div><div class="body" style="max-width:700px">Numara, unvan, adres. Panelden güncelleyin; kartınız aynı anda güncellensin.</div></div>`,
  }),
);

add("dokun", (num) =>
  page({
    num,
    img: "lux-phone-black",
    pos: "50% 60%",
    vb: true,
    body: top("Paylaşım", "Dokunun.<br><span class='it g'>Profiliniz açılsın.</span>", "", "h2"),
  }),
);

add("kaydedildi", (num) =>
  page({
    num,
    img: "lux-phone-gold-saved",
    pos: "50% 60%",
    body: top(
      "Tek dokunuşla",
      "Rehbere kaydedildi.<br><span class='it g'>Siz hatırlandınız.</span>",
      "",
      "h2",
    ),
  }),
);

add("bes-kaplama", (num) =>
  page({
    num,
    img: "lux-stack",
    pos: "50% 60%",
    body: top(
      "Koleksiyon",
      "Beş kaplama.<br><span class='it g'>Tek imza.</span>",
      "Siyah metal, gümüş, gold, koyu ve açık ahşap.",
    ),
  }),
);

add("masaya-birakilan", (num) =>
  page({
    num,
    img: "lux-edge-black",
    vt: false,
    body: bottom("İlk izlenim", "Masaya bırakılan<br><span class='it g'>ilk imza.</span>"),
  }),
);

add("kenarina-kadar", (num) =>
  page({
    num,
    img: "lux-edge-gold",
    vt: false,
    body: bottom("Kenar işçiliği", "Kenarına kadar<br><span class='it g'>özen.</span>"),
  }),
);

add("tanismak", (num) =>
  page({
    num,
    img: "life-handshake",
    grade: true,
    vt: false,
    body: bottom(
      "Bağlantı",
      "Tanışmak bir an.<br><span class='it g'>Hatırlanmak, bir tercih.</span>",
      "",
      "h2",
    ),
  }),
);

add("koleksiyon-liste", (num) =>
  page({
    num,
    img: "lux-row",
    pos: "70% 50%",
    vt: false,
    vb: false,
    body: `<div style="position:absolute;inset:0;background:linear-gradient(90deg,#0a0a0bfa 0%,#0a0a0bea 48%,#0a0a0b00 70%)"></div>
      <div class="abs" style="top:150px;right:auto;width:520px"><div class="label">Koleksiyon</div><div class="h2" style="margin:28px 0 50px">Size<br><span class="it g">yakışanı</span><br>seçin.</div>
      ${order.map((f, i) => `<div style="display:flex;gap:24px;align-items:baseline;padding:22px 0;border-top:1px solid ${GOLD}40"><span class="serif g" style="font-size:30px">0${i + 1}</span><span style="font-size:26px;letter-spacing:.02em">${FIN[f][0]}</span></div>`).join("")}</div>`,
  }),
);

add("uygulama-yok", (num) =>
  page({
    num,
    frame: true,
    body: `<div class="abs" style="top:300px"><div class="label">Deneyim</div><div class="h1" style="margin-top:36px;line-height:1.08">Uygulama yok.<br>Bekleme yok.<br><span class="it g">Sadece dokunuş.</span></div><div class="rule" style="margin:54px 0 30px"></div><div class="body" style="max-width:700px">Profiliniz, karşınızdakinin telefonunda tarayıcıda açılır. NFC olmayan telefonlarda QR yeterli.</div></div>`,
  }),
);

add("dogal-doku", (num) =>
  page({
    num,
    img: "lux-macro-wood",
    vt: false,
    body: bottom("Koyu Ahşap", "Her kartın dokusu<br><span class='it g'>kendine özgü.</span>"),
  }),
);

add("on-yuz-arka-yuz", (num) =>
  page({
    num,
    img: "lux-duo-black-gold",
    pos: "50% 60%",
    body: top("İki yüz", "Önde dokunuş.<br><span class='it g'>Arkada imzamız.</span>", "", "h2"),
  }),
);

add("isigi-yakalayan", (num) =>
  page({
    num,
    img: "lux-float-gold",
    vt: false,
    body: bottom(
      "Mat Fırçalanmış Gold",
      "Işığı yakalayan<br><span class='it g'>bir kartvizit.</span>",
    ),
  }),
);

add("nfc-nedir", (num) =>
  page({
    num,
    ivory: true,
    frame: true,
    body: `<div class="abs" style="top:200px"><div class="label">Sık sorulan</div><div class="h2" style="margin-top:30px">NFC nedir?</div><div class="rule" style="margin:44px 0 34px"></div><div class="body" style="font-size:31px;line-height:1.6;max-width:820px">Telefonların temassız ödemede kullandığı yakın alan iletişimi. Dijivizit kartın içindeki küçük çip, telefona dokunduğunda profilinizi açar. Pil yok, şarj yok, uygulama yok.</div></div>`,
  }),
);

add("kaydedilen-aranir", (num) =>
  page({
    num,
    img: "life-woman-phone",
    grade: true,
    pos: "50% 30%",
    vt: false,
    body: bottom("Hatırlanmak", "Kaydedilen<br><span class='it g'>aranır.</span>"),
  }),
);

add("ahsabin-iki-tonu", (num) =>
  page({
    num,
    img: "lux-duo-wood",
    pos: "50% 60%",
    body: top(
      "Ahşap koleksiyonu",
      "Ahşabın<br><span class='it g'>iki tonu.</span>",
      "Koyu ve açık; ikisi de gerçek ahşap, ikisi de NFC.",
    ),
  }),
);

add("baglanti", (num) =>
  page({
    num,
    img: "life-hands-dark",
    grade: true,
    vt: false,
    body: bottom("Bağlantı", "Bir dokunuş<br><span class='it g'>uzağınızda.</span>"),
  }),
);

// Detail macros with a second treatment

// Second takes on the heroes, ivory caption band
for (const f of ["gold", "black", "wood"]) {
  add(`edisyon-${f}`, (num) =>
    page({
      num,
      img: `lux-lean-${f}`,
      pos: "50% 40%",
      scale: 1.06,
      vt: false,
      vb: false,
      body: `<div style="position:absolute;left:0;right:0;bottom:0;height:400px;background:#f1ece3"></div>
        <div class="abs" style="bottom:150px;color:#141312"><div class="label" style="color:#8a6a3c">${FIN[f][0]}</div><div class="h2" style="margin-top:18px">${FIN[f][1].replace(/ g'/g, "' style='color:#8a6a3c'").replace("class='it'", "class='it'")}</div></div>`,
    }),
  );
}

add("qr-yedegi", (num) =>
  page({
    num,
    frame: true,
    body: `<div class="abs" style="top:420px"><div class="label">Her telefonda</div><div class="h1" style="margin-top:36px">NFC yoksa,<br><span class="it g">QR var.</span></div><div class="rule" style="margin:54px 0 30px"></div><div class="body" style="max-width:700px">Her kartın arkasında yedek bir QR kod bulunur. Kamera yeterli.</div></div>`,
  }),
);

add("dijital-kartvizit-nedir", (num) =>
  page({
    num,
    ivory: true,
    frame: true,
    body: `<div class="abs" style="top:200px"><div class="label">Sık sorulan</div><div class="h2" style="margin-top:30px">Akıllı kartvizit<br><span class="it">nedir?</span></div><div class="rule" style="margin:44px 0 34px;background:linear-gradient(90deg,#8a6a3ccc,#8a6a3c00)"></div><div class="body" style="font-size:31px;line-height:1.6;max-width:820px">Telefonunuzu, e-postanızı, sosyal hesaplarınızı ve belgelerinizi tek bir sayfada toplayan, NFC ve QR ile paylaşılan dijital kartvizit. Kâğıt bitmez, bilgi eskimez.</div></div>`,
  }),
);

add("sayilarla", (num) =>
  page({
    num,
    body: `<div class="abs" style="top:120px"><div class="label">Sayılarla Dijivizit</div></div>
      ${[
        ["0", "kâğıt", "Baskı, kesim, atık yok."],
        ["1", "dokunuş", "Profiliniz anında açılır."],
        ["∞", "güncelleme", "Kart aynı, bilgileriniz hep güncel."],
      ]
        .map(
          ([a, b, c], i) =>
            `<div class="abs" style="top:${250 + i * 300}px;display:flex;align-items:center;gap:56px;border-top:1px solid ${GOLD}40;padding-top:36px"><div class="serif g" style="font-size:190px;line-height:.8;width:180px;text-align:center">${a}</div><div><div class="serif" style="font-size:64px">${b}</div><div class="body">${c}</div></div></div>`,
        )
        .join("")}`,
  }),
);

add("her-yerde", (num) =>
  page({
    num,
    img: "lux-hero-black",
    pos: "50% 70%",
    body: `<div class="abs" style="top:110px"><div class="label">Her an, her yerde</div><div class="h2" style="margin-top:30px">Toplantıda. Fuarda.<br>Kafede. <span class="it g">Yolda.</span></div></div>`,
  }),
);

add("ilk-izlenim", (num) =>
  page({
    num,
    ivory: true,
    frame: true,
    body: `<div class="abs" style="top:360px"><div class="label">İlk izlenim</div><div class="h1" style="margin-top:36px">İkinci bir şansı<br><span class="it">yoktur.</span></div><div class="rule" style="margin:54px 0 30px;background:linear-gradient(90deg,#8a6a3ccc,#8a6a3c00)"></div><div class="body" style="max-width:700px">O yüzden ilk dokunuşu özenle tasarladık.</div></div>`,
  }),
);

add("kurumsal", (num) =>
  page({
    num,
    img: "lux-stack",
    pos: "50% 45%",
    scale: 1.15,
    vt: false,
    body: bottom(
      "Kurumsal",
      "Tüm ekip,<br><span class='it g'>tek imza.</span>",
      "Ekibiniz için aynı tasarım; biri ayrıldığında kart değil, profil değişir.",
    ),
  }),
);

add("atolye", (num) =>
  page({
    num,
    frame: true,
    body: `<div class="abs" style="top:300px"><div class="label">Atölye</div><div class="h1" style="margin-top:36px">Eskişehir'den,<br><span class="it g">özenle.</span></div><div class="rule" style="margin:54px 0 34px"></div>
    <div class="body" style="font-size:28px">Osmangazi Mah. Basın Şehitleri Cad. No:174<br>Odunpazarı / Eskişehir<br><br>0540 626 19 65 · talep@dijivizit.com</div></div>`,
  }),
);

add("siparis", (num) =>
  page({
    num,
    img: "lux-hero-gold",
    pos: "50% 65%",
    body: `<div class="abs center" style="top:130px"><div class="label">Sipariş</div><div class="h1" style="margin-top:30px">Kartınızı<br><span class="it g">seçin.</span></div><div class="rule c" style="margin:44px auto 34px"></div><div class="body" style="letter-spacing:.24em;text-transform:uppercase;font-size:20px;color:#efe9df">dijivizit.com/siparis</div></div>`,
  }),
);

// ---- How it works: tap and on-screen profile
add("dokundurun", (num) =>
  page({
    num,
    img: "lux-tap-black",
    fx: "transform:translateY(190px) scale(.8);-webkit-mask-image:radial-gradient(ellipse 62% 58% at 50% 50%,#000 70%,transparent 100%);",
    body: top(
      "Nasıl çalışır",
      "Dokundurun.<br><span class='it g'>Profiliniz açılsın.</span>",
      "",
      "h2",
    ),
  }),
);
add("yaklastirin", (num) =>
  page({
    num,
    img: "lux-tap-gold-idle",
    pos: "50% 60%",
    body: bottom(
      "NFC",
      "Yaklaştırın.<br><span class='it g'>Gerisi kendiliğinden.</span>",
      "Kartınız telefonun üst kısmına değdiği an bağlantı kurulur.",
    ),
  }),
);
add("profil-boyle-gorunur", (num) =>
  page({
    num,
    img: "lux-ui-profile",
    pos: "50% 50%",
    vt: true,
    vb: false,
    body: `<div class="abs" style="top:110px"><div class="label">Arayüz</div><div class="h2" style="margin-top:26px">Profiliniz,<br><span class="it g">onun ekranında.</span></div></div>
      <div class="abs" style="bottom:120px;right:auto;width:420px"><div style="background:#0a0a0bd9;border:1px solid ${GOLD}55;padding:30px 34px">
      ${["Fotoğraf, ad ve unvan", "Rehbere Kaydet", "Telefon ve WhatsApp", "LinkedIn, e-posta, web", "IBAN ve belgeler"].map((t) => `<div style="display:flex;gap:16px;align-items:center;padding:9px 0;font-size:24px"><span style="width:8px;height:8px;border-radius:50%;background:${GOLD}"></span>${t}</div>`).join("")}</div></div>`,
  }),
);
add("rehberde", (num) =>
  page({
    num,
    img: "lux-ui-saved",
    pos: "50% 50%",
    vt: true,
    vb: false,
    body: top("Tek dokunuşla", "Rehbere<br><span class='it g'>kaydedildi.</span>", "", "h2"),
  }),
);
add("kilit-ekrani", (num) =>
  page({
    num,
    img: "lux-ui-idle",
    pos: "50% 50%",
    vt: true,
    vb: false,
    body: top(
      "Uygulama gerekmez",
      "Telefonun kilidi açık,<br><span class='it g'>bu kadar.</span>",
      "",
      "h2",
    ),
  }),
);
add("rehbere-kaydet", (num) =>
  page({
    num,
    img: "lux-ui-macro",
    vt: false,
    fx: "-webkit-mask-image:linear-gradient(#000 50%,transparent 70%);",
    body: bottom("Arayüz", "Rehbere Kaydet.<br><span class='it g'>Hepsi bu.</span>"),
  }),
);
add("ahsapta-da-ayni", (num) =>
  page({
    num,
    img: "lux-tap-wood",
    fx: "transform:translateY(190px) scale(.8);-webkit-mask-image:radial-gradient(ellipse 62% 58% at 50% 50%,#000 70%,transparent 100%);",
    body: top("Ceviz", "Ahşapta da<br><span class='it g'>aynı tek dokunuş.</span>", "", "h2"),
  }),
);
add("uc-adim", (num) =>
  page({
    num,
    body: `<div class="abs center" style="top:110px"><div class="label">Nasıl çalışır</div><div class="h2" style="margin-top:22px">Üç adımda<br><span class="it g">tanışın.</span></div></div>
      <div style="position:absolute;left:60px;right:60px;top:470px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px">
      ${[
        ["lux-tap-gold-idle", "01", "Yaklaştırın"],
        ["lux-tap-black", "02", "Profil açılır"],
        ["lux-ui-saved", "03", "Rehbere kaydedin"],
      ]
        .map(
          ([img, n, t]) =>
            `<div><div style="height:520px;background:url('${A(img)}') center/cover;border:1px solid ${GOLD}40"></div><div class="serif g" style="font-size:44px;margin-top:22px">${n}</div><div style="font-size:24px;margin-top:4px">${t}</div></div>`,
        )
        .join("")}</div>`,
  }),
);

// Weave the "how it works" posts through the series so the feed never
// goes long without showing the tap and the screen.
const HOW = [
  "dokundurun",
  "profil-boyle-gorunur",
  "yaklastirin",
  "rehberde",
  "uc-adim",
  "kilit-ekrani",
  "ahsapta-da-ayni",
  "rehbere-kaydet",
];
const AT = [3, 7, 11, 15, 20, 26, 32, 38];
const base = LIST.filter(([id]) => !HOW.includes(id));
const last = base.pop(); // keep the order call-to-action at the end
HOW.forEach((id, i) =>
  base.splice(
    AT[i] - 1,
    0,
    LIST.find(([x]) => x === id),
  ),
);
base.push(last);
base.forEach(([id, fn], i) => {
  const num = String(i + 1).padStart(2, "0");
  P[`${num}-${id}`] = () => fn(num);
});
console.log(Object.keys(P).join(" "));
const ids = ONLY ? ONLY.split(",") : Object.keys(P);

// THEME=light: the same layouts on warm white with dark type and a deeper
// gold, for a fresher feed. Pair it with renders made by lux.py --theme light.
function theme(html) {
  if (process.env.THEME !== "light") return html;
  return html
    .replace(/#0a0a0b/g, "#f5f3ef")
    .replace(/#efe9df/g, "#161514")
    .replace(/rgba\(239,233,223/g, "rgba(22,21,20")
    .replace(/rgba\(200,169,126/g, "rgba(138,106,60")
    .replaceAll(GOLD, "#8a6a3c")
    .replace("filter:grayscale(1) sepia(.18) contrast(1.12) brightness(.72)", "")
    .replace("opacity:.07;mix-blend-mode:overlay", "opacity:.035;mix-blend-mode:multiply");
}
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome",
  args: ["--allow-file-access-from-files"],
});
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 } });
for (const id of ids) {
  const pg = await ctx.newPage();
  const file = path.join(OUT, `${id}.html`);
  fs.writeFileSync(file, theme(P[id]()));
  await pg.goto(`file://${path.resolve(file)}`);
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(120);
  await pg.screenshot({ path: path.join(OUT, `${id}.png`) });
  fs.unlinkSync(file);
  await pg.close();
}
await browser.close();
console.log(`built ${ids.length}`);
