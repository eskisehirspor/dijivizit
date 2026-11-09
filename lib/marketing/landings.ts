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
  /** The other landing pages to link to (slugs of LANDINGS or SEGMENTS). */
  siblings: string[];
  /** Parent page for nested pages (/dijital-kartvizit/<meslek|şehir>). */
  parent?: { name: string; href: string };
  /** Grouping for nested pages, used for the index list on the parent page. */
  kind?: "meslek" | "sehir";
  /** Only these products in the grid and the ItemList (material pages). */
  finishes?: string[];
};

export const LANDINGS: Landing[] = [
  {
    slug: "nfc-kartvizit",
    term: "NFC kartvizit",
    title: "NFC Kartvizit | PVC, Metal ve Ahşap, Dokundur Paylaş | Dijivizit",
    description:
      "NFC kartvizit: telefona dokundur, profilin açılsın, rehbere tek dokunuşla kaydedilsin. Metal, ahşap ve PVC; link ve QR kod da sizde. Kargo ücretsiz.",
    h1: "NFC kartvizit",
    lead: "İçinde NFC çipi olan, telefona dokundurunca dijital profilinizi açan kartvizit. Metal, ahşap ya da mat siyah PVC; profil linki ve QR kod da sizde, karşı tarafta uygulama gerekmez.",
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
          "NFC'si olmayan ya da kapalı olan telefonlar için profilinizin QR kodu ve linki de sizde. QR kodu kendi telefonunuzun ekranından okutursunuz, aynı profil açılır. Yani profiliniz her telefonda açılır.",
        ],
      },
      {
        heading: "Malzemeler: metal, ahşap ve PVC",
        paragraphs: [
          "Metal kartlarda logo ve temassız işareti yüzeye lazerle kazınır, ahşap kartlarda lazerle yakılır. Baskı ve mürekkep olmadığı için silinmez, solmaz. Mat siyah PVC kartta logo ve temassız işareti mat yüzeye işlenir; kart hafif, ince ve daha uygun fiyatlıdır. Altı kaplama var: mat siyah PVC, siyah metal, gümüş, gold, koyu ahşap ve açık ahşap.",
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
        a: "Profilinizin QR kodunu kendi telefonunuzdan okutabilir ya da linki paylaşabilirsiniz. İki yolla da aynı profil açılır.",
      },
      {
        q: "Kartı kaybedersem ne olur?",
        a: "Panelde Kartlarım sayfasından o kartı kapatırsınız; kart artık açılmaz, diğer kartlarınız çalışmaya devam eder.",
      },
      {
        q: "Telefonda NFC nasıl açılır?",
        a: "iPhone'da NFC her zaman açıktır. Android'de Ayarlar > Bağlantılar (Samsung) ya da Bağlantı ve paylaşım (Xiaomi) içinden NFC'yi açarsınız; hızlı ayarlar panelinde de NFC düğmesi bulunur.",
      },
      {
        q: "NFC kartvizit nereden alınır?",
        a: "Kartı ve dijital profili birlikte sunan markalardan alabilirsiniz. Dijivizit'te sipariş bu sitedeki formdan verilir; profil ilk yıl ücretsizdir, kargo ve KDV fiyata dahildir.",
      },
      {
        q: "NFC kartvizit fiyatları ne kadar?",
        a: "Güncel fiyatlar bu sayfada ve Fiyatlar sayfasında yazar; KDV dahil, kargo ücretsizdir. 10 ve üzeri adette indirim uygulanır.",
      },
    ],
    guides: [
      "nfc-kartvizit-nedir",
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "telefonda-nfc-nasil-acilir",
      "nfc-kartvizit-nereden-alinir",
      "metal-kartvizit",
      "ahsap-kartvizit",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
      "kartvizit-nasil-verilir",
    ],
    siblings: ["dijital-kartvizit", "akilli-kartvizit"],
  },
  {
    slug: "dijital-kartvizit",
    term: "Dijital kartvizit özellikleri",
    title: "Dijital Kartvizit Özellikleri: Profil, QR ve NFC | Dijivizit",
    description:
      "Dijital kartvizit: telefon, WhatsApp, e-posta, sosyal medya ve IBAN tek sayfada. Link, QR ya da NFC kartla paylaşın; bilgileriniz değişince anında güncelleyin.",
    h1: "Dijital kartvizit özellikleri",
    lead: "Bütün iletişim bilgileriniz, sosyal hesaplarınız, IBAN'ınız ve belgeleriniz tek bir sayfada. Bağlantıyla, QR kodla ya da NFC kartla paylaşılır; bilgileriniz değiştiğinde siz güncellersiniz, herkes yenisini görür.",
    sections: [
      {
        heading: "Dijital kartvizit nedir?",
        paragraphs: [
          "Dijital kartvizit, kâğıt kartvizitin telefonda açılan hâlidir: adınız, unvanınız, telefonunuz, WhatsApp'ınız, e-postanız, adresiniz ve sosyal hesaplarınız tek bir web sayfasında durur. Bu sayfa bir bağlantıyla, QR kodla ya da NFC kartla paylaşılır; karşı tarafın uygulama indirmesi gerekmez.",
          "Kâğıttan farkı, bilgilerin her zaman güncel kalmasıdır. Numaranız ya da unvanınız değişince panelden düzeltirsiniz; daha önce kartınızı alan herkes yeni bilgiyi görür. Mobil kartvizit, elektronik kartvizit, cep kartviziti ve e-kartvizit aynı şeyin farklı adlarıdır.",
        ],
      },
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
    compare: [
      ["Bilgi değişince", "Yeniden basım gerekir", "Panelden güncellenir, kart aynı kalır"],
      ["Rehbere kayıt", "Numara elle yazılır", "Tek dokunuşla tüm bilgiler kaydedilir"],
      ["İçerik", "Ad, telefon, e-posta", "WhatsApp, konum, sosyal hesaplar, IBAN, PDF"],
      ["Paylaşım", "Yalnızca yüz yüze", "Link, QR kod ve NFC kart"],
      ["Ölçüm", "Yok", "Kaç kez, nereden açıldığı görünür"],
    ],
    faq: [
      {
        q: "Dijital kartvizit fiyatları ne kadar?",
        a: "Dijivizit'te NFC kartla birlikte dijital profil ilk yıl ücretsizdir; sonrasında aylık 59,90 TL'dir. Kartlar ahşap ve mat siyah PVC'de 2.500 TL, metalde 4.000 TL'dir (KDV ve kargo dahil). Kartsız, yalnızca link ve QR kodla kullanım aylık 59,90 TL'dir.",
      },
      {
        q: "Dijital kartvizit hangi telefonlarda açılır?",
        a: "Link ve QR kod her akıllı telefonda açılır. NFC kart iPhone XS ve sonrası ile NFC'si olan Android telefonlarda dokundurunca açılır; uygulama gerekmez.",
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
        q: "En iyi dijital kartvizit hangisi?",
        a: "Karşı tarafta uygulama istemeyen, tek dokunuşla rehbere kaydeden, NFC'nin yanında QR kodu olan, analitik sunan ve kayıp kartı kapatmaya izin veren bir hizmet seçin. Rehberde 7 kriteri tek tek anlattık.",
      },
      {
        q: "Kişisel verilerim güvende mi?",
        a: "Banka ve fatura bilgileri siz açmadıkça profilde görünmez. Ziyaretçilerin IP adresi saklanmaz; ayrıntılar KVKK aydınlatma metnindedir.",
      },
    ],
    guides: [
      "dijital-kartvizit-nedir",
      "dijital-kartvizit-nasil-olusturulur",
      "en-iyi-dijital-kartvizit-nasil-secilir",
      "qr-kod-kartvizit",
      "kurumsal-dijital-kartvizit",
      "yeni-isletme-kontrol-listesi",
      "dijital-kartvizit-uygulamasi",
    ],
    siblings: ["nfc-kartvizit", "akilli-kartvizit"],
  },
  {
    slug: "akilli-kartvizit",
    term: "Akıllı kartvizit",
    title: "Akıllı Kartvizit | NFC, QR ve Dijital Profil | Dijivizit",
    description:
      "Akıllı kartvizit: NFC çipli metal, ahşap ya da PVC kart, link, QR kod ve güncel dijital profil. Rehbere tek dokunuşla kayıt, analitik ve ekip yönetimi.",
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
          "Her siparişte profil linki ve QR kod; NFC'si olmayan telefonlarda ekrandan okutulur",
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
        a: "Genellikle aynı anlamda kullanılır. Dijivizit'te akıllı kartvizit; NFC kart, profil QR kodu ve dijital profilin birlikte sunulmasıdır.",
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
      "en-iyi-dijital-kartvizit-nasil-secilir",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
    ],
    siblings: ["nfc-kartvizit", "dijital-kartvizit"],
  },
  {
    slug: "metal-kartvizit",
    term: "Metal kartvizit",
    title: "Metal Kartvizit | Siyah, Gold, Gümüş NFC Kartvizit | Dijivizit",
    description:
      "Metal kartvizit: mat siyah, fırçalanmış gümüş ve gold NFC kart; logo lazerle kazınır. Dokundur, profilin açılsın. 72 saatte teslim, kargo ücretsiz.",
    h1: "Metal kartvizit",
    lead: "Ağırlığı ve soğuk dokusuyla elden ele geçtiği anda fark edilen kart. İçinde NFC çip; bilgileriniz kartta değil, her zaman güncel dijital profilinizde.",
    finishes: ["black", "silver", "gold"],
    sections: [
      {
        heading: "Üç metal kaplama",
        list: [
          "Mat siyah metal: açık gri lazer kazıma, en sade ve kurumsal seçenek",
          "Fırçalanmış gümüş: ince yatay fırça izleri, koyu lazer kazıma",
          "Fırçalanmış gold: sarı pirinç tonunda, belirgin fırça dokusu",
        ],
        paragraphs: [
          "Üçünde de Dijivizit logosu ve temassız işareti yüzeye lazerle kazınır; baskı olmadığı için silinmez, solmaz. 10 ve üzeri adetteki kurumsal siparişlerde logo yerine firma logonuz işlenir.",
        ],
      },
      {
        heading: "Metal kartta NFC çalışır mı?",
        paragraphs: [
          "Metal, NFC sinyalini zayıflatır; bu yüzden metal NFC kartlarda çip, sinyalin geçeceği şekilde yerleştirilir. Dijivizit metal kartları iPhone XS ve sonrası ile NFC'si açık Android telefonlarda okunur. NFC'si olmayan telefonlar için profilinizin QR kodunu kendi ekranınızdan okutursunuz; aynı profil açılır.",
          "Kart okunmazsa ücretsiz yenisiyle değiştiriyoruz.",
        ],
      },
      {
        heading: "Kimler metal kartı seçiyor?",
        list: [
          "Yöneticiler, kurucular ve satış ekipleri: ilk toplantıda iz bırakmak için",
          "Avukatlar, mali müşavirler, danışmanlar: sade ve ağırbaşlı bir kart için",
          "Mimarlar ve tasarımcılar: malzemenin kendisi bir tasarım cümlesi olduğu için",
        ],
      },
      {
        heading: "Fiyat ve teslimat",
        paragraphs: [
          "Metal kartların fiyatı KDV dahil sitede yazar; kargo ücretsizdir, kart 72 saat içinde teslim edilir. Kartla birlikte dijital profil ilk yıl ücretsizdir. 14 gün cayma hakkınız vardır.",
        ],
      },
    ],
    compare: [
      ["Dayanıklılık", "Kâğıt yıpranır", "Metal, yıllarca aynı"],
      ["Yazı", "Mürekkep baskı", "Lazer kazıma, silinmez"],
      ["Bilgi değişince", "Yeniden baskı", "Profili güncellemek yeter"],
      ["Paylaşım", "Elden", "Dokundur ya da QR okut"],
    ],
    faq: [
      {
        q: "Metal kartvizit ağır mı?",
        a: "Kâğıt ve PVC karttan belirgin şekilde ağırdır, cüzdanda bir banka kartı gibi taşınır. Ağırlığı, kartın elde fark edilmesini sağlar.",
      },
      {
        q: "Metal kartvizit çizilir mi?",
        a: "Günlük kullanımda yüzeyde ince izler oluşabilir; fırçalanmış kaplamalar bu izleri daha az gösterir. Lazer kazıma silinmez.",
      },
      {
        q: "Metal kartın üzerine adım yazılıyor mu?",
        a: "Standart kartlarda Dijivizit logosu ve temassız işareti bulunur; adınız, unvanınız ve iletişim bilgileriniz profilde durur. 10 ve üzeri kurumsal siparişte firma logonuz işlenir.",
      },
      {
        q: "Metal kartvizit fiyatı ne kadar?",
        a: "Güncel fiyat bu sayfada ve Fiyatlar sayfasında yazar; KDV dahil, kargo ücretsizdir. 10 ve üzeri adette %20 indirim uygulanır.",
      },
    ],
    guides: [
      "metal-kartvizit",
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "nfc-kartvizit-nedir",
      "en-iyi-dijital-kartvizit-nasil-secilir",
    ],
    siblings: ["ahsap-kartvizit", "pvc-kartvizit", "nfc-kartvizit"],
  },
  {
    slug: "ahsap-kartvizit",
    term: "Ahşap kartvizit",
    title: "Ahşap Kartvizit | Koyu ve Açık Ahşap NFC Kartvizit | Dijivizit",
    description:
      "Ahşap kartvizit: gerçek koyu ve açık ahşap NFC kart, logo lazerle yakılır, her kartın damar dokusu farklı. Link ve QR kod da sizde, uygulama gerekmez.",
    h1: "Ahşap kartvizit",
    lead: "Gerçek ahşaptan, her biri kendi damar dokusuyla. Sıcak ve doğal bir ilk izlenim; içinde NFC çip, yanında profil linki ve QR kodunuz.",
    finishes: ["wood", "wood-light"],
    sections: [
      {
        heading: "İki ahşap tonu",
        list: [
          "Koyu ahşap: ceviz tonunda, logo koyu iz olarak yakılır",
          "Açık ahşap: meşe tonunda, daha aydınlık ve sade",
        ],
        paragraphs: [
          "Logo ve temassız işareti lazerle yakılır; mürekkep yoktur, silinmez. Ahşap doğal bir malzeme olduğu için iki kart birbirinin aynısı olmaz.",
        ],
      },
      {
        heading: "Ahşap kartvizit dayanıklı mı?",
        paragraphs: [
          "Cüzdanda taşınmaya uygundur. Uzun süre suda bırakmamak ve doğrudan ısıya maruz bırakmamak yeterli. NFC çip ahşap kartta da sorunsuz çalışır; kart okunmazsa ücretsiz değiştiriyoruz.",
        ],
      },
      {
        heading: "Kimler ahşap kartı seçiyor?",
        list: [
          "Kafe, restoran ve butik işletmeler",
          "Mimarlar, iç mimarlar ve doğal malzemeyle çalışanlar",
          "Danışmanlar, terapistler, eğitmenler: sıcak bir izlenim için",
          "Sürdürülebilirliği önemseyen markalar",
        ],
      },
      {
        heading: "Fiyat ve teslimat",
        paragraphs: [
          "Ahşap kartlar metal kartlardan daha uygun fiyatlıdır; fiyat KDV dahil, kargo ücretsiz, 72 saatte teslim. Kartla birlikte dijital profil ilk yıl ücretsizdir.",
        ],
      },
    ],
    faq: [
      {
        q: "Ahşap kartvizitte NFC çalışır mı?",
        a: "Evet. Ahşap NFC sinyalini engellemez; kart güncel iPhone'larda ve NFC'si açık Android telefonlarda okunur. NFC'si olmayan telefonlarda profil QR kodunuzu ekrandan okutursunuz.",
      },
      {
        q: "Ahşap kart ıslanırsa ne olur?",
        a: "Kısa süreli temas sorun olmaz; uzun süre suda bırakmayın. Kart okunmaz hale gelirse bize yazın.",
      },
      {
        q: "Koyu mu açık ahşap mı?",
        a: "Koyu ahşap daha resmî ve kontrastlı, açık ahşap daha aydınlık ve sade görünür. İkisinin fiyatı aynıdır.",
      },
    ],
    guides: [
      "ahsap-kartvizit",
      "nfc-kartvizit-nedir",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
      "en-iyi-dijital-kartvizit-nasil-secilir",
    ],
    siblings: ["metal-kartvizit", "pvc-kartvizit", "nfc-kartvizit"],
  },
  {
    slug: "pvc-kartvizit",
    term: "PVC kartvizit",
    title: "PVC NFC Kartvizit | Siyah Mat PVC Akıllı Kartvizit | Dijivizit",
    description:
      "PVC NFC kartvizit: mat siyah, kadife dokulu, hafif ve ince akıllı kart. Dokundur, profilin açılsın; link ve QR kod da sizde. KDV dahil, kargo ücretsiz.",
    h1: "PVC NFC kartvizit",
    lead: "Banka kartı inceliğinde, mat siyah ve kadife dokulu. En hafif Dijivizit kartı; içinde NFC çip, yanında profil linki ve QR kodunuz.",
    finishes: ["pvc-black"],
    sections: [
      {
        heading: "Siyah mat PVC",
        paragraphs: [
          "Mat siyah yüzey parmak izi göstermez, sade ve şık durur. Logo ve temassız işareti kartın mat yüzeyine işlenir. Kart banka kartı ölçüsündedir (85,6 × 54 mm), cüzdanın kart bölmesine girer.",
        ],
      },
      {
        heading: "PVC mi metal mi?",
        list: [
          "PVC: hafif, ince, daha uygun fiyatlı; günlük kullanım ve ekipler için",
          "Metal: ağır ve gösterişli; ilk izlenimin öne çıktığı yerler için",
          "İkisinde de NFC ve dijital profil aynı şekilde çalışır",
        ],
      },
      {
        heading: "Ekipler için",
        paragraphs: [
          "PVC kart, kalabalık satış ve saha ekipleri için ekonomik bir seçenektir. 10 ve üzeri adette %20 indirim uygulanır, firma logonuz karta işlenir; kartları ekip panelinden yönetirsiniz.",
        ],
      },
      {
        heading: "Fiyat ve teslimat",
        paragraphs: [
          "Fiyat KDV dahil, kargo ücretsiz, kart 72 saatte teslim edilir. Kartla birlikte dijital profil ilk yıl ücretsizdir; kart okunmazsa ücretsiz değişim.",
        ],
      },
    ],
    faq: [
      {
        q: "PVC NFC kartvizit dayanıklı mı?",
        a: "Banka kartı ile aynı malzeme ailesindendir; cüzdanda yıllarca taşınabilir. Çok yüksek ısıda bırakmayın.",
      },
      {
        q: "NFC'si olmayan telefonlar PVC kartı okuyabilir mi?",
        a: "Kartın üzerinde QR kod yoktur; NFC'si olmayan telefonlar için profilinizin QR kodunu kendi ekranınızdan okutur ya da linki paylaşırsınız.",
      },
      {
        q: "PVC kartın fiyatı ne kadar?",
        a: "Güncel fiyat bu sayfada yazar; ahşap kartlarla aynı fiyattadır ve metal kartlardan daha uygundur.",
      },
    ],
    guides: [
      "nfc-kartvizit-nedir",
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "kurumsal-dijital-kartvizit",
      "en-iyi-dijital-kartvizit-nasil-secilir",
    ],
    siblings: ["metal-kartvizit", "ahsap-kartvizit", "nfc-kartvizit"],
  },
  {
    slug: "kurumsal-kartvizit",
    term: "Kurumsal kartvizit",
    title: "Kurumsal Dijital Kartvizit | Logolu NFC Kartvizit | Dijivizit",
    description:
      "Kurumsal dijital kartvizit: firma logolu NFC kartlar, ekip paneli, kart devri ve analitik. 10 ve üzeri adette %20 indirim, KDV dahil, kargo ücretsiz.",
    h1: "Kurumsal dijital kartvizit",
    lead: "Bütün ekibin kartları tek panelde: firma logolu NFC kartlar, ortak tasarım, çalışan değişince kartı devretme ve ekip analitiği.",
    sections: [
      {
        heading: "Kurumsal siparişte neler var?",
        list: [
          "10 ve üzeri adette %20 indirim",
          "Firma logonuz karta işlenir (metal ve ahşapta lazerle)",
          "Ekip paneli: kartları çalışanlara atayın, profilleri tek yerden yönetin",
          "Kart devri: çalışan ayrılınca kart yeniden basılmaz, yeni kişiye geçer",
          "Ekip analitiği ve ziyaretçilerin bıraktığı kişiler",
          "Kaybolan kartı tek tıkla kapatma",
        ],
      },
      {
        heading: "Nasıl ilerliyoruz?",
        list: [
          "Sipariş formundan adet ve kaplama tercihinizi bırakın",
          "Logonuzla kart görselini hazırlayıp onayınıza sunuyoruz",
          "Onaydan sonra kartlar üretilip ücretsiz kargoyla gönderilir",
          "Ekip panelinden çalışanlarınızı davet edersiniz",
        ],
      },
      {
        heading: "Hangi kart?",
        paragraphs: [
          "Kalabalık saha ve satış ekiplerinde mat siyah PVC, yönetim ve temsil kartlarında metal, sıcak bir marka dili için ahşap tercih ediliyor. Aynı ekipte farklı kaplamalar da kullanılabilir.",
        ],
      },
      {
        heading: "KVKK ve güvenlik",
        paragraphs: [
          "Profil adresleri çalışanların adını değil rastgele bir kodu içerir. Ziyaretçi verileri KVKK'ya göre işlenir; kart sahibi yalnızca kendi kişilerini görür.",
        ],
      },
    ],
    faq: [
      {
        q: "En az kaç adet kurumsal sipariş verebilirim?",
        a: "Her adette sipariş verebilirsiniz; 10 ve üzeri adette %20 indirim ve firma logosu uygulanır.",
      },
      {
        q: "Çalışan işten ayrılırsa kart ne olur?",
        a: "Ekip panelinden kartı yeni çalışana devredersiniz; kart yeniden basılmaz.",
      },
      {
        q: "Ekipte farklı kaplamalar kullanabilir miyim?",
        a: "Evet. Aynı siparişte PVC, metal ve ahşap kartları birlikte isteyebilirsiniz; hepsi aynı ekip panelinden yönetilir.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "en-iyi-dijital-kartvizit-nasil-secilir",
      "nfc-kartvizit-nereden-alinir",
    ],
    siblings: ["metal-kartvizit", "pvc-kartvizit", "dijital-kartvizit"],
  },
];

export function getLanding(slug: string): Landing {
  const l = LANDINGS.find((x) => x.slug === slug);
  if (!l) throw new Error(`unknown landing ${slug}`);
  return l;
}
