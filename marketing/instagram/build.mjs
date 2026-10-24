// Builds the Dijivizit Instagram posts (1080x1350) from HTML templates with
// "liquid glass" panels over the Blender renders.
//
//   node marketing/instagram/build.mjs <renders-dir> <out-dir> [id,id,...]
//
// Needs playwright (Chromium) and the geist font package from node_modules.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const [, , BG_DIR = "", OUT_DIR = "out", ONLY = ""] = process.argv;
const FONT = path.join(ROOT, "node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2");
const MONO = path.join(ROOT, "node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2");
const AVATAR = path.join(ROOT, "render/textures-src/avatar.jpg");

const bg = (name) => `file://${path.resolve(BG_DIR, name + ".png")}`;

const MARK = (fg = "#0a0a0a", cut = "#fff") =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="2" y="2" width="20" height="20" rx="6" fill="${fg}"/><circle cx="8.6" cy="12" r="1.35" fill="${cut}"/><g fill="none" stroke="${cut}" stroke-width="1.6" stroke-linecap="round"><path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4"/><path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2"/></g></svg>`;

const ICON = {
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  nfc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 8.5a5 5 0 0 1 0 7"/><path d="M10.5 6a8.5 8.5 0 0 1 0 12"/><path d="M14 3.5a12 12 0 0 1 0 17"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>`,
  bank: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h18L12 4 3 10z"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/></svg>`,
  doc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
  qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20h2M20 14v2"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
};

const CSS = `
@font-face{font-family:Geist;src:url(file://${FONT}) format("woff2");font-weight:100 900}
@font-face{font-family:GeistMono;src:url(file://${MONO}) format("woff2");font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;overflow:hidden}
body{font-family:Geist,system-ui;color:#0a0a0a;-webkit-font-smoothing:antialiased;position:relative;background:#d6d3ce}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.scrim-top{position:absolute;inset:0 0 auto 0;height:620px;background:linear-gradient(#fff9 0%,#fff0 100%)}
.scrim-bot{position:absolute;inset:auto 0 0 0;height:700px;background:linear-gradient(#fff0 0%,#ffffffb3 100%)}
.dark .scrim-top{background:linear-gradient(#000a,#0000)} .dark .scrim-bot{background:linear-gradient(#0000,#000c)}
.dark{color:#fff}
.glass{position:relative;border-radius:44px;overflow:hidden;
  background:linear-gradient(135deg,rgba(255,255,255,.42),rgba(255,255,255,.14) 55%,rgba(255,255,255,.22));
  backdrop-filter:blur(30px) saturate(180%);-webkit-backdrop-filter:blur(30px) saturate(180%);
  border:1.5px solid rgba(255,255,255,.62);
  box-shadow:inset 0 2px 0 rgba(255,255,255,.85),inset 0 -2px 6px rgba(255,255,255,.18),inset 0 0 0 1px rgba(255,255,255,.08),0 40px 80px -30px rgba(20,20,30,.35)}
.glass::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background:radial-gradient(120% 60% at 15% -10%,rgba(255,255,255,.65),rgba(255,255,255,0) 55%),
             radial-gradient(80% 40% at 100% 110%,rgba(255,255,255,.25),rgba(255,255,255,0) 60%)}
.glass>*{position:relative}
.dark .glass,.glass.dark{background:linear-gradient(135deg,rgba(255,255,255,.16),rgba(255,255,255,.04) 55%,rgba(255,255,255,.08));
  border-color:rgba(255,255,255,.26);box-shadow:inset 0 1.5px 0 rgba(255,255,255,.4),inset 0 -1px 4px rgba(255,255,255,.06),0 40px 80px -30px rgba(0,0,0,.6)}
.dark .glass::before,.glass.dark::before{background:radial-gradient(120% 60% at 15% -10%,rgba(255,255,255,.22),rgba(255,255,255,0) 55%)}
.pill{display:inline-flex;align-items:center;gap:16px;border-radius:999px;padding:16px 28px 16px 18px;font-size:30px;font-weight:550;letter-spacing:-.01em}
.pill .m{width:46px;height:46px}
.brand{position:absolute;top:56px;left:56px}
.url{position:absolute;top:66px;right:56px;font-size:26px;font-weight:500;opacity:.75;letter-spacing:.01em}
.kicker{font-size:30px;font-weight:550;opacity:.62;letter-spacing:-.005em}
h1{font-size:116px;line-height:.98;font-weight:640;letter-spacing:-.055em}
h1.m{font-size:96px} h1.s{font-size:84px}
.lead{font-size:38px;line-height:1.32;font-weight:430;letter-spacing:-.015em;opacity:.78}
.abs{position:absolute;left:56px;right:56px}
.row{display:flex;align-items:center;gap:22px}
.ic{width:64px;height:64px;border-radius:20px;display:flex;align-items:center;justify-content:center;flex:none;background:rgba(255,255,255,.55);box-shadow:inset 0 1px 0 #fff}
.dark .ic{background:rgba(255,255,255,.12);box-shadow:inset 0 1px 0 rgba(255,255,255,.3)}
.ic svg{width:34px;height:34px}
.li{font-size:36px;font-weight:520;letter-spacing:-.02em}
.sub{font-size:27px;opacity:.6;font-weight:450}
.cta{display:inline-flex;align-items:center;gap:16px;background:#0a0a0a;color:#fff;border-radius:999px;padding:26px 40px;font-size:34px;font-weight:560}
.dark .cta{background:#fff;color:#0a0a0a}
.cta svg{width:34px;height:34px}
.mono{font-family:GeistMono}
.chip{border-radius:999px;padding:14px 26px;font-size:28px;font-weight:540}
`;

