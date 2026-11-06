/** More city pages at /dijital-kartvizit/<slug>; same rules as segments.ts. */
import type { Landing } from "@/lib/marketing/landings";

const PARENT = { name: "Dijital kartvizit", href: "/dijital-kartvizit" };

export const MORE_SEHIR: Landing[] = [
  {
    slug: "dijital-kartvizit/adana",
    parent: PARENT,
    kind: "sehir",
    term: "Adana",
    title: "Adana NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Adana'da NFC kartvizit ve dijital kartvizit: tarım ve gıda firmaları için. Bayi ziyaretinde, Tüyap Adana'da akıllı kartvizit dokundurun; ücretsiz kargo.",
    h1: "Adana'da NFC ve dijital kartvizit",
    lead: "Adana'da iş çoğu zaman Çukurova'nın tarlasında, bir gıda fabrikasının sevkiyat rampasında ya da bir toptancının tezgâhında başlar. Tanıştığınız kişinin rehberine tek dokunuşla girin; kataloğunuz ve fiyat listeniz de yanınızda olsun.",
    sections: [
      {
        heading: "Çukurova'da ticaret ve kartvizit",
        paragraphs: [
          "Adana; verimli Çukurova ovasıyla tarımın ve tarıma dayalı sanayinin, gıda işleme ve ambalajın, tekstilin ve toptan ticaretin güçlü olduğu bir şehirdir. Tohum, gübre, tarım ilacı ve tarım makinesi satan firmalar, ürün alan tüccarlar ve ihracatçılar yıl boyunca sahada çok sayıda kişiyle görüşür.",
          "Bu görüşmelerin çoğu bir ofiste değil; tarlada, depoda, bayide ya da yolda yapılır. Kâğıt kartvizit cepte buruşur, bayinin çekmecesinde kaybolur. Dijivizit kartını telefona dokundurmanız yeter: adınız, firmanız ve telefonlarınız karşı tarafın rehberine tek kayıt olarak eklenir.",
        ],
      },
      {
        heading: "Adana'da akıllı kartvizit sahada nasıl kullanılır?",
        list: [
          "Saha satış temsilcisi: bayi ya da çiftçi ziyaretinde kartı dokundurun; ürün kataloğu ve fiyat listesi PDF olarak profilde açılsın",
          "Ekim ve hasat dönemlerinde değişen fiyat listesini panelden yeni PDF'le değiştirin; daha önce kart verdiğiniz herkesin bağlantısı güncel dosyayı açar",
          "Satış, depo ve sevkiyat numaralarınızı ayrı, etiketli satırlarda gösterin",
          "Size verilen kâğıt kartvizitlerin fotoğrafını çekin; ad, firma ve telefon otomatik okunsun, her birine takip hatırlatması kurun",
        ],
        paragraphs: [
          "Sahada herkesin telefonunda NFC açık olmayabilir. Profilinizin QR kodunu kendi telefonunuzdan okutabilir ya da linki paylaşabilirsiniz; uygulama indirmek gerekmez.",
        ],
      },
      {
        heading: "Tüyap Adana ve fuar dönemleri",
        paragraphs: [
          "Adana'daki tarım, gıda, inşaat ve sektör fuarlarının birçoğu Tüyap Adana Uluslararası Fuar ve Kongre Merkezi'nde düzenlenir. Fuarda profil QR kodunuzu stand panosuna ve broşürlere koyarsınız; standda kimse yokken gelen ziyaretçi de sizi rehberine kaydeder.",
          "Ziyaretçiler “Bilgilerimi bırak” ile ad, telefon ve kısa bir not bırakır; fuar bitince bu liste panelinizde hazırdır. Analitik panelinde fuar günlerinde profilinizin kaç kez ve hangi şehirlerden açıldığını görürsünüz.",
        ],
      },
      {
        heading: "Adana'ya sipariş ve teslimat",
        paragraphs: [
          "Dijivizit Eskişehir'dedir; Adana'da şubesi ya da teslim noktası yoktur. Siparişler bu siteden verilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Kart beklemeden başlamak isterseniz kartsız dijital kartvizit 2 saat içinde e-postanıza gelir; link ve QR kodu hemen paylaşırsınız. Saha ekipleri için 10 ve üzeri adette %20 indirim uygulanır ve kartlar ekip panelinden temsilcilere atanır.",
        ],
      },
    ],
    faq: [
      {
        q: "Adana'da NFC kartvizit nereden alınır?",
        a: "Dijivizit'ten online sipariş verirsiniz. Adana'da mağazamız yoktur; kartlar Adana'nın tüm ilçelerine ücretsiz kargoyla gönderilir ve 72 saat içinde teslim edilir.",
      },
      {
        q: "Bayinin ya da çiftçinin telefonu eskiyse çalışır mı?",
        a: "NFC'li telefonlarda kartı dokundurmak yeter; NFC'si olmayan ya da kapalı telefonlarda profilinizin QR kodunu kendi ekranınızdan okutursunuz. Profil tarayıcıda açılır.",
      },
      {
        q: "Fiyat listemiz sık değişiyor, ne yapmalıyız?",
        a: "Fiyat listesini PDF olarak profile eklersiniz; değiştiğinde panelden yenisini yüklersiniz. Kart ve QR kod aynı kalır, güncel listeyi açar.",
      },
      {
        q: "Kartların üzerinde firmamızın logosu olabilir mi?",
        a: "Standart kartlarda Dijivizit logosu bulunur. 10 ve üzeri adetteki kurumsal siparişlerde firma logonuz karta işlenir ve %20 indirim uygulanır.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "qr-kod-kartvizit",
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "nfc-kartvizit-nereden-alinir",
    ],
    siblings: [
      "dijital-kartvizit/mersin",
      "dijital-kartvizit/gaziantep",
      "dijital-kartvizit/konya",
      "dijital-kartvizit/antalya",
    ],
  },
  {
    slug: "dijital-kartvizit/mersin",
    parent: PARENT,
    kind: "sehir",
    term: "Mersin",
    title: "Mersin NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Mersin'de NFC kartvizit ve dijital kartvizit: liman, lojistik ve yaş meyve-sebze ihracatı için. Limanda, depoda akıllı kartvizit dokundurun; kargo ücretsiz.",
    h1: "Mersin'de NFC ve dijital kartvizit",
    lead: "Mersin'de bir gün limanda, ertesi gün bir paketleme tesisinde ya da serbest bölgedeki bir depoda geçebilir. Muhatabınız gümrük müşaviri de olsa, yabancı bir alıcı da olsa iletişim bilgileriniz tek dokunuşla telefonunda olsun.",
    sections: [
      {
        heading: "Liman şehrinde kartvizit",
        paragraphs: [
          "Mersin; Türkiye'nin büyük limanlarından birine, serbest bölgesine ve gelişmiş bir lojistik sektörüne ev sahipliği yapar. Narenciye başta olmak üzere yaş meyve ve sebze üretimi, paketleme ve ihracat; taşımacılık, gümrük müşavirliği ve depolama şehrin iş hayatının merkezindedir.",
          "Bu zincirde aynı yükle ilgili birçok kişi konuşur: üretici, ihracatçı, nakliyeci, forwarder, gümrük müşaviri, alıcının temsilcisi. Kartvizitin işi, her yeni tanışmada doğru numaranın doğru kişiye hızla ulaşmasıdır.",
        ],
      },
      {
        heading: "Mersin'de akıllı kartvizitle ne paylaşılır?",
        list: [
          "Operasyon, satış ve muhasebe için ayrı, etiketli telefon satırları; sevkiyatla ilgili bir soru doğru kişiye gider",
          "Şirket sunumu, hizmet verdiğiniz hatlar ya da ürün listesi, PDF olarak profilde",
          "Fatura bilgileri; cari kart açacak firma vergi numaranızı tek dokunuşla kopyalar, siz açmadıkça görünmez",
          "WhatsApp hattınız; alıcı ya da nakliyeci size tek dokunuşla yazar",
        ],
        paragraphs: [
          "Profildeki “Rehberime Kaydet” düğmesi adınızı, şirketinizi ve bütün numaralarınızı tek seferde rehbere ekler. Numaralarınızı +90 ile başlayarak girerseniz yurt dışı hatlardan da doğrudan aranırsınız.",
        ],
      },
      {
        heading: "İhracat görüşmesinde ve fuarda",
        paragraphs: [
          "Yabancı alıcılarla ve temsilcileriyle görüşmelerde dil farkı bilgi alışverişini yavaşlatır. Ad, şirket, telefon ve e-posta dilden bağımsızdır; “Hakkımda” yazısına kısa bir İngilizce paragraf, belgelerinize İngilizce bir ürün listesi ekleyebilirsiniz.",
          "Mersin'de ya da başka şehirlerde katıldığınız fuarlarda profil QR kodunuzu stand panosuna koyar, ziyaretçilerin “Bilgilerimi bırak” ile bıraktığı bilgileri panelinizde toplarsınız. Size verilen kâğıt kartvizitleri fotoğrafını çekerek kaydeder, numune ya da teklif gününe hatırlatma kurarsınız.",
        ],
      },
      {
        heading: "Mersin'e sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Mersin'de şubesi yoktur; siparişler online verilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Kartlar mat siyah PVC, ahşap ve metal seçenekleriyle gelir; kartsız dijital kartvizit ise 2 saat içinde e-postanıza gelir. Lojistik ve ihracat ekipleri için 10 ve üzeri adette %20 indirim uygulanır; çalışan değiştiğinde kart ekip panelinden yeni kişiye devredilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Mersin'de NFC kartvizit nereden alınır?",
        a: "Dijivizit'ten online sipariş verirsiniz; Mersin'de mağazamız ya da teslim noktamız yoktur. Kartlar Mersin'in tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Yabancı alıcının telefonunda çalışır mı?",
        a: "Evet. NFC'li iPhone ve Android telefonlarda dokundurunca, diğerlerinde ekranınızdaki profil QR koduyla tarayıcıda açılır. Uygulama gerekmez.",
      },
      {
        q: "Profilime İngilizce bilgi ekleyebilir miyim?",
        a: "Evet. “Hakkımda” yazısını ve belgelerinizi istediğiniz dilde hazırlayabilirsiniz; ad ve iletişim bilgileri her dilde aynı görünür.",
      },
      {
        q: "Kartımı kaybedersem ne olur?",
        a: "Panelden kartı tek tıkla kapatırsınız; profiliniz ve bilgileriniz panelde durur. Profil adresiniz adınızı değil rastgele bir kodu içerir.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "qr-kod-kartvizit",
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "kartvizite-ne-yazilir",
    ],
    siblings: [
      "dijital-kartvizit/adana",
      "dijital-kartvizit/gaziantep",
      "dijital-kartvizit/izmir",
      "dijital-kartvizit/antalya",
    ],
  },
  {
    slug: "dijital-kartvizit/gaziantep",
    parent: PARENT,
    kind: "sehir",
    term: "Gaziantep",
    title: "Gaziantep NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Gaziantep'te NFC kartvizit ve dijital kartvizit: tekstil, gıda ve ambalaj ihracatçıları için. Katalog profilde, akıllı kartvizit ekibe atanır; ücretsiz kargo.",
    h1: "Gaziantep'te NFC ve dijital kartvizit",
    lead: "Gaziantep'te üretim ve ihracat iç içedir: aynı firma bir gün yurt içindeki bayisiyle, ertesi gün yurt dışından gelen bir alıcıyla görüşür. Kartınızı dokundurun; iletişim bilgileriniz ve kataloğunuz karşı tarafın telefonuna geçsin.",
    sections: [
      {
        heading: "Üretim ve ihracat şehrinde kartvizit",
        paragraphs: [
          "Gaziantep; makine halısı ve tekstil, fıstık, bulgur ve tatlı başta olmak üzere gıda, plastik ve ambalaj ile makine imalatıyla Güneydoğu'nun en büyük sanayi ve ihracat merkezidir. Organize sanayi bölgelerindeki fabrikalar yurt içine ve yurt dışına, özellikle Orta Doğu pazarına satış yapar.",
          "Bu firmalarda kartvizit katalog ve fiyat listesiyle birlikte çalışır. Alıcı kartı aldıktan sonra numune ister, teklif bekler, bir süre sonra yeniden arar. Dijivizit profilinde iletişim bilgileriniz, kataloğunuz ve WhatsApp hattınız tek bağlantıda durur; alıcı sizi rehberine kaydeder, gerektiğinde tek dokunuşla ulaşır.",
        ],
      },
      {
        heading: "Gaziantep'te akıllı kartvizit ve katalog",
        list: [
          "Halı, ambalaj ya da gıda kataloğunuzu PDF olarak ekleyin; profile en fazla 10 belge, her biri 10 MB'a kadar yüklenir",
          "Yurt içi ve ihracat fiyat listelerini ayrı belgeler olarak koyun; değiştiğinde panelden yenisini yükleyin",
          "Yabancı alıcılar için “Hakkımda” yazısına istediğiniz dilde kısa bir tanıtım ekleyin",
          "Numune ve teklif takibi için her yeni kişiye hatırlatma kurun; günü gelince e-postanıza düşer",
        ],
      },
      {
        heading: "Fuarlarda ve alıcı ziyaretlerinde",
        paragraphs: [
          "Gaziantep'teki firmalar hem ilin fuar ve kongre merkezlerinde düzenlenen sektör fuarlarına hem de İstanbul'daki ve yurt dışındaki büyük fuarlara katılır; şehre gelen alıcılarla fabrika ziyaretleri de iş hayatının olağan parçasıdır.",
          "Stand panosuna, numune etiketlerine ve broşürlere profil QR kodunuzu koyun. Ziyaretçiler “Bilgilerimi bırak” ile ad, şirket ve not bırakır; size verilen kâğıt kartvizitleri de fotoğrafını çekerek kaydedersiniz. Analitik panelinde profilinizin hangi şehirlerden ve cihazlardan açıldığını izlersiniz.",
        ],
      },
      {
        heading: "Gaziantep'e sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Gaziantep'te şubesi ya da bayisi yoktur; siparişler online verilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "İhracat ve satış ekipleri için 10 ve üzeri adette firma logonuz karta işlenir ve %20 indirim uygulanır. Fuara yetişmesi gereken durumlarda kartsız dijital kartvizit 2 saat içinde e-postanıza gelir; sonradan karta geçtiğinizde link ve QR kod aynı kalır.",
        ],
      },
    ],
    faq: [
      {
        q: "Gaziantep'te NFC kartvizit nereden alınır?",
        a: "Dijivizit'ten online sipariş verirsiniz. Gaziantep'te mağazamız yoktur; kartlar Gaziantep'in tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Kataloğumuz büyük, profile sığar mı?",
        a: "Her PDF en fazla 10 MB olabilir ve profile en fazla 10 belge eklenir. Büyük bir kataloğu ürün gruplarına bölerek ekleyebilirsiniz.",
      },
      {
        q: "Yurt dışındaki alıcıya nasıl ulaştırırım?",
        a: "Profil bir web sayfası olarak tarayıcıda açılır; uygulama gerekmez. Yüz yüze görüşmede kartı dokundurur ya da QR kodu okutursunuz, uzaktaki alıcıya da bağlantıyı WhatsApp ya da e-postayla gönderirsiniz.",
      },
      {
        q: "Firmamızın logosu kartta olabilir mi?",
        a: "Standart kartlarda Dijivizit logosu bulunur. 10 ve üzeri adetteki kurumsal siparişlerde firma logonuz karta işlenir; metal kartlarda lazerle kazınır, ahşap kartlarda lazerle yakılır.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "dijital-kartvizit-ornekleri",
      "qr-kod-kartvizit",
      "nfc-kartvizit-nereden-alinir",
    ],
    siblings: [
      "dijital-kartvizit/adana",
      "dijital-kartvizit/mersin",
      "dijital-kartvizit/kayseri",
      "dijital-kartvizit/istanbul",
    ],
  },
  {
    slug: "dijital-kartvizit/kayseri",
    parent: PARENT,
    kind: "sehir",
    term: "Kayseri",
    title: "Kayseri NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Kayseri'de NFC kartvizit ve dijital kartvizit: mobilya, tekstil ve metal firmalarının bayi ve showroom görüşmeleri için akıllı kartvizit. Ücretsiz kargoyla.",
    h1: "Kayseri'de NFC ve dijital kartvizit",
    lead: "Kayseri'de ticaret bir gelenek, üretim bir meslektir. Mobilya showroom'unda, bir bayi toplantısında ya da organize sanayideki bir fabrikada tanıştığınız kişiye kartınızı dokundurun; sizi ve ürünlerinizi tek bağlantıda bulsun.",
    sections: [
      {
        heading: "Kayseri sanayisi ve kartvizit",
        paragraphs: [
          "Kayseri; mobilya ve yatak üretimi, tekstil, metal ve makine imalatı, gıda ve inşaat malzemeleriyle İç Anadolu'nun önde gelen sanayi ve ticaret şehirlerindendir. Organize sanayi bölgesindeki üreticilerin önemli bir kısmı ürünlerini Türkiye'nin dört bir yanındaki bayiler ve mağazalar üzerinden satar.",
          "Bayi ağıyla çalışan bir firmada kartvizit, satış temsilcisinin en çok dağıttığı şeydir. Temsilci ya da numara değiştiğinde, yeni koleksiyon çıktığında kâğıt kartlar eskir. Dijital profilde bilgiler panelden güncellenir; bayinin elindeki kart yeni bilgileri gösterir.",
        ],
      },
      {
        heading: "Mobilya showroom'unda ve bayide",
        list: [
          "Koleksiyon kataloğunuzu ve ürün föylerinizi PDF olarak profile ekleyin; müşteri showroom'dan ayrıldıktan sonra da inceler",
          "Showroom girişine ve ürünlerin yanına profil QR kodu koyun; müşteri sizi rehberine kaydeder, WhatsApp'tan yazar",
          "Showroom ya da fabrika adresinizi ekleyin; dokununca harita açılır",
          "Satış, sevkiyat ve servis için ayrı, etiketli telefon satırları kullanın",
        ],
        paragraphs: [
          "Showroom'u gezip “Bilgilerimi bırak” ile adını ve numarasını bırakan müşteriler Kişiler listenize düşer; teklif ya da teslimat günü için hatırlatma kurarsınız.",
        ],
      },
      {
        heading: "Kayseri'de akıllı kartvizitle satış ekibi",
        paragraphs: [
          "Satış ekibi geniş firmalarda kartlar ekip panelinden yönetilir. Kart çalışana atanır; temsilci ayrıldığında aynı fiziksel kart yeni temsilciye devredilir. Kaybolan kart panelden kapatılır.",
          "Analitik panelinde her temsilcinin profilinin kaç kez açıldığını, hangi şehirlerden görüntülendiğini ve kaç kişinin rehberine kaydettiğini görürsünüz. İlin fuar ve kongre merkezlerinde ya da İstanbul'daki sektör fuarlarında stand kurduğunuzda da aynı veriyi izlersiniz.",
        ],
      },
      {
        heading: "Kayseri'ye sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Kayseri'de şubesi yoktur; siparişler online verilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Ahşap kartlar mobilya ve dekorasyon firmalarının ürünleriyle uyumlu bir seçenektir; koyu ve açık ahşap 2.500 TL'dir. 10 ve üzeri adette firma logonuz ahşaba lazerle yakılır ve %20 indirim uygulanır. Kartsız dijital kartvizit 2 saat içinde e-postanıza gelir.",
        ],
      },
    ],
    faq: [
      {
        q: "Kayseri'de NFC kartvizit nereden alınır?",
        a: "Dijivizit'ten online sipariş verirsiniz. Kayseri'de mağazamız yoktur; kartlar Kayseri'nin tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Mobilya firmamıza hangi kart uygun?",
        a: "Koyu ve açık ahşap kartlar 2.500 TL'dir ve ahşap ürünlerle uyumludur. Daha ağır bir his isteyenler siyah, gümüş ya da gold metal kartı (4.000 TL) seçer; mat siyah PVC de 2.500 TL'dir.",
      },
      {
        q: "Temsilcimiz değişince kart ne olur?",
        a: "Ekip panelinden kartı yeni temsilciye atarsınız; aynı kart yeni kişinin profilini açar.",
      },
      {
        q: "Bayilerimiz kataloğun güncelini nasıl görür?",
        a: "Kataloğu panelden yeni PDF'le değiştirirsiniz; bayinin elindeki kart ve QR kod güncel dosyayı açar.",
      },
    ],
    guides: [
      "ahsap-kartvizit",
      "kurumsal-dijital-kartvizit",
      "metal-kartvizit",
      "dijital-kartvizit-ornekleri",
    ],
    siblings: [
      "dijital-kartvizit/konya",
      "dijital-kartvizit/ankara",
      "dijital-kartvizit/gaziantep",
      "dijital-kartvizit/eskisehir",
    ],
  },
  {
    slug: "dijital-kartvizit/samsun",
    parent: PARENT,
    kind: "sehir",
    term: "Samsun",
    title: "Samsun NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Samsun'da NFC kartvizit ve dijital kartvizit: tıbbi cihaz, tarım ve lojistik firmaları, hastane ziyaretleri için akıllı kartvizit. Ücretsiz kargoyla.",
    h1: "Samsun'da NFC ve dijital kartvizit",
    lead: "Samsun'da iş limandan ovaya, hastaneden organize sanayiye uzanır. Tıbbi cihaz temsilcisi de, tarım bayisi de, nakliyeci de aynı şeye ihtiyaç duyar: tanıştığı kişinin rehberine hızla ve doğru bilgiyle girmek.",
    sections: [
      {
        heading: "Karadeniz'in ticaret merkezinde kartvizit",
        paragraphs: [
          "Samsun; limanı, Çarşamba ve Bafra ovalarındaki tarımı, organize sanayi bölgeleri ve tıbbi cihaz üreticileriyle Karadeniz'in en büyük ticaret ve sanayi şehridir. Ondokuz Mayıs Üniversitesi ve hastaneleriyle aynı zamanda bölgenin sağlık merkezidir.",
          "Bu yapıda kartvizit farklı ortamlarda kullanılır: bir hastanenin satın alma biriminde, bir tarım bayisinin tezgâhında, limandaki bir lojistik firmasının ofisinde. Dijivizit kartı her ortamda aynı işi yapar; dokundurulduğunda profilinizi açar, “Rehberime Kaydet” ile sizi rehbere ekler.",
        ],
      },
      {
        heading: "Samsun'da akıllı kartvizitle hastane ve satın alma ziyareti",
        list: [
          "Ürün kataloğu, teknik doküman ve kalite belgelerinizi PDF olarak profile ekleyin; satın alma birimi dosyaları tek bağlantıda bulur",
          "Satış, teknik servis ve yedek parça için ayrı, etiketli telefon satırları kullanın",
          "Görüştüğünüz hekimin, biyomedikal mühendisinin ya da satın almacının kâğıt kartvizitini fotoğrafını çekerek kaydedin",
          "Demo, teklif ya da ihale tarihine göre hatırlatma kurun; o sabah e-postanıza gelir",
        ],
        paragraphs: [
          "Kartın çipinde yalnızca profilinize giden bağlantı bulunur; profil adresi adınızı değil rastgele bir kodu içerir. Kaybolan kartı panelden kapatırsınız.",
        ],
      },
      {
        heading: "Tarım ve lojistik sahasında",
        paragraphs: [
          "Ovalardaki üreticilerle ve bayilerle çalışan tohum, fide, gübre ve tarım makinesi firmalarında kartvizit sezon boyunca elden ele geçer. Profilinize ürün dönemine göre güncellediğiniz kataloğu koyarsınız; çiftçi kartı dokundurduğunda ya da QR kodu okuttuğunda güncel dosyayı görür.",
          "Liman ve kara taşımacılığı firmalarında operasyon hattı ile muhasebe hattı ayrı tutulmalıdır. Etiketli telefon satırları sayesinde müşteri doğru hattı arar, WhatsApp hattınıza tek dokunuşla yazar.",
        ],
      },
      {
        heading: "Samsun'a sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Samsun'da şubesi yoktur; siparişler online verilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Kart istemeyenler için kartsız dijital kartvizit aylık 59,90 TL'dir; yıllık 718,80 TL olarak peşin ödenir ve 2 saat içinde e-postanıza gelir. 10 ve üzeri adetteki ekip siparişlerinde %20 indirim uygulanır.",
        ],
      },
    ],
    faq: [
      {
        q: "Samsun'da NFC kartvizit nereden alınır?",
        a: "Dijivizit'ten online sipariş verirsiniz. Samsun'da mağazamız yoktur; kartlar Samsun'un tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Karşı tarafın telefonunda NFC kapalıysa?",
        a: "Profilinizin QR kodunu kendi telefonunuzdan okutur ya da linki paylaşırsınız; uygulama gerekmez.",
      },
      {
        q: "Teknik dokümanlarımızı profile ekleyebilir miyiz?",
        a: "Evet. En fazla 10 PDF belge, her biri 10 MB'a kadar; katalog, teknik doküman ve sunum gibi türler seçilebilir.",
      },
      {
        q: "Kart okunmazsa ne olur?",
        a: "Okunmayan kart ücretsiz olarak yenisiyle değiştirilir. Ayrıca teslimattan sonra 14 gün cayma hakkınız vardır.",
      },
    ],
    guides: [
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "telefonda-nfc-nasil-acilir",
      "kurumsal-dijital-kartvizit",
      "nfc-kartvizit-nereden-alinir",
    ],
    siblings: [
      "dijital-kartvizit/trabzon",
      "dijital-kartvizit/ankara",
      "dijital-kartvizit/kocaeli",
    ],
  },
  {
    slug: "dijital-kartvizit/trabzon",
    parent: PARENT,
    kind: "sehir",
    term: "Trabzon",
    title: "Trabzon NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Trabzon'da NFC kartvizit ve dijital kartvizit: fındık ve gıda ticareti, turizm ve dış ticaret için. Yabancı misafire QR ve akıllı kartvizit; ücretsiz kargo.",
    h1: "Trabzon'da NFC ve dijital kartvizit",
    lead: "Trabzon'da iş limanla, fındıkla, turizmle ve sınır ötesi ticaretle döner. Karşınızdaki kişi bir fındık tüccarı da olsa, yaylaya gelen bir misafir de olsa bilgileriniz tek dokunuşla telefonunda olsun.",
    sections: [
      {
        heading: "Doğu Karadeniz'in ticaret kapısı",
        paragraphs: [
          "Trabzon; limanıyla, fındık ve gıda ticaretiyle, Gürcistan ve Kafkasya'ya uzanan dış ticaretiyle Doğu Karadeniz'in ticaret merkezidir. Uzungöl ve yaylalarıyla yerli ve yabancı turistlerin uğrak noktası, Karadeniz Teknik Üniversitesi ile de bölgenin akademik merkezidir.",
          "Bu çeşitlilikte kartvizitten beklenen de farklıdır: tüccar fiyat listesini, otel ve acente rezervasyon hattını, akademisyen yayın listesini paylaşmak ister. Dijivizit profilinde hepsi tek bağlantıda durur; kartı dokundurmak ya da QR kodu okutmak yeter.",
        ],
      },
      {
        heading: "Trabzon'da turizm ve akıllı kartvizit",
        list: [
          "Otel, pansiyon ve tur firmaları: resepsiyona ve araçlara profil QR kodu koyun; misafir sizi rehberine kaydeder, dönüşte WhatsApp'tan yazar",
          "Numaralarınızı +90 ile başlayarak girin; yurt dışı hatlardan doğrudan aranırsınız",
          "“Hakkımda” yazısına İngilizce ya da misafirlerinizin dilinde kısa bir paragraf ekleyin",
          "Rezervasyon ya da tur programı sayfanız varsa bağlantısını profile koyun",
        ],
        paragraphs: [
          "Dijivizit bir rezervasyon sistemi değildir; misafir profilden sizi arar, yazar ya da kullandığınız rezervasyon sayfasına geçer.",
        ],
      },
      {
        heading: "Fındık, gıda ve dış ticarette",
        paragraphs: [
          "Fındık ve gıda ticaretinde fiyatlar sık değişir, alıcıyla satıcı arasındaki görüşme çoğu zaman kısa ve yoğundur. Ürün listenizi ve şirket sunumunuzu PDF olarak profile ekler, değiştiğinde panelden yenisini yüklersiniz.",
          "Size verilen kâğıt kartvizitleri fotoğrafını çekerek kaydedersiniz; ad, firma ve telefon otomatik okunur. Analitik panelinde profilinizin hangi şehirlerden açıldığını görür, yurt dışındaki bir alıcıya gönderdiğiniz bağlantının açılıp açılmadığını anlarsınız.",
        ],
      },
      {
        heading: "Trabzon'a sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Trabzon'da şubesi yoktur; siparişler online verilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Kartsız dijital kartvizit 2 saat içinde e-postanıza gelir; sezon başında hızlı başlamak isteyen turizm işletmeleri için uygundur. Ekip siparişlerinde 10 ve üzeri adette %20 indirim uygulanır ve kartlar ekip panelinden yönetilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Trabzon'da NFC kartvizit nereden alınır?",
        a: "Dijivizit'ten online sipariş verirsiniz. Trabzon'da mağazamız yoktur; kartlar Trabzon'un tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Yabancı turistlerin telefonunda çalışır mı?",
        a: "Evet. NFC'li telefonlarda dokundurunca, diğerlerinde ekranınızdaki profil QR koduyla tarayıcıda açılır. Uygulama gerekmez.",
      },
      {
        q: "Akademisyenler için uygun mu?",
        a: "Evet. Unvanınızı, bölümünüzü ve özgeçmişinizi “Özgeçmiş” türünde PDF olarak eklersiniz; kongrede sunumunuzun son slaytına QR kodunuzu koyarsınız.",
      },
      {
        q: "Fiyat listemi ne sıklıkla değiştirebilirim?",
        a: "İstediğiniz kadar. Panelden yeni PDF'i yüklediğinizde kartınız ve QR kodunuz güncel listeyi açar.",
      },
    ],
    guides: [
      "qr-kod-kartvizit",
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "instagram-kartvizit",
      "dijital-kartvizit-nedir",
    ],
    siblings: [
      "dijital-kartvizit/samsun",
      "dijital-kartvizit/antalya",
      "dijital-kartvizit/istanbul",
    ],
  },
  {
    slug: "dijital-kartvizit/denizli",
    parent: PARENT,
    kind: "sehir",
    term: "Denizli",
    title: "Denizli NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Denizli'de NFC kartvizit ve dijital kartvizit: ev tekstili ve havlu ihracatçıları, traverten ve kablo üreticileri için akıllı kartvizit. Ücretsiz kargoyla.",
    h1: "Denizli'de NFC ve dijital kartvizit",
    lead: "Denizli'de bir havlu numunesi, bir traverten plakası ya da bir kablo makarası çoğu zaman yurt dışına giden bir siparişin ilk adımıdır. Alıcıyla tanıştığınız anda iletişim bilgileriniz ve kataloğunuz onun telefonunda olsun.",
    sections: [
      {
        heading: "Denizli'nin üretimi ve kartvizit",
        paragraphs: [
          "Denizli; havlu, bornoz ve ev tekstilinde Türkiye'nin önde gelen üretim merkezlerindendir. Bunun yanında traverten ve doğal taş, kablo ve metal, gıda üretimi de şehrin güçlü sektörleridir; Pamukkale ise Denizli'yi önemli bir turizm noktası yapar.",
          "Üretimin önemli bir kısmı ihracata gider. Alıcıyla ilk tanışma bir fuarda, bir fabrika ziyaretinde ya da showroom'da olur; ardından numune, teklif ve uzun bir yazışma gelir. Kartvizitin bu süreç boyunca güncel kalması gerekir.",
        ],
      },
      {
        heading: "Denizli'de tekstil firmaları için akıllı kartvizit",
        list: [
          "Koleksiyon kataloğunu ve ürün föylerini PDF olarak profile ekleyin; alıcı showroom'dan çıktıktan sonra da inceler",
          "Sezona göre değişen kataloğu panelden yenisiyle değiştirin; kart ve QR kod aynı kalır",
          "Yabancı alıcılar için “Hakkımda” yazısına kısa bir İngilizce tanıtım ekleyin",
          "Numune gönderdiğiniz her alıcıya takip hatırlatması kurun; günü gelince e-postanıza düşer, WhatsApp mesajı hazır yazılmış olur",
        ],
      },
      {
        heading: "Traverten, kablo ve turizm",
        paragraphs: [
          "Traverten ve doğal taş firmaları için proje referansları ve ürün föyleri, kablo ve metal üreticileri için teknik dokümanlar ve kalite belgeleri profilde durur. Satın almacı kartınızı dokundurduğunda sizi rehberine kaydeder ve belgelere tek dokunuşla ulaşır.",
          "Pamukkale çevresindeki otel, acente ve tur firmaları ise profil QR kodunu resepsiyona ve araçlara koyar; misafir sizi rehberine kaydeder, WhatsApp'tan yazar.",
        ],
      },
      {
        heading: "Denizli'ye sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Denizli'de şubesi yoktur; siparişler online verilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "İhracat ve satış ekipleri için 10 ve üzeri adette firma logonuz karta işlenir ve %20 indirim uygulanır; kartlar ekip panelinden temsilcilere atanır. Kartsız dijital kartvizit 2 saat içinde e-postanıza gelir.",
        ],
      },
    ],
    faq: [
      {
        q: "Denizli'de NFC kartvizit nereden alınır?",
        a: "Dijivizit'ten online sipariş verirsiniz. Denizli'de mağazamız yoktur; kartlar Denizli'nin tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Koleksiyonumuz her sezon değişiyor, kartları yeniden bastırmamız gerekir mi?",
        a: "Hayır. Kataloğu panelden güncellersiniz; elinizdeki kartlar ve dağıttığınız QR kodlar yeni kataloğu açar.",
      },
      {
        q: "Hangi kart seçenekleri var?",
        a: "Mat siyah PVC ile koyu ve açık ahşap 2.500 TL, siyah, gümüş ve gold metal 4.000 TL'dir. Kartsız dijital kartvizit aylık 59,90 TL'dir ve yıllık ödenir.",
      },
      {
        q: "Kartın üzerinde adım yazar mı?",
        a: "Standart kartlarda Dijivizit logosu bulunur; adınız ve bilgileriniz kartta değil profilinizde durur. Bilgileriniz değiştiğinde kartı yeniden bastırmazsınız.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "dijital-kartvizit-ornekleri",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
      "en-iyi-dijital-kartvizit-nasil-secilir",
    ],
    siblings: [
      "dijital-kartvizit/izmir",
      "dijital-kartvizit/mugla",
      "dijital-kartvizit/antalya",
      "dijital-kartvizit/bursa",
    ],
  },
  {
    slug: "dijital-kartvizit/sakarya",
    parent: PARENT,
    kind: "sehir",
    term: "Sakarya",
    title: "Sakarya NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Sakarya'da NFC kartvizit ve dijital kartvizit: otomotiv, raylı sistemler ve yan sanayi firmalarında tedarikçi görüşmesi için akıllı kartvizit; ücretsiz kargo.",
    h1: "Sakarya'da NFC ve dijital kartvizit",
    lead: "Sakarya'da tedarik zinciri kısa mesafelerde, hızlı döner: bir yan sanayici aynı hafta hem Sakarya'daki hem Kocaeli'deki ana sanayi tesislerine gidebilir. Kartınızı dokundurun, teknik dokümanınız toplantı masasında açılsın.",
    sections: [
      {
        heading: "Sakarya'nın sanayisi ve kartvizit",
        paragraphs: [
          "Sakarya; otomotiv ve otomotiv yan sanayi, raylı sistem araçları, makine, metal ve gıda üretimiyle Marmara'nın önemli sanayi şehirlerindendir. İstanbul ve Kocaeli'ye yakınlığı, organize sanayi bölgeleri ve Sakarya Üniversitesi şehri hem üretim hem mühendislik açısından canlı tutar; fındık başta olmak üzere tarım da ilin ekonomisinde yer tutar.",
          "Bu yapıda tedarikçi ile ana sanayi arasındaki ziyaret, denetim ve teklif görüşmeleri gündelik iştir. Dijivizit profilinde teknik föyünüz, kalite belgeleriniz ve iletişim bilgileriniz bir arada durur; satın almacı sizi rehberine kaydeder, belgelerinize tek dokunuşla ulaşır.",
        ],
      },
      {
        heading: "Tedarikçi ve satın alma görüşmesinde",
        list: [
          "Satış, kalite ve lojistik için ayrı, etiketli telefon satırları; ana sanayinin kalite birimi doğrudan doğru kişiyi arar",
          "Ürün föyü, teknik doküman ve sertifikalar PDF olarak profilde; toplantıda ekrandan gösterilir",
          "Fatura bilgileri; cari kart açacak satın alma birimi vergi numaranızı tek dokunuşla kopyalar",
          "Görüşmede aldığınız kâğıt kartvizitler fotoğrafla kaydedilir; ad, unvan, şirket ve telefon otomatik okunur",
        ],
        paragraphs: [
          "Fabrika toplantı odalarında NFC'si kapalı telefonlar için profilinizin QR kodunu kendi telefonunuzdan okutur ya da linki paylaşırsınız.",
        ],
      },
      {
        heading: "Sakarya'da akıllı kartvizitle ekip yönetimi",
        paragraphs: [
          "Çok tesisli firmalarda satış mühendisi, kalite sorumlusu ya da satın almacı değişebilir. Ekip panelinde kart çalışana atanır; çalışan ayrıldığında aynı fiziksel kart yeni kişiye devredilir, kaybolan kart panelden kapatılır.",
          "Kurumsal siparişlerde firma logonuz karta işlenir. Analitik panelinde ekibinizin profillerinin kaç kez açıldığını ve kaç kişinin onları rehberine kaydettiğini görürsünüz.",
        ],
      },
      {
        heading: "Sakarya'ya sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Sakarya'da şubesi yoktur; siparişler online verilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "10 ve üzeri adette %20 indirim uygulanır. Kart beklemeden başlamak isteyen çalışanlar için kartsız dijital kartvizit 2 saat içinde e-postaya gelir.",
        ],
      },
    ],
    faq: [
      {
        q: "Sakarya'da NFC kartvizit nereden alınır?",
        a: "Dijivizit'ten online sipariş verirsiniz. Sakarya'da mağazamız yoktur; kartlar Adapazarı dahil Sakarya'nın tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Kaç adetten itibaren kurumsal fiyat uygulanır?",
        a: "10 ve üzeri adetteki siparişlerde %20 indirim uygulanır ve firma logonuz karta işlenir.",
      },
      {
        q: "Çalışan başka tesise geçerse ne olur?",
        a: "Unvanını ve tesis adresini panelden güncellersiniz; kart aynı kalır. Çalışan ayrılırsa kartı ekip panelinden yeni kişiye atarsınız.",
      },
      {
        q: "NFC'si kapalı telefonlarda çalışır mı?",
        a: "Evet. Profilinizin QR kodunu kendi telefonunuzdan okutabilir ya da linki paylaşabilirsiniz; aynı profil açılır.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "metal-kartvizit",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
      "telefonda-nfc-nasil-acilir",
    ],
    siblings: [
      "dijital-kartvizit/kocaeli",
      "dijital-kartvizit/bursa",
      "dijital-kartvizit/istanbul",
      "dijital-kartvizit/tekirdag",
    ],
  },
  {
    slug: "dijital-kartvizit/tekirdag",
    parent: PARENT,
    kind: "sehir",
    term: "Tekirdağ",
    title: "Tekirdağ NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Tekirdağ'da NFC kartvizit ve dijital kartvizit: Çorlu ve Çerkezköy'deki fabrikalar, lojistik ve tarım firmaları için akıllı kartvizit. Ücretsiz kargoyla gelir.",
    h1: "Tekirdağ'da NFC ve dijital kartvizit",
    lead: "Tekirdağ'da iş çoğu zaman Çorlu–Çerkezköy hattındaki bir fabrikada, bir lojistik deposunda ya da İstanbul'a giden yolda geçer. Kartınızı dokundurun; adınız, firmanız ve telefonlarınız karşı tarafın rehberine tek seferde geçsin.",
    sections: [
      {
        heading: "Trakya sanayisinde kartvizit",
        paragraphs: [
          "Tekirdağ; Çorlu ve Çerkezköy'deki organize sanayi bölgeleriyle tekstil, gıda, kimya, metal ve ambalaj gibi birçok sektörde fabrikaya ev sahipliği yapar. İstanbul'a yakınlığı, limanları ve Avrupa'ya açılan kara yolu şehri bir lojistik merkezi yapar; Trakya'nın tarımı da ilin ekonomisinde önemli yer tutar.",
          "Bu yoğunlukta tedarikçi, müşteri ve nakliyeci arasındaki tanışmalar hızlı ve sıktır. Kâğıt kartvizitler masada birikir, rehbere geçirilmeden kaybolur. Dijivizit'te kartı dokundurmak yeter; “Rehberime Kaydet” sizi tek seferde kaydeder.",
        ],
      },
      {
        heading: "Tekirdağ'da akıllı kartvizit fabrikada ve depoda",
        list: [
          "Satış, sevkiyat ve muhasebe için ayrı, etiketli telefon satırları; nakliyeci doğrudan sevkiyat hattını arar",
          "Depo ya da fabrika adresi; dokununca harita açılır, ilk kez gelen şoför ya da ziyaretçi kolayca bulur",
          "Ürün kataloğu, teknik föy ve şirket sunumu PDF olarak profilde",
          "Size verilen kâğıt kartvizitleri fotoğrafını çekerek kaydedin; her birine not ve hatırlatma ekleyin",
        ],
      },
      {
        heading: "İstanbul fuarlarına giden firmalar için",
        paragraphs: [
          "Tekirdağ'daki birçok firma ürünlerini İstanbul'daki büyük sektör fuarlarında sergiler. Stand panosuna ve broşürlere profil QR kodunuzu koyarsınız; ziyaretçi “Bilgilerimi bırak” ile ad, şirket ve not bırakır, fuar bitince liste panelinizde hazırdır.",
          "Fuar dönüşü her kişiye takip hatırlatması kurarsınız; o sabah e-postanıza gelir, WhatsApp mesajı hazır yazılmış olur. Analitik panelinde fuar günlerinde profilinizin kaç kez açıldığını görürsünüz.",
        ],
      },
      {
        heading: "Tekirdağ'a sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Tekirdağ'da şubesi yoktur; siparişler online verilir ve kartlar Çorlu, Çerkezköy ve Süleymanpaşa dahil ilin tüm ilçelerine gönderilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Çok sayıda çalışanı olan fabrikalar kartları ekip panelinden yönetir; çalışan ayrıldığında kart yeni kişiye devredilir. 10 ve üzeri adette %20 indirim uygulanır.",
        ],
      },
    ],
    faq: [
      {
        q: "Tekirdağ'da NFC kartvizit nereden alınır?",
        a: "Dijivizit'ten online sipariş verirsiniz. Tekirdağ'da mağazamız yoktur; kartlar ilin tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Fuara yetişmesi gereken acil bir ihtiyacımız var, ne yapabiliriz?",
        a: "Kartsız dijital kartvizitle başlayabilirsiniz: link ve QR kod 2 saat içinde e-postanıza gelir. Sonradan karta geçtiğinizde link ve QR kod aynı kalır.",
      },
      {
        q: "Çalışan kartını kaybederse ne yaparız?",
        a: "Kartı panelden tek tıkla kapatırsınız; kart artık profili açmaz. Kartın çipinde kişisel bilgi değil, yalnızca profil bağlantısı bulunur.",
      },
      {
        q: "Uygulama indirmek gerekiyor mu?",
        a: "Hayır. Profil iPhone'da ve Android'de tarayıcıda açılır; ne sizin ne karşı tarafın uygulama indirmesi gerekir.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "qr-kod-kartvizit",
      "nfc-kartvizit-nedir",
      "dijital-kartvizit-nasil-olusturulur",
    ],
    siblings: [
      "dijital-kartvizit/istanbul",
      "dijital-kartvizit/kocaeli",
      "dijital-kartvizit/sakarya",
      "dijital-kartvizit/bursa",
    ],
  },
  {
    slug: "dijital-kartvizit/mugla",
    parent: PARENT,
    kind: "sehir",
    term: "Muğla",
    title: "Muğla NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Muğla'da NFC kartvizit ve dijital kartvizit: Bodrum, Marmaris ve Fethiye'de yat, otel ve emlak işletmeleri için akıllı kartvizit. Ücretsiz kargoyla gelir.",
    h1: "Muğla'da NFC ve dijital kartvizit",
    lead: "Muğla'da müşteriyle tanışma bir marinada, bir otel lobisinde ya da satılık bir villanın bahçesinde olur. Misafir hangi ülkeden gelirse gelsin, kartınızı dokundurduğunuzda sizi rehberine kaydetsin ve dönüşte nereden ulaşacağını bilsin.",
    sections: [
      {
        heading: "Muğla'da turizm, yat ve emlak",
        paragraphs: [
          "Muğla; Bodrum, Marmaris, Fethiye, Datça ve Göcek ile Türkiye'nin turizm ve yatçılık merkezlerindendir. Marinalar, yat kiralama ve mavi yolculuk firmaları, oteller ve villa kiralama işletmeleri, yabancılara konut satan emlak ofisleri ilin iş hayatını belirler. Arıcılık ve çam balı, su ürünleri yetiştiriciliği ve tarım da önemli sektörlerdir.",
          "Bu işlerin ortak noktası, müşterinin çoğu zaman bir kez gelip yüz yüze görüşmesi, sonrasında telefonla ve WhatsApp'la devam etmesidir. İlk tanışmada doğru numaranın rehbere girmesi sonraki her görüşmeyi kolaylaştırır.",
        ],
      },
      {
        heading: "Marinada ve yat kiralamada",
        list: [
          "Tekne, rota ve hizmet bilgilerinizi içeren sunumu PDF olarak profile ekleyin",
          "Numaralarınızı +90 ile başlayarak girin; yurt dışı hatlardan doğrudan aranır, WhatsApp'tan tek dokunuşla yazılırsınız",
          "“Hakkımda” yazısına İngilizce ya da misafirlerinizin dilinde kısa bir tanıtım ekleyin",
          "Teknede, iskelede ya da broşürde profil QR kodu bulundurun; misafir sizi kaydeder, sonraki sezon yeniden arar",
        ],
      },
      {
        heading: "Muğla'da akıllı kartvizitle emlak ve sezonluk ekipler",
        paragraphs: [
          "Yabancı alıcıyla çalışan emlak danışmanları için profil, portföy sunumunu ve iletişim bilgilerini tek bağlantıda toplar. Bağlantınızı WhatsApp'tan gönderirsiniz; alıcı ülkesine döndükten sonra da sizi bulur. Analitik panelinde profilinizin hangi şehirlerden açıldığını görürsünüz.",
          "Otel ve tekne ekipleri sezondan sezona değişebilir. Ekip panelinde fiziksel kart çalışana atanır; çalışan ayrıldığında aynı kart yeni kişiye devredilir. Kaybolan ya da geri alınamayan kart panelden kapatılır.",
        ],
      },
      {
        heading: "Muğla'ya sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Muğla'da şubesi yoktur; siparişler online verilir ve kartlar Bodrum'dan Fethiye'ye ilin tüm ilçelerine gönderilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Sezon açılışına yetişmesi gereken durumlarda kartsız dijital kartvizit 2 saat içinde e-postanıza gelir. 10 ve üzeri adetteki ekip siparişlerinde firma logonuz karta işlenir ve %20 indirim uygulanır.",
        ],
      },
    ],
    faq: [
      {
        q: "Muğla'da NFC kartvizit nereden alınır?",
        a: "Dijivizit'ten online sipariş verirsiniz. Muğla'da mağazamız yoktur; kartlar ilin tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Yabancı müşterim beni telefonuna nasıl kaydeder?",
        a: "Profildeki “Rehberime Kaydet” düğmesine dokunur; adınız, şirketiniz ve numaralarınız tek kayıt olarak rehberine eklenir. Uygulama gerekmez.",
      },
      {
        q: "Otelimizin logosuyla ahşap kart yaptırabilir miyiz?",
        a: "Evet, 10 ve üzeri adetteki kurumsal siparişlerde logonuz ahşaba lazerle yakılır ve %20 indirim uygulanır. Koyu ve açık ahşap kartlar 2.500 TL'dir.",
      },
      {
        q: "Sezon bitince kartlar ne olur?",
        a: "Kartlar sizde kalır. Ekip panelinden gelecek sezonun çalışanına atarsınız; aynı kart yeni kişinin profilini açar.",
      },
    ],
    guides: [
      "ahsap-kartvizit",
      "qr-kod-kartvizit",
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "instagram-kartvizit",
    ],
    siblings: ["dijital-kartvizit/antalya", "dijital-kartvizit/izmir", "dijital-kartvizit/denizli"],
  },
];
