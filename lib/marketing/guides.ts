/**
 * Long-form guide pages served at dijivizit.com/rehber/<slug>.
 *
 * Each guide targets one search intent ("nfc kartvizit nedir", "metal kartvizit",
 * ...) so the landing page does not have to rank for everything at once.
 */
export type GuideSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
  /** Optional link shown under the section; absolute URLs open as external links. */
  link?: { href: string; label: string };
};

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
  {
    slug: "dijital-kartvizit-nedir",
    label: "Dijital kartvizit nedir?",
    title: "Dijital Kartvizit Nedir? Avantajları ve Kullanımı",
    description:
      "Dijital kartvizit nedir, kâğıt kartvizitten farkı ne? Bağlantı, QR kod ve NFC kartla paylaşılan, her zaman güncel kalan dijital kartvizitin rehberi.",
    image: "/rehber/dijital-kartvizit-nedir.jpg",
    imageAlt: "Siyah NFC kartvizit telefona dokunduruluyor, ekranda dijital kartvizit profili açık",
    published: "2026-10-28",
    sections: [
      {
        heading: "Kısaca dijital kartvizit",
        paragraphs: [
          "Dijital kartvizit, adınızı, unvanınızı, telefonunuzu, e-postanızı ve sosyal medya hesaplarınızı tek bir web sayfasında toplayan kartvizittir. Bu sayfa bir bağlantı, bir QR kod ya da bir NFC kart ile paylaşılır.",
          "Karşınızdaki kişi sayfayı açtığında sizi tek dokunuşla arayabilir, WhatsApp'tan yazabilir ya da bilgilerinizi rehberine kaydedebilir. Bilgileriniz kartın üzerine basılı olmadığı için değiştiğinde yeniden baskı gerekmez.",
        ],
      },
      {
        heading: "Dijital kartvizit nasıl paylaşılır?",
        paragraphs: ["Aynı profil birkaç farklı yolla açılabilir:"],
        list: [
          "NFC kart: Kartı telefona yaklaştırırsınız, profil ekranda açılır.",
          "QR kod: Karşınızdaki kişi kamerasıyla kodu okutur.",
          "Bağlantı: Profil adresinizi mesaj, e-posta imzası ya da sosyal medya biyografisi üzerinden gönderirsiniz.",
          "Apple Cüzdan: Kart yanınızda değilken telefonunuzdaki QR'ı gösterirsiniz.",
        ],
      },
      {
        heading: "Kâğıt kartvizitten farkı",
        paragraphs: [],
        list: [
          "Her zaman günceldir: numara, unvan ya da adres değiştiğinde profili güncellemeniz yeter.",
          "Bitmez: tek kartla yüzlerce kişiye paylaşırsınız, kutu kutu baskı gerekmez.",
          "Daha fazla bilgi taşır: sosyal medya, web sitesi, konum ve belgeler aynı sayfadadır.",
          "Yazım hatası olmaz: karşı taraf bilgilerinizi elle yazmak yerine tek dokunuşla kaydeder.",
        ],
      },
      {
        heading: "Uygulama gerekir mi?",
        paragraphs: [
          "Hayır. Dijital kartvizit profili tarayıcıda açılır; ne sizin ne de karşınızdaki kişinin bir uygulama indirmesi gerekir.",
        ],
      },
      {
        heading: "Fiziksel kart hâlâ gerekli mi?",
        paragraphs: [
          "Dijital profil tek başına da kullanılabilir, ama yüz yüze tanışmalarda elinize alıp uzatabileceğiniz bir kart hâlâ en doğal yoldur. Dijivizit'te profiliniz mat siyah metal, fırçalanmış gold, fırçalanmış gümüş, koyu ahşap ve açık ahşap kaplamalı NFC kartlarla birlikte gelir; kartın arkasında NFC'si olmayan telefonlar için QR kod bulunur.",
        ],
      },
    ],
    faq: [
      {
        q: "Dijital kartvizit ücretsiz mi?",
        a: "Dijital profil, Dijivizit NFC kartıyla birlikte gelir ve ilk yıl ücretsizdir; sonrasında aylık 59,90 TL'dir. Kartlar metal kaplamalarda 4.000 TL, ahşap kaplamalarda 2.500 TL'dir (KDV dahil, kargo ücretsiz).",
      },
      {
        q: "Dijital kartvizitimi kaç kişiyle paylaşabilirim?",
        a: "Sınır yoktur. Aynı kartı ve aynı profili istediğiniz kadar kişiyle paylaşabilirsiniz.",
      },
    ],
  },
  {
    slug: "nfc-kartvizit-mi-kagit-kartvizit-mi",
    label: "NFC mi kâğıt mı?",
    title: "NFC Kartvizit mi, Kâğıt Kartvizit mi? Karşılaştırma",
    description:
      "NFC kartvizit ile kâğıt kartvizitin farkları: maliyet, güncellik, paylaşım, ilk izlenim ve sürdürülebilirlik. Hangisinin size uygun olduğuna karar verin.",
    image: "/rehber/nfc-kartvizit-mi-kagit-kartvizit-mi.jpg",
    imageAlt: "Toplantı masasında siyah NFC kartvizit karşıdaki kişiye uzatılıyor",
    published: "2026-10-28",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Bilgileriniz sık değişiyorsa, çok sayıda kişiyle tanışıyorsanız ya da akılda kalıcı bir ilk izlenim istiyorsanız NFC kartvizit daha mantıklıdır. Yılda birkaç kartvizit dağıtıyorsanız ve bilgileriniz hiç değişmiyorsa kâğıt kartvizit yeterli olabilir.",
        ],
      },
      {
        heading: "Güncellik",
        paragraphs: [
          "Kâğıt kartvizitte numara, unvan ya da adres değiştiğinde elinizdeki tüm kartlar geçersiz olur. NFC kartvizitte bilgiler profilde durur; profili güncellediğinizde daha önce kart verdiğiniz kişiler de yeni bilgilerinizi görür.",
        ],
      },
      {
        heading: "Paylaşım ve kayıt",
        paragraphs: [
          "Kâğıt kartviziti alan kişi bilgilerinizi telefonuna elle yazmak zorundadır; çoğu kart da bu adıma hiç gelmeden bir çekmecede kaybolur. NFC kartvizitte karşı taraf profilinizi açar ve \"Rehbere Kaydet\" ile bilgilerinizi tek dokunuşla telefonuna kaydeder.",
        ],
      },
      {
        heading: "Maliyet",
        paragraphs: [
          "Kâğıt kartvizitin tanesi ucuzdur ama tükenir ve her değişiklikte yeniden basılır. NFC kartvizit tek seferlik bir alımdır ve yıllarca kullanılır. Hangisinin daha ekonomik olduğu, ne kadar sık kartvizit dağıttığınıza ve bilgilerinizin ne sıklıkla değiştiğine bağlıdır.",
        ],
      },
      {
        heading: "İlk izlenim",
        paragraphs: [
          "Metal ya da ahşap bir NFC kart, elinize alındığı anda fark edilir. Telefona dokundurulduğunda profilin açılması da çoğu zaman sohbeti başlatan bir an olur.",
        ],
      },
      {
        heading: "Özet tablo",
        paragraphs: [],
        list: [
          "Bilgi değişince: kâğıtta yeniden baskı, NFC'de profil güncellemesi.",
          "Paylaşılan bilgi: kâğıtta kartın üstüne sığan kadar, NFC'de sosyal medya, web sitesi, konum ve belgeler dahil.",
          "Kayıt: kâğıtta elle yazma, NFC'de tek dokunuşla rehbere kaydetme.",
          "Ömür: kâğıtta tükenir, NFC'de tek kart yıllarca kullanılır.",
        ],
      },
    ],
    faq: [
      {
        q: "NFC kartvizit her telefonda açılır mı?",
        a: "Güncel iPhone'lar ve NFC'si açık Android telefonlar kartı doğrudan okur. NFC'si olmayan telefonlar için Dijivizit kartlarının arkasında aynı profile açılan bir QR kod bulunur.",
      },
    ],
  },
  {
    slug: "qr-kod-kartvizit",
    label: "QR kod kartvizit",
    title: "QR Kod Kartvizit: Nasıl Çalışır, NFC'den Farkı Ne?",
    description:
      "QR kod kartvizit nedir, nasıl kullanılır? QR ve NFC kartvizit arasındaki farklar ve iki yöntemi aynı kartta birleştirmenin avantajları.",
    image: "/rehber/qr-kod-kartvizit.jpg",
    imageAlt: "Deri kartlıktan çıkarılan siyah Dijivizit NFC kartvizit",
    published: "2026-10-28",
    sections: [
      {
        heading: "QR kod kartvizit nedir?",
        paragraphs: [
          "QR kod kartvizit, üzerinde dijital profilinize bağlanan bir QR kod bulunan kartvizittir. Karşınızdaki kişi telefonunun kamerasını koda tuttuğunda profiliniz açılır ve bilgilerinizi kaydedebilir.",
        ],
      },
      {
        heading: "QR ile NFC arasındaki fark",
        paragraphs: [],
        list: [
          "NFC: Kartı telefona yaklaştırmak yeterlidir; kamera açmak gerekmez. Güncel iPhone'lar ve NFC'si açık Android telefonlarda çalışır.",
          "QR: Kamerası olan hemen her telefonda çalışır, ama kişinin kamerayı açıp kodu çerçevelemesi gerekir.",
        ],
      },
      {
        heading: "En iyisi: ikisi bir arada",
        paragraphs: [
          "Dijivizit kartlarında iki yöntem birlikte kullanılır. Kartın içinde NFC çip, arkasında aynı profile açılan bir QR kod vardır. NFC'si kapalı ya da olmayan bir telefonla karşılaştığınızda QR kod yedek görevi görür.",
        ],
      },
      {
        heading: "Kart yanınızda değilken",
        paragraphs: [
          "Profilinizi Apple Cüzdan'a ekleyebilirsiniz. Fiziksel kart yanınızda değilken telefonunuzdaki QR'ı gösterirsiniz, karşınızdaki kişi okutur.",
        ],
      },
      {
        heading: "QR kodu nerelerde kullanabilirsiniz?",
        paragraphs: ["Aynı profil bağlantısı kartın dışında da işe yarar:"],
        list: [
          "Fuar standı ve sunum slaytları",
          "Mağaza, kafe veya ofis girişindeki tabela",
          "Ürün ambalajı ve broşürler",
          "E-posta imzası",
        ],
      },
    ],
    faq: [
      {
        q: "QR kod bir süre sonra çalışmaz hâle gelir mi?",
        a: "Dijivizit kartındaki QR kod profilinize bağlıdır. Profil bilgilerini değiştirdiğinizde kod değişmez; okutan kişi her zaman güncel profilinizi görür.",
      },
    ],
  },
  {
    slug: "yeni-isletme-kontrol-listesi",
    label: "Yeni işletme kontrol listesi",
    title: "Yeni İşletme Kurarken Kontrol Listesi: İsimden Kartvizite",
    description:
      "Yeni bir işletme kurarken marka ismi, alan adı, marka tescili, sosyal medya, logo ve kartvizit için adım adım kontrol listesi.",
    image: "/rehber/yeni-isletme-kontrol-listesi.jpg",
    imageAlt: "Açık ahşap, koyu ahşap, gold, gümüş ve siyah Dijivizit kartvizit kaplamaları üst üste",
    published: "2026-10-28",
    sections: [
      {
        heading: "Neden bir kontrol listesi?",
        paragraphs: [
          "Yeni bir işletme kurarken en çok zaman kaybettiren şeyler, sırası karışan adımlardır: logo bitmiştir ama alan adı alınmamıştır, kartvizit basılmıştır ama isim değişmek zorundadır. Aşağıdaki sıra bu sorunları baştan önler.",
        ],
      },
      {
        heading: "1. İsim",
        paragraphs: [
          "Her şey isimle başlar. Kısa, kolay söylenen ve kolay yazılan bir isim seçin. Seçtiğiniz ismin marka olarak başvurulup başvurulmadığını, .com alan adının ve sosyal medya kullanıcı adlarının boşta olup olmadığını aynı gün kontrol edin.",
          "Bu araştırmayla uğraşmak istemiyorsanız, .com alan adı ve marka tescil başvurusu hazır isimlere göz atabilirsiniz.",
        ],
        link: { href: "https://markapano.com/", label: "Markapano: alan adı ve marka başvurusu hazır isimler" },
      },
      {
        heading: "2. Alan adı ve e-posta",
        paragraphs: [
          "İsmin .com alan adını alın ve isim@alanadiniz.com biçiminde kurumsal bir e-posta açın. Kartvizitte ve faturalarda kişisel e-posta yerine kurumsal adres kullanmak güven verir.",
        ],
      },
      {
        heading: "3. Marka tescili",
        paragraphs: [
          "İsmi faaliyet alanınızın sınıflarında TÜRKPATENT'e başvurun. Marka hakkı kural olarak ilk başvurana ait olduğu için bu adımı ertelemeyin.",
        ],
      },
      {
        heading: "4. Sosyal medya",
        paragraphs: [
          "Instagram, LinkedIn ve diğer platformlarda aynı kullanıcı adını alın. Her platformda aynı ad, müşterilerin sizi bulmasını kolaylaştırır.",
        ],
      },
      {
        heading: "5. Logo ve renkler",
        paragraphs: [
          "Logonuzu, kurumsal renklerinizi ve yazı tipinizi belirleyin. Kartvizit, tabela ve web sitesi bu kararlara göre hazırlanacak.",
        ],
      },
      {
        heading: "6. Kartvizit",
        paragraphs: [
          "Son adım, insanlara sizi hatırlatacak karttır. NFC kartvizitte bilgileriniz profilde durduğu için ilk aylarda değişen telefon numarası ya da adres yüzünden kartları çöpe atmazsınız. Dijivizit kartlarında isminiz ve logonuz metal ya da ahşap yüzeye lazerle işlenir; profiliniz tek dokunuşla paylaşılır.",
        ],
      },
    ],
    faq: [
      {
        q: "Kartvizit için logonun hazır olması gerekir mi?",
        a: "Logo kartın tasarımını kolaylaştırır ama şart değildir. Logo olmadan da isim ve unvanla şık bir kart hazırlanabilir; logo hazır olduğunda yeni kart siparişi verebilirsiniz.",
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
