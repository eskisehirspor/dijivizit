/**
 * Category landing pages at dijivizit.com/<slug>: one page per head term
 * ("nfc kartvizit", "dijital kartvizit", "akıllı kartvizit"), each with its own
 * angle so they do not compete with each other, with /kartvizit (prices) or
 * with the /rehber guides, which they link to.
 *
 * Every claim here must match what the product actually does (see the app and
 * docs/kilavuz); prices come from lib/orders/finishes.ts.
 */
export type LandingSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export type Landing = {
  slug: string;
  /** The search term the page is built around, used as the breadcrumb label. */
  term: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  sections: LandingSection[];
  /** Rows for the comparison table: [feature, paper card, Dijivizit]. */
  compare?: [string, string, string][];
  faq: { q: string; a: string }[];
  guides: string[];
  /** The other landing pages to link to. */
  siblings: string[];
};

export const LANDINGS: Landing[] = [
  {
    slug: "nfc-kartvizit",
    term: "NFC kartvizit",
    title: "NFC Kartvizit | Metal ve Ahşap, Telefona Dokundur Paylaş | Dijivizit",
    description:
      "NFC kartvizit: telefona dokundurunca dijital profiliniz açılır, rehbere tek dokunuşla kaydedilir. Siyah, gümüş, gold metal ve ahşap; arkada QR kod, uygulama gerekmez. Fiyatlar KDV dahil, kargo ücretsiz.",
    h1: "NFC kartvizit",
    lead: "İçinde NFC çipi olan, telefona dokundurunca dijital profilinizi açan kartvizit. Metal ya da ahşap; arkasında QR kod, karşı tarafta uygulama gerekmez.",
    sections: [
      {
        heading: "NFC kartvizit nasıl çalışır?",
        paragraphs: [
          "NFC (yakın alan iletişimi), temassız ödemede kullanılan teknolojinin aynısıdır. Kartın içine yerleştirilen küçük çip, telefon yaklaştırıldığında kartınıza özel bağlantıyı telefona iletir. Telefon bu bağlantıyı tarayıcıda açar ve karşınızdaki kişi profilinizi görür.",
          "Çipin pili yoktur, şarj edilmez; enerjisini telefonun NFC alanından alır. Bu yüzden kart yıllarca aynı şekilde çalışır.",
        ],
        list: [
          "Karşınızdakinin telefonunun kilidi açık olsun.",
          "iPhone'da kartı telefonun üst kenarına, Android'de arkasının ortasına yaklaştırın.",
          "Ekranda çıkan bildirime dokunun; profiliniz açılır.",
          "“Rehberime Kaydet” ile tüm bilgileriniz tek seferde telefon rehberine eklenir.",
        ],
      },
      {
        heading: "Hangi telefonlarda çalışır?",
        paragraphs: [
          "iPhone XS, XR ve sonraki tüm modeller NFC kartvizitleri ek bir ayar gerekmeden okur. Android telefonların büyük çoğunluğunda NFC vardır; ayarlarda açık olması yeterlidir.",
          "NFC'si olmayan ya da kapalı olan telefonlar için her kartın arkasında yedek bir QR kod bulunur. Kamerayla okutulduğunda aynı profil açılır. Yani kartınız her telefonda çalışır.",
        ],
      },
      {
        heading: "Malzemeler: metal ve ahşap",
        paragraphs: [
          "Metal kartlarda yazı ve logo yüzeye lazerle kazınır, ahşap kartlarda lazerle yakılır. Baskı ve mürekkep olmadığı için silinmez, solmaz. Beş kaplama var: siyah metal, gümüş, gold, koyu ahşap ve açık ahşap.",
          "İletişim bilgileriniz dijital profilinizde durur; numaranız ya da unvanınız değiştiğinde kartı yeniden bastırmanız gerekmez, profili güncellemeniz yeter.",
        ],
      },
      {
        heading: "Kâğıt kartvizitten farkı",
        paragraphs: [
          "Kâğıt kartvizit verildikten sonra çoğu zaman bir çekmeceye girer ve bilgileri elle yazılmayı bekler. NFC kartvizitte bilgileriniz karşınızdakinin telefonuna bir dokunuşla geçer; tek kart yıllarca yeter.",
        ],
      },
    ],
    compare: [
      ["Bilgileri paylaşmak", "Elden verilir, elle yazılır", "Dokundur, rehbere kaydet"],
      ["Numara ya da unvan değişince", "Yeniden baskı", "Profili güncellemek yeter"],
      ["Sosyal medya, web, IBAN, katalog", "Sığmaz", "Tek profilde"],
      ["Kaç kez açıldığını görmek", "Mümkün değil", "Analitik panelinde"],
      ["Ömrü", "Bir dağıtımlık", "Yıllarca aynı kart"],
    ],
    faq: [
      {
        q: "NFC kartvizit için karşı tarafın uygulama indirmesi gerekir mi?",
        a: "Hayır. Profil telefonun tarayıcısında açılır; iPhone ve Android'de ek bir uygulama gerekmez.",
      },
      {
        q: "Telefonda NFC yoksa ne olur?",
        a: "Her kartın arkasında yedek bir QR kod vardır. Kamerayla okutulduğunda aynı profil açılır.",
      },
      {
        q: "Kartı kaybedersem ne olur?",
        a: "Panelde Kartlarım sayfasından o kartı kapatırsınız; kart artık açılmaz, diğer kartlarınız çalışmaya devam eder.",
      },
      {
        q: "NFC kartvizit fiyatları ne kadar?",
        a: "Güncel fiyatlar bu sayfada ve Fiyatlar sayfasında yazar; KDV dahil, kargo ücretsizdir. 10 ve üzeri adette indirim uygulanır.",
      },
    ],
    guides: [
      "nfc-kartvizit-nedir",
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "metal-kartvizit",
      "ahsap-kartvizit",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
    ],
    siblings: ["dijital-kartvizit", "akilli-kartvizit"],
  },
  {
    slug: "dijital-kartvizit",
    term: "Dijital kartvizit",
    title: "Dijital Kartvizit | Profil, QR Kod ve NFC Kart | Dijivizit",
    description:
      "Dijital kartvizit: telefon, WhatsApp, e-posta, sosyal medya, IBAN ve kataloğunuz tek sayfada. Bağlantı, QR kod ya da NFC kartla paylaşın; bilgileriniz değişince anında güncelleyin. Gelen kişileri ve görüntülenmeleri panelden takip edin.",
    h1: "Dijital kartvizit",
    lead: "Bütün iletişim bilgileriniz, sosyal hesaplarınız, IBAN'ınız ve belgeleriniz tek bir sayfada. Bağlantıyla, QR kodla ya da NFC kartla paylaşılır; bilgileriniz değiştiğinde siz güncellersiniz, herkes yenisini görür.",
    sections: [
      {
        heading: "Dijital kartvizitte neler olur?",
        paragraphs: [
          "Dijivizit profiliniz, karşınızdakinin telefonunda açılan sade bir sayfadır. Üstte fotoğrafınız, adınız, unvanınız ve şirketiniz; altında dokunulabilir iletişim satırları yer alır.",
        ],
        list: [
          "Telefon, WhatsApp, e-posta, web sitesi, LinkedIn, Instagram ve X",
          "Adres; dokununca harita açılır",
          "IBAN ve fatura bilgileri, tek dokunuşla kopyalanır",
          "Katalog, fiyat listesi, özgeçmiş gibi PDF belgeler",
          "Uzmanlık alanlarınız ve kısa bir tanıtım yazısı",
        ],
      },
      {
        heading: "Tek dokunuşla rehbere kaydedilir",
        paragraphs: [
          "Profilinizdeki “Rehberime Kaydet” düğmesi; adınızı, şirketinizi, unvanınızı, bütün telefonlarınızı ve e-postalarınızı, adresinizi ve web bağlantılarınızı tek seferde karşı tarafın rehberine ekler. Kimsenin numaranızı elle yazması gerekmez.",
        ],
      },
      {
        heading: "Size geri dönüş: kişiler, notlar, hatırlatmalar",
        paragraphs: [
          "Dijital kartvizit yalnızca bilgi vermez, bilgi de toplar. Profilinizi açan kişi “Bilgilerimi bırak” ile adını ve numarasını size iletebilir; bu kişiler panelinizdeki Kişiler listesine düşer.",
          "Her kişiye not ekleyebilir, “1 hafta sonra ara” gibi takip hatırlatmaları kurabilirsiniz; o gün sabah e-postanıza hatırlatma gelir. Aldığınız kâğıt kartvizitlerin fotoğrafını çektiğinizde bilgiler otomatik okunur.",
        ],
      },
      {
        heading: "Kim, ne zaman, nereden açtı?",
        paragraphs: [
          "Analitik panelinde kartınızın kaç kez açıldığını, hangi şehirlerden ve hangi telefonlarla açıldığını, ziyaretçilerin neye dokunduğunu ve kaçının sizi rehberine kaydettiğini görürsünüz.",
        ],
      },
      {
        heading: "Nasıl paylaşılır?",
        list: [
          "Bağlantı: WhatsApp'tan, e-postayla, e-posta imzanızda ya da sosyal medya biyografinizde",
          "QR kod: broşürde, sunumda, fuar standında, ürün ambalajında",
          "NFC kart: yüz yüze tanıştığınız anda, telefona dokundurarak",
        ],
      },
      {
        heading: "Şirketler için",
        paragraphs: [
          "Ekip panelinde bütün çalışan kartlarını tek yerden yönetirsiniz. Bir çalışan ayrıldığında fiziksel kart aynı kalır; kartın kimin profilini açacağını değiştirmeniz yeter. Şirket kartlarından gelen kişileri ve görüntülenmeleri de buradan görürsünüz.",
        ],
      },
    ],
    faq: [
      {
        q: "Dijital kartvizit ücretli mi?",
        a: "Dijital profil ilk yıl ücretsizdir; sonrasında aylık küçük bir ücret alınır. Güncel tutarlar Fiyatlar sayfasında yazar. NFC kart bir kez satın alınır.",
      },
      {
        q: "Bilgilerimi değiştirince yeni kart gerekir mi?",
        a: "Hayır. Panelden profilinizi güncellersiniz; aynı kart, QR ve bağlantı yeni bilgileri gösterir.",
      },
      {
        q: "Dijital kartvizit nasıl oluşturulur?",
        a: "Hesabınızı açar, adınızı, fotoğrafınızı ve iletişim bağlantılarınızı eklersiniz, sonra profili yayınlarsınız. Bütün adımlar birkaç dakika sürer.",
      },
      {
        q: "Kişisel verilerim güvende mi?",
        a: "Banka ve fatura bilgileri siz açmadıkça profilde görünmez. Ziyaretçilerin IP adresi saklanmaz; ayrıntılar KVKK aydınlatma metnindedir.",
      },
    ],
    guides: [
      "dijital-kartvizit-nedir",
      "dijital-kartvizit-nasil-olusturulur",
      "qr-kod-kartvizit",
      "kurumsal-dijital-kartvizit",
      "yeni-isletme-kontrol-listesi",
    ],
    siblings: ["nfc-kartvizit", "akilli-kartvizit"],
  },
  {
    slug: "akilli-kartvizit",
    term: "Akıllı kartvizit",
    title: "Akıllı Kartvizit | NFC + QR + Dijital Profil Bir Arada | Dijivizit",
    description:
      "Akıllı kartvizit: NFC çipli metal ya da ahşap kart, arkasında QR kod ve her zaman güncel dijital profil. Rehbere tek dokunuşla kayıt, gelen kişiler, analitik ve ekip yönetimi. Eskişehir'den Türkiye'ye ücretsiz kargo.",
    h1: "Akıllı kartvizit",
    lead: "Akıllı kartvizit üç şeyin birleşimidir: telefona dokundurulan NFC kart, her telefonda çalışan QR kod ve bilgilerinizi taşıyan dijital profil. Dijivizit üçünü birlikte verir.",
    sections: [
      {
        heading: "Akıllı kartvizit ne işe yarar?",
        paragraphs: [
          "Tanıştığınız kişi, bilgilerinizi saniyeler içinde telefonuna kaydeder; siz de onun bilgilerini alırsınız. Kartınız bir kez basılır, içerik ise her zaman güncel kalır.",
        ],
        list: [
          "Dokundurunca profil açılır, uygulama gerekmez",
          "Rehbere tek dokunuşla kayıt",
          "Telefon, WhatsApp, sosyal medya, IBAN, katalog tek sayfada",
          "Karşı tarafın bilgisini bırakabildiği form",
          "Görüntülenme, şehir ve cihaz istatistikleri",
          "Kaybolan kartı tek tıkla kapatma",
        ],
      },
      {
        heading: "Kimler kullanıyor?",
        list: [
          "Satış ve iş geliştirme ekipleri: fuarda, toplantıda, sahada",
          "Emlak danışmanları ve sigortacılar: müşteri adayını hemen rehbere kaydettirmek için",
          "Mimarlar, tasarımcılar, ajanslar: kataloğu ve projeleri kartta göstermek için",
          "Doktorlar, avukatlar, danışmanlar: randevu ve iletişim bilgilerini tek yerde toplamak için",
          "Restoran, kafe ve mağazalar: QR ile menü, konum ve sosyal medya",
          "Şirketler: bütün çalışan kartlarını tek panelden yönetmek için",
        ],
      },
      {
        heading: "Neden Dijivizit?",
        list: [
          "Metal kartlarda lazer kazıma, ahşapta lazerle yakma; silinmez",
          "Her kartta yedek QR kod; NFC'si olmayan telefonlarda da çalışır",
          "Türkçe panel, Türkçe destek; Eskişehir'de üretim",
          "Ekip paneli ve kart devri: çalışan değişince kart yeniden basılmaz",
          "KDV dahil fiyat, ücretsiz kargo, 10 ve üzeri adette indirim",
        ],
      },
    ],
    compare: [
      ["Paylaşım", "Elden kâğıt", "NFC + QR + bağlantı"],
      ["Güncelleme", "Yeniden baskı", "Anında, panelden"],
      ["Rehbere kayıt", "Elle", "Tek dokunuş"],
      ["Geri dönüş", "Yok", "Bilgi bırakma formu, Kişiler listesi"],
      ["Ölçüm", "Yok", "Görüntülenme, şehir, cihaz"],
    ],
    faq: [
      {
        q: "Akıllı kartvizit ile NFC kartvizit aynı şey mi?",
        a: "Genellikle aynı anlamda kullanılır. Dijivizit'te akıllı kartvizit; NFC kart, arkasındaki QR kod ve dijital profilin birlikte sunulmasıdır.",
      },
      {
        q: "Ekip için toplu sipariş verebilir miyim?",
        a: "Evet. 10 ve üzeri adette indirim uygulanır; ekip panelinden kartları çalışanlarınıza atar, çalışan değişince kartı yeni kişiye devredersiniz.",
      },
    ],
    guides: [
      "nfc-kartvizit-nedir",
      "dijital-kartvizit-nedir",
      "kurumsal-dijital-kartvizit",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
    ],
    siblings: ["nfc-kartvizit", "dijital-kartvizit"],
  },
];

export function getLanding(slug: string): Landing {
  const l = LANDINGS.find((x) => x.slug === slug);
  if (!l) throw new Error(`unknown landing ${slug}`);
  return l;
}
