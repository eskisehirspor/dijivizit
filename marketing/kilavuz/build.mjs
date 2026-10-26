// Builds the customer guide PDF: one step per page, short text, a real
// screenshot of the app (demo data) in a phone frame.
//   node marketing/kilavuz/build.mjs [out.pdf]
// Screenshots live in img/ (390 pt wide phone viewport, the control the step
// talks about outlined in brass).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] || path.join(HERE, "dijivizit-kullanim-kilavuzu.pdf");
const IMG = (n) => `img/${n}.jpg`;

// [label, title (2nd line grey), bullets, images, note?]
const STEPS = [
  [
    "Başlarken",
    ["Hesabınızı", "açın."],
    [
      "<b>app.dijivizit.com</b> adresine girin, <b>Kayıt olun</b>’a dokunun.",
      "Adınızı, e-postanızı ve size gönderilen <b>davet kodunu</b> yazın. Bağlantıyla geldiyseniz kod hazır gelir.",
      "En az 8 karakterlik bir parola belirleyin, kutucuğu işaretleyin, <b>Hesap oluştur</b>.",
      "E-postanıza gelen bağlantıya tıklayın. Hesabınız açıldı.",
    ],
    ["register"],
    "Kodunuz yoksa: merhaba@dijivizit.com",
  ],
  [
    "Başlarken",
    ["Giriş", "yapın."],
    [
      "E-posta ve parolanızla <b>Giriş yap</b>.",
      "Parolanızı unuttuysanız <b>Parolamı unuttum</b>’a dokunun, e-postanıza gelen bağlantıdan yenisini belirleyin.",
    ],
    ["login"],
  ],
  [
    "Panel",
    ["Her şey", "tek ekranda."],
    [
      "Giriş yapınca <b>Panel</b> açılır.",
      "Aşağıdaki kutuların her biri bir ayar sayfasıdır: bilgiler, fotoğraf, bağlantılar, belgeler, kişiler…",
      "Kaybolursanız sayfanın üstündeki <b>Panele dön</b>’e dokunun.",
    ],
    ["dash-actions"],
  ],
  [
    "Profil",
    ["Bilgilerinizi", "yazın."],
    [
      "<b>Profili düzenle</b> kutusuna dokunun.",
      "<b>Ad soyad</b>, <b>Unvan</b>, <b>Şirket</b> ve <b>Adres</b>i yazın.",
      "<b>Hakkımda</b>: kendinizi 1–2 cümleyle anlatın.",
      "<b>Kaydet</b>.",
    ],
    ["edit"],
  ],
  [
    "Profil",
    ["Fotoğrafınızı", "ekleyin."],
    [
      "<b>Profil fotoğrafı</b> → <b>Fotoğraf yükle</b>.",
      "JPEG, PNG veya WebP; en fazla 2 MB.",
      "Yüzünüzün ortada olduğu kare bir fotoğraf en iyisidir.",
    ],
    ["avatar"],
  ],
  [
    "Bağlantılar",
    ["Telefon ve sosyal", "medyanızı ekleyin."],
    [
      "<b>Bağlantılar</b> → aşağıdaki <b>Bağlantı ekle</b> bölümü.",
      "<b>Platform</b> seçin: Telefon, WhatsApp, E-posta, Web sitesi, LinkedIn, Instagram, X.",
      "Numaranızı ya da kullanıcı adınızı yazın. İsterseniz etiket ekleyin: <i>Cep</i>, <i>İş</i>…",
      "<b>Bağlantı ekle</b>. En fazla 20 bağlantı.",
    ],
    ["links-add"],
  ],
  [
    "Bağlantılar",
    ["Sıralayın,", "gizleyin."],
    [
      "Oklarla sırayı değiştirin; kartınızda bu sırayla görünür.",
      "<b>Kartta göster</b> kapalıysa bağlantı kayıtlı kalır ama kartta görünmez.",
      "Bir şeyi değiştirdiyseniz satırdaki <b>Kaydet</b>’e basın.",
    ],
    ["links-row"],
  ],
  [
    "Profil",
    ["Uzmanlık", "alanlarınız."],
    [
      "<b>Uzmanlık ve yetenekler</b> → türü seçin, kısa bir ad yazın, <b>Ekle</b>.",
      "Kartınızın altında etiket olarak görünür. En fazla 20.",
    ],
    ["skills"],
  ],
  [
    "Ödeme",
    ["IBAN", "ekleyin."],
    [
      "<b>Banka bilgileri</b> → <b>Hesap sahibi</b> ve <b>IBAN</b>. Banka kendiliğinden bulunur.",
      "<b>Kaydet</b>.",
      "<b>Kartımda göster</b>’i açın. Açmazsanız IBAN kartınızda görünmez.",
    ],
    ["bank"],
  ],
  [
    "Ödeme",
    ["Fatura", "bilgileri."],
    [
      "<b>Fatura bilgileri</b> → Şirket ünvanı, adresi, vergi numarası (10 veya 11 hane), vergi dairesi.",
      "<b>Kaydet</b>, sonra <b>Kartımda göster</b>’i açın.",
    ],
    ["billing"],
  ],
  [
    "Belgeler",
    ["Katalog, fiyat listesi,", "özgeçmiş ekleyin."],
    [
      "<b>Belgeler</b> → türü seçin, başlık yazın, <b>Dosya seç</b> ile PDF’inizi seçin, <b>Belgeyi yükle</b>.",
      "Yalnızca PDF, en fazla 10 MB. En fazla 10 belge.",
      "<b>Aktif</b> / <b>Pasif</b> anahtarıyla kartta gösterip gizleyin.",
    ],
    ["docs-add", "docs-list"],
  ],
  [
    "Yayın",
    ["Kartınızı", "yayınlayın."],
    [
      "Panelde <b>Herkese açık profil</b> anahtarını açın.",
      "Açmazsanız kartınız okutulduğunda “Kart bulunamadı” görünür.",
      "<b>Kopyala</b> ile kartınızın bağlantısını alabilirsiniz.",
    ],
    ["dash-status"],
  ],
  [
    "Yayın",
    ["Nasıl göründüğüne", "bakın."],
    [
      "<b>Profili aç</b> kutusu kartınızı ziyaretçinin gördüğü gibi gösterir.",
      "Bir şey eksikse ilgili sayfaya dönüp düzeltin.",
    ],
    ["preview"],
  ],
  [
    "Kullanım",
    ["Kartınızı", "okutun."],
    [
      "Karşınızdakinin telefonunun kilidi açık olsun. Uygulama gerekmez.",
      "<b>iPhone</b>: kartı telefonun <b>üst kenarına</b> yaklaştırın.",
      "<b>Android</b>: kartı telefonun <b>arkasının ortasına</b> yaklaştırın (NFC açık olmalı).",
      "NFC yoksa kartın arkasındaki <b>QR</b>’ı kamerayla okutun.",
    ],
    ["nfc", "qr"],
    null,
    "photo",
  ],
  [
    "Kullanım",
    ["Bağlantı ve QR", "ile paylaşın."],
    [
      "<b>Paylaş</b> → <b>Bağlantıyı kopyala</b>: WhatsApp’tan, e-postayla gönderin.",
      "<b>PNG indir</b> / <b>SVG indir</b>: QR kodunuzu broşüre, sunuma, e-posta imzasına koyun.",
    ],
    ["share"],
  ],
  [
    "Ziyaretçi",
    ["Karşınızdaki", "bunu görür."],
    [
      "Fotoğrafınız, adınız, unvanınız.",
      "<b>Rehberime Kaydet</b>: bilgileriniz tek dokunuşla telefonuna kaydedilir.",
      "Aşağıda telefon, WhatsApp, e-posta, IBAN, belgeler.",
    ],
    ["card-top", "card-bottom"],
  ],
  [
    "Ziyaretçi",
    ["Size bilgisini", "bırakabilir."],
    [
      "Ziyaretçi <b>Bilgilerimi bırak</b>’a dokunup adını ve numarasını bırakır.",
      "Size e-posta gelir, kişi <b>Kişiler</b> listenize düşer.",
    ],
    ["leave"],
  ],
  [
    "Kişiler",
    ["Tanıştığınız herkes", "tek listede."],
    [
      "<b>Kişiler</b>: kartınızdan gelenler <b>Karttan</b> etiketiyle görünür.",
      "<b>Kişi ekle</b> ile tanıştığınız birini elle ekleyin. Telefon ya da e-postadan biri yeter.",
      "Etiketlerle süzün, <b>CSV indir</b> ile Excel’e alın.",
    ],
    ["contacts", "contact-new"],
  ],
  [
    "Kişiler",
    ["Not alın,", "hatırlatma kurun."],
    [
      "Kişiye dokunun: <b>WhatsApp’tan yaz</b>, <b>Ara</b>, <b>E-posta gönder</b>.",
      "<b>Takip hatırlatmaları</b>: Yarın, 1 hafta, 1 ay ya da bir tarih seçin, <b>Hatırlatma kur</b>. O sabah e-posta gelir.",
      "<b>Notlar</b>: görüşmede konuştuklarınızı yazın.",
    ],
    ["contact-top", "contact-follow"],
  ],
  [
    "Kişiler",
    ["Kâğıt kartviziti", "tarayın."],
    [
      "<b>Kişiler</b> → <b>Kartvizit tara</b> → <b>Fotoğraf çek veya seç</b>.",
      "Ad, unvan, şirket, telefon ve e-posta kendiliğinden dolar. Kontrol edip kaydedin.",
      "Kartı düz bir yere koyun, ışık yansımasın.",
    ],
    ["scan"],
  ],
  [
    "Analitik",
    ["Kartınız kaç kez", "açıldı?"],
    [
      "<b>Analitik</b> → üstten dönemi seçin: <b>7</b>, <b>30</b> veya <b>90 gün</b>.",
      "Siyah kutu: kaç kez açıldı ve önceki döneme göre artış.",
      "Tekil ziyaretçi, rehbere kaydeden ve bilgi bırakan sayıları.",
      "Grafikte her çubuk bir gün; üstüne dokununca o günün sayısı çıkar.",
    ],
    ["an-top", "an-daily"],
  ],
  [
    "Analitik",
    ["Kim, nereden,", "hangi telefonla?"],
    [
      "<b>Ne zaman bakıyorlar?</b>: haftanın günü ve saati; koyu kare en yoğun saat.",
      "<b>Nereden açıldı?</b>: şehirler ve ülkeler.",
      "<b>Hangi telefonla?</b>: iPhone, Android, bilgisayar oranı.",
      "<b>Nasıl geldiler?</b>: kart/QR, WhatsApp, Instagram, LinkedIn…",
    ],
    ["an-where", "an-devices"],
  ],
  [
    "Analitik",
    ["Karttan", "müşteriye."],
    [
      "Kartı açanların kaçı bir bağlantıya dokundu, kaçı sizi rehbere kaydetti, kaçı bilgisini bıraktı.",
      "<b>Neye dokundular?</b>: WhatsApp, telefon, rehber, belge… en çok kullanılandan aza.",
      "Birden fazla kartınız varsa <b>Kartlara göre</b> hangisinin daha çok okunduğunu görürsünüz.",
    ],
    ["an-funnel"],
  ],
  [
    "Kartlarım",
    ["Kartınızı kaybettiniz mi?", "Kapatın."],
    [
      "<b>Kartlarım</b>: ofis kartı, yedek kart, fuar standı için ayrı kartlar ekleyin.",
      "Kaybolan kartın anahtarını <b>Kapalı</b> yapın; o kart artık açılmaz, diğerleri çalışır.",
    ],
    ["cards"],
  ],
  [
    "Ekip",
    ["Şirket kartlarını", "yönetin."],
    [
      "<b>Ekip</b> → ekip adını yazın, <b>Ekibi oluştur</b>.",
      "<b>Üye davet et</b>: çalışanın e-postasını yazın, <b>Davet et</b>.",
      "<b>Şirket kartları</b>: her karta <b>Kimin profilini açsın</b>’dan bir çalışan seçin.",
      "Çalışan ayrılınca kartı yeni kişiye atayın; fiziksel kart aynı kalır.",
    ],
    ["team-members", "team-cards"],
  ],
  [
    "Hesap",
    ["E-posta, şifre", "ve hesap."],
    [
      "Sağ üstte <b>Ayarlar</b>.",
      "E-postanızı ya da şifrenizi buradan değiştirin.",
      "<b>Hesabı sil</b> her şeyi kalıcı olarak siler; kartınız artık açılmaz.",
    ],
    ["settings"],
  ],
];

