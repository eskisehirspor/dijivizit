/** Copy for the indexable sections of dijivizit.com, shared by the page and
 * its JSON-LD so the structured data always matches what is on screen. */
import { FINISHES, PRICING, PROMISES, formatTry, type Finish } from "@/lib/orders/finishes";

export const USE_CASES = [
  {
    title: "Kurumsal ekipler",
    body: "Tüm ekibe aynı tasarımda kurumsal NFC kartvizit. Ekip panelinden kartları yönetin; biri ayrıldığında kartı yeni çalışana devredin, kart değişmez.",
  },
  {
    title: "Satış ve emlak",
    body: "Müşteriyle tanıştığın anda telefon, WhatsApp ve konum tek dokunuşla onun rehberinde. Takip edilmeyen kartvizit kalmaz.",
  },
  {
    title: "Serbest çalışanlar",
    body: "Portfolyo, sosyal hesaplar, IBAN ve belgeler tek bir akıllı kartvizitte. Kağıt kartvizit bastırmana gerek kalmaz.",
  },
  {
    title: "Fuar ve etkinlikler",
    body: "Kalabalıkta kartvizit dağıtmak yerine dokun ya da QR kodu okut. Temassız kartvizit, gün sonunda tükenmez.",
  },
] as const;

const priceOf = (material: Finish["material"]) =>
  FINISHES.find((f) => f.material === material)!.price;

/** Column headers for the homepage comparison table. */
export const COMPARISON_COLUMNS = [
  "Kâğıt kartvizit",
  "Kartsız dijital kartvizit (link + QR)",
  "Dijivizit NFC kartvizit",
] as const;

/** Rows: [label, paper, card-less digital, NFC card]. Prices come from finishes.ts. */
export const COMPARISON: readonly (readonly [string, string, string, string])[] = [
  [
    "İlk maliyet",
    "Baskı başına ödenir; her değişiklikte yeniden basılır.",
    `${formatTry(priceOf("digital"))}/ay; yıllık ${formatTry(PRICING.digitalYearlyFee)} peşin ödenir. Kart ve kargo ücreti yok.`,
    `PVC ve ahşap ${formatTry(priceOf("pvc"))}, metal ${formatTry(priceOf("metal"))}; tek seferlik. Profil ilk ${PRICING.profileFreeYears === 1 ? "" : `${PRICING.profileFreeYears} `}yıl ücretsiz, sonra ${formatTry(PRICING.profileMonthlyFee)}/ay.`,
  ],
  [
    "Bilgi değişince",
    "Kartlar yeniden bastırılır.",
    "Panelden anında güncellenir; link ve QR kod aynı kalır.",
    "Panelden anında güncellenir; kart aynı kalır.",
  ],
  [
    "Paylaşım şekli",
    "Elden ele verilir, kaybolur.",
    "Link (WhatsApp, e-posta imzası, sosyal medya) ve QR kod.",
    "Telefona NFC dokunuş, QR kod ve link.",
  ],
  ["Rehbere kayıt", "Bilgiler elle yazılır.", "Tek dokunuşla (vCard).", "Tek dokunuşla (vCard)."],
  [
    "İstatistik",
    "Yok; kartın işe yarayıp yaramadığı bilinmez.",
    "Kaç kez açıldığı, hangi şehir ve cihazlardan görüntülendiği.",
    "Kaç kez açıldığı, hangi şehir ve cihazlardan görüntülendiği.",
  ],
  [
    "Çevre etkisi / yeniden baskı",
    "Bilgi değiştiğinde ve kart bittiğinde yeni baskı.",
    "Baskı yok.",
    "Tek kart yıllarca kullanılır; yeniden baskı gerekmez.",
  ],
  [
    "Kurumsal yönetim",
    "Her çalışan için ayrı baskı; çalışan ayrılınca kartları kullanılamaz.",
    `${PRICING.bulkMinQuantity} ve üzeri kişilik ekiplerde %${PRICING.bulkDiscountPercent} indirim.`,
    `Ekip panelinden kart atama ve devir; ${PRICING.bulkMinQuantity} ve üzeri adette %${PRICING.bulkDiscountPercent} indirim ve firma logosu.`,
  ],
];

