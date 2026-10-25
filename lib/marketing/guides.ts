/**
 * Long-form guide pages served at dijivizit.com/rehber/<slug>.
 *
 * Each guide targets one search intent ("nfc kartvizit nedir", "metal kartvizit",
 * ...) so the landing page does not have to rank for everything at once.
 */
export type GuideSection = { heading: string; paragraphs: string[]; list?: string[] };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  /** Short label for cards and breadcrumbs. */
  label: string;
  image: string;
  imageAlt: string;
  published: string;
  sections: GuideSection[];
  faq?: { q: string; a: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "nfc-kartvizit-nedir",
    label: "NFC kartvizit nedir?",
    title: "NFC Kartvizit Nedir, Nasıl Çalışır?",
    description:
      "NFC kartvizit nedir, nasıl çalışır, hangi bilgileri paylaşır? Telefona dokundurunca profil açan akıllı kartvizitin kısa ve net rehberi.",
    image: "/rehber/nfc-kartvizit-nedir.jpg",
    imageAlt: "Siyah metal NFC kartvizit telefonun arkasına dokunuyor, ekranda dijital profil açık",
    published: "2026-10-25",
    sections: [
      {
        heading: "Kısaca NFC kartvizit",
        paragraphs: [
          "NFC kartvizit, içinde küçük bir NFC çip bulunan akıllı bir kartvizittir. Kartı karşınızdaki kişinin telefonuna yaklaştırdığınızda telefonun ekranında dijital profiliniz açılır: adınız, unvanınız, telefonunuz, e-postanız, sosyal medya hesaplarınız ve web siteniz tek sayfada görünür.",
          "Kâğıt kartvizitin aksine bilgileriniz kartın üzerine basılı değildir; internette duran profilinize bağlıdır. Numaranız ya da unvanınız değiştiğinde kartı yeniden bastırmazsınız, profilinizi güncellersiniz.",
        ],
      },
      {
        heading: "Nasıl çalışır?",
        paragraphs: [
          "NFC (Near Field Communication), birkaç santimetre mesafede çalışan temassız bir iletişim teknolojisidir. Banka kartıyla temassız ödeme yaparken kullandığınız teknolojinin aynısıdır.",
        ],
        list: [
          "Kartı telefonun üst arka kısmına yaklaştırırsınız.",
          "Telefon karttaki bağlantıyı okur ve ekranda bir bildirim gösterir.",
          "Bildirime dokununca profiliniz tarayıcıda açılır.",
          'Karşı taraf "Rehbere Kaydet" ile bilgilerinizi tek dokunuşla telefonuna kaydeder.',
        ],
      },
      {
        heading: "Uygulama gerekir mi?",
        paragraphs: [
          "Hayır. Ne sizin ne de karşınızdaki kişinin bir uygulama indirmesi gerekir. Güncel iPhone modelleri ve NFC özelliği açık Android telefonlar kartı doğrudan okur. NFC'si olmayan ya da kapalı olan telefonlar için Dijivizit kartlarının arkasında QR kod bulunur; kamerayla okutmak yeterlidir.",
        ],
      },
      {
        heading: "Hangi bilgileri paylaşabilirim?",
        paragraphs: [
          "Dijital profilinize istediğiniz kadar bilgi ekleyebilirsiniz. En sık kullanılanlar:",
        ],
        list: [
          "Fotoğraf, ad soyad, unvan ve şirket",
          "Telefon, WhatsApp ve e-posta",
          "LinkedIn, Instagram ve diğer sosyal medya hesapları",
          "Web sitesi, konum, IBAN ve belgeler",
        ],
      },
      {
        heading: "Neden kâğıt kartvizit yerine NFC kartvizit?",
        paragraphs: [
          "Kâğıt kartvizitler çekmecelerde kaybolur, bilgiler değiştikçe çöpe gider ve her baskı yeniden maliyet demektir. NFC kartvizit ise tek bir kartla yıllarca kullanılır, bilgileriniz her zaman günceldir ve karşınızdaki kişi sizi yazım hatası olmadan rehberine kaydeder.",
          "Dijivizit kartları mat siyah metal, fırçalanmış gold, fırçalanmış gümüş, koyu ahşap ve açık ahşap kaplamalarla üretilir; yani hem pratik hem de akılda kalıcı bir ilk izlenim bırakır.",
        ],
      },
    ],
    faq: [
      {
        q: "NFC kartvizit iPhone'da çalışır mı?",
        a: "Evet. Güncel iPhone modelleri NFC etiketlerini arka planda okur; kartı telefonun üst arka kısmına yaklaştırmak yeterlidir. Eski modellerde kartın arkasındaki QR kod kullanılabilir.",
      },
      {
        q: "Kartın pili var mı, şarj etmem gerekir mi?",
        a: "Hayır. NFC çip enerjisini okuyan telefondan alır; kartın pili yoktur ve şarj gerektirmez.",
      },
      {
        q: "Bilgilerim değişirse ne olur?",
        a: "Profilinizi güncellemeniz yeterli. Kartınız aynı kalır, okutan herkes yeni bilgilerinizi görür.",
      },
    ],
  },
  {
    slug: "metal-kartvizit",
    label: "Metal kartvizit",
    title: "Metal Kartvizit: Siyah, Gold ve Gümüş NFC Kartvizit",
    description:
      "Mat siyah metal, fırçalanmış gold ve gümüş NFC metal kartvizit. Lazer kazıma isim ve logo, QR kod ve tek dokunuşla paylaşılan dijital profil.",
    image: "/rehber/metal-kartvizit.jpg",
    imageAlt: "Mat siyah metal Dijivizit NFC kartvizit",
    published: "2026-10-25",
    sections: [
      {
        heading: "Metal kartvizit neden farklı?",
        paragraphs: [
          "Metal kartvizit elinize aldığınız anda fark edilir: ağırlığı, soğuk yüzeyi ve keskin lazer kazıması kâğıdın veremeyeceği bir ciddiyet taşır. Dijivizit metal kartlarında bu his, NFC teknolojisiyle birleşir; kart hem göz alıcı bir obje hem de tek dokunuşla bilgilerinizi paylaşan akıllı bir kartvizittir.",
        ],
      },
      {
        heading: "Üç metal kaplama",
        paragraphs: ["Her biri farklı bir karakter taşıyan üç metal seçenek sunuyoruz:"],
        list: [
          "Mat siyah metal: tamamen mat, ışığı yansıtmayan derin siyah yüzey ve açık gri lazer kazıma. Sade ve güçlü.",
          "Mat fırçalanmış gold: parlamayan, ince fırça izleriyle ışıldayan sakin bir altın tonu ve koyu kazıma.",
          "Mat fırçalanmış gümüş: ışığın açısına göre değişen fırça dokusu ve koyu kazıma. Teknik ve zamansız.",
        ],
      },
      {
        heading: "Kazıma ve kişiselleştirme",
        paragraphs: [
          "Adınız, unvanınız ve logonuz kartın yüzeyine lazerle kazınır; baskı olmadığı için silinmez, solmaz. Kartın arkasında NFC'si olmayan telefonlar için QR kod yer alır.",
        ],
      },
      {
        heading: "Metal kart NFC'yi engellemez mi?",
        paragraphs: [
          "Metal yüzeyler sıradan NFC etiketlerinin sinyalini zayıflatabilir. Dijivizit metal kartlarında metal yüzey için tasarlanmış NFC yapısı kullanılır; kart telefonun üst arka kısmına yaklaştırıldığında okunur. Her ihtimale karşı kartın arkasındaki QR kod da aynı profile açılır.",
        ],
      },
    ],
  },
  {
    slug: "ahsap-kartvizit",
    label: "Ahşap kartvizit",
    title: "Ahşap Kartvizit: Doğal Dokuda NFC Akıllı Kartvizit",
    description:
      "Koyu ve açık tonlu gerçek ahşap NFC kartvizit. Lazerle yakılmış isim ve logo, her kartta kendine özgü doku, tek dokunuşla paylaşılan dijital profil.",
    image: "/rehber/ahsap-kartvizit.jpg",
    imageAlt: "Koyu ahşap NFC kartvizit telefona dokunuyor",
    published: "2026-10-25",
    sections: [
      {
        heading: "Doğal bir ilk izlenim",
        paragraphs: [
          "Ahşap kartvizit sıcak, samimi ve akılda kalıcıdır. Gerçek ahşaptan üretildiği için her kartın damar dokusu birbirinden biraz farklıdır; elinize aldığınız kart yalnızca size aittir.",
          "Dijivizit ahşap kartlarının içinde NFC çip bulunur. Çip görünmez ama kart telefona yaklaştırıldığında dijital profiliniz açılır.",
        ],
      },
      {
        heading: "İki ahşap tonu",
        paragraphs: [],
        list: [
          "Koyu ahşap: ceviz tonlarında, ince damarlı, ağırbaşlı bir yüzey.",
          "Açık ahşap: yumuşak ve aydınlık bir ton; sade, davetkâr bir görünüm.",
        ],
      },
      {
        heading: "Lazerle yakılmış yazı",
        paragraphs: [
          "İsim, unvan ve logo ahşabın yüzeyine lazerle yakılarak işlenir. Mürekkep kullanılmadığı için yazı silinmez; zamanla ahşapla birlikte olgunlaşır.",
        ],
      },
      {
        heading: "Kimler için uygun?",
        paragraphs: [
          "Mimarlar, tasarımcılar, kafe ve restoran sahipleri, butik markalar, doğal ve sürdürülebilir ürünlerle çalışan girişimciler ahşap kartviziti sıklıkla tercih eder. Kurumsal ekipler için de metal ve ahşap kartlar aynı sistemle birlikte kullanılabilir.",
        ],
      },
    ],
  },
  {
    slug: "dijital-kartvizit-nasil-olusturulur",
    label: "Dijital kartvizit nasıl oluşturulur?",
    title: "Dijital Kartvizit Nasıl Oluşturulur? Adım Adım Rehber",
    description:
      "Dijital kartvizit nasıl oluşturulur? Profil bilgileri, fotoğraf, sosyal medya bağlantıları ve NFC kart ile dijital kartvizitinizi adım adım hazırlayın.",
    image: "/rehber/dijital-kartvizit-nasil-olusturulur.jpg",
    imageAlt: "Telefon ekranında Dijivizit dijital kartvizit profili",
    published: "2026-10-25",
    sections: [
      {
        heading: "Dijital kartvizit nedir?",
        paragraphs: [
          "Dijital kartvizit, iletişim bilgilerinizi tek bir web sayfasında toplayan ve bağlantı, QR kod ya da NFC kart ile paylaşılan modern kartvizittir. Karşınızdaki kişi sayfayı açtığında sizi tek dokunuşla arayabilir, WhatsApp'tan yazabilir veya rehberine kaydedebilir.",
        ],
      },
      {
        heading: "1. Kaplamanızı seçin",
        paragraphs: [
          "Dijivizit'te süreç fiziksel kartla başlar. Mat siyah metal, fırçalanmış gold, fırçalanmış gümüş, koyu ahşap veya açık ahşap kaplamalardan birini seçip sipariş talebi oluşturursunuz. Ekibimiz sizi arayarak kart üzerindeki isim, unvan ve logo detaylarını netleştirir.",
        ],
      },
      {
        heading: "2. Profilinizi doldurun",
        paragraphs: ["Kartınıza bağlı dijital profilinize şu bilgileri ekleyin:"],
        list: [
          "Net, gülümseyen bir profil fotoğrafı",
          "Ad soyad, unvan ve şirket adı",
          "Telefon, WhatsApp ve e-posta",
          "LinkedIn, Instagram, web sitesi gibi bağlantılar",
          "Gerekirse IBAN, konum ve belgeler",
        ],
      },
      {
        heading: "3. Kartınızı paylaşmaya başlayın",
        paragraphs: [
          "Kartınızı karşınızdaki kişinin telefonuna yaklaştırın; profiliniz açılır. NFC'si olmayan telefonlarda kartın arkasındaki QR kodu okutmak yeterlidir. Bilgileriniz değiştiğinde yalnızca profilinizi güncellersiniz; kart aynı kalır.",
        ],
      },
      {
        heading: "İyi bir dijital kartvizit için ipuçları",
        paragraphs: [],
        list: [
          "Fotoğrafınız güncel ve yüzünüz net görünür olsun.",
          "Unvanınızı kısa tutun; ne iş yaptığınız tek satırda anlaşılsın.",
          "En çok kullandığınız iletişim kanalını en üste koyun.",
          "Kullanmadığınız sosyal medya hesaplarını eklemeyin.",
        ],
      },
    ],
  },
  {
    slug: "nfc-kartvizit-hangi-telefonlarda-calisir",
    label: "Hangi telefonlarda çalışır?",
    title: "NFC Kartvizit Hangi Telefonlarda Çalışır?",
    description:
      "NFC kartvizit iPhone ve Android telefonlarda nasıl okunur? NFC'yi açma, kartı doğru yere tutma ve QR kod yedeği hakkında bilmeniz gerekenler.",
    image: "/rehber/nfc-kartvizit-hangi-telefonlarda-calisir.jpg",
    imageAlt: "Gold NFC kartvizit telefona yaklaştırılıyor",
    published: "2026-10-25",
    sections: [
      {
        heading: "iPhone",
        paragraphs: [
          "Güncel iPhone modelleri NFC etiketlerini arka planda okur; herhangi bir ayar açmanız ya da uygulama indirmeniz gerekmez. Ekran açıkken kartı telefonun üst arka kısmına, kameraların yakınına yaklaştırın. Ekranın üstünde beliren bildirime dokunduğunuzda profil açılır.",
        ],
      },
      {
        heading: "Android",
        paragraphs: [
          'NFC özelliği olan Android telefonlarda NFC\'nin açık olması yeterlidir. Ayarlar içinde "Bağlantılar" ya da "Bağlı cihazlar" bölümünden NFC\'yi açabilirsiniz; hızlı ayarlar panelinde de çoğu zaman bir NFC düğmesi bulunur. NFC anteni genellikle telefonun arka yüzünün ortasındadır.',
        ],
      },
      {
        heading: "Kart okunmuyorsa",
        paragraphs: [],
        list: [
          "Telefonun ekranının açık ve kilidinin açık olduğundan emin olun.",
          "Kartı 1-2 saniye sabit tutun; hızlıca sürtmeyin.",
          "Kalın veya metal içeren telefon kılıfları okumayı zorlaştırabilir.",
          "Android'de NFC'nin açık olduğunu kontrol edin.",
          "Hiçbiri olmazsa kartın arkasındaki QR kodu kamerayla okutun.",
        ],
      },
      {
        heading: "QR kod her zaman yedekte",
        paragraphs: [
          "Dijivizit kartlarının arkasında aynı profile açılan bir QR kod bulunur. NFC'si olmayan eski telefonlar dahil, kamerası olan her telefon profilinizi açabilir.",
        ],
      },
    ],
  },
  {
    slug: "kurumsal-dijital-kartvizit",
    label: "Kurumsal dijital kartvizit",
    title: "Kurumsal Dijital Kartvizit: Ekipler İçin NFC Kartvizit",
    description:
      "Şirketiniz için kurumsal NFC dijital kartvizit. Tüm ekibe aynı tasarım, merkezi bilgi güncelleme, ayrılan çalışanda kartı devretme kolaylığı.",
    image: "/rehber/kurumsal-dijital-kartvizit.jpg",
    imageAlt: "Kurumsal ekip için Dijivizit NFC kartvizitler",
    published: "2026-10-25",
    sections: [
      {
        heading: "Ekipler için tek tip, her zaman güncel",
        paragraphs: [
          "Kurumsal kartvizit siparişleri genellikle aynı döngüye takılır: yeni çalışan geldiğinde baskı beklenir, unvan değiştiğinde kutularca kartvizit çöpe gider. Dijital kartvizit bu döngüyü bitirir. Her çalışanın kartı aynı kurumsal tasarımı taşır, bilgileri ise profilden güncellenir.",
        ],
      },
      {
        heading: "Şirketlere sağladığı avantajlar",
        paragraphs: [],
        list: [
          "Tüm ekipte aynı kaplama, logo ve tipografi",
          "Unvan, numara veya adres değiştiğinde yeniden baskı yok",
          "Fuar, toplantı ve saha ziyaretlerinde hızlı ve temassız paylaşım",
          "Kâğıt tüketimini azaltan sürdürülebilir bir çözüm",
        ],
      },
      {
        heading: "Nasıl ilerliyoruz?",
        paragraphs: [
          "Kurumsal taleplerde önce ekibinizin büyüklüğünü ve tercih ettiğiniz kaplamayı konuşuruz. Logonuz ve kurumsal renklerinize göre kart tasarımını hazırlar, onayınızın ardından üretime geçeriz. Tek yapmanız gereken bizimle iletişime geçmek.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