const PROBLEMS = [
  [
    "“Kart bulunamadı” çıkıyor",
    "Panelde <b>Herkese açık profil</b>’i açın. Kartlarım’da kartın <b>Açık</b> olduğuna bakın.",
  ],
  [
    "Telefon kartı okumuyor",
    "Kilidi açın; iPhone’da üst kenara, Android’de arkanın ortasına tutun. Kalın kılıfı çıkarın. Olmazsa QR’ı okutun.",
  ],
  ["IBAN kartta yok", "Banka bilgilerinde <b>Kartımda göster</b>’i açın."],
  ["Bir bağlantı görünmüyor", "<b>Kartta göster</b> açık mı, <b>Kaydet</b>’e basıldı mı?"],
  ["Fotoğraf yüklenmiyor", "JPEG, PNG veya WebP olsun ve 2 MB’ı geçmesin."],
  ["E-posta gelmedi", "Spam klasörüne bakın, birkaç dakika sonra yeniden gönderin."],
];

const MARK = (fg, cut) =>
  `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="${fg}"/><circle cx="8.6" cy="12" r="1.35" fill="${cut}"/><g fill="none" stroke="${cut}" stroke-width="1.6" stroke-linecap="round"><path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4"/><path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2"/></g></svg>`;
const ARCS = `<svg viewBox="0 0 200 200" fill="none" stroke="#E4E4E7" stroke-width="1.2" stroke-linecap="round"><path d="M52 70a42 42 0 0 1 0 60"/><path d="M86 40a84 84 0 0 1 0 120"/><path d="M120 10a126 126 0 0 1 0 180"/></svg>`;