/** Card facts already stated on the product and landing pages. */
export const CARD_SPECS = [
  ["Ölçü", "Banka kartı ölçüsü, 85,6 × 54 mm (PVC); cüzdanın kart bölmesine girer."],
  ["Kaplamalar", "Mat siyah PVC, siyah metal, gümüş, gold, koyu ve açık ahşap."],
  ["Baskı", "Yalnızca ön yüz: solda logo, sağda NFC işareti. Metalde lazer kazıma, ahşapta yakma."],
  ["Pil", "Yok. NFC çip enerjisini dokunulan telefondan alır."],
  ["Uyumluluk", "iPhone XS ve sonrası, NFC'li Android telefonlar; diğerleri için QR kod ve link."],
  [
    "Teslimat",
    `${PROMISES.deliveryHours} saatte, kargo ücretsiz; kartsız ürün ${PROMISES.digitalDeliveryHours} saatte e-postada.`,
  ],
  ["Değişim", "Okunmayan kart ücretsiz yenisiyle değiştirilir; 14 gün cayma hakkı."],
] as const;

export const FAQ = [
  {
    q: "Dijital kartvizit nedir?",
    a: "Dijital kartvizit, kâğıt kartvizitin telefonda açılan hâlidir: telefon, WhatsApp, e-posta, adres, sosyal hesaplar ve IBAN tek bir sayfada durur. Link, QR kod ya da NFC kartla paylaşılır; karşı taraf uygulama indirmeden açar ve tek dokunuşla rehberine kaydeder.",
  },
  {
    q: "Dijital kartvizit ücretsiz mi?",
    a: "NFC kartla birlikte dijital profil ilk yıl ücretsizdir; sonrasında aylık 59,90 TL'dir. Kartlar ahşap ve mat siyah PVC'de 2.500 TL, metalde 4.000 TL'dir; KDV ve kargo dahildir.",
  },
  {
    q: "Dijivizit güvenilir mi?",
    a: "Dijivizit, Eskişehir'deki ASD Tasarım Ltd. Şti.'nin markasıdır. Ödeme Shopier güvencesiyle alınır, kartlar 72 saatte teslim edilir, okunmayan kart ücretsiz değiştirilir ve 14 gün cayma hakkın vardır.",
  },
  {
    q: "Kartım ne kadar sürede elime ulaşır?",
    a: "Siparişin 72 saatte teslim edilir ve kargo ücretsizdir. Kart telefonlarda okunmazsa ücretsiz yenisiyle değiştiririz.",
  },
  {
    q: "Kart olmadan dijital kartvizit alabilir miyim?",
    a: "Evet. Kartsız dijital kartvizitte profil linkini ve QR kodunu alırsın; aylık 59,90 TL'dir ve yıllık 718,80 TL olarak peşin ödenir. Link ve QR kodun 2 saat içinde e-postanda olur. İstediğin zaman NFC karta geçebilirsin, link ve QR aynı kalır.",
  },
  {
    q: "NFC kartvizit nedir?",
    a: "NFC kartvizit, içinde NFC çip bulunan bir akıllı kartvizittir. Kartı bir telefonun arkasına dokundurduğunda dijital kartvizit profilin telefonda açılır; karşı taraf bilgilerini tek dokunuşla rehberine kaydeder.",
  },
  {
    q: "Karşı tarafın uygulama indirmesi gerekir mi?",
    a: "Hayır. Dijivizit profili telefonun tarayıcısında açılır. NFC desteklemeyen telefonlar için profilinin QR kodunu kendi telefonundan okutabilir ya da linkini paylaşabilirsin.",
  },
  {
    q: "Hangi telefonlarla çalışır?",
    a: "iPhone XS ve sonrası tüm iPhone modelleri ile NFC özelliği olan Android telefonlar kartı doğrudan okur. NFC kapalıysa veya yoksa profilinin QR kodunu kendi ekranından okutur ya da linkini paylaşırsın.",
  },
  {
    q: "Bilgilerim değişince kartı yeniden bastırmam gerekir mi?",
    a: "Hayır. Kart her zaman aynı profile yönlendirir. Telefonunu, unvanını ya da sosyal hesaplarını Dijivizit panelinden değiştirdiğin anda kartın da güncellenmiş olur.",
  },
  {
    q: "Akıllı kartvizitte hangi bilgileri paylaşabilirim?",
    a: "Telefon, WhatsApp, e-posta, web sitesi, LinkedIn ve diğer sosyal hesaplar, IBAN, adres ve paylaşmak istediğin belgeler. Hangisinin görüneceğine sen karar verirsin.",
  },
  {
    q: "Kartın pili ya da şarjı var mı?",
    a: "Yok. NFC çip enerjisini dokunulan telefondan alır; kart yıllarca şarjsız çalışır.",
  },
  {
    q: "Hangi kaplama seçenekleri var?",
    a: "Mat siyah PVC, kumlu mat siyah metal, parlak gümüş, ayna parlaklığında gold, koyu ceviz ve açık meşe ahşap. Baskı yalnızca ön yüzdedir: solda logo, sağda NFC işareti. Metalde logo lazerle kazınır, ahşapta yakılır, PVC'de mat yüzeye işlenir; NFC hepsinde aynı şekilde çalışır. 10 ve üzeri kurumsal siparişte firma logon işlenir.",
  },
  {
    q: "Karşımdakinin bilgilerini de alabilir miyim?",
    a: 'Evet. Kartını açan kişi "Bilgilerimi bırak" ile adını, telefonunu ve e-postasını sana bırakır; kişi listene düşer ve sana e-posta gelir. Kâğıt kartvizit verenlerinkini de fotoğrafını çekerek tarayabilirsin.',
  },
  {
    q: "Tanıştığım kişileri takip etmemi hatırlatır mı?",
    a: "Evet. Her kişiye not ve takip tarihi ekleyebilirsin. Günü gelince sabah e-postana hatırlatma gelir; tek dokunuşla hazır yazılmış WhatsApp mesajını gönderirsin.",
  },
  {
    q: "Ekibim için toplu kartvizit alabilir miyim?",
    a: "Evet. Ekip panelinden şirket kartlarını yönetir, çalışanlarına atarsın; biri ayrılınca kartı yeni kişiye devredersin. Kurumsal siparişler için merhaba@dijivizit.com adresine yaz.",
  },
] as const;