const brand = (dark = false) =>
  `<div class="brand glass ${dark ? "dark" : ""} pill"><span class="m">${dark ? MARK("#fff", "#0a0a0a") : MARK()}</span>Dijivizit</div>`;

function page({
  bgName,
  dark = false,
  pos = "center",
  scale = 1,
  top = true,
  bottom = true,
  body,
  extraCss = "",
}) {
  const b = bgName
    ? `<div class="bg" style="background-image:url('${bg(bgName)}');background-position:${pos};transform:scale(${scale})"></div>`
    : "";
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}${extraCss}</style></head>
<body class="${dark ? "dark" : ""}">${b}${top ? '<div class="scrim-top"></div>' : ""}${bottom ? '<div class="scrim-bot"></div>' : ""}
${brand(dark)}<div class="url">dijivizit.com</div>${body}</body></html>`;
}

const list = (items) =>
  items
    .map(
      ([icon, title, sub]) =>
        `<div class="row"><div class="ic">${ICON[icon]}</div><div><div class="li">${title}</div>${sub ? `<div class="sub">${sub}</div>` : ""}</div></div>`,
    )
    .join("");

const FINISH_COPY = {
  black: ["Siyah metal", "Mat siyah yüzey, açık gri lazer kazıma. Sade, güçlü, her ortamda."],
  silver: ["Gümüş", "Mat fırçalanmış gümüş. Işıkla değişen ince çizgiler, koyu kazıma."],
  gold: ["Gold", "Mat fırçalanmış gold. Sıcak, iddialı, unutulmaz bir ilk izlenim."],
  wood: ["Koyu ahşap", "Doğal koyu ahşap, lazerle yakılmış yazı. Her kartın dokusu kendine özgü."],
  "wood-light": ["Açık ahşap", "Açık tonlu doğal ahşap. Sıcak, sade ve doğal."],
};

const POSTS = {
  // --- hero / statements
  "01-tanismanin-yeni-hali": () =>
    page({
      bgName: "hero-black",
      pos: "50% 62%",
      scale: 1.05,
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:56px 56px 52px">
        <div class="kicker" style="margin-bottom:22px">NFC akıllı kartvizit</div>
        <h1>Tanışmanın<br>yeni hali.</h1>
        <div class="lead" style="margin-top:26px">Bir kez tasarla. Tek dokunuşla paylaş.<br>Her zaman güncel kalsın.</div></div></div>`,
    }),
  "02-dokun-o-kadar": () =>
    page({
      bgName: "tap",
      pos: "50% 40%",
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:52px 56px">
        <h1>Dokun.<br>O kadar.</h1>
        <div class="lead" style="margin-top:24px">Kartı telefona yaklaştır, profilin anında açılsın.</div></div></div>`,
    }),
  "03-uygulama-gerekmez": () =>
    page({
      bgName: "profile",
      pos: "62% 50%",
      body: `<div class="abs" style="top:190px;right:auto;width:600px"><div class="glass" style="padding:48px 48px 50px">
        <h1 class="s">Uygulama<br>gerekmez.</h1>
        <div style="display:grid;gap:26px;margin-top:40px">${list([
          ["check", "iPhone ve Android"],
          ["check", "Tarayıcıda açılır"],
          ["check", "Rehbere tek dokunuş"],
        ])}</div></div></div>`,
    }),
  "04-bes-kaplama": () =>
    page({
      bgName: "fan",
      pos: "50% 45%",
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:52px 56px">
        <h1 class="m">Beş kaplama.<br>Tek dokunuş.</h1>
        <div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:34px">${[
          "Siyah metal",
          "Gümüş",
          "Gold",
          "Koyu ahşap",
          "Açık ahşap",
        ]
          .map((t) => `<span class="chip glass" style="border-radius:999px">${t}</span>`)
          .join("")}</div></div></div>`,
    }),
  "05-nfc-nedir": () =>
    page({
      bgName: "macro-nfc",
      scale: 1.1,
      body: `<div class="abs" style="top:190px"><div class="glass" style="padding:56px">
        <div class="kicker" style="margin-bottom:18px">Kısaca</div>
        <h1 class="m">NFC nedir?</h1>
        <div class="lead" style="margin-top:24px">Telefonların temassız ödemede kullandığı yakın alan iletişimi. Dijivizit kartın içinde küçük bir NFC çip var; telefona dokunduğunda profilini açar.</div>
        <div style="display:grid;gap:24px;margin-top:40px">${list([
          ["bolt", "Pil yok, şarj yok", "Enerjisini telefondan alır"],
          ["qr", "QR yedeği", "NFC'si kapalı telefonlarda da çalışır"],
        ])}</div></div></div>`,
    }),
  "06-kagit-vs-dijivizit": () => {
    const rows = [
      ["Bilgin değişince", "Yeniden baskı", "Anında güncelleme"],
      ["Paylaşım", "Elden ele", "Dokun ya da QR"],
      ["Rehbere kayıt", "Elle yazılır", "Tek dokunuş"],
      ["Ömür", "Bir baskı", "Yıllarca"],
    ];
    return page({
      bgName: "duo",
      pos: "50% 30%",
      top: false,
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:48px 48px 40px">
        <h1 class="s" style="margin-bottom:34px">Kağıt mı,<br>Dijivizit mi?</h1>
        <div style="display:grid;grid-template-columns:1.1fr 1fr 1fr;font-size:29px;row-gap:0">
          <div></div><div class="sub" style="padding-bottom:16px">Kağıt</div><div style="padding-bottom:16px;font-weight:600">Dijivizit</div>
          ${rows
            .map(
              ([a, b, c]) =>
                `<div style="padding:18px 0;border-top:1.5px solid rgba(0,0,0,.08);font-weight:520">${a}</div><div style="padding:18px 0;border-top:1.5px solid rgba(0,0,0,.08);opacity:.55">${b}</div><div style="padding:18px 0;border-top:1.5px solid rgba(0,0,0,.08);font-weight:560">${c}</div>`,
            )
            .join("")}
        </div></div></div>`,
    });
  },
  "07-bilgin-degisti-mi": () =>
    page({
      bgName: "hero-silver",
      pos: "50% 60%",
      body: `<div class="abs" style="top:190px"><div class="glass" style="padding:52px 56px">
        <h1 class="m">Numaran değişti mi?<br>Kartın değişmez.</h1>
        <div class="lead" style="margin-top:24px">Bilgilerini panelden güncelle, kartın aynı anda güncellensin. Yeniden baskı yok.</div></div></div>`,
    }),
  "08-rehbere-tek-dokunus": () =>
    page({
      bgName: "saved",
      pos: "55% 50%",
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:52px 56px">
        <h1 class="m">Rehbere<br>tek dokunuşla.</h1>
        <div class="lead" style="margin-top:22px">Tanıştığın kişi seni anında kaydeder. Kaybolan kartvizit kalmaz.</div></div></div>`,
    }),
  "09-pil-yok-sarj-yok": () =>
    page({
      bgName: "dark-black",
      dark: true,
      pos: "50% 55%",
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:52px 56px">
        <h1 class="m">Şarj yok.<br>Pil yok.<br>Uygulama yok.</h1>
        <div class="lead" style="margin-top:24px">Sadece bir dokunuş.</div></div></div>`,
    }),
  "10-paylasabileceklerin": () =>
    page({
      bgName: "hero-gold",
      pos: "50% 80%",
      scale: 1.1,
      body: `<div class="abs" style="top:180px"><div class="glass" style="padding:48px 52px">
        <h1 class="s" style="margin-bottom:36px">Her şey<br>tek sayfada.</h1>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px 28px">${list([
          ["phone", "Telefon"],
          ["chat", "WhatsApp"],
          ["mail", "E-posta"],
          ["link", "LinkedIn"],
          ["globe", "Web sitesi"],
          ["bank", "IBAN"],
          ["doc", "Belgeler"],
          ["pin", "Adres"],
        ])}</div></div></div>`,
    }),
  "11-kurumsal-ekipler": () =>
    page({
      bgName: "flatlay",
      pos: "50% 50%",
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:52px 56px">
        <div class="kicker" style="margin-bottom:18px">Kurumsal</div>
        <h1 class="m">Tüm ekip,<br>tek tasarım.</h1>
        <div class="lead" style="margin-top:22px">Biri ayrıldığında ya da unvanı değiştiğinde kart değil, profil güncellenir.</div></div></div>`,
    }),
  "12-qr-yedegi": () =>
    page({
      bgName: "back",
      pos: "50% 50%",
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:52px 56px">
        <h1 class="m">NFC yoksa<br>QR var.</h1>
        <div class="lead" style="margin-top:22px">Her kartta yedek QR. Kamerayı tut, profil açılsın.</div></div></div>`,
    }),
  "13-siparis": () =>
    page({
      bgName: "dark-gold",
      dark: true,
      pos: "50% 45%",
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:56px">
        <h1 class="m">Kartını seç.<br>Gerisini biz<br>halledelim.</h1>
        <div style="margin-top:40px" class="cta">Sipariş ver ${ICON.arrow}</div>
        <div class="sub mono" style="margin-top:22px">dijivizit.com/siparis</div></div></div>`,
    }),
  "14-iletisim": () =>
    page({
      bgName: "dark-wood",
      dark: true,
      pos: "50% 40%",
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:52px 56px">
        <h1 class="s" style="margin-bottom:36px">Bize ulaş.</h1>
        <div style="display:grid;gap:26px">${list([
          ["pin", "Osmangazi Mah. Basın Şehitleri Cad. No:174", "Odunpazarı / Eskişehir"],
          ["phone", "0540 626 19 65", "Telefon ve WhatsApp"],
          ["mail", "talep@dijivizit.com", "Sipariş ve kurumsal talepler"],
        ])}</div></div></div>`,
    }),
  "15-sss-uygulama": () =>
    page({
      bgName: "hero-wood-light",
      pos: "50% 70%",
      body: `<div class="abs" style="top:190px"><div class="glass" style="padding:52px 56px">
        <div class="kicker" style="margin-bottom:20px">Sık sorulan</div>
        <div style="font-size:52px;line-height:1.15;font-weight:600;letter-spacing:-.035em">Karşı taraf uygulama indirmeli mi?</div>
        <div style="display:flex;align-items:center;gap:20px;margin-top:34px"><div class="ic" style="background:#0a0a0a;color:#fff">${ICON.check}</div><div class="li">Hayır. Profil tarayıcıda açılır.</div></div></div></div>`,
    }),
  "16-sss-telefonlar": () =>
    page({
      bgName: "hero-wood",
      pos: "50% 70%",
      body: `<div class="abs" style="top:190px"><div class="glass" style="padding:52px 56px">
        <div class="kicker" style="margin-bottom:20px">Sık sorulan</div>
        <div style="font-size:52px;line-height:1.15;font-weight:600;letter-spacing:-.035em">Hangi telefonlarla çalışır?</div>
        <div style="display:grid;gap:24px;margin-top:36px">${list([
          ["check", "iPhone XS ve sonrası"],
          ["check", "NFC'li Android telefonlar"],
          ["check", "Diğer tüm telefonlar: QR ile"],
        ])}</div></div></div>`,
    }),
  "17-detaylarda": () =>
    page({
      bgName: "macro-gold",
      top: false,
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:48px 56px">
        <h1 class="m">Detaylarda<br>saklı.</h1>
        <div class="lead" style="margin-top:20px">Lazer kazıma logo. Mat fırçalanmış gold.</div></div></div>`,
    }),
  "18-dogal": () =>
    page({
      bgName: "macro-wood",
      dark: true,
      top: false,
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:48px 56px">
        <h1 class="m">Doğal.<br>Kendine özgü.</h1>
        <div class="lead" style="margin-top:20px">Ahşabın dokusu her kartta farklı.</div></div></div>`,
    }),
  "19-tek-kart": () =>
    page({
      bgName: "macro-black",
      dark: true,
      top: false,
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:48px 56px">
        <h1 class="m">Tek kart.<br>Sınırsız güncelleme.</h1></div></div>`,
    }),
  "20-uc-adim": () =>
    page({
      bgName: "dark-silver",
      dark: true,
      pos: "50% 30%",
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:52px 56px">
        <h1 class="s" style="margin-bottom:38px">Üç adımda hazır.</h1>
        <div style="display:grid;gap:30px">${[
          ["01", "Profilini kur", "Ad, unvan, iletişim, sosyal hesaplar"],
          ["02", "Kartını seç", "Beş kaplamadan birini seç"],
          ["03", "Dokun ve paylaş", "Telefona dokundur ya da QR okut"],
        ]
          .map(
            ([n, t, s]) =>
              `<div class="row"><div class="mono" style="font-size:30px;opacity:.5;width:60px">${n}</div><div><div class="li">${t}</div><div class="sub">${s}</div></div></div>`,
          )
          .join("")}</div></div></div>`,
    }),
  "21-profil-onizleme": () =>
    page({
      bgName: "hero-black",
      pos: "50% 20%",
      scale: 1.2,
      body: `<div class="abs" style="left:170px;right:170px;bottom:72px"><div class="glass" style="padding:48px 44px;text-align:center">
        <img src="file://${AVATAR}" style="width:170px;height:170px;border-radius:50%;object-fit:cover;object-position:50% 30%;border:6px solid #fff;box-shadow:0 20px 40px -12px rgba(0,0,0,.3)">
        <div style="font-size:52px;font-weight:620;letter-spacing:-.03em;margin-top:22px">Ayşe Demir</div>
        <div class="sub" style="margin-top:6px">Kurucu Ortak</div>
        <div style="background:#0a0a0a;color:#fff;border-radius:22px;padding:24px;font-size:30px;font-weight:560;margin-top:30px">Rehbere Kaydet</div>
        <div style="display:flex;justify-content:center;gap:16px;margin-top:22px">${[
          "phone",
          "chat",
          "mail",
          "link",
        ]
          .map((i) => `<div class="ic">${ICON[i]}</div>`)
          .join("")}</div></div></div>`,
    }),
};

for (const f of ["black", "silver", "gold", "wood", "wood-light"]) {
  const [title, text] = FINISH_COPY[f];
  POSTS[`3${["black", "silver", "gold", "wood", "wood-light"].indexOf(f)}-kaplama-${f}`] = () =>
    page({
      bgName: `dark-${f}`,
      dark: true,
      pos: "50% 40%",
      body: `<div class="abs" style="bottom:72px"><div class="glass" style="padding:48px 56px">
        <div class="kicker" style="margin-bottom:16px">Kaplama</div>
        <h1 class="m">${title}</h1>
        <div class="lead" style="margin-top:20px">${text}</div></div></div>`,
    });
}

// Clean product shots: brand pill and URL only.
for (const name of [
  "hero-black",
  "hero-silver",
  "hero-gold",
  "hero-wood",
  "hero-wood-light",
  "flatlay",
  "fan",
  "macro-wood-light",
]) {
  POSTS[`50-${name}`] = () =>
    page({ bgName: name, dark: false, top: false, bottom: false, body: "" });
}

const ids = ONLY ? ONLY.split(",") : Object.keys(POSTS);
fs.mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome",
  args: ["--allow-file-access-from-files"],
});
const ctx = await browser.newContext({
  viewport: { width: 1080, height: 1350 },
  deviceScaleFactor: 1,
});
for (const id of ids) {
  const p = await ctx.newPage();
  const file = path.join(OUT_DIR, `${id}.html`);
  fs.writeFileSync(file, POSTS[id]());
  await p.goto(`file://${path.resolve(file)}`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(150);
  await p.screenshot({ path: path.join(OUT_DIR, `${id}.png`) });
  fs.unlinkSync(file);
  await p.close();
  console.log("built", id);
}
await browser.close();