const phone = (src) =>
  `<div class="phone"><div class="scr"><img src="${IMG(src)}"><i></i></div></div>`;
const photo = (src) => `<div class="photo"><img src="${IMG(src)}"></div>`;

const stepPage = ([label, [t1, t2], bullets, imgs, note, kind], i) => {
  const two = imgs.length > 1;
  const media = imgs.map((s) => (kind === "photo" ? photo(s) : phone(s))).join("");
  return `<section class="step ${two ? "two" : "one"}">
<div class="txt">
  <div class="k"><b>${String(i + 1).padStart(2, "0")}</b>${label}</div>
  <h2>${t1}<br><span>${t2}</span></h2>
  <ol>${bullets.map((b) => `<li><span>${b}</span></li>`).join("")}</ol>
  ${note ? `<p class="note">${note}</p>` : ""}
</div>
<div class="media">${media}</div>
</section>`;
};

const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Dijivizit Kullanım Kılavuzu</title><style>
@font-face{font-family:Geist;src:url(../instagram/fonts/Geist-Variable.woff2) format("woff2");font-weight:100 900}
@font-face{font-family:GeistMono;src:url(../instagram/fonts/GeistMono-Variable.woff2) format("woff2");font-weight:100 900}
@page{size:A4;margin:0}
:root{--ink:#121213;--ink2:#5E5D59;--line:#E4E4E7;--paper:#FFFFFF;--brass:#9A7743}
*{box-sizing:border-box;margin:0;padding:0}
html{font-family:Geist;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}
section{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;padding:18mm 18mm 16mm}
section:last-child{page-break-after:auto}
.foot{position:absolute;left:18mm;right:18mm;bottom:10mm;display:flex;justify-content:space-between;align-items:center;font:500 7.5pt GeistMono;letter-spacing:.08em;color:var(--ink2)}
.foot .lk{display:flex;align-items:center;gap:6px;font:560 10pt Geist;letter-spacing:-.02em;color:var(--ink)}
.foot svg{width:14px;height:14px}
.k{font:500 8.5pt GeistMono;letter-spacing:.14em;text-transform:uppercase;color:var(--ink2)}
.k b{color:var(--brass);font-weight:500;margin-right:10px}
h2{font-weight:620;font-size:30pt;line-height:1.02;letter-spacing:-.04em;margin:4mm 0 7mm}
h2 span{color:var(--ink2)}
ol{list-style:none;counter-reset:n}
ol li{counter-increment:n;display:grid;grid-template-columns:9mm 1fr;font-size:12.5pt;line-height:1.42;padding:3.2mm 0;border-top:1px solid var(--line)}
ol li:last-child{border-bottom:1px solid var(--line)}
ol li::before{content:counter(n);display:flex;align-items:center;justify-content:center;width:6.4mm;height:6.4mm;border-radius:50%;background:var(--ink);color:#fff;font:600 8.5pt Geist;margin-top:.6mm}
ol li b{font-weight:620}
.note{margin-top:5mm;font-size:10.5pt;color:var(--ink2)}
/* one phone: text left, phone right */
.step.one{display:grid;grid-template-columns:1fr 92mm;gap:10mm;align-items:center;background:#fff}
.step.one .media{display:flex;align-items:center;justify-content:center}
/* two phones: text on top, phones below */
.step.two{display:flex;flex-direction:column;gap:8mm}
.step.two .txt{max-width:150mm}
.step.two h2{margin-bottom:5mm}
.step.two .media{flex:1;display:flex;gap:10mm;justify-content:center;align-items:flex-start;background:var(--paper);margin:0 -18mm -16mm;padding:9mm 18mm 18mm}
.phone{width:76mm;border-radius:10mm;background:#0e0e10;padding:2.1mm;border:.35mm solid #2b2b2f}
.step.two .phone{width:64mm}
.scr{position:relative;border-radius:8mm;overflow:hidden;background:#fff;padding-top:9%}
.scr img{display:block;width:100%}
.scr i{position:absolute;top:2mm;left:50%;transform:translateX(-50%);width:16mm;height:4.6mm;border-radius:99px;background:#0e0e10}
.photo{width:72mm;border-radius:6mm;overflow:hidden;border:.3mm solid #E4E4E7}
.photo img{display:block;width:100%}
/* cover */
.cover{background:var(--paper)}
.cover .lock{display:flex;align-items:center;gap:10px;font-weight:560;font-size:17pt;letter-spacing:-.03em}
.cover .lock svg{width:30px;height:30px}
.cover h1{position:absolute;left:18mm;right:18mm;top:62mm;font-weight:620;font-size:50pt;line-height:.98;letter-spacing:-.045em}
.cover h1 span{color:var(--ink2)}
.cover .lead{position:absolute;left:18mm;width:100mm;top:112mm;font-size:13pt;line-height:1.5;color:var(--ink2)}
.cover .arcs{position:absolute;right:-60mm;bottom:-40mm;width:190mm;height:190mm}
.cover .phones{position:absolute;left:34mm;top:150mm;display:flex;gap:10mm;transform:rotate(-8deg)}
.cover .phone{width:62mm}
/* overview */
.ov h2{margin-bottom:6mm}
.ov .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7mm 8mm}
.ov .it{display:flex;flex-direction:column;gap:3mm}
.ov .it .phone{width:100%;border-radius:7mm;padding:1.5mm}
.ov .it .scr{border-radius:5.6mm;height:96mm;padding-top:0}
.ov .it .scr img{object-fit:cover;object-position:top;height:100%}
.ov .it .scr i{width:11mm;height:3.2mm;top:1.4mm}
.ov .it p{font-size:11pt;font-weight:560;letter-spacing:-.01em;display:flex;gap:7px}
.ov .it p b{color:var(--brass);font:500 9pt GeistMono;padding-top:2px}
/* help */
table{width:100%;border-collapse:collapse;margin-top:2mm}
td{padding:4mm 6mm 4mm 0;border-top:1px solid var(--line);vertical-align:top;font-size:11.5pt;line-height:1.4}
td:first-child{font-weight:600;width:42%}
tr:last-child td{border-bottom:1px solid var(--line)}
.contact{display:grid;grid-template-columns:1fr 1fr;gap:6mm;margin-top:12mm}
.contact div{background:#F4F4F5;border-radius:4mm;padding:6mm}
.contact h4{font:500 8pt GeistMono;letter-spacing:.12em;text-transform:uppercase;color:var(--ink2);margin-bottom:2mm}
.contact p{font-size:12pt;line-height:1.5}
</style></head><body>

<section class="cover">
  <div class="lock">${MARK("#121213", "#FFFFFF")}Dijivizit</div>
  <div class="phones">${phone("card-top")}${phone("dash-status")}</div>
  <h1>Kullanım<br><span>kılavuzu.</span></h1>
  <p class="lead">Kartınızı adım adım hazırlayın. Her sayfada bir adım ve o adımın ekran görüntüsü var.</p>
  <div class="arcs">${ARCS}</div>
</section>

<section class="ov">
  <div class="k">Özet</div>
  <h2>6 adımda<br><span>hazır kart.</span></h2>
  <div class="grid">
  ${[
    ["register", "Hesabınızı açın"],
    ["edit", "Bilgilerinizi yazın"],
    ["avatar", "Fotoğrafınızı ekleyin"],
    ["links-add", "Telefon ve bağlantılar"],
    ["dash-status", "Kartı yayınlayın"],
    ["card-top", "Okutun ve test edin"],
  ]
    .map(([s, t], i) => `<div class="it">${phone(s)}<p><b>0${i + 1}</b>${t}</p></div>`)
    .join("")}
  </div>
</section>

${STEPS.map(stepPage).join("\n")}

<section class="help">
  <div class="k">Yardım</div>
  <h2>Bir sorun<br><span>mu var?</span></h2>
  <table>${PROBLEMS.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join("")}</table>
  <div class="contact">
    <div><h4>Bize ulaşın</h4><p>talep@dijivizit.com<br>0540 626 19 65 · WhatsApp</p></div>
    <div><h4>Adres</h4><p>Osmangazi Mah. Basın Şehitleri Cad. No:174<br>Odunpazarı / Eskişehir</p></div>
  </div>
</section>
</body></html>`;

// Footer on every page but the cover.
const withFoot = html
  .replace(
    /<\/section>/g,
    `<div class="foot"><span class="lk">${MARK("#121213", "#fff")}Dijivizit</span><span>KULLANIM KILAVUZU</span></div></section>`,
  )
  .replace(
    /(<section class="cover">[\s\S]*?)<div class="foot">[\s\S]*?<\/div><\/section>/,
    "$1</section>",
  );

const file = path.join(HERE, "_kilavuz.html");
fs.writeFileSync(file, withFoot);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();
await page.goto(`file://${file}`);
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState("networkidle");
await page.pdf({ path: OUT, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
fs.unlinkSync(file);
console.log(OUT);