export const KEYWORDS = [
  "NFC kartvizit",
  "akıllı kartvizit",
  "dijital kartvizit",
  "temassız kartvizit",
  "dokunmatik kartvizit",
  "QR kod kartvizit",
  "QR kartvizit",
  "metal kartvizit",
  "gold kartvizit",
  "ahşap kartvizit",
  "PVC kartvizit",
  "kurumsal kartvizit",
  "NFC kart",
  "elektronik kartvizit",
  "online kartvizit",
  "kartvizit yerine NFC",
] as const;

/** Short answers to what people search around "dijital kartvizit". */
export const GUIDE_BLOCKS = [
  {
    title: "Dijital kartvizit nasıl yapılır?",
    body: "Kaplamanı seçip siparişi verirsin, panelde fotoğrafını, iletişim bilgilerini ve linklerini eklersin, kartın 72 saatte gelir. Kartı telefona dokundurduğunda profilin açılır; link ve QR kodun da hazırdır.",
    href: "/rehber/dijital-kartvizit-nasil-olusturulur",
  },
  {
    title: "Fiyatlar neye göre değişir?",
    body: "Fark kartın malzemesindedir: ahşap ve mat siyah PVC 2.500 TL, metal 4.000 TL. Profil ilk yıl ücretsiz, sonra aylık 59,90 TL; içinde analitik, kişi listesi, hatırlatmalar ve sınırsız güncelleme var.",
    href: "/dijital-kartvizit-fiyatlari",
  },
  {
    title: "NFC mi, QR kod mu?",
    body: "NFC kart yüz yüze tanışmada en hızlısıdır: dokundurmak yeter. QR kod ve link ise her telefonda çalışır; e-posta imzasında, sunumda ve sosyal medyada paylaşılır. Dijivizit'te üçü birlikte gelir.",
    href: "/nfc-kartvizit",
  },
  {
    title: "Rehbere kaydetme (vCard)",
    body: 'Profildeki "Rehberime Kaydet" düğmesi bilgilerini vCard (VCF) dosyası olarak karşı tarafın telefonuna ekler: ad, şirket, unvan, telefonlar, e-posta, adres ve web adresleri tek seferde kaydedilir.',
    href: "/rehber/vcf-dosyasi-nedir",
  },
  {
    title: "Dijital kartvizit nasıl kullanılır?",
    body: "Toplantıda kartı dokundur, Instagram biyografine ve WhatsApp durumuna profil linkini koy, e-posta imzana ve sunumlarına QR kodunu ekle. Fuarda kartvizit bitmez, her açılış panelde görünür.",
    href: "/rehber/dijital-kartvizit-nasil-paylasilir",
  },
  {
    title: "Dijital kartvizit örnekleri",
    body: "Emlak danışmanından diyetisyene, avukattan kuaföre: mesleğine göre profilde hangi bilgilerin öne çıktığını örneklerle gör.",
    href: "/rehber/dijital-kartvizit-ornekleri",
  },
] as const;
