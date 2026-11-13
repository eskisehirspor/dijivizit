/**
 * Guides published on 2026-11-03, merged into GUIDES. Same rules as guides.ts:
 * one search intent per guide, every product claim must match the product.
 */
import type { Guide } from "@/lib/marketing/guides";
import { FINISHES, PRICING, formatTry } from "@/lib/orders/finishes";

const priceOf = (material: (typeof FINISHES)[number]["material"]) =>
  FINISHES.find((f) => f.material === material)!.price;
const METAL_PRICE = priceOf("metal");
const WOOD_PRICE = priceOf("wood");
const PVC_PRICE = priceOf("pvc");
const DIGITAL_MONTHLY = priceOf("digital");

export const NEW_GUIDES: Guide[] = [
  {
    slug: "cep-kartviziti-nedir",
    label: "Cep kartviziti nedir?",
    title: "Cep Kartviziti Nedir? Mobil ve Telefon Kartviziti",
    description:
      "Cep kartviziti, mobil kartvizit ve telefon kartviziti nedir, nasıl çalışır? Telefonda taşınan dijital kartvizitin kâğıttan farkı ve nasıl oluşturulduğu.",
    image: "/rehber/dijital-kartvizit-nedir.jpg",
    imageAlt: "Telefon ekranında açılmış Dijivizit mobil kartvizit profili",
    published: "2026-11-07",
    sections: [
      {
        heading: "Kısaca",
        paragraphs: [
          "Cep kartviziti, kâğıt yerine telefonda taşınan kartvizittir. Mobil kartvizit, telefon kartviziti, elektronik kartvizit ve dijital kartvizit aynı şeyin farklı adlarıdır: adınız, unvanınız, telefonunuz, e-postanız, adresiniz ve sosyal hesaplarınız tek bir web sayfasında toplanır, bu sayfa bir link, QR kod ya da NFC kartla paylaşılır.",
          "Karşınızdaki kişinin uygulama indirmesine gerek yoktur; link ya da QR kod telefonun tarayıcısında açılır, tek dokunuşla bilgileriniz rehbere kaydedilir.",
        ],
        link: { href: "/", label: "Dijital kartvizit" },
      },
      {
        heading: "Cep kartviziti nasıl paylaşılır?",
        paragraphs: [],
        list: [
          "NFC kart: kartı karşınızdakinin telefonuna dokundurursunuz, profil açılır.",
          "QR kod: kendi telefon ekranınızdaki QR kodu karşınızdaki kişi kamerasıyla okutur.",
          "Link: WhatsApp, SMS, e-posta veya Instagram üzerinden profil linkinizi gönderirsiniz.",
          "E-posta imzası ve sunumlar: profil linkiniz ya da QR kodunuz her yazışmada sizinle gider.",
        ],
      },
      {
        heading: "Kâğıt kartvizitten farkı",
        paragraphs: [
          "Kâğıt kartvizit basıldığı anda sabitlenir; telefon, unvan ya da adres değişince yeniden basmanız gerekir. Cep kartvizitinde bilgilerinizi panelden güncellersiniz, daha önce kartınızı alan herkes güncel hâlini görür.",
          "Kâğıt kartvizit çoğu zaman bir çekmecede kaybolur. Cep kartvizitindeki bilgiler ise tek dokunuşla telefon rehberine kaydedilir; WhatsApp, Instagram, konum ve web siteniz bir dokunuş uzaklıkta olur.",
        ],
        link: {
          href: "/rehber/nfc-kartvizit-mi-kagit-kartvizit-mi",
          label: "NFC kartvizit mi, kâğıt kartvizit mi?",
        },
      },
      {
        heading: "Cep kartviziti nasıl oluşturulur?",
        paragraphs: [
          "Dijivizit'te profilinizi birkaç dakikada oluşturursunuz: fotoğrafınızı, iletişim bilgilerinizi ve linklerinizi eklersiniz, size özel profil linki ve QR kodunuz hazır olur. İsterseniz telefona dokundurunca profilinizi açan metal, ahşap veya PVC NFC kart da alabilirsiniz.",
        ],
        link: {
          href: "/rehber/dijital-kartvizit-nasil-olusturulur",
          label: "Dijital kartvizit nasıl oluşturulur?",
        },
      },
      {
        heading: "Kimler kullanır?",
        paragraphs: [
          "Emlak danışmanları, doktorlar ve diyetisyenler, avukatlar, sigortacılar, satış temsilcileri, kuaförler ve fuarlara katılan herkes için cep kartviziti, kartvizit bastırma derdini bitirir. Ekipler için kurumsal panelden tüm çalışanların kartları tek yerden yönetilir.",
        ],
        link: { href: "/rehber/e-kartvizit-nedir", label: "E-kartvizit nedir?" },
      },
    ],
    faq: [
      {
        q: "Mobil kartvizit ile dijital kartvizit aynı şey mi?",
        a: "Evet. Mobil kartvizit, cep kartviziti, telefon kartviziti ve elektronik kartvizit aynı şeyi anlatır: telefonda açılan ve link, QR kod ya da NFC ile paylaşılan bir kartvizit.",
      },
      {
        q: "Cep kartviziti için uygulama gerekir mi?",
        a: "Hayır. Profil telefonun tarayıcısında açılır; ne sizin ne karşı tarafın uygulama indirmesi gerekir.",
      },
      {
        q: "Cep kartviziti ücretli mi?",
        a: "Dijivizit NFC kart alana dijital profil ilk yıl ücretsizdir; sonrasında aylık 59,90 TL'dir. Kartsız, yalnızca link ve QR kodla kullanmak isterseniz dijital profil aylık 59,90 TL'dir.",
      },
    ],
  },
  {
    slug: "ucretsiz-dijital-kartvizit",
    label: "Ücretsiz dijital kartvizit",
    title: "Ücretsiz Dijital Kartvizit: Ne Alırsınız, Sınırı Ne?",
    description:
      "Ücretsiz dijital kartvizit mümkün mü? Ücretsiz QR kartvizitin size neler verdiği, sınırları ve ücretli dijital kartvizitin ne zaman gerçekten değdiği.",
    image: "/rehber/dijital-kartvizit-nasil-olusturulur.jpg",
    imageAlt: "Telefon ekranında Dijivizit dijital kartvizit profili",
    published: "2026-11-03",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Evet, ücretsiz bir dijital kartvizitle başlayabilirsiniz. Bilgilerinizi bir QR koda yazdırıp kâğıt kartvizitinize, sunumunuza ya da e-posta imzanıza eklemek hiçbir ücret gerektirmez. Okutan kişi sizi doğrudan rehberine kaydeder.",
          "Ücretsiz seçeneğin sınırı, bilgilerin kodun içine sabitlenmesidir. Güncellenebilen bir profil, paylaşılabilir bir bağlantı, kimlerin açtığını gösteren analitik ve size geri dönüş sağlayan bir form istiyorsanız ücretli bir dijital kartvizite ihtiyaç duyarsınız.",
        ],
        link: { href: "/", label: "Dijital kartvizit" },
      },
      {
        heading: "Ücretsiz olarak neler yapabilirsiniz?",
        paragraphs: [
          "Dijivizit'in iki ücretsiz aracı üyelik ya da e-posta istemez. QR kod tarayıcınızda oluşturulur; yazdığınız bilgiler sunucumuza gönderilmez.",
        ],
        list: [
          "Ad, unvan, şirket, telefon, e-posta ve web sitenizi yazıp rehbere kaydeden bir QR kod oluşturmak",
          "QR kodu yüksek çözünürlüklü PNG olarak indirip baskıya hazır hâle getirmek",
          "Dijital kartvizitinizin telefonda nasıl görüneceğini önizlemek",
          "Kodu kâğıt kartvizite, broşüre, sunum slaytına ya da fuar standına eklemek",
        ],
        link: { href: "/dijital-kartvizit-olustur", label: "Ücretsiz dijital kartvizit oluştur" },
      },
      {
        heading: "Ücretsiz QR kartvizitin sınırları",
        paragraphs: [
          'Ücretsiz araçla ürettiğiniz QR kod "statik"tir: bilgileriniz kodun içine yazılır. Bunun birkaç sonucu vardır:',
        ],
        list: [
          "Numaranız, unvanınız ya da e-postanız değişirse yeni bir kod üretip yeniden bastırmanız gerekir.",
          "Kodu kaç kişinin okuttuğunu göremezsiniz.",
          "Fotoğraf, WhatsApp, sosyal medya, konum ve PDF belgeler eklenemez; kod yalnızca temel kişi bilgilerini taşır.",
          "Paylaşabileceğiniz bir profil bağlantısı yoktur; QR kodu ancak görsel olarak gönderebilirsiniz.",
        ],
        link: { href: "/qr-kartvizit-olustur", label: "Ücretsiz QR kartvizit oluştur" },
      },
      {
        heading: "Ücretli dijital kartvizit neyi değiştirir?",
        paragraphs: [
          "Ücretli dijital kartvizitte QR kod ve bağlantı, internette duran profilinize gider. Bilgilerinizi panelden değiştirirsiniz; QR kod ve bağlantı hiç değişmez, okutan herkes güncel hâlini görür.",
        ],
        list: [
          "Fotoğraf, WhatsApp, LinkedIn, Instagram, web sitesi, adres, IBAN ve PDF belgeler tek profilde",
          "Karşı taraf sizi tek dokunuşla rehberine kaydeder; uygulama gerekmez",
          'Ziyaretçi "Bilgilerimi bırak" ile kendi adını ve numarasını size iletir',
          "Profilinizin kaç kez, hangi şehirlerden ve cihazlardan açıldığını görürsünüz",
          "Profil adresiniz adınızı değil rastgele bir kodu içerir; linki bilmeyen profilinizi tahmin edemez",
        ],
      },
      {
        heading: "Ne kadar tutar?",
        paragraphs: [
          "Kartsız dijital kartvizit, yani profil linki ve QR kod, aylık 59,90 TL'dir; ödeme yıllık 718,80 TL olarak tek seferde alınır, KDV dahildir. Kart, kargo ya da kurulum ücreti yoktur ve link ile QR kodunuz siparişten sonra 2 saat içinde e-postanıza gelir.",
          "Yüz yüze tanışmalar için fiziksel kart isterseniz NFC kartvizitlerde dijital profil ilk yıl ücretsizdir, sonrasında aylık 59,90 TL'dir. Kartsız dijital kartvizitle başlayıp sonradan PVC, metal ya da ahşap NFC karta geçebilirsiniz; link ve QR kodunuz aynı kalır.",
        ],
        link: {
          href: "/kartvizit/dijital-kartvizit-qr",
          label: "Kartsız dijital kartvizit (link + QR)",
        },
      },
      {
        heading: "Hangisi size uygun?",
        paragraphs: [
          "Bilgileriniz yıllardır aynıysa ve tek ihtiyacınız kâğıt kartvizite rehbere kaydeden bir QR kod eklemekse ücretsiz araç yeterlidir. Bilgileriniz değişiyorsa, sosyal medya ve belgelerinizi de paylaşmak istiyorsanız ya da kartvizitinizin işe yarayıp yaramadığını görmek istiyorsanız ücretli dijital kartvizit daha doğru bir tercihtir.",
        ],
        link: { href: "/kartvizit", label: "Tüm fiyatları görün" },
      },
    ],
    faq: [
      {
        q: "Ücretsiz QR kartvizit ne kadar süre çalışır?",
        a: "Süresiz. Bilgileriniz kodun içine yazıldığı için kod herhangi bir sunucuya bağlı değildir ve kapanmaz. Ancak bilgileriniz değişirse yeni kod üretmeniz gerekir.",
      },
      {
        q: "Ücretsiz araç için üye olmam gerekir mi?",
        a: "Hayır. Üyelik ya da e-posta istenmez; QR kod tarayıcınızda oluşturulur, yazdığınız bilgiler sunucumuza gönderilmez.",
      },
      {
        q: "Dijital profil NFC kartla birlikte ücretsiz mi?",
        a: "NFC kart satın aldığınızda dijital profil ilk yıl ücretsizdir; sonrasında aylık 59,90 TL'dir. Kartlar metal kaplamalarda 4.000 TL, ahşap kaplamalarda 2.500 TL'dir (KDV dahil, kargo ücretsiz).",
      },
      {
        q: "Ücretsiz QR kodumu sonradan dijital kartvizite çevirebilir miyim?",
        a: "Statik QR kodun içeriği değiştirilemez. Dijital kartvizite geçtiğinizde size profilinize giden yeni bir QR kod verilir; bundan sonra bilgileriniz değişse de bu kod aynı kalır.",
      },
    ],
  },
  {
    slug: "dijital-kartvizit-ornekleri",
    label: "Dijital kartvizit örnekleri",
    title: "Dijital Kartvizit Örnekleri: Mesleğe Göre Ne Eklenir?",
    description:
      "Dijital kartvizit örnekleri: emlakçı, diyetisyen, avukat, kuaför, satış temsilcisi ve restoran için profilde neler olmalı, hangi bağlantı en üstte durmalı?",
    image: "/rehber/yeni-isletme-kontrol-listesi.jpg",
    imageAlt:
      "Açık ahşap, koyu ahşap, gold, gümüş ve siyah Dijivizit kartvizit kaplamaları üst üste",
    published: "2026-11-03",
    sections: [
      {
        heading: "İyi bir dijital kartvizitin ortak iskeleti",
        paragraphs: [
          "Mesleğiniz ne olursa olsun, iyi bir dijital kartvizit aynı iskelete oturur: üstte net bir fotoğraf, ad soyad ve tek satırlık unvan; hemen altında en çok kullandığınız iletişim kanalı; ardından sosyal medya, adres ve belgeler. Farkı yaratan, hangi bilginin en üstte durduğu ve profile hangi belgeyi eklediğinizdir.",
          "Aşağıdaki örnekler, farklı mesleklerde profilin nasıl kurulabileceğini anlatıyor. Dijivizit profilinde bağlantıların sırasını panelden değiştirebilir, her bağlantıya kendi etiketinizi verebilirsiniz.",
        ],
        link: { href: "/", label: "Dijital kartvizit" },
      },
      {
        heading: "Emlak danışmanı",
        paragraphs: [
          "Emlakta müşteri adayı çoğu zaman bir ilan ya da tabela üzerinden gelir ve hızlı dönüş bekler. Profilin amacı, kişinin sizi hemen rehberine kaydetmesi ve WhatsApp'tan yazabilmesidir.",
        ],
        list: [
          "En üstte WhatsApp ve telefon",
          "Ofis adresi; dokununca harita açılır",
          "Portföyü gösteren Instagram hesabı ve web sitesi",
          "Güncel portföy broşürü PDF olarak",
          'Ev arayan ziyaretçi için "Bilgilerimi bırak" formu',
        ],
        link: { href: "/dijital-kartvizit/emlakci", label: "Emlakçılar için dijital kartvizit" },
      },
      {
        heading: "Diyetisyen",
        paragraphs: [
          "Danışanlar diyetisyeni çoğu zaman Instagram'da keşfeder, randevuyu ise WhatsApp'tan alır. Profil bu iki adımı birleştirmeli.",
        ],
        list: [
          "WhatsApp ile randevu satırı en üstte",
          "Instagram hesabı",
          "Hakkında bölümünde kısa bir tanıtım ve çalıştığınız alanlar",
          "Muayenehane adresi ve online görüşme yapıyorsanız bunun notu",
        ],
        link: {
          href: "/dijital-kartvizit/diyetisyen",
          label: "Diyetisyenler için dijital kartvizit",
        },
      },
      {
        heading: "Avukat",
        paragraphs: [
          "Avukatlık mesleğinde tanıtım kurallarına uygun, sade ve bilgi odaklı bir profil en doğrusudur. Abartılı ifadeler yerine kim olduğunuzu ve size nasıl ulaşılacağını net yazın.",
        ],
        list: [
          "Ad soyad, unvan ve büro adı",
          "Büro telefonu, e-posta ve adres",
          "Uzmanlık alanları bölümünde çalıştığınız hukuk dalları",
          "LinkedIn profili",
          "Gerekirse büronun IBAN ve fatura bilgileri; yalnızca siz açarsanız görünür",
        ],
        link: { href: "/dijital-kartvizit/avukat", label: "Avukatlar için dijital kartvizit" },
      },
      {
        heading: "Kuaför ve güzellik salonu",
        paragraphs: [
          "Kuaförde kartvizit genellikle kasada ya da aynanın kenarında durur. Müşterinin bir sonraki randevuyu kolayca alması ve işlerinizi görmesi yeter.",
        ],
        list: [
          "WhatsApp randevu satırı",
          "İşlerinizi gösteren Instagram hesabı",
          "Salon adresi",
          "Hizmet ve fiyat listesi PDF olarak",
        ],
      },
      {
        heading: "Satış temsilcisi",
        paragraphs: [
          "Satışta kartvizit, fuarda ya da müşteri ziyaretinde başlayan bir sürecin ilk adımıdır. Profil hem kataloğu taşımalı hem de karşı tarafın bilgisini size geri getirmeli.",
        ],
        list: [
          "Telefon, e-posta ve LinkedIn",
          "Ürün kataloğu ve fiyat listesi PDF olarak",
          '"Bilgilerimi bırak" formu; gelen kişiler panelde Kişiler listesine düşer',
          "Her kişiye not ve takip hatırlatması; günü gelince e-postanıza hatırlatma gelir",
          "Analitik: kartınızın hangi şehirlerde ve kaç kez açıldığı",
        ],
        link: {
          href: "/rehber/kurumsal-dijital-kartvizit",
          label: "Ekipler için kurumsal dijital kartvizit",
        },
      },
      {
        heading: "Restoran ve kafe sahibi",
        paragraphs: [
          "Restoran sahibi için dijital kartvizit hem kişisel kart hem de işletmenin vitrini olabilir. Aynı profilin QR kodu masaya, kasaya ya da paket servis poşetine konabilir.",
        ],
        list: [
          "Rezervasyon için telefon ve WhatsApp",
          "Menü PDF olarak",
          "Adres; dokununca harita açılır",
          "Instagram hesabı ve web sitesi",
        ],
        link: { href: "/rehber/qr-kod-kartvizit", label: "QR kod kartvizit rehberi" },
      },
      {
        heading: "Kendi profilinizi kurarken",
        paragraphs: [
          "Örneklerdeki ortak nokta şu: her meslek için tek bir ana iletişim kanalı var ve o kanal en üstte. Kullanmadığınız hesapları eklemeyin, unvanınızı tek satırda tutun ve profilinize en fazla bir iki belge koyun. Bilgileriniz değiştiğinde profili güncellemeniz yeter; kart, QR ve bağlantı aynı kalır.",
        ],
        link: { href: "/dijital-kartvizit", label: "Dijital kartvizit özelliklerine bakın" },
      },
    ],
    faq: [
      {
        q: "Dijital kartvizite hangi sosyal medya hesaplarını ekleyebilirim?",
        a: "Dijivizit profilinde LinkedIn, Instagram ve X hesaplarınızı, ayrıca telefon, WhatsApp, e-posta ve web sitesi bağlantılarını ekleyebilirsiniz. Web sitesi bağlantılarına kendi etiketinizi verebilirsiniz.",
      },
      {
        q: "Profile PDF belge ekleyebilir miyim?",
        a: "Evet. Özgeçmiş, ürün kataloğu, fiyat listesi, broşür, sunum gibi en fazla 10 PDF belge ekleyebilirsiniz; her biri en fazla 10 MB olabilir.",
      },
      {
        q: "Bağlantıların sırasını değiştirebilir miyim?",
        a: "Evet. Panelden bağlantıları yukarı ya da aşağı taşıyabilir, istemediğinizi kartta gizleyebilirsiniz.",
      },
    ],
  },
  {
    slug: "kartvizite-ne-yazilir",
    label: "Kartvizite ne yazılır?",
    title: "Kartvizite Ne Yazılır? Kartvizitte Olması Gerekenler",
    description:
      "Kartvizite ne yazılır, kartvizitte neler olmalı? Kâğıt ve dijital kartvizit için ad, unvan, iletişim, logo ve QR kod kontrol listesi ve sık yapılan hatalar.",
    image: "/rehber/nfc-kartvizit-mi-kagit-kartvizit-mi.jpg",
    imageAlt: "Toplantı masasında siyah NFC kartvizit karşıdaki kişiye uzatılıyor",
    published: "2026-11-03",
    sections: [
      {
        heading: "Kısaca",
        paragraphs: [
          "Bir kartvizit tek bir soruya cevap verir: bu kişi kim ve ona nasıl ulaşırım? Kartvizite yazılan her bilgi bu soruya hizmet etmeli. Fazlası kartı kalabalıklaştırır, eksiği ise kartı işe yaramaz hâle getirir.",
        ],
      },
      {
        heading: "Kâğıt kartvizitte mutlaka olması gerekenler",
        paragraphs: [],
        list: [
          "Ad soyad: kartın en okunaklı yazısı olmalı.",
          "Unvan: ne iş yaptığınızı tek satırda anlatsın.",
          "Şirket adı ve logo",
          "Telefon: tek bir numara, ülke koduyla birlikte (+90).",
          "E-posta: mümkünse kişisel değil kurumsal adres.",
          "Web sitesi",
        ],
      },
      {
        heading: "İşinize göre eklenebilecekler",
        paragraphs: [],
        list: [
          "Adres: müşteri sizi ziyaret ediyorsa.",
          "Bir ya da iki sosyal medya hesabı: işinizi gerçekten orada anlatıyorsanız.",
          "Kısa bir slogan ya da hizmet listesi: unvan tek başına yetmiyorsa.",
          "QR kod: bilgilerinizi rehbere kaydettiren ya da dijital profilinize açılan.",
        ],
        link: {
          href: "/qr-kartvizit-olustur",
          label: "Kartvizitiniz için ücretsiz QR kod oluşturun",
        },
      },
      {
        heading: "Kartvizite yazılmaması gerekenler",
        paragraphs: [],
        list: [
          "Artık kullanmadığınız faks ya da sabit hat numaraları",
          "Birden fazla cep telefonu numarası",
          "Kişisel ya da takma adlı e-posta adresleri",
          "Aktif kullanmadığınız sosyal medya hesapları",
          "Okunması zor küçük yazılar ve süslü yazı tipleri",
        ],
      },
      {
        heading: "Dijital kartvizitte neler olmalı?",
        paragraphs: [
          "Dijital kartvizitte yer sınırı olmadığı için kâğıda sığmayan bilgileri ekleyebilirsiniz. Yine de ölçü aynıdır: karşınızdaki kişinin işine yarayacak olanı koyun.",
        ],
        list: [
          "Net ve güncel bir profil fotoğrafı",
          "Telefon, WhatsApp ve e-posta; en çok kullandığınız en üstte",
          "LinkedIn, Instagram ve web sitesi",
          "Adres; dokununca harita açılır",
          "Hakkında bölümü ve uzmanlık alanları",
          "Katalog, fiyat listesi ya da özgeçmiş gibi PDF belgeler",
          "Gerekiyorsa IBAN ve fatura bilgileri",
        ],
        link: {
          href: "/rehber/dijital-kartvizit-nasil-olusturulur",
          label: "Dijital kartvizit nasıl oluşturulur?",
        },
      },
      {
        heading: "NFC kartvizitin üzerine ne yazılır?",
        paragraphs: [
          "NFC kartvizitte iletişim bilgileriniz kartın içindeki bağlantıyla açılan profilde durur. Bu yüzden kartın yüzeyini sade tutabilirsiniz. Dijivizit kartlarında adınız yazmaz; Dijivizit logosu ve temassız işareti metal yüzeye lazerle kazınır ya da ahşaba lazerle yakılır (10 ve üzeri kurumsal siparişte firma logonuz). Kartın arka yüzü boştur; aynı profile açılan QR kodunuz ise dijital olarak sizdedir.",
          "Numaranız ya da unvanınız değiştiğinde kartı yeniden bastırmazsınız; profilinizi güncellersiniz.",
        ],
        link: { href: "/nfc-kartvizit", label: "NFC kartvizit modelleri" },
      },
      {
        heading: "Tasarım ve baskı için birkaç ipucu",
        paragraphs: [],
        list: [
          "Türkiye'de standart kartvizit ölçüsü 85 x 55 mm'dir; cüzdana ve kartlığa bu ölçü sığar.",
          "Kartta en fazla iki yazı tipi kullanın.",
          "QR kodun kenarı en az 2 cm olsun ve etrafında boşluk bırakın.",
          "Baskıdan önce telefon numarasını ve e-postayı bir kez daha okuyun; en sık hata buradadır.",
        ],
      },
    ],
    faq: [
      {
        q: "Kartvizitin arka yüzüne ne yazılır?",
        a: "Arka yüz genellikle logo, slogan, hizmet listesi ya da QR kod için kullanılır. Ön yüzü kalabalıklaştırmamak için QR kodu arkaya koymak iyi bir tercihtir.",
      },
      {
        q: "Kartvizitte adres yazmak zorunlu mu?",
        a: "Hayır. Müşteri sizi ofisinizde ya da mağazanızda ziyaret etmiyorsa adres yazmanız gerekmez. Dijital kartvizitte adresi dilerseniz profilinize ekleyebilirsiniz; dokununca harita açılır.",
      },
      {
        q: "Kartvizitte kişisel cep numarası mı, iş numarası mı yazılmalı?",
        a: "Size en hızlı ulaşılan tek numarayı yazın. İş ve özel hayatınızı ayırmak istiyorsanız iş numaranızı tercih edin.",
      },
    ],
  },
  {
    slug: "linktree-alternatifi",
    label: "Linktree alternatifi",
    title: "Linktree Alternatifi: Link-in-Bio mi, Dijital Kartvizit mi?",
    description:
      "Linktree alternatifi mi arıyorsunuz? Link-in-bio araçları ile dijital kartvizitin farkları: rehbere kaydet, NFC kart, QR kod ve analitikte hangisi uygun?",
    image: "/rehber/dijital-kartvizit-nedir.jpg",
    imageAlt: "Siyah NFC kartvizit telefona dokunduruluyor, ekranda dijital kartvizit profili açık",
    published: "2026-11-03",
    sections: [
      {
        heading: "İki araç, iki farklı amaç",
        paragraphs: [
          "Linktree ve benzeri link-in-bio araçları, sosyal medya biyografisine tek bir bağlantı koyup o bağlantının arkasında birçok linki listelemek için tasarlanmıştır. İçerik üreticileri, markalar ve sanatçılar için takipçiyi YouTube videosuna, mağazaya ya da yeni bir kampanyaya yönlendirmenin pratik bir yoludur.",
          "Dijital kartvizit ise tanıştığınız kişinin sizi kaydetmesi ve size ulaşması için tasarlanır. Öncelik link sayısı değil; telefon, WhatsApp, e-posta ve rehbere kayıttır. Hangisinin daha iyi olduğu, ne yapmak istediğinize bağlıdır.",
        ],
        link: { href: "/", label: "Dijital kartvizit" },
      },
      {
        heading: "Link-in-bio aracı ne zaman daha uygun?",
        paragraphs: [],
        list: [
          "Takipçilerinizi çok sayıda farklı linke yönlendiriyorsanız",
          "YouTube, TikTok, podcast ya da online mağaza gibi kanallarınız varsa",
          "Linklerinizi kampanyalara göre sık sık değiştiriyorsanız",
          "Kitleniz sizinle yüz yüze değil, sosyal medyada tanışıyorsa",
        ],
      },
      {
        heading: "Dijital kartvizit ne zaman daha uygun?",
        paragraphs: [],
        list: [
          "İnsanlarla toplantıda, fuarda, mağazada yüz yüze tanışıyorsanız",
          "Karşınızdakinin sizi telefon rehberine kaydetmesini istiyorsanız",
          "Kâğıt kartvizitin yerine fiziksel bir kart arıyorsanız",
          "Katalog, fiyat listesi ya da özgeçmiş gibi belgeleri paylaşıyorsanız",
          "Profilinizi açanların kendi bilgilerini size bırakabilmesini istiyorsanız",
        ],
      },
      {
        heading: "Rehbere kaydet: en belirgin fark",
        paragraphs: [
          'Bir link sayfası, ziyaretçiyi başka sayfalara yönlendirir; ziyaretçi sayfayı kapattığında genellikle elinde size dair bir kayıt kalmaz. Dijital kartvizitte "Rehberime Kaydet" düğmesi; adınızı, şirketinizi, unvanınızı, telefonlarınızı, e-postanızı, adresinizi ve web bağlantılarınızı vCard olarak tek seferde karşı tarafın telefon rehberine ekler.',
        ],
      },
      {
        heading: "NFC kart ve QR kod",
        paragraphs: [
          "Link-in-bio sayfaları çoğunlukla bir bağlantı olarak paylaşılır. Dijital kartvizitte aynı profil, telefona dokundurulan bir NFC kartla, kamerayla okutulan bir QR kodla ya da bir bağlantıyla açılır. Dijivizit'te PVC, metal ve ahşap NFC kartlarla birlikte aynı profile giden link ve QR kod verilir; kartsız dijital kartvizitte de profil linki ve QR kod verilir.",
        ],
        link: { href: "/nfc-kartvizit", label: "NFC kartvizit nasıl çalışır?" },
      },
      {
        heading: "Analitik ve geri dönüş",
        paragraphs: [
          'Link-in-bio araçlarının birçoğu tıklama istatistiği sunar. Dijital kartvizitte bunun yanında iki yönlü bir akış vardır: Dijivizit profilini açan kişi "Bilgilerimi bırak" ile adını ve numarasını size iletir, bu kişiler panelde Kişiler listesine düşer ve her birine takip hatırlatması kurabilirsiniz. Analitik panelinde profilinizin kaç kez açıldığını, hangi şehirlerden ve cihazlardan görüntülendiğini, kaç kişinin sizi rehberine kaydettiğini görürsünüz.',
        ],
      },
      {
        heading: "İkisini birlikte kullanmak",
        paragraphs: [
          "Çoğu zaman en doğru cevap birini diğerinin yerine koymak değil, ikisini doğru yerde kullanmaktır. Sosyal medya biyografinizde link-in-bio sayfanız dursun; yüz yüze tanışmalarda dijital kartvizitinizi verin. Dijivizit profilinize web sitesi bağlantısı olarak link-in-bio sayfanızı da kendi etiketiyle ekleyebilirsiniz.",
          "Dijivizit profili bir link koleksiyonu değil, bir kartvizittir: telefon, WhatsApp, e-posta, web sitesi, LinkedIn, Instagram, X, adres ve PDF belgeler için tasarlanmıştır. Onlarca farklı platforma link vermeniz gerekiyorsa link-in-bio aracı bu iş için daha uygundur.",
        ],
        link: { href: "/dijital-kartvizit", label: "Dijital kartvizitte neler var?" },
      },
    ],
    faq: [
      {
        q: "Dijital kartvizit Linktree'nin yerini tutar mı?",
        a: "Amacınız yüz yüze tanıştığınız kişilerin sizi kaydetmesi ve size ulaşmasıysa evet. Amacınız sosyal medya takipçilerini çok sayıda linke yönlendirmekse link-in-bio aracı daha uygundur; ikisi birlikte de kullanılabilir.",
      },
      {
        q: "Dijital kartvizit linkimi Instagram biyografisine koyabilir miyim?",
        a: "Evet. Profil linkiniz her yerde paylaşılabilir; Instagram biyografisine eklediğinizde profilinizi açan kişi sizi tek dokunuşla rehberine kaydedebilir.",
      },
      {
        q: "Profil linkimde adım görünür mü?",
        a: "Hayır. Dijivizit profil adresi adınızı değil rastgele bir kodu içerir; linki bilmeyen biri profilinizi tahmin edemez.",
      },
      {
        q: "Dijital kartvizit için uygulama gerekir mi?",
        a: "Hayır. Profil telefonun tarayıcısında açılır; ne sizin ne de karşınızdaki kişinin uygulama indirmesi gerekir.",
      },
    ],
  },
  {
    slug: "akilli-kartvizit-nedir",
    label: "Akıllı kartvizit nedir?",
    title: "Akıllı Kartvizit Nedir? Nasıl Çalışır, Ne İşe Yarar?",
    description:
      "Akıllı kartvizit nedir, nasıl çalışır? NFC çip, QR kod ve dijital profilden oluşan akıllı kartvizitin kâğıt kartvizitten farkları, özellikleri ve fiyatı.",
    image: "/rehber/nfc-kartvizit-nedir.jpg",
    imageAlt: "Siyah metal NFC kartvizit telefonun arkasına dokunuyor, ekranda dijital profil açık",
    published: "2026-11-03",
    sections: [
      {
        heading: "Kısaca akıllı kartvizit",
        paragraphs: [
          "Akıllı kartvizit, içinde NFC çip bulunan ve bilgilerinizi kartın üzerine basmak yerine internetteki dijital profilinize bağlayan kartvizittir. Kartı karşınızdaki kişinin telefonuna yaklaştırdığınızda profiliniz açılır; kişi sizi tek dokunuşla rehberine kaydeder.",
          "Akıllı kartvizit, NFC kartvizit ve dijital kartvizit çoğu zaman aynı anlamda kullanılır. Doğrusu şu: akıllı kartvizit üç parçanın birleşimidir.",
        ],
        link: { href: "/akilli-kartvizit", label: "Akıllı kartvizit" },
      },
      {
        heading: "Üç parça: NFC, QR ve dijital profil",
        paragraphs: [],
        list: [
          "NFC çip: Kartın içindedir, telefona dokundurulunca profilinizi açar. Pili yoktur, şarj edilmez; enerjisini telefondan alır.",
          "QR kod: Profilinize aittir ve telefonunuzda durur. NFC'si olmayan ya da kapalı olan telefonlar onu ekranınızdan okutarak aynı profili açar.",
          "Dijital profil: Fotoğrafınız, iletişim bilgileriniz, sosyal medya hesaplarınız, adresiniz ve belgeleriniz bu sayfada durur. Bilgileriniz değişince yalnızca profili güncellersiniz.",
        ],
        link: { href: "/rehber/nfc-kartvizit-nedir", label: "NFC kartvizit nasıl çalışır?" },
      },
      {
        heading: "Kâğıt kartvizitten ne farkı var?",
        paragraphs: [
          "Kâğıt kartvizit verildiği anda işini bitirir; bilgilerin rehbere girmesi, karşı tarafın onları elle yazmasına bağlıdır. Akıllı kartvizitte iş, kart verildikten sonra devam eder:",
        ],
        list: [
          "Karşı taraf sizi yazım hatası olmadan, tek dokunuşla rehberine kaydeder.",
          'Ziyaretçi "Bilgilerimi bırak" ile kendi bilgisini size iletir.',
          "Kartınızın kaç kez, hangi şehirlerden ve cihazlardan açıldığını görürsünüz.",
          "Numaranız ya da unvanınız değişince yeniden baskı gerekmez.",
          "Kart kaybolursa panelden tek tıkla kapatırsınız.",
        ],
        link: {
          href: "/rehber/nfc-kartvizit-mi-kagit-kartvizit-mi",
          label: "NFC mi kâğıt mı? Karşılaştırma",
        },
      },
      {
        heading: "Uygulama gerekir mi?",
        paragraphs: [
          "Hayır. Profil telefonun tarayıcısında açılır. Güncel iPhone'lar NFC'yi kendiliğinden okur; Android telefonlarda NFC'nin açık olması yeterlidir. Kart yanınızda değilken profilinizi Apple Cüzdan'a ekleyip telefonunuzdaki QR'ı da gösterebilirsiniz.",
        ],
        link: { href: "/rehber/telefonda-nfc-nasil-acilir", label: "Telefonda NFC nasıl açılır?" },
      },
      {
        heading: "Gizlilik ve güvenlik",
        paragraphs: [
          "Dijivizit profil adresi adınızı değil rastgele bir kodu içerir; linki bilmeyen biri profilinizi tahmin edemez. IBAN ve fatura bilgileri siz açmadıkça profilde görünmez. Kartı okutmak, okutan kişinin telefonundaki bilgileri paylaşmaz; yalnızca karttaki bağlantı okunur.",
        ],
      },
      {
        heading: "Şirketler için akıllı kartvizit",
        paragraphs: [
          "Ekip panelinde tüm çalışan kartlarını tek yerden yönetirsiniz. Bir çalışan ayrıldığında fiziksel kart yeniden basılmaz; kartın kimin profilini açacağını değiştirirsiniz. 10 ve üzeri adette %20 indirim uygulanır.",
        ],
        link: { href: "/rehber/kurumsal-dijital-kartvizit", label: "Kurumsal dijital kartvizit" },
      },
      {
        heading: "Malzeme ve fiyat",
        paragraphs: [
          "Dijivizit akıllı kartvizitleri mat siyah PVC, mat siyah metal, fırçalanmış gümüş, fırçalanmış gold, koyu ahşap ve açık ahşap kaplamalarda üretilir. Metal kartlar 4.000 TL, ahşap ve PVC kartlar 2.500 TL'dir; KDV dahil, kargo ücretsizdir. Kartlar 72 saatte teslim edilir, okunmayan kart ücretsiz yenisiyle değiştirilir. Dijital profil ilk yıl ücretsizdir, sonrasında aylık 59,90 TL'dir.",
        ],
        link: { href: "/akilli-kartvizit", label: "Akıllı kartvizit modellerine bakın" },
      },
    ],
    faq: [
      {
        q: "Akıllı kartvizit ile NFC kartvizit aynı şey mi?",
        a: "Genellikle aynı anlamda kullanılır. Akıllı kartvizit; NFC kart, profil QR kodu ve dijital profilin birlikte sunulmasıdır.",
      },
      {
        q: "Akıllı kartvizitin pili biter mi?",
        a: "Hayır. NFC çipin pili yoktur; enerjisini okuyan telefondan alır. Kart şarj gerektirmez.",
      },
      {
        q: "Kartı kaybedersem ne olur?",
        a: "Panelde Kartlarım sayfasından o kartı kapatırsınız; kart artık profilinizi açmaz, diğer kartlarınız çalışmaya devam eder.",
      },
      {
        q: "Fiziksel kart olmadan akıllı kartvizit kullanabilir miyim?",
        a: "Evet. Kartsız dijital kartvizitte profil linki ve QR kod verilir; aylık 59,90 TL'dir ve yıllık 718,80 TL olarak ödenir. İstediğiniz zaman NFC karta geçebilirsiniz.",
      },
    ],
  },
  {
    slug: "instagram-kartvizit",
    label: "Instagram kartvizit",
    title: "Instagram Kartvizit: QR Kod ve NFC ile Profil Paylaşma",
    description:
      "Instagram kartvizit nasıl yapılır? Instagram QR kodu, NFC kart ve dijital kartvizitle hesabınızı paylaşın; mağaza sahipleri ve içerik üreticileri için rehber.",
    image: "/rehber/qr-kod-kartvizit.jpg",
    imageAlt: "Deri kartlıktan çıkarılan siyah Dijivizit NFC kartvizit",
    published: "2026-11-03",
    sections: [
      {
        heading: "Instagram'ı kartvizitle paylaşmanın üç yolu",
        paragraphs: [
          "Instagram hesabınızı yüz yüze tanıştığınız birine göstermek için kullanıcı adınızı hecelemenize gerek yok. Üç yöntem var:",
        ],
        list: [
          "Instagram'ın kendi QR kodu: Uygulamanın profil paylaşım menüsünde bulunur ve doğrudan Instagram profilinizi açar.",
          "Kartvizite basılı QR kod: Kâğıt ya da NFC kartvizitin üzerinde durur, okutan kişiyi profilinize götürür.",
          "NFC kart: Telefona dokundurulur, kamera açmaya gerek kalmaz.",
        ],
      },
      {
        heading: "Sadece Instagram QR'ı yeterli mi?",
        paragraphs: [
          "Instagram'ın QR kodu ücretsizdir ve takipçi kazanmak için işe yarar. Ancak yalnızca Instagram profilinizi açar: karşınızdaki kişi sizi rehberine kaydedemez, telefonunuzu ya da WhatsApp'ınızı görmek için profilinizdeki bilgilere tek tek bakmak zorunda kalır.",
          "Dijital kartvizitte Instagram hesabınız profilinizdeki satırlardan biridir. Aynı sayfada WhatsApp, telefon, e-posta, adres ve web siteniz de durur; kişi sizi tek dokunuşla rehberine kaydettiğinde Instagram adresiniz de kişi kaydına eklenir.",
        ],
      },
      {
        heading: "Mağaza ve butik sahipleri için",
        paragraphs: [
          "Instagram'dan satış yapan bir mağaza için kartvizit, müşteriyi hem takipçiye hem de alıcıya çevirmenin aracıdır.",
        ],
        list: [
          "Dijital kartvizitinizin QR kodunu kasaya, vitrine ve kargo paketine koyun.",
          "Profilde Instagram'ın yanına sipariş için WhatsApp satırı ekleyin.",
          "Ürün kataloğunu ya da fiyat listesini PDF olarak ekleyin.",
          "Mağaza adresini ekleyin; dokununca harita açılır.",
          "Analitikte profilinizin kaç kez, hangi şehirlerden açıldığına bakın.",
        ],
      },
      {
        heading: "İçerik üreticileri ve influencer'lar için",
        paragraphs: [
          "Etkinliklerde ve marka toplantılarında sizi hatırlatacak olan, takipçi sayınız kadar ulaşılabilir olmanızdır. Dijital kartvizit bu iki ihtiyacı aynı sayfada karşılar.",
        ],
        list: [
          "Instagram, X ve LinkedIn hesaplarınızı ekleyin; bağlantıların sırasını değiştirip Instagram'ı en üste alın.",
          "İş birlikleri için ayrı bir e-posta adresi ekleyin.",
          "Medya kitinizi ya da sunumunuzu PDF olarak profile koyun.",
          'Markaların temsilcileri "Bilgilerimi bırak" ile size iletişim bilgilerini iletsin.',
        ],
        link: {
          href: "/rehber/linktree-alternatifi",
          label: "Link-in-bio mi, dijital kartvizit mi?",
        },
      },
      {
        heading: "Instagram biyografisine dijital kartvizit linki",
        paragraphs: [
          "Dijital kartvizit linkinizi Instagram biyografinize de koyabilirsiniz. Profilinizi biyografiden açan kişi size WhatsApp'tan yazabilir ya da sizi rehberine kaydedebilir. Dijivizit profil adresi adınızı değil rastgele bir kodu içerdiği için linkiniz tahmin edilemez.",
        ],
      },
      {
        heading: "Kartlı ya da kartsız başlayın",
        paragraphs: [
          "Fiziksel karta ihtiyacınız yoksa kartsız dijital kartvizitle başlayabilirsiniz: profil linkiniz ve QR kodunuz 2 saat içinde e-postanıza gelir; aylık 59,90 TL'dir, yıllık 718,80 TL olarak ödenir. Yüz yüze tanışmalar için PVC, metal ya da ahşap NFC kartvizite geçtiğinizde link ve QR kodunuz aynı kalır.",
          "Önce denemek isterseniz ücretsiz araçla bilgilerinizi rehbere kaydeden bir QR kod oluşturabilirsiniz.",
        ],
        link: {
          href: "/kartvizit/dijital-kartvizit-qr",
          label: "Kartsız dijital kartvizit (link + QR)",
        },
      },
    ],
    faq: [
      {
        q: "Instagram QR kodu nasıl alınır?",
        a: "Instagram uygulamasında profilinizi açıp profil paylaşım seçeneklerinden QR kodunuza ulaşabilirsiniz. Menü adları uygulama sürümüne göre değişebilir.",
      },
      {
        q: "Kartvizite Instagram kullanıcı adı yazılır mı?",
        a: "Instagram işiniz için önemli bir kanalsa evet. Kâğıt kartvizitte kullanıcı adını @ ile yazın; dijital kartvizitte Instagram satırı profilinizi doğrudan açar.",
      },
      {
        q: "NFC kart doğrudan Instagram'ı açabilir mi?",
        a: "Dijivizit kartları dijital profilinizi açar; Instagram hesabınız bu profilde bir dokunuşla açılan satırlardan biridir. Böylece kişi aynı anda sizi rehberine de kaydedebilir.",
      },
    ],
  },
  {
    slug: "dijital-kartvizit-aylik-ucret-var-mi",
    label: "Dijital kartvizit aylık ücret",
    title: "Dijital Kartvizitte Aylık Ücret Var mı? Abonelik Modelleri",
    description:
      "Dijital kartvizit aylık ücret alır mı? Tek seferlik ödeme ile abonelik modellerinin farkı, gizli maliyetler ve Dijivizit'te ilk yıldan sonra ne ödersiniz.",
    image: "/rehber/en-iyi-dijital-kartvizit-nasil-secilir.jpg",
    imageAlt: "Elde tutulan mat siyah Dijivizit NFC kartvizit",
    published: "2026-11-05",
    updated: "2026-11-13",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Markaya göre değişir. Bazı firmalar kartı tek seferlik satar, bazıları profil için aylık ya da yıllık abonelik alır. Dijivizit'te kart fiyatına ilk yılın dijital profili dahildir; sonrasında aylık 59,90 TL'dir ve otomatik çekim yapılmaz. Kart istemeyenler için kartsız dijital kartvizit yıllık 718,80 TL'dir.",
        ],
        link: { href: "/", label: "Dijital kartvizit" },
      },
      {
        heading: "Neden bir dijital kartvizit sürekli ücret alır?",
        paragraphs: [
          "NFC kartın kendisi yalnızca bir bağlantı taşır. Kartı okuttuğunuzda açılan profil, sizin bilgilerinizi saklayan, güncellemelerinizi yayına alan ve görüntülenmeleri sayan bir sunucuda çalışır. Bu altyapının, e-posta bildirimlerinin ve desteğin sürekli bir maliyeti vardır.",
          "Bu yüzden ödeme modeli ne olursa olsun bir soruyu mutlaka sorun: profilim yıllar sonra da açılacak mı, açılacaksa bunun bedelini kim, nasıl ödüyor?",
        ],
      },
      {
        heading: "Üç yaygın ödeme modeli",
        paragraphs: [],
        list: [
          "Tek seferlik ödeme: Kartı bir kez alırsınız, profil için ayrıca ödeme istenmez. Gelişmiş özellikler çoğu zaman ayrı bir pakette olur.",
          "Kart + abonelik: Kart bir kez ödenir, profil için aylık ya da yıllık ücret alınır. Analitik, form ve ekip paneli genellikle bu modelde yer alır.",
          "Yalnızca abonelik: Fiziksel kart olmadan profil linki ve QR kod için düzenli ödeme yapılır.",
          "Ücretsiz katman: Bazı markalar sınırlı bir ücretsiz profil sunar; kart, analitik ya da ekip özellikleri ücretlidir.",
        ],
        link: {
          href: "/rehber/ucretsiz-dijital-kartvizit",
          label: "Ücretsiz dijital kartvizit ne verir?",
        },
      },
      {
        heading: "Dijivizit'te ne ödersiniz?",
        paragraphs: [
          "Fiyatlara KDV dahildir, kargo ücretsizdir. Kartla birlikte gelen dijital profil ilk yıl ücretsizdir; sonrasında aylık 59,90 TL'dir. Kartsız dijital kartvizit yıllık olarak peşin ödenir. Otomatik yenileme ve otomatik çekim yapılmaz.",
        ],
        list: [
          `Mat siyah PVC NFC kart: ${formatTry(PVC_PRICE)}, ilk yıl profil dahil`,
          `Koyu ya da açık ahşap NFC kart: ${formatTry(WOOD_PRICE)}, ilk yıl profil dahil`,
          `Siyah, gümüş ya da gold metal NFC kart: ${formatTry(METAL_PRICE)}, ilk yıl profil dahil`,
          `İlk yıldan sonra profil: aylık ${formatTry(PRICING.profileMonthlyFee)}`,
          `Kartsız dijital kartvizit (link + QR): aylık ${formatTry(DIGITAL_MONTHLY)}, yıllık ${formatTry(PRICING.digitalYearlyFee)} peşin`,
          `${PRICING.bulkMinQuantity} ve üzeri adet: %${PRICING.bulkDiscountPercent} indirim`,
        ],
        link: { href: "/kartvizit", label: "Tüm fiyatlar" },
      },
      {
        heading: "Örnek hesap: 3 yılda toplam maliyet",
        paragraphs: [
          "Mat siyah PVC kartla başlayan biri için: kart 2.500 TL, ilk yıl profil dahil; ikinci ve üçüncü yıl 2 × 718,80 = 1.437,60 TL. Üç yılın toplamı 3.937,60 TL olur, yani yılda ortalama yaklaşık 1.312 TL.",
          "Kartsız dijital kartvizitte aynı üç yıl 3 × 718,80 = 2.156,40 TL tutar. Fiziksel kart istemiyorsanız daha düşük maliyetli seçenek budur; yüz yüze tanışmalarınız çoksa kart, karşı tarafın sizi saniyeler içinde kaydetmesini sağlar.",
        ],
      },
      {
        heading: "Abonelik seçerken sorulacak sorular",
        paragraphs: [],
        list: [
          "İlk yıldan sonra ne kadar ödeyeceğim, fiyat sitede açıkça yazıyor mu?",
          "Ödeme otomatik mi çekiliyor, iptal etmek için ne yapmam gerekiyor?",
          "Ödemeyi bırakırsam kartım ve profilim ne olur?",
          "Fiyata KDV ve kargo dahil mi?",
          "Rehbere kayıt, analitik, form ve kayıp kart kapatma hangi pakette?",
        ],
        link: {
          href: "/rehber/en-iyi-dijital-kartvizit-nasil-secilir",
          label: "Dijital kartvizit seçerken 7 kriter",
        },
      },
      {
        heading: "Ücrete neler dahil?",
        paragraphs: [
          "Dijivizit profil ücreti; profil linkinizi, rehbere kaydet düğmesini, ziyaretçinin bilgilerini bıraktığı formu, kişi listesi ve takip hatırlatmalarını, kâğıt kartvizit taramayı, şehir ve cihaz bazında analitiği, kayıp kartı kapatmayı ve Apple Cüzdan kartını kapsar. Kart ve profil için ayrıca uygulama satın almanız gerekmez.",
        ],
        link: { href: "/dijital-kartvizit", label: "Dijital kartvizit özellikleri" },
      },
    ],
    faq: [
      {
        q: "Dijivizit'te aylık ödeme otomatik çekilir mi?",
        a: "Hayır. Otomatik yenileme ve otomatik çekim yapılmaz. Kartsız dijital kartvizit yıllık olarak peşin ödenir; kartla gelen profil ilk yıl ücretsizdir.",
      },
      {
        q: "Kart fiyatına profil dahil mi?",
        a: "Evet, ilk yıl için. PVC ve ahşap kartlar 2.500 TL, metal kartlar 4.000 TL'dir; ilk yıl dijital profil ücretsizdir, sonrasında aylık 59,90 TL'dir.",
      },
      {
        q: "Abonelik istemiyorum, tek seferlik dijital kartvizit var mı?",
        a: "Bilgileri doğrudan QR koda yazan ücretsiz araçla tek seferlik ve süresiz bir QR kartvizit oluşturabilirsiniz. Güncellenebilen profil, analitik ve form ise sürekli çalışan bir altyapı gerektirdiği için ücretlidir.",
      },
      {
        q: "Ekipler için fiyat farklı mı?",
        a: "10 ve üzeri adette kartlarda ve kartsız dijital kartvizitte %20 indirim uygulanır; kurumsal siparişlerde kartlara firma logosu işlenir.",
      },
    ],
  },
  {
    slug: "nfc-kartvizit-guvenli-mi",
    label: "NFC kartvizit güvenli mi?",
    title: "NFC Kartvizit Güvenli mi? Kopyalanır mı, KVKK'ya Uygun mu?",
    description:
      "NFC kartvizit güvenli mi, kopyalanır mı, telefondan veri çalar mı? NFC çipte ne saklanır, kayıp kartta ne yapılır ve KVKK açısından nelere dikkat edilir.",
    image: "/rehber/nfc-kartvizit-nedir.jpg",
    imageAlt: "Siyah metal NFC kartvizit telefonun arkasına dokunuyor, ekranda dijital profil açık",
    published: "2026-11-05",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Evet, doğru kullanıldığında güvenlidir. NFC kartvizitin çipinde para, şifre ya da telefon verisi değil, yalnızca profilinize giden bir bağlantı bulunur. Kart okutulduğunda okutan kişinin telefonundan hiçbir bilgi alınmaz. Risk karttan çok profilde ne paylaştığınızdadır; bu yüzden gizlilik ayarları ve kayıp kartı kapatabilmek önemlidir.",
        ],
      },
      {
        heading: "NFC çipte ne saklanır?",
        paragraphs: [
          "Kartvizitlerde kullanılan NFC etiketleri birkaç yüz baytlık küçük bir hafızaya sahiptir. Bu hafızaya genellikle tek bir web adresi yazılır. Telefon kartı okuduğunda bu adresi tarayıcıda açar; adınız, telefonunuz ve diğer bilgileriniz kartta değil, bu adresteki profilde durur.",
          "Banka kartındaki temassız ödeme de NFC kullanır, ancak orada şifreli bir ödeme çipi vardır. Kartvizitteki etiket ödeme bilgisi taşımaz ve ödeme yapamaz.",
        ],
      },
      {
        heading: "Kartvizit kopyalanabilir mi?",
        paragraphs: [
          "Karttaki bağlantı okunabilir ve başka bir etikete yazılabilir. Ancak bunu yapan kişinin eline geçen şey, kartınızı okutan herkesin zaten görebildiği profil bağlantısıdır. Profilinize giriş yapamaz, bilgilerinizi değiştiremez.",
          "Asıl önemli olan, profilde neyin herkese açık olduğudur. Göstermek istemediğiniz bir bilgiyi profile hiç koymayın ya da gizli olarak işaretleyin.",
        ],
      },
      {
        heading: "Telefondan veri çalınabilir mi?",
        paragraphs: [
          "Hayır. Kartvizit okutmak, okutan kişinin rehberini, fotoğraflarını ya da konumunu paylaşmaz. NFC yalnızca birkaç santimetre mesafede ve telefonun ekranı açıkken çalışır. Telefon karttaki bağlantıyı okur, ekranda gösterir; bağlantıyı açmak yine kullanıcının elindedir.",
        ],
        link: { href: "/rehber/nfc-kartvizit-nedir", label: "NFC kartvizit nasıl çalışır?" },
      },
      {
        heading: "Dijivizit'te güvenlik önlemleri",
        paragraphs: [],
        list: [
          "Profil adresi adınızı değil rastgele bir kodu içerir; linki bilmeyen profilinizi tahmin edemez.",
          "IBAN ve fatura bilgileri siz açmadıkça profilde görünmez.",
          "Gizli olarak işaretlediğiniz bağlantı ve belgeler herkese açık değildir.",
          "Kaybolan kartı panelde Kartlarım sayfasından tek tıkla kapatırsınız; diğer kartlarınız çalışmaya devam eder.",
          "Profili yayından kaldırdığınızda profil adresi artık açılmaz.",
        ],
      },
      {
        heading: "KVKK açısından ne bilinmeli?",
        paragraphs: [
          "Dijital kartvizitte üç tür veri vardır: sizin yayınladığınız profil bilgileri, profili açanların görüntüleme kayıtları ve ziyaretçinin kendi isteğiyle bıraktığı iletişim bilgileri. Hizmet sağlayıcının bu verileri nasıl işlediğini aydınlatma metninde açıkça yazması gerekir.",
        ],
        list: [
          "Dijivizit, profil ziyaretçilerinin adını ya da iletişim bilgisini toplamaz; görüntüleme ve tıklamaları rastgele bir ziyaretçi kimliğiyle sayar.",
          "IP adresinden yaklaşık ülke ve şehir bulunur; IP adresinin kendisi saklanmaz.",
          "Görüntüleme ve tıklama kayıtları en fazla 13 ay tutulur, sonra otomatik silinir.",
          '"Bilgilerimi bırak" formuyla gelen bilgiler yalnızca kart sahibine iletilir.',
          "Hesabınızı sildiğinizde profiliniz, kişi listeniz ve istatistikleriniz kalıcı olarak silinir.",
        ],
        link: { href: "/yasal/kvkk", label: "KVKK aydınlatma metni" },
      },
      {
        heading: "Güvenli kullanım için 4 öneri",
        paragraphs: [],
        list: [
          "Profilde yalnızca tanıştığınız herkesin görmesinde sakınca olmayan bilgileri yayınlayın.",
          "Ev adresi yerine iş adresi kullanın.",
          "Kartı kaybettiğinizde hemen panelden kapatın.",
          "Şirket kartlarında çalışan ayrıldığında kartı yeni kişiye atayın ya da kapatın.",
        ],
      },
    ],
    faq: [
      {
        q: "NFC kartvizit banka kartımı etkiler mi?",
        a: "Hayır. Kartvizitteki etiket ödeme yapamaz ve banka kartınızın bilgilerini okuyamaz. İki kartı cüzdanda yan yana taşımak sorun yaratmaz.",
      },
      {
        q: "Biri kartımı okutup profilimi değiştirebilir mi?",
        a: "Hayır. Profilinizi yalnızca kendi hesabınızla giriş yaparak panelden düzenleyebilirsiniz. Kartı okutmak sadece profilinizi görüntüler.",
      },
      {
        q: "Kartımı kaybedersem ne yapmalıyım?",
        a: "Panelde Kartlarım sayfasından o kartı kapatın. Kart artık profilinizi açmaz; yeni bir kart sipariş ettiğinizde profiliniz aynen devam eder.",
      },
      {
        q: "Dijivizit verileri nerede saklıyor?",
        a: "Veriler Supabase ve Cloudflare gibi altyapı sağlayıcılarında barındırılır. Hangi sağlayıcının hangi veriyi işlediği KVKK aydınlatma metninde listelenir.",
      },
    ],
  },
  {
    slug: "nfc-kartvizit-okumuyor",
    label: "NFC kartvizit okumuyor",
    title: "NFC Kartvizit Okumuyor mu? iPhone ve Android Çözümleri",
    description:
      "NFC kartvizit okumuyor ya da iPhone kartı görmüyor mu? NFC kapalı, kılıf, yanlış okuma noktası ve eski model sorunları için adım adım çözüm ve QR yedeği.",
    image: "/rehber/telefonda-nfc-nasil-acilir.jpg",
    imageAlt:
      "Siyah NFC kartvizit telefonun arkasına yaklaştırılmış, ekranda dijital kartvizit profili açık",
    published: "2026-11-05",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "NFC kartvizit okunmuyorsa sorun çoğu zaman karttan değil telefondan kaynaklanır: Android'de NFC kapalıdır, kart telefonun okuma noktasına tutulmamıştır, kalın ya da metal kılıf sinyali keser veya telefon NFC etiketi okumayan eski bir modeldir. Bu sırada profilinizin QR kodunu kendi ekranınızdan okutarak profili hemen açabilirsiniz.",
        ],
      },
      {
        heading: "1. Android'de NFC açık mı?",
        paragraphs: [
          "Android telefonlarda NFC ayarı kapatılabilir. Bildirim panelini aşağı çekip NFC kutucuğuna bakın ya da Ayarlar'ın arama kutusuna NFC yazın. Bazı telefonlarda ekran kilitliyken NFC okunmaz; kilidi açıp yeniden deneyin.",
        ],
        link: { href: "/rehber/telefonda-nfc-nasil-acilir", label: "Telefonda NFC nasıl açılır?" },
      },
      {
        heading: "2. Kartı doğru yere tutun",
        paragraphs: [
          "NFC yalnızca birkaç santimetre mesafede çalışır ve okuma noktası telefona göre değişir.",
        ],
        list: [
          "iPhone: arka yüzün üst kısmı, kameraların yakını",
          "Çoğu Android: arka yüzün ortası",
          "Mesafe: 1–4 cm; kartı 1–2 saniye sabit tutun",
          "Ekran açık olmalı; iPhone'da kamera ya da Cüzdan açıkken okuma çalışmayabilir",
        ],
      },
      {
        heading: "3. Kılıfı kontrol edin",
        paragraphs: [
          "Metal plakalı, mıknatıslı (araç tutucu için) ya da cüzdan tipi kalın kılıflar NFC sinyalini zayıflatır. Kılıfı çıkarıp deneyin. Kılıfın içinde banka kartı ya da başka bir NFC kart varsa telefon hangisini okuyacağını şaşırabilir; onları da çıkarın.",
          "Kartı telefona paralel tutun ve okumuyorsa kartı çevirip öbür yüzüyle deneyin. Metal kartlarda bu küçük fark okumayı hızlandırabilir.",
        ],
      },
      {
        heading: "4. iPhone modelini kontrol edin",
        paragraphs: [],
        list: [
          "iPhone XS, XR ve sonrası: NFC etiketlerini arka planda kendiliğinden okur, ayar yoktur.",
          'iPhone 7, 8 ve X: Denetim Merkezi\'ne "NFC Etiketi Okuyucu" eklenip ona dokunarak okunur.',
          "iPhone 6s ve öncesi: NFC etiketi okuyamaz; QR kodu kullanın.",
          "iPhone'da NFC'yi kapatan bir ayar yoktur; sorun genellikle okuma noktası ya da kılıftır.",
        ],
        link: {
          href: "/rehber/nfc-kartvizit-hangi-telefonlarda-calisir",
          label: "NFC kartvizit hangi telefonlarda çalışır?",
        },
      },
      {
        heading: "5. QR kod yedeğini kullanın",
        paragraphs: [
          "Her Dijivizit kullanıcısının, NFC ile açılan profile giden bir QR kodu vardır. Kodu kendi telefonunuzun ekranında gösterirsiniz; karşı tarafın kamerayı koda tutması yeterlidir. NFC'si olmayan ya da kapalı olan her telefon, eski modeller dahil, profili bu yolla açar. Tanışma anında vakit kaybetmemek için ilk denemede okumazsa QR'a geçin.",
        ],
        link: { href: "/rehber/qr-kod-kartvizit", label: "QR kod kartvizit rehberi" },
      },
      {
        heading: "Hiçbir telefonda okumuyorsa",
        paragraphs: [
          "Kartı NFC'si açık iki farklı telefonda denediyseniz ve hiçbiri okumuyorsa sorun kartta olabilir. Kartınız NFC ile okunmuyorsa bize yazın; sorunu birlikte kontrol ederiz, karttan kaynaklanıyorsa kargo dahil ücretsiz yenisini göndeririz. Bu sürede profilinizi link ya da QR ile paylaşmaya devam edebilirsiniz.",
        ],
        link: { href: "/yasal/teslimat-ve-iade", label: "Teslimat, değişim ve iade" },
      },
    ],
    faq: [
      {
        q: "iPhone NFC kartvizit okumuyor, ne yapmalıyım?",
        a: "Ekranın açık olduğundan emin olun, kartı arka yüzün üst kısmına, kameraların yakınına tutun ve kılıfı çıkarıp deneyin. iPhone 7, 8 ve X'te Denetim Merkezi'ndeki NFC Etiketi Okuyucu'yu kullanın. Olmazsa profilinizin QR kodunu kendi ekranınızdan okutun.",
      },
      {
        q: "Kart bildirimi çıkıyor ama profil açılmıyorsa?",
        a: "Bildirime dokunduğunuzda profil tarayıcıda açılır; telefonun internet bağlantısı yoksa sayfa yüklenmez. Mobil veriyi ya da Wi-Fi'yi kontrol edin.",
      },
      {
        q: "NFC kart zamanla bozulur mu?",
        a: "Çipin pili yoktur ve normal kullanımda yıllarca çalışır. Kartın kırılması, sert bükülmesi ya da çipin bulunduğu bölgenin delinmesi okumayı bozabilir.",
      },
    ],
  },
  {
    slug: "kartvizit-olculeri",
    label: "Kartvizit ölçüleri",
    title: "Kartvizit Ölçüleri: Kartvizit Boyutu Kaç cm? (85 × 55 mm)",
    description:
      "Kartvizit kaç cm? Türkiye'de standart kartvizit 8,5 × 5,5 cm (85 × 55 mm), NFC kartvizit 85,6 × 54 mm. Kesim payı, güvenli alan ve piksel ölçüleri rehberi.",
    image: "/rehber/metal-kartvizit.jpg",
    imageAlt: "Mat siyah metal Dijivizit NFC kartvizit",
    published: "2026-11-05",
    updated: "2026-11-13",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Türkiye'de standart kâğıt kartvizit ölçüsü 85 × 55 mm, yani 8,5 × 5,5 cm'dir. NFC kartvizitler ise kredi kartı boyutundadır: ISO/IEC 7810 ID-1 standardına göre 85,6 × 54 mm. Baskıya gönderirken her kenara 2–3 mm kesim payı eklenir, yazılar kenardan en az 3–5 mm içeride tutulur.",
        ],
      },
      {
        heading: "Ölçü karşılaştırması",
        paragraphs: [],
        list: [
          "Türkiye standart kartvizit: 85 × 55 mm",
          "Kredi kartı / NFC kart (ISO/IEC 7810 ID-1): 85,6 × 53,98 mm, köşeler yaklaşık 3 mm yuvarlatılmış",
          "ABD ve Kanada kartviziti: 88,9 × 50,8 mm (3,5 × 2 inç)",
          "Avrupa'da yaygın ölçü: 85 × 55 mm",
          "Japonya kartviziti (meishi): 91 × 55 mm",
        ],
        link: {
          href: "/rehber/kredi-karti-olculeri",
          label: "Kredi kartı kaç cm? Ayrıntılı ölçüler",
        },
      },
      {
        heading: "Kesim payı (taşma) nedir?",
        paragraphs: [
          "Baskı sonrası kartlar büyük tabakalardan kesilir ve bıçak milimetrik olarak kayabilir. Arka plan rengi ya da görsel kartın kenarına kadar uzanıyorsa, kenarda beyaz çizgi kalmaması için tasarım her kenardan 2–3 mm taşırılır.",
        ],
        list: [
          "Net ölçü: 85 × 55 mm",
          "2 mm kesim paylı dosya: 89 × 59 mm",
          "3 mm kesim paylı dosya: 91 × 61 mm",
        ],
      },
      {
        heading: "Güvenli alan",
        paragraphs: [
          "Kesim payının tersine, güvenli alan kartın içine doğrudur. Ad, telefon, e-posta ve QR kod gibi önemli öğeleri kesim çizgisinden en az 3–5 mm içeride tutun. 85 × 55 mm'lik bir kartta 4 mm güvenli alan bırakırsanız yazılarınız için yaklaşık 77 × 47 mm'lik bir alan kalır.",
        ],
      },
      {
        heading: "Dosya hazırlarken",
        paragraphs: [],
        list: [
          "Çözünürlük: en az 300 dpi",
          "Renk modu: baskı için CMYK",
          "Yazı boyutu: ad için 9–12 pt, iletişim bilgileri için en az 7 pt",
          "QR kod: kenarı en az 2 cm, etrafında boşluk",
          "Yazıları dışa aktarmadan önce eğriye çevirin ya da yazı tiplerini dosyaya gömün",
        ],
        link: { href: "/rehber/kartvizit-tasarimi-ipuclari", label: "Kartvizit tasarımı ipuçları" },
      },
      {
        heading: "NFC kartvizitler neden kredi kartı boyutunda?",
        paragraphs: [
          "NFC kartlar, banka ve kimlik kartlarıyla aynı üretim standardını kullanır. Bu ölçü cüzdanların kart bölmelerine, kartlıklara ve telefon kılıflarının kart cebine tam oturur. 85 × 55 mm'lik kâğıt kartvizitten yaklaşık 1 mm daha kısadır; elde aradaki fark hissedilmez.",
          "Dijivizit'in PVC, metal ve ahşap kartları kredi kartı boyutundadır. Ön yüzde Dijivizit logosu ve temassız işareti bulunur, arka yüz boştur.",
        ],
        link: { href: "/nfc-kartvizit", label: "NFC kartvizit modelleri" },
      },
      {
        heading: "Kalınlık",
        paragraphs: [
          "Kâğıt kartvizitler genellikle 300–400 gr/m² kuşe ya da özel kâğıda basılır. Kredi kartı standardındaki kartların kalınlığı yaklaşık 0,76 mm'dir. Metal ve ahşap kartlar malzemeye göre biraz farklı bir his verir; metal kart elde belirgin şekilde daha ağırdır.",
        ],
        link: { href: "/rehber/metal-kartvizit", label: "Metal kartvizit" },
      },
    ],
    faq: [
      {
        q: "Kartvizit kaç cm?",
        a: "Türkiye'de standart kartvizit 8,5 × 5,5 cm'dir. NFC kartvizitler kredi kartı boyutunda, yaklaşık 8,56 × 5,4 cm'dir.",
      },
      {
        q: "Kartvizit kaç piksel olmalı?",
        a: "300 dpi'da 85 × 55 mm'lik bir kart yaklaşık 1004 × 650 pikseldir. 3 mm kesim payıyla (91 × 61 mm) dosya yaklaşık 1075 × 720 piksel olur.",
      },
      {
        q: "Dikey kartvizit ölçüsü nedir?",
        a: "Aynı ölçünün döndürülmüş hâlidir: 55 × 85 mm. Kesim payı ve güvenli alan kuralları değişmez.",
      },
    ],
  },
  {
    slug: "kartvizit-fiyatlari",
    label: "Kartvizit fiyatları",
    title: "Kartvizit Fiyatları Neye Göre Değişir? Kâğıt ve NFC (2026)",
    description:
      "Kartvizit fiyatları 2026: 1000 adet kâğıt kartvizit baskı maliyeti neye göre değişir, NFC kartvizit ne kadar ve hangisi uzun vadede daha ekonomik?",
    image: "/rehber/nfc-kartvizit-mi-kagit-kartvizit-mi.jpg",
    imageAlt: "Toplantı masasında siyah NFC kartvizit karşıdaki kişiye uzatılıyor",
    published: "2026-11-05",
    updated: "2026-11-13",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Kâğıt kartvizit fiyatı adet, kâğıt, baskı yönü ve selefon gibi ek işlemlere göre değişir; 1000 adetlik standart baskı Kasım 2026'da baktığımız Türk matbaa sayfalarında birkaç yüz TL ile 1.000 TL arasında. NFC kartvizit ise tek kart olarak satılır: Dijivizit'te 2.500 TL ya da 4.000 TL, KDV ve kargo dahil.",
        ],
        link: { href: "/dijital-kartvizit-fiyatlari", label: "Dijital kartvizit fiyatları" },
      },
      {
        heading: "Kâğıt kartvizit fiyatını ne belirler?",
        paragraphs: [],
        list: [
          "Adet: 500, 1000 ya da 5000; adet arttıkça tane başı maliyet düşer.",
          "Kâğıt: 300–400 gr/m² kuşe en yaygın olanıdır; kraft, dokulu ya da özel kâğıtlar daha pahalıdır.",
          "Baskı: tek yön ya da çift yön, 4 renk.",
          "Ek işlemler: mat ya da parlak selefon, kabartma lak, yaldız, köşe kesimi.",
          "Tasarım: hazır şablon mu, tasarımcı mı?",
          "KDV ve kargo: fiyatın içinde mi, ayrı mı?",
        ],
      },
      {
        heading: "Matbaa sayfalarında gördüğümüz fiyatlar (Kasım 2026)",
        paragraphs: [
          "Aşağıdaki rakamlar, Kasım 2026'da Türkiye'deki matbaa ve hizmet sitelerinde yayınlanmış fiyatlardır. Fiyatlar şehre, matbaaya ve kampanyalara göre hızla değişir; sipariş vermeden önce güncel teklif alın.",
        ],
        list: [
          "Printer Ofset (İzmir) 2026 fiyat rehberi: 1000 adet, 300 gr kuşe, çift yön renkli ve mat selefonlu kartvizit için 600–1.000 TL + KDV",
          "Karekod.org, Ocak 2026'da güncellenen Bursa matbaa fiyatları yazısı: 1000 adet standart kartvizit 245 TL (KDV bilgisi belirtilmemiş)",
          "Armut: kartvizit baskı hizmeti talebin ayrıntısına göre 500–4.000 TL",
        ],
      },
      {
        heading: "NFC kartvizit fiyatları",
        paragraphs: [
          "NFC kartvizit tek kart olarak alınır; aynı kart yıllarca kullanılır ve bilgileriniz değişince yeniden basılmaz. Dijivizit fiyatlarına KDV dahildir, kargo ücretsizdir ve dijital profil ilk yıl ücretsizdir.",
        ],
        list: [
          "Mat siyah PVC: 2.500 TL",
          "Koyu ahşap / açık ahşap: 2.500 TL",
          "Siyah, gümüş, gold metal: 4.000 TL",
          "İlk yıldan sonra profil: aylık 59,90 TL",
          "Kartsız dijital kartvizit (link + QR): yıllık 718,80 TL",
          "10 ve üzeri adet: %20 indirim ve firma logosu",
        ],
        link: { href: "/kartvizit", label: "NFC kartvizit fiyatları" },
      },
      {
        heading: "Hangisi daha ekonomik?",
        paragraphs: [
          "Tek başına bakıldığında 1000 kâğıt kartvizit, bir NFC karttan ucuzdur. Fark, bilgileriniz değiştiğinde ve kartvizitin ne kadar işe yaradığında ortaya çıkar:",
        ],
        list: [
          "Unvan, numara ya da adres değiştiğinde kâğıt kartvizitin kalan stoğu kullanılamaz; NFC kartta yalnızca profil güncellenir.",
          "Kâğıt kartvizitin bilgileri karşı tarafın rehberine elle girilir; NFC kartta tek dokunuşla kaydedilir.",
          "Kâğıt kartvizitin kaç kişi tarafından kullanıldığını bilemezsiniz; dijital profilde görüntülenmeleri görürsünüz.",
          "Fuarda standdan alınan ya da broşür gibi dağıtılan kartlar için kâğıt kartvizit hâlâ mantıklı olabilir; ikisini birlikte kullanmak da mümkündür.",
        ],
        link: {
          href: "/rehber/nfc-kartvizit-mi-kagit-kartvizit-mi",
          label: "NFC mi kâğıt mı? Karşılaştırma",
        },
      },
      {
        heading: "Kâğıt kartvizitinize QR kod ekleyin",
        paragraphs: [
          "Kâğıt kartvizitten vazgeçmek istemiyorsanız arka yüze, okutulunca sizi rehbere kaydeden bir QR kod ekleyebilirsiniz. Dijivizit'in ücretsiz aracıyla bu QR kodu üyelik olmadan oluşturup PNG olarak indirebilirsiniz.",
        ],
        link: { href: "/qr-kartvizit-olustur", label: "Ücretsiz QR kartvizit oluştur" },
      },
    ],
    faq: [
      {
        q: "1000 adet kartvizit kaç TL?",
        a: "Kasım 2026'da baktığımız Türk matbaa sayfalarında 1000 adet standart kartvizit için birkaç yüz TL ile 1.000 TL arasında fiyatlar yayınlanmıştı. Kâğıt, selefon, KDV ve kargo fiyatı değiştirir; güncel teklif alın.",
      },
      {
        q: "NFC kartvizit kaç TL?",
        a: "Dijivizit'te mat siyah PVC ve ahşap NFC kartlar 2.500 TL, metal kartlar 4.000 TL'dir; KDV dahil, kargo ücretsiz. Dijital profil ilk yıl ücretsizdir, sonrasında aylık 59,90 TL'dir.",
      },
      {
        q: "Kurumsal kartvizitlerde indirim var mı?",
        a: "Dijivizit'te 10 ve üzeri adette %20 indirim uygulanır ve kartlara firma logosu işlenir.",
      },
    ],
  },
  {
    slug: "e-kartvizit-nedir",
    label: "E-kartvizit nedir?",
    title: "E-Kartvizit Nedir? Sanal ve Online Kartvizit Rehberi",
    description:
      "E-kartvizit nedir? Sanal, online ve elektronik kartvizit nasıl çalışır, nasıl paylaşılır, kâğıt kartvizitten farkı ne ve e-kartviziti nasıl oluşturursunuz?",
    image: "/rehber/dijital-kartvizit-nasil-olusturulur.jpg",
    imageAlt: "Telefon ekranında Dijivizit dijital kartvizit profili",
    published: "2026-11-05",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "E-kartvizit, iletişim bilgilerinizi kâğıt yerine bir web sayfasında, QR kodda ya da vCard dosyasında taşıyan elektronik kartvizittir. Sanal kartvizit, online kartvizit ve dijital kartvizit aynı şeyi anlatır. Bir bağlantı, QR kod ya da NFC kartla paylaşılır; karşı taraf sizi tek dokunuşla telefon rehberine kaydeder.",
        ],
        link: { href: "/", label: "Dijital kartvizit" },
      },
      {
        heading: "Aynı şeyin farklı adları",
        paragraphs: [],
        list: [
          "E-kartvizit / elektronik kartvizit: kartvizitin elektronik ortamdaki hâli",
          "Sanal kartvizit: fiziksel bir kart olmadan kullanılan kartvizit",
          "Online kartvizit: internette bir bağlantıyla açılan profil",
          "Dijital kartvizit: bu kullanımların hepsini kapsayan genel ad",
          "NFC / akıllı kartvizit: aynı profili telefona dokundurarak açan fiziksel kart",
        ],
        link: { href: "/rehber/dijital-kartvizit-nedir", label: "Dijital kartvizit nedir?" },
      },
      {
        heading: "E-kartvizitin üç biçimi",
        paragraphs: [],
        list: [
          "Profil sayfası: Bilgileriniz bir web adresinde durur; güncellenebilir, fotoğraf, sosyal medya ve belge içerebilir.",
          "QR kod: Bilgiler ya doğrudan kodun içine yazılır (statik) ya da kod profil sayfasına gider (dinamik).",
          "vCard dosyası (.vcf): Telefon rehberine eklenen standart kişi dosyası; e-postayla gönderilebilir.",
        ],
        link: { href: "/rehber/vcf-dosyasi-nedir", label: "VCF dosyası nedir?" },
      },
      {
        heading: "Kâğıt kartvizitten farkı",
        paragraphs: [],
        list: [
          "Baskı yok: Bilgileriniz değişince profili güncellersiniz.",
          "Rehbere kayıt: Karşı taraf bilgilerinizi elle yazmaz.",
          "Uzaktan paylaşım: WhatsApp, e-posta ya da sosyal medyada bağlantı olarak gönderilir.",
          "Zengin içerik: Fotoğraf, WhatsApp, LinkedIn, Instagram, konum ve PDF belgeler tek sayfada.",
          "Ölçüm: Profilin kaç kez açıldığını görebilirsiniz.",
        ],
      },
      {
        heading: "E-kartvizit nasıl paylaşılır?",
        paragraphs: [
          "Profil bağlantınızı mesajla gönderebilir, e-posta imzanıza ve sosyal medya biyografinize koyabilir, QR kodu sunum ve broşürlere basabilirsiniz. Yüz yüze tanışmalarda NFC kart, telefona dokundurularak aynı profili açar.",
        ],
        link: {
          href: "/rehber/dijital-kartvizit-nasil-paylasilir",
          label: "Dijital kartvizit nasıl paylaşılır?",
        },
      },
      {
        heading: "E-kartvizit nasıl oluşturulur?",
        paragraphs: [
          "Ücretsiz başlamak için Dijivizit'in araçlarıyla üyelik olmadan rehbere kaydeden bir QR kod oluşturabilirsiniz. Güncellenebilen bir profil, paylaşılabilir bir link, analitik ve ziyaretçi formu istiyorsanız kartsız dijital kartvizit aylık 59,90 TL'dir; yıllık 718,80 TL olarak ödenir ve link ile QR kodunuz 2 saat içinde e-postanıza gelir.",
        ],
        link: { href: "/dijital-kartvizit-olustur", label: "Ücretsiz e-kartvizit oluştur" },
      },
      {
        heading: "Fiziksel karta ne zaman geçmeli?",
        paragraphs: [
          "Toplantıda, fuarda ya da mağazada çok sayıda insanla yüz yüze tanışıyorsanız NFC kart işinizi hızlandırır: karşınızdakinin kamerasını açmasına gerek kalmaz. Dijivizit'te PVC, ahşap ve metal NFC kartlara geçtiğinizde profil linkiniz ve QR kodunuz aynı kalır.",
        ],
        link: { href: "/nfc-kartvizit", label: "NFC kartvizit modelleri" },
      },
    ],
    faq: [
      {
        q: "E-kartvizit ile dijital kartvizit aynı şey mi?",
        a: "Evet. E-kartvizit, sanal kartvizit, online kartvizit ve dijital kartvizit aynı kavram için kullanılır: iletişim bilgilerinin elektronik ortamda paylaşılması.",
      },
      {
        q: "E-kartvizit için uygulama gerekir mi?",
        a: "Hayır. Dijivizit profili telefonun tarayıcısında açılır; ne sizin ne de karşınızdaki kişinin uygulama indirmesi gerekir.",
      },
      {
        q: "E-kartviziti e-postayla gönderebilir miyim?",
        a: "Evet. Profil bağlantınızı e-postaya ya da imzanıza ekleyebilirsiniz. Karşı taraf bağlantıyı açıp Rehberime Kaydet'e dokunduğunda bilgileriniz vCard olarak telefonuna eklenir.",
      },
    ],
  },
  {
    slug: "vcf-dosyasi-nedir",
    label: "VCF dosyası nedir?",
    title: "VCF Dosyası Nedir, Nasıl Açılır? vCard Rehberi",
    description:
      "VCF dosyası nedir, nasıl açılır? vCard formatı, iPhone, Android, Gmail ve Outlook'ta VCF dosyasını rehbere ekleme ve dijital kartvizitte vCard kullanımı.",
    image: "/rehber/dijital-kartvizit-nedir.jpg",
    imageAlt: "Siyah NFC kartvizit telefona dokunduruluyor, ekranda dijital kartvizit profili açık",
    published: "2026-11-05",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "VCF dosyası, bir kişinin adını, telefonunu, e-postasını, şirketini ve adresini taşıyan standart kartvizit dosyasıdır; formatın adı vCard'dır. iPhone ve Android telefonlar VCF dosyasını açınca kişiyi rehbere eklemeyi önerir. Dijital kartvizitlerdeki Rehbere Kaydet düğmesi de arka planda bir VCF dosyası indirir.",
        ],
      },
      {
        heading: "vCard formatı",
        paragraphs: [
          "vCard, kişi bilgilerini düz metin olarak yazan uluslararası bir standarttır. Dosya BEGIN:VCARD satırıyla başlar, END:VCARD ile biter; aradaki her satır bir bilgiyi taşır. Bir VCF dosyasında tek kişi ya da birden çok kişi olabilir.",
        ],
        list: [
          "vCard 2.1: eski telefonlarla uyumlu ilk yaygın sürüm",
          "vCard 3.0: bugün en yaygın kullanılan sürüm; iPhone ve Android sorunsuz okur",
          "vCard 4.0: en yeni sürüm; desteği uygulamaya göre değişir",
        ],
      },
      {
        heading: "VCF dosyasında neler olur?",
        paragraphs: [],
        list: [
          "FN ve N: ad soyad",
          "ORG ve TITLE: şirket ve unvan",
          "TEL: telefon numaraları",
          "EMAIL: e-posta adresleri",
          "ADR: adres",
          "URL: web sitesi ve sosyal medya bağlantıları",
          "PHOTO: fotoğraf (isteğe bağlı; dosyayı büyütür)",
        ],
      },
      {
        heading: "VCF dosyası nasıl açılır?",
        paragraphs: [],
        list: [
          'iPhone: Dosyaya dokunun, açılan kartta "Yeni Kişi Oluştur" ya da "Mevcut Kişiye Ekle"yi seçin.',
          "Android: Dosyaya dokunun ve Kişiler uygulamasını seçin; ya da Kişiler uygulamasında içe aktarma seçeneğini kullanın.",
          "Gmail / Google Kişiler: Google Kişiler'de İçe aktar'ı seçip VCF dosyasını yükleyin.",
          "Outlook: Dosyayı açın ve kişi olarak kaydedin.",
          "Mac: Dosyaya çift tıklayın, Kişiler uygulaması açılır.",
        ],
        link: { href: "/rehber/e-kartvizit-nedir", label: "E-kartvizit nedir?" },
      },
      {
        heading: "Dijital kartvizitte vCard",
        paragraphs: [
          'Dijivizit profilinde "Rehberime Kaydet" düğmesi bir vCard 3.0 dosyası indirir. Dosyada adınız, şirketiniz, unvanınız, telefonlarınız, e-postalarınız, adresiniz, web siteniz, LinkedIn, Instagram, X ve WhatsApp bağlantılarınız ile profil linkiniz bulunur. Karşı taraf tek dokunuşla sizi rehberine ekler.',
          "Profil fotoğrafı vCard'a eklenmez; dosya küçük kalır ve her telefonda hızlıca açılır. Fotoğrafınız profil sayfasında görünmeye devam eder.",
        ],
        link: { href: "/dijital-kartvizit", label: "Dijital kartvizit özellikleri" },
      },
      {
        heading: "QR kodla vCard paylaşmak",
        paragraphs: [
          "vCard bilgileri doğrudan bir QR koda da yazılabilir. Okutan kişinin telefonu kişiyi kaydetmeyi önerir; internet bağlantısı bile gerekmez. Sınırı, bilgilerin kodun içine sabitlenmesidir: numaranız değişirse yeni kod gerekir. Dijivizit'in ücretsiz QR kartvizit aracı bu türde bir kod üretir.",
        ],
        link: { href: "/qr-kartvizit-olustur", label: "vCard QR kod oluştur" },
      },
      {
        heading: "Sık karşılaşılan sorunlar",
        paragraphs: [],
        list: [
          "Türkçe karakterler bozuk: Dosya UTF-8 olarak kaydedilmemiştir; vCard 3.0 ve UTF-8 kullanın.",
          "Dosya açılmıyor: E-posta uygulaması ekleri önizlemiyor olabilir; dosyayı indirip Kişiler'den içe aktarın.",
          "Yalnızca ilk kişi eklendi: Bazı uygulamalar çok kişili dosyada yalnızca birini alır; içe aktarma menüsünü kullanın.",
        ],
      },
    ],
    faq: [
      {
        q: "VCF dosyası virüs taşır mı?",
        a: "VCF düz metin bir dosyadır ve kod çalıştırmaz. Yine de tanımadığınız kaynaklardan gelen eklere dikkat edin; dosya adının .vcf ile bittiğinden emin olun.",
      },
      {
        q: "Rehberimi VCF olarak nasıl dışa aktarırım?",
        a: "iPhone'da iCloud.com Kişiler üzerinden, Android'de Kişiler uygulamasının dışa aktarma seçeneğiyle rehberinizi VCF olarak kaydedebilirsiniz. Menü adları sürüme göre değişebilir.",
      },
      {
        q: "Dijivizit'te vCard'a fotoğraf ekleniyor mu?",
        a: "Hayır. vCard dosyası fotoğraf içermez; böylece küçük kalır ve hızlı açılır. Fotoğrafınız profil sayfanızda görünür.",
      },
    ],
  },
  {
    slug: "nfc-kart-programlama",
    label: "NFC kart programlama",
    title: "NFC Tools Nasıl Kullanılır? NFC Kart Programlama Rehberi",
    description:
      "NFC Tools nasıl kullanılır, NFC kart nasıl kodlanır? Karta URL yazma adımları, NDEF kaydı, NTAG213/215/216 kapasiteleri ve geri alınamayan kilitleme uyarısı.",
    image: "/rehber/nfc-kartvizit-hangi-telefonlarda-calisir.jpg",
    imageAlt: "Gold NFC kartvizit telefona yaklaştırılıyor",
    published: "2026-11-05",
    updated: "2026-11-13",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Boş bir NFC kartı programlamak için telefona NFC Tools gibi bir yazma uygulaması kurar, yeni bir URL kaydı ekler, adresinizi yazar ve kartı telefonun okuma noktasına tutarsınız. Karta NDEF formatında bir bağlantı yazılır. Kartı kilitlemek kalıcıdır ve geri alınamaz; yönetilen bir profil kullanırsanız karta hiç dokunmadan güncelleme yaparsınız.",
        ],
      },
      {
        heading: "Ne gerekir?",
        paragraphs: [],
        list: [
          "NFC destekli bir telefon: Android'de NFC açık olmalı; iPhone'da iOS 13 ve sonrası yüklü iPhone 7 ve sonrası modeller etikete yazabilir.",
          "Boş ve kilitlenmemiş bir NFC kart ya da etiket (NTAG21x en yaygın olanıdır)",
          "NFC Tools gibi bir yazma uygulaması (iOS ve Android'de bulunur)",
          "Karta yazılacak bağlantı: web siteniz ya da dijital kartvizit profiliniz",
        ],
      },
      {
        heading: "NTAG çip kapasiteleri",
        paragraphs: [
          "Kartvizit için en çok NTAG213, NTAG215 ve NTAG216 çipleri kullanılır. Fark, kullanıcı hafızasıdır:",
        ],
        list: [
          "NTAG213: 144 bayt; 100 karakter civarında bir web adresi için yeterli",
          "NTAG215: 504 bayt; uzun bağlantılar ya da birkaç kayıt",
          "NTAG216: 888 bayt; temel bir vCard kaydı sığabilir",
        ],
      },
      {
        heading: "NFC Tools ile karta URL yazma",
        paragraphs: [
          "Menü adları uygulama sürümüne ve dile göre değişebilir; adımlar genel olarak şöyledir:",
        ],
        list: [
          'Uygulamayı açın ve "Yaz" (Write) sekmesine geçin.',
          '"Kayıt ekle" ile URL / URI kaydını seçin.',
          "Adresinizi https:// ile birlikte yazın ve onaylayın.",
          '"Yaz" düğmesine dokunun ve kartı telefonun okuma noktasına tutun.',
          '"Oku" (Read) sekmesinden kartı okutup kaydın doğru yazıldığını kontrol edin.',
        ],
      },
      {
        heading: "Kilitleme uyarısı",
        paragraphs: [
          "NFC Tools ve benzeri uygulamalarda kartı salt okunur yapan bir kilitleme seçeneği vardır. Kilitlenen kartın içeriği bir daha değiştirilemez; bu işlem geri alınamaz. Bağlantınızdan emin değilseniz ya da ileride değiştirmeniz ihtimali varsa kartı kilitlemeyin.",
          "Karta doğrudan vCard yazarsanız numaranız ya da unvanınız değiştiğinde kartı yeniden yazmanız gerekir. Bu yüzden karta kişi bilgisi yerine güncellenebilen bir profilin bağlantısını yazmak daha pratiktir.",
        ],
      },
      {
        heading: "Kendin yap mı, yönetilen profil mi?",
        paragraphs: [],
        list: [
          "Kartı kendiniz programlarsanız: Bağlantı değişince kartı yeniden yazarsınız; analitik, rehbere kaydet düğmesi ve kayıp kart kapatma yoktur; profilinize açılan bir QR kodu da kendiniz hazırlamanız gerekir.",
          "Yönetilen profilde: Kart hazır gelir, siz yalnızca profili panelden güncellersiniz; görüntülenmeleri görür, kaybolan kartı tek tıkla kapatırsınız.",
        ],
      },
      {
        heading: "Dijivizit kartlarında programlama gerekmez",
        paragraphs: [
          "Dijivizit kartları profilinize bağlı olarak 72 saatte kapınıza gelir. Aynı profile açılan link ve QR kod da sizde olur. Bilgilerinizi panelden değiştirirsiniz; karta uygulamayla bir şey yazmanız gerekmez. Kart okunmazsa ücretsiz yenisiyle değiştirilir.",
        ],
        link: { href: "/nfc-kartvizit", label: "NFC kartvizit modelleri" },
      },
    ],
    faq: [
      {
        q: "iPhone ile NFC kart programlanır mı?",
        a: "Evet. iOS 13 ve sonrası yüklü iPhone 7 ve sonrası modeller, NFC Tools gibi uygulamalarla etikete NDEF kaydı yazabilir.",
      },
      {
        q: "NFC karta ne kadar bilgi sığar?",
        a: "NTAG213'te 144, NTAG215'te 504, NTAG216'da 888 bayt kullanıcı hafızası vardır. Bir web adresi için NTAG213 yeterlidir.",
      },
      {
        q: "Kilitlenmiş NFC kartın kilidi açılır mı?",
        a: "Hayır. Salt okunur yapılan NTAG kartın içeriği kalıcı olarak sabitlenir ve değiştirilemez.",
      },
      {
        q: "Dijivizit kartını kendim yeniden programlayabilir miyim?",
        a: "Buna gerek yoktur. Kart profilinize bağlı gelir; bilgilerinizi panelden güncellersiniz ve kart her zaman güncel profili açar.",
      },
    ],
  },
  {
    slug: "linkedin-qr-kod",
    label: "LinkedIn QR kod",
    title: "LinkedIn QR Kod Nasıl Bulunur? Profili Kartvizitle Paylaşın",
    description:
      "LinkedIn QR kod nasıl bulunur ve paylaşılır? Mobil uygulamada QR kodunuza ulaşma, kartvizite ekleme ve LinkedIn'i dijital kartvizitle birlikte kullanma.",
    image: "/rehber/qr-kod-kartvizit.jpg",
    imageAlt: "Deri kartlıktan çıkarılan siyah Dijivizit NFC kartvizit",
    published: "2026-11-05",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "LinkedIn QR kodunuz mobil uygulamada, arama çubuğunun yanındaki QR simgesinin altında bulunur. Simgeye dokunup kodunuzun gösterildiği sekmeye geçin; buradan kodu paylaşabilir ya da kaydedebilirsiniz. Menü adları uygulama sürümüne göre değişebilir. Kod yalnızca LinkedIn profilinizi açar; telefon ve rehbere kayıt için dijital kartvizit gerekir.",
        ],
      },
      {
        heading: "LinkedIn QR kodunu bulma",
        paragraphs: ["Adımlar genel olarak şöyledir; arayüz güncellemelerle değişebilir:"],
        list: [
          "LinkedIn mobil uygulamasını açın.",
          "Üstteki arama çubuğuna dokunun; sağda QR simgesi görünür.",
          "QR simgesine dokunun; bir sekmede tarayıcı, diğerinde kendi kodunuz bulunur.",
          "Kendi kodunuzun olduğu sekmede paylaş ya da kaydet seçeneğini kullanın.",
        ],
      },
      {
        heading: "Birinin LinkedIn QR kodunu okutmak",
        paragraphs: [
          "Aynı ekrandaki tarayıcı sekmesiyle karşınızdakinin kodunu okutabilirsiniz; profili açılır ve bağlantı isteği gönderebilirsiniz. Telefonun kendi kamerası da LinkedIn QR kodlarını okuyup profili açar.",
        ],
      },
      {
        heading: "LinkedIn profil linkinizi bulun",
        paragraphs: [
          "QR yerine bağlantı paylaşmak isterseniz kendi profilinizi açın; profil paylaşım seçeneklerinden bağlantıyı kopyalayabilirsiniz. Profil ayarlarından herkese açık profil adresinizi adınızı içerecek şekilde kısaltmak da mümkündür.",
        ],
      },
      {
        heading: "LinkedIn QR mi, dijital kartvizit mi?",
        paragraphs: [],
        list: [
          "LinkedIn QR: Ücretsizdir, bağlantı isteği için idealdir; yalnızca LinkedIn profilini açar, karşı tarafta LinkedIn hesabı olması işi kolaylaştırır.",
          "Dijital kartvizit: LinkedIn bir satırdır; yanında telefon, WhatsApp, e-posta, web sitesi ve belgeler durur, kişi sizi tek dokunuşla rehberine kaydeder.",
          "Analitik: LinkedIn kendi istatistiklerini gösterir; dijital kartvizitte kartınızın kaç kez, hangi şehirden açıldığını görürsünüz.",
        ],
        link: { href: "/rehber/instagram-kartvizit", label: "Instagram kartvizit rehberi" },
      },
      {
        heading: "Kartvizitinize LinkedIn eklemek",
        paragraphs: [
          "Kâğıt kartvizitte LinkedIn adresinizi kısa hâliyle yazabilir ya da arka yüze QR kod koyabilirsiniz. Dijivizit profilinde LinkedIn satırı tek dokunuşla profilinizi açar ve vCard'a da eklenir; kişi sizi rehberine kaydettiğinde LinkedIn bağlantınız da kişi kaydında durur.",
        ],
        link: { href: "/dijital-kartvizit", label: "Dijital kartvizit özellikleri" },
      },
      {
        heading: "Etkinlik ve fuarlarda",
        paragraphs: [
          "Kalabalık bir etkinlikte her tanışmada uygulama açıp QR aramak zaman alır. NFC kartvizit telefona dokundurulduğunda profiliniz açılır; LinkedIn'e bağlanmak isteyen kişi oradan tek dokunuşla geçer. Size verilen kâğıt kartvizitleri ise Dijivizit panelinde fotoğrafını çekerek kaydedebilirsiniz.",
        ],
        link: { href: "/rehber/fuarda-kartvizit", label: "Fuarda kartvizit ve networking" },
      },
    ],
    faq: [
      {
        q: "LinkedIn QR kodu masaüstünde görünür mü?",
        a: "QR kod özelliği öncelikle mobil uygulamada yer alır. Masaüstünde profil linkinizi kopyalayıp paylaşabilirsiniz.",
      },
      {
        q: "LinkedIn QR kodunu kartvizite basabilir miyim?",
        a: "Evet. Kodu kaydedip kartvizitin arka yüzüne ekleyebilirsiniz. Kenarı en az 2 cm olsun ve etrafında boşluk bırakın.",
      },
      {
        q: "Dijital kartvizit LinkedIn'i doğrudan açar mı?",
        a: "Dijivizit kartı dijital profilinizi açar; LinkedIn bu profilde tek dokunuşla açılan satırlardan biridir. Böylece kişi sizi aynı anda rehberine de kaydedebilir.",
      },
    ],
  },
  {
    slug: "whatsapp-kartvizit",
    label: "WhatsApp kartvizit",
    title: "WhatsApp Kartvizit: wa.me Linki ve WhatsApp QR Kod",
    description:
      "WhatsApp kartvizit nasıl yapılır? wa.me linki oluşturma, hazır mesajlı bağlantı, WhatsApp QR kodu ve WhatsApp'ı dijital kartvizitte kullanmanın yolları.",
    image: "/rehber/ahsap-kartvizit.jpg",
    imageAlt: "Koyu ahşap NFC kartvizit telefona dokunuyor",
    published: "2026-11-05",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "WhatsApp kartvizitin temeli wa.me bağlantısıdır: wa.me/ adresinin sonuna numaranızı ülke koduyla, başında 0 ve + olmadan yazarsınız, örneğin wa.me/905321234567. Bu bağlantıya dokunan kişi doğrudan sizinle sohbet açar. Bağlantıyı QR koda çevirip kartvizite basabilir ya da dijital kartvizitinize WhatsApp satırı olarak ekleyebilirsiniz.",
        ],
      },
      {
        heading: "wa.me bağlantısı nasıl yazılır?",
        paragraphs: [],
        list: [
          "Doğru: wa.me/905321234567",
          "Yanlış: wa.me/+905321234567 (+ işareti olmaz)",
          "Yanlış: wa.me/05321234567 (ülke kodu eksik)",
          "Yanlış: wa.me/90 532 123 45 67 (boşluk ve tire olmaz)",
          "Hazır mesajla: wa.me/905321234567?text=Merhaba%20randevu%20almak%20istiyorum",
        ],
      },
      {
        heading: "Hazır mesajlı bağlantı",
        paragraphs: [
          'Bağlantının sonuna ?text= ekleyip mesajı yazarsanız sohbet, metin kutusu dolu olarak açılır. Boşluklar %20 ile yazılır. "Merhaba, kartvizitinizden ulaşıyorum" gibi bir mesaj, size kimin hangi kanaldan yazdığını anlamanızı kolaylaştırır.',
        ],
      },
      {
        heading: "WhatsApp'ın kendi QR kodu",
        paragraphs: [
          "WhatsApp'ta Ayarlar ekranında adınızın yanındaki QR simgesine dokunarak kişisel QR kodunuza ulaşabilirsiniz. Bu kodu okutan kişi sizi WhatsApp kişisi olarak ekleyebilir. WhatsApp Business'ta işletme araçları altında kısa bağlantı ve QR kod seçeneği de bulunur. Menü adları uygulama sürümüne göre değişebilir.",
        ],
      },
      {
        heading: "WhatsApp QR mi, dijital kartvizit mi?",
        paragraphs: [],
        list: [
          "WhatsApp QR / wa.me: Ücretsiz; yalnızca sohbet açar, telefon rehberine tam kayıt yapmaz.",
          "Dijital kartvizit: WhatsApp bir satırdır; yanında telefon, e-posta, Instagram, adres ve belgeler durur.",
          "Rehbere kayıt: Dijital kartvizitte kişi sizi adınız, şirketiniz ve unvanınızla tek dokunuşla kaydeder; WhatsApp bağlantınız da kişi kaydına eklenir.",
          'Geri dönüş: Dijivizit profilinde ziyaretçi "Bilgilerimi bırak" ile kendi numarasını size iletir.',
        ],
      },
      {
        heading: "Dijivizit'te WhatsApp",
        paragraphs: [
          "Dijivizit profilinize WhatsApp numaranızı eklediğinizde profilde, dokununca sohbet açan bir satır oluşur. Bağlantıların sırasını değiştirip WhatsApp'ı en üste alabilirsiniz. Tanıştığınız bir kişiye takip hatırlatması kurduğunuzda günü gelince e-postanıza hatırlatma düşer ve WhatsApp mesajı hazır yazılmış olur.",
        ],
        link: { href: "/dijital-kartvizit", label: "Dijital kartvizit özellikleri" },
      },
      {
        heading: "Kartvizite basarken",
        paragraphs: [],
        list: [
          "QR kodun kenarı en az 2 cm olsun, etrafında boşluk bırakın.",
          'QR kodun altına ne açtığını yazın: "WhatsApp\'tan yazın" gibi.',
          "Basmadan önce kodu iki farklı telefonla okutun.",
          "Numaranız değişebilecekse QR kodu doğrudan WhatsApp'a değil, güncellenebilen dijital profilinize yönlendirin.",
        ],
        link: { href: "/qr-kartvizit-olustur", label: "Ücretsiz QR kartvizit oluştur" },
      },
    ],
    faq: [
      {
        q: "wa.me bağlantısı WhatsApp Business'ta çalışır mı?",
        a: "Evet. wa.me bağlantısı hem WhatsApp hem WhatsApp Business numaralarında çalışır.",
      },
      {
        q: "Numaramı kaydetmeyen biri bana WhatsApp'tan yazabilir mi?",
        a: "Evet. wa.me bağlantısına dokunan kişi numaranızı rehberine kaydetmeden sizinle sohbet açabilir.",
      },
      {
        q: "WhatsApp QR kodum değişir mi?",
        a: "WhatsApp kişisel QR kodunuzu sıfırlamanıza izin verir; sıfırlarsanız eski kod çalışmaz. wa.me bağlantısı ise numaranız aynı kaldıkça değişmez.",
      },
    ],
  },
  {
    slug: "fuarda-kartvizit",
    label: "Fuarda kartvizit",
    title: "Fuar İçin Kartvizit: Fuarda Networking Rehberi",
    description:
      "Fuar için kartvizit nasıl hazırlanır? Fuardan önce, fuarda ve fuardan sonra kartvizit, QR kod, NFC kart ve takip hatırlatmalarıyla fuarda networking rehberi.",
    image: "/rehber/kurumsal-dijital-kartvizit.jpg",
    imageAlt: "Kurumsal ekip için Dijivizit NFC kartvizitler",
    published: "2026-11-05",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Fuarda kartvizitin işi tanışmayı kayda dönüştürmektir. Stant ekibine NFC kartvizit, stant görsellerine QR kod koyun; ziyaretçinin bilgisini almak için bir form kullanın ve aldığınız kâğıt kartvizitleri aynı gün kaydedin. Fuardan sonraki ilk günlerde takip edin; tanışma sıcakken atılan mesaj daha kolay cevap bulur.",
        ],
      },
      {
        heading: "Fuardan önce",
        paragraphs: [],
        list: [
          "Kartları en az 3 iş günü önce sipariş edin; Dijivizit kartları 72 saatte teslim edilir.",
          "Stant ekibindeki herkesin profilini kontrol edin: unvan, telefon, WhatsApp ve katalog PDF'i güncel mi?",
          "Ürün kataloğu ve fiyat listesini profile PDF olarak ekleyin.",
          "Stant panosu, roll-up ve broşürlere profilinize giden QR kodu koyun; kenarı uzaktan okunacak kadar büyük olsun.",
          "Kartı unutma ihtimaline karşı profilinizi Apple Cüzdan'a ekleyin.",
        ],
        link: { href: "/rehber/kurumsal-dijital-kartvizit", label: "Kurumsal dijital kartvizit" },
      },
      {
        heading: "Fuarda: kâğıt mı, NFC mi?",
        paragraphs: [],
        list: [
          "Kâğıt kartvizit: Ziyaretçi kartı çantasına atar; bilgilerinizi rehberine sonradan elle girmesi gerekir.",
          "NFC kartvizit: Kartı telefona dokundurursunuz, profil 1–2 saniyede açılır; ziyaretçi sizi o anda rehberine kaydeder.",
          "QR kod: NFC'si kapalı telefonlarda ya da stant görsellerinde aynı profili açar.",
          "Tek kart yeter: NFC kartı vermezsiniz, her tanışmada yeniden kullanırsınız.",
        ],
        link: {
          href: "/rehber/nfc-kartvizit-mi-kagit-kartvizit-mi",
          label: "NFC mi kâğıt mı? Karşılaştırma",
        },
      },
      {
        heading: "Fuarda: bilgiyi geri almak",
        paragraphs: [
          "Fuarda asıl değerli olan, ziyaretçinin sizin bilginizi alması kadar sizin de onunkini almanızdır.",
        ],
        list: [
          'Dijivizit profilinizi açan ziyaretçi "Bilgilerimi bırak" ile adını, numarasını ve şirketini size iletir; kişi panelde Kişiler listesine düşer.',
          "Size verilen kâğıt kartvizitin fotoğrafını çekin; ad, unvan, şirket ve telefon otomatik okunur.",
          'Her kişiye o anda bir not ekleyin: "Fiyat teklifi istedi", "Numune gönderilecek".',
        ],
      },
      {
        heading: "Fuardan sonra",
        paragraphs: [],
        list: [
          'Her kişiye bir takip hatırlatması kurun: "2 gün sonra ara", "1 hafta sonra teklif gönder".',
          "Hatırlatma günü sabah e-postanıza gelir; WhatsApp mesajı hazır yazılmış olur.",
          "Analitik panelinde profillerin fuar günlerinde kaç kez, hangi şehirlerden açıldığına bakın.",
          "Kişiler listesini ekibinizle birlikte gözden geçirin; kimin hangi firmayla görüştüğü belli olsun.",
        ],
      },
      {
        heading: "Stant ekibi için",
        paragraphs: [
          "Ekip panelinden kartları stant ekibine dağıtırsınız; şirket kartlarından gelen kişileri ve görüntülenmeleri tek yerden görürsünüz. Fuarda geçici çalışan biriyle çalıştıysanız fuardan sonra kartı başka bir çalışana atarsınız; fiziksel kart aynı kalır. 10 ve üzeri adette %20 indirim uygulanır ve kartlara firma logosu işlenir.",
        ],
        link: { href: "/kurumsal-kartvizit", label: "Kurumsal kartvizit" },
      },
      {
        heading: "Kısa kontrol listesi",
        paragraphs: [],
        list: [
          "Kartlar teslim alındı ve her biri bir telefonda denendi",
          "Profillerde katalog ve fiyat listesi güncel",
          "Stant görsellerinde QR kod var ve 1–2 metreden okunuyor",
          "Ekip, ziyaretçiye formu göstermeyi biliyor",
          "Fuar sonrası takip için hatırlatmalar kuruldu",
        ],
      },
    ],
    faq: [
      {
        q: "Fuarda kaç kartvizit götürmeliyim?",
        a: "Kâğıt kartvizitte beklenen ziyaretçi sayısına göre stok gerekir. NFC kartvizitte her stant görevlisine bir kart yeter; kartı vermezsiniz, her tanışmada telefona dokundurursunuz.",
      },
      {
        q: "Ziyaretçinin telefonunda NFC yoksa?",
        a: "Profilinizin QR kodunu kendi telefonunuzun ekranından gösterirsiniz; karşı tarafın kamerayla okutması yeterlidir.",
      },
      {
        q: "Fuarda aldığım kartvizitleri nasıl saklarım?",
        a: "Dijivizit panelinde kartvizitin fotoğrafını çektiğinizde bilgiler otomatik okunur ve Kişiler listesine kaydedilir; not ve takip hatırlatması ekleyebilirsiniz.",
      },
    ],
  },
  {
    slug: "dijital-kartvizit-nasil-paylasilir",
    label: "Dijital kartvizit nasıl paylaşılır?",
    title: "Dijital Kartvizit Nasıl Paylaşılır? 7 Yöntem",
    description:
      "Dijital kartvizit nasıl paylaşılır? NFC kart, QR kod, profil linki, WhatsApp, e-posta imzası, Apple Cüzdan ve sosyal medyayla kartvizit paylaşmanın 7 yolu.",
    image: "/rehber/nfc-kartvizit-nereden-alinir.jpg",
    imageAlt: "İş toplantısında siyah metal NFC kartvizit karşı tarafa uzatılıyor",
    published: "2026-11-05",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Dijital kartvizit yedi yolla paylaşılır: NFC kartı telefona dokundurarak, QR kodu okutarak, profil linkini mesajla göndererek, e-posta imzasına ekleyerek, Apple Cüzdan'dan göstererek, sosyal medya biyografisine koyarak ve sunum ya da broşürlere basarak. Hepsi aynı profili açar; karşı taraf sizi tek dokunuşla rehberine kaydeder.",
        ],
        link: { href: "/", label: "Dijital kartvizit" },
      },
      {
        heading: "Yöntemler bir bakışta",
        paragraphs: [],
        list: [
          "NFC kart: yüz yüze, 1–2 saniye; NFC açık telefon gerekir",
          "QR kod: yüz yüze ya da basılı materyalde; her kameralı telefon",
          "Profil linki: uzaktan; WhatsApp, SMS, e-posta",
          "E-posta imzası: her gönderdiğiniz e-postada",
          "Apple Cüzdan: kart yanınızda değilken telefonunuzdaki QR",
          "Sosyal medya biyografisi: Instagram, LinkedIn, X",
          "Basılı materyal: sunum, broşür, ambalaj, stant",
        ],
      },
      {
        heading: "1. NFC kart",
        paragraphs: [
          "Yüz yüze tanışmada en hızlı yöntemdir. Kartı karşınızdakinin telefonunun arkasına yaklaştırırsınız, profil açılır. Uygulama gerekmez; güncel iPhone'lar kendiliğinden okur, Android'de NFC'nin açık olması yeterlidir.",
        ],
        link: { href: "/nfc-kartvizit", label: "NFC kartvizit modelleri" },
      },
      {
        heading: "2. QR kod",
        paragraphs: [
          "Her Dijivizit profilinin, aynı profile açılan bir QR kodu vardır. Panelin Paylaş sayfasından QR kodunuzu indirip sunum slaytına, broşüre, vitrine, menüye ya da kargo paketine koyabilirsiniz.",
        ],
        link: { href: "/rehber/qr-kod-kartvizit", label: "QR kod kartvizit rehberi" },
      },
      {
        heading: "3. Profil linki ve WhatsApp",
        paragraphs: [
          "Paylaş sayfasından profil linkinizi kopyalayıp WhatsApp, SMS ya da e-postayla gönderin. Toplantıdan önce linki göndermek, karşı tarafın sizi önceden kaydetmesini sağlar. Profil adresiniz adınızı değil rastgele bir kodu içerir; linki bilmeyen tahmin edemez.",
        ],
        link: { href: "/rehber/whatsapp-kartvizit", label: "WhatsApp kartvizit rehberi" },
      },
      {
        heading: "4. E-posta imzası",
        paragraphs: [
          'İmzanıza "Dijital kartvizitim" gibi kısa bir bağlantı ekleyin. Her e-posta, alıcının sizi rehberine kaydedebileceği bir fırsata dönüşür. İmzayı sade tutun: ad, unvan, telefon ve tek bir kartvizit bağlantısı yeterlidir.',
        ],
      },
      {
        heading: "5. Apple Cüzdan",
        paragraphs: [
          "Dijivizit panelinden profilinizi Apple Cüzdan'a ekleyebilirsiniz. Cüzdan kartının ön yüzündeki QR kodu okutan kişi profilinizi açar. Fiziksel kartı unuttuğunuz günlerde işinizi görür.",
        ],
      },
      {
        heading: "6–7. Sosyal medya ve basılı materyal",
        paragraphs: [
          "Profil linkinizi Instagram, LinkedIn ya da X biyografinize koyun; sizi oradan bulan kişi WhatsApp'tan yazabilir ya da rehberine kaydedebilir. QR kodu ise sunumlarınızın son slaytına, broşürlere, fuar standına ve ürün ambalajına ekleyin.",
          "Analitik panelinde profilinizin hangi kaynaktan açıldığını görürsünüz; hangi paylaşım yönteminin işe yaradığını buradan anlarsınız.",
        ],
        link: { href: "/rehber/instagram-kartvizit", label: "Instagram kartvizit rehberi" },
      },
    ],
    faq: [
      {
        q: "Dijital kartvizitimi paylaşmak için karşı tarafın uygulaması olmalı mı?",
        a: "Hayır. Profil telefonun tarayıcısında açılır; NFC, QR ya da link ile paylaştığınızda karşı tarafın uygulama indirmesi gerekmez.",
      },
      {
        q: "Kartsız dijital kartvizit nasıl paylaşılır?",
        a: "Kartsız dijital kartvizitte profil linki ve QR kod verilir. Linki mesajla, e-postayla ve sosyal medyada paylaşır; QR kodu basılı materyallere koyarsınız. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak ödenir.",
      },
      {
        q: "Android telefonlarda Cüzdan kartı var mı?",
        a: "Dijivizit şu anda Apple Cüzdan kartı sunar. Android'de profil linkinizi ya da QR kodunuzu kullanabilirsiniz.",
      },
    ],
  },
  {
    slug: "kartvizit-tasarimi-ipuclari",
    label: "Kartvizit tasarımı",
    title: "Kartvizit Tasarımı: İyi Bir Kartvizit İçin 10 İpucu",
    description:
      "Kartvizit tasarımı nasıl yapılır? Kâğıt ve NFC kartvizit için yazı boyutu, renk, boşluk, QR kod ve logo kullanımına dair 10 pratik kartvizit tasarım ipucu.",
    image: "/rehber/yeni-isletme-kontrol-listesi.jpg",
    imageAlt:
      "Açık ahşap, koyu ahşap, gold, gümüş ve siyah Dijivizit kartvizit kaplamaları üst üste",
    published: "2026-11-05",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "İyi bir kartvizit tasarımı sade, okunaklı ve tek bir amaca hizmet eder: sizi tanıtmak ve size ulaşılmasını sağlamak. En fazla iki yazı tipi kullanın, adınızı en belirgin öğe yapın, iletişim bilgilerini 7 pt'den küçük yazmayın ve kenarlardan en az 3–5 mm boşluk bırakın. NFC kartvizitte ise kartın yüzeyi sade kalır, bilgiler profilde durur.",
        ],
      },
      {
        heading: "Kâğıt kartvizit için 10 ipucu",
        paragraphs: [],
        list: [
          "Hiyerarşi: önce ad, sonra unvan, sonra iletişim bilgileri.",
          "En fazla iki yazı tipi; süslü yazıları yalnızca logoda kullanın.",
          "Yazı boyutu: ad için 9–12 pt, iletişim bilgileri için en az 7 pt.",
          "Kontrast: açık zemine koyu yazı; ince yazıyı renkli zemine koymayın.",
          "Boşluk: kartın en az üçte biri boş kalsın.",
          "Güvenli alan: önemli öğeler kesim çizgisinden 3–5 mm içeride.",
          "Renk: marka renginizi bir vurgu olarak kullanın, her yere değil.",
          "Arka yüz: logo, slogan ya da QR kod için ideal.",
          "QR kod: kenarı en az 2 cm, etrafında boşluk, altında ne açtığını yazan kısa bir not.",
          "Kontrol: baskıdan önce telefon ve e-postayı yüksek sesle okuyun.",
        ],
      },
      {
        heading: "Ölçü ve dosya",
        paragraphs: [
          "Türkiye'de standart kartvizit 85 × 55 mm'dir. Dosyayı her kenara 2–3 mm kesim payı ekleyerek, en az 300 dpi ve CMYK olarak hazırlayın.",
        ],
        link: { href: "/rehber/kartvizit-olculeri", label: "Kartvizit ölçüleri rehberi" },
      },
      {
        heading: "Kartvizite ne yazmalı?",
        paragraphs: [
          "Tasarım içerikten sonra gelir. Ad soyad, unvan, şirket, tek bir telefon, e-posta ve web sitesi çoğu kart için yeterlidir. Kullanmadığınız hesapları ve eski numaraları koymayın.",
        ],
        link: { href: "/rehber/kartvizite-ne-yazilir", label: "Kartvizite ne yazılır?" },
      },
      {
        heading: "NFC kartvizitte tasarım",
        paragraphs: [
          "NFC kartvizitte iletişim bilgileriniz kartın yüzeyinde değil, kartla açılan dijital profildedir. Kart sade kalabilir; tasarımın ağırlığı malzemeye ve profile geçer.",
        ],
        list: [
          "Malzeme ilk izlenimi belirler: metal ağır ve kurumsal, ahşap sıcak ve doğal, mat PVC hafif ve sade.",
          "Profil fotoğrafınız net, yüzünüz belirgin olsun.",
          "En çok kullandığınız iletişim kanalını profilde en üste alın.",
          "Unvanınızı tek satırda tutun; uzun açıklamaları Hakkında bölümüne yazın.",
        ],
        link: { href: "/rehber/dijital-kartvizit-ornekleri", label: "Dijital kartvizit örnekleri" },
      },
      {
        heading: "Dijivizit kartlarının tasarımı",
        paragraphs: [
          "Dijivizit kartları standart bir tasarımla üretilir: ön yüzün solunda Dijivizit logosu, sağında temassız işareti bulunur; arka yüz boştur. Kartın üzerinde adınız yazmaz. Logo metal kartlarda yüzeye lazerle kazınır, ahşap kartlarda lazerle yakılır, mat siyah PVC kartlarda mat yüzeye işlenir.",
          "10 ve üzeri kartlık kurumsal siparişlerde Dijivizit logosu yerine firma logonuz işlenir ve %20 indirim uygulanır.",
        ],
        list: [
          "Mat siyah PVC: 2.500 TL",
          "Koyu ve açık ahşap: 2.500 TL",
          "Siyah, gümüş ve gold metal: 4.000 TL",
        ],
        link: { href: "/kartvizit", label: "Kaplamaları ve fiyatları görün" },
      },
      {
        heading: "Kâğıt ve NFC'yi birlikte kullanmak",
        paragraphs: [
          "Kâğıt kartvizitinizi korumak istiyorsanız arka yüzüne dijital profilinize açılan QR kodu ekleyin. Böylece kâğıt kart dağıtılır, bilgileriniz ise QR'ın açtığı profilde güncel kalır.",
        ],
        link: { href: "/qr-kartvizit-olustur", label: "Ücretsiz QR kartvizit oluştur" },
      },
    ],
    faq: [
      {
        q: "Kartvizit tasarımı için hangi program kullanılır?",
        a: "Profesyonel baskı için genellikle vektör tabanlı tasarım programları tercih edilir. Hazır şablon sunan çevrimiçi araçlar da yeterlidir; dosyayı 300 dpi, CMYK ve kesim paylı olarak dışa aktarın.",
      },
      {
        q: "Dijivizit kartına kendi tasarımımı basabilir miyim?",
        a: "Standart Dijivizit kartları aynı tasarımla üretilir. 10 ve üzeri kurumsal siparişlerde kartlara firma logonuz işlenir.",
      },
      {
        q: "Kartvizitte fotoğraf kullanılır mı?",
        a: "Emlak ve danışmanlık gibi kişiye güvenin önemli olduğu işlerde kullanılabilir. Dijital kartvizitte fotoğraf profilin en üstünde yer alır.",
      },
    ],
  },
  {
    slug: "dijital-kartvizit-karsilastirma",
    label: "Dijital kartvizit karşılaştırma",
    title: "Dijital Kartvizit Karşılaştırma 2026: Türk Markaları",
    description:
      "Dijital kartvizit karşılaştırma 2026: Trowas, Cool Card, Ticicard, vTag, Parsvizit ve Dijivizit; kart malzemeleri, fiyatlar, abonelik ve ekip özellikleri.",
    image: "/rehber/en-iyi-dijital-kartvizit-nasil-secilir.jpg",
    imageAlt: "Elde tutulan mat siyah Dijivizit NFC kartvizit",
    published: "2026-11-05",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Bu karşılaştırmayı Dijivizit hazırladı. Tek bir en iyi dijital kartvizit yok: bazı markalar kartı tek seferlik satar, bazıları aylık plan sunar; ekip paneli ve fiyatlar farklıdır. Aşağıda Kasım 2026 itibarıyla firmaların sitelerinde yazan bilgileri, yorum katmadan, seçim kriterleriyle birlikte bulacaksınız.",
        ],
      },
      {
        heading: "Trowas",
        paragraphs: [],
        list: [
          "Kartlar: beyaz, siyah ve gümüş kartlar; siyah, altın, gümüş ve rose gold metal; 24K gold; bambu",
          'Fiyat: beyaz, siyah, gümüş 999 TL; metal kartlar 2.999 TL (metal gümüş "çok yakında" olarak listeleniyor); bambu 1.299 TL; 24K gold 6.990 TL',
          "Abonelik: sitede belirtilmemiş",
          "Ekip: Trowas Teams adıyla ekip kartlarını tek panelden yönetme",
          "Uygulama: App Store ve Google Play'de Trowas Pro uygulaması var; karşı tarafın NFC ile okutması için uygulama gerekmediği belirtiliyor",
          "NFC ve QR: ikisi de var",
        ],
      },
      {
        heading: "Cool Card",
        paragraphs: [],
        list: [
          "Kartlar: siyah Prestige, bambu, metal ve renkli kart",
          "Fiyat: ana sayfada kontrol ettiğimizde dolar cinsinden gösteriliyordu; 27,90 $ ile 59,90 $ arası (para birimi bölgeye göre farklı görünebilir)",
          'Abonelik: "1 kez öder, ömür boyu kullanırsınız" ifadesi var; ayrıca Pro+ ve Cool Enterprise adlı işletme planlarından söz ediliyor, aylık plan fiyatları sitede belirtilmemiş',
          "Ekip: yönetim paneli, Zapier üzerinden CRM entegrasyonu, Pro+ planında API entegrasyonu ve toplu işlemler",
          "Uygulama: gerekmediği belirtiliyor",
          "NFC ve QR: ikisi de var",
        ],
      },
      {
        heading: "Ticicard",
        paragraphs: [],
        list: [
          "Kartlar: mat siyah PVC, bambu ahşap, siyah, gold, silver ve rose gold metal, simli kartlar; ayrıca yaka kartı, anahtarlık ve etiket",
          "Fiyat: her ürün için iki fiyat yan yana gösteriliyor (örneğin metal kartlarda 2.499 TL ve 2.699 TL, mat siyah PVC'de 999 TL ve 1.149 TL)",
          "Abonelik: sitede belirtilmemiş",
          "Ekip: kurumsal talep sayfası ve personel kartlarının merkezden yönetimi anlatılıyor",
          "Uygulama: gerekmediği belirtiliyor",
          "NFC ve QR: ikisi de var",
        ],
      },
      {
        heading: "vTag",
        paragraphs: [],
        list: [
          "Kartlar: fiziksel NFC kart; malzeme ana sayfada belirtilmemiş",
          'Fiyat: dijital kartvizit "₺199\'dan" başlayan fiyatla listeleniyor',
          "Abonelik: ücretsiz plan (0 TL), Standart 79 TL/ay, Pro+ 129 TL/ay; 100+ çalışanlı firmalar için özel fiyat; yıllık ödemede indirim",
          "Ekip: 10–50 kişilik ekipler için kişi başı 79 TL/ay, ekip yönetim paneli ve departman bazlı raporlama",
          "Uygulama: karşı taraf için gerekmediği belirtiliyor; iOS uygulaması var",
          "NFC ve QR: ikisi de var",
        ],
      },
      {
        heading: "Parsvizit",
        paragraphs: [],
        list: [
          "Kartlar: beyaz dikey NFC dijital kartvizit; ayrıca Google yorum, Instagram ve Facebook takip kartları ile standlar",
          "Fiyat: beyaz dikey NFC dijital kartvizit 1.499 TL",
          "Abonelik: sitede belirtilmemiş",
          "Ekip: kurumsal paketteki kartların online yönetimi, analitik, iletişim formu ve randevu modülü",
          "Uygulama: sitede belirtilmemiş",
          "NFC ve QR: ikisi de var",
        ],
      },
      {
        heading: "Dijivizit",
        paragraphs: [],
        list: [
          "Kartlar: mat siyah PVC; siyah, gümüş ve gold metal; koyu ve açık ahşap; kartsız dijital kartvizit",
          "Fiyat: PVC ve ahşap 2.500 TL, metal 4.000 TL; KDV dahil, kargo ücretsiz, 72 saatte teslim",
          "Abonelik: kartla gelen profil ilk yıl ücretsiz, sonra aylık 59,90 TL; kartsız dijital kartvizit yıllık 718,80 TL; otomatik çekim yok",
          "Ekip: ekip paneli, kart devri, 10 ve üzeri adette %20 indirim ve firma logosu",
          "Öne çıkanlar: ziyaretçi bilgi formu, kişi listesi ve takip hatırlatmaları, kâğıt kartvizit tarama, şehir ve cihaz bazında analitik, kayıp kartı kapatma, Apple Cüzdan",
          "Uygulama: gerekmez; NFC ve QR ikisi de var",
        ],
        link: { href: "/kartvizit", label: "Dijivizit fiyatları" },
      },
      {
        heading: "Seçerken nelere bakmalı?",
        paragraphs: [
          "Karşılaştırmada fiyat kadar toplam maliyete ve kartı verdikten sonra ne olduğuna bakın:",
        ],
        list: [
          "Toplam maliyet: kart + varsa yıllık profil ücreti + KDV + kargo",
          "Ödeme modeli: tek seferlik mi, abonelik mi; abonelikte otomatik çekim var mı?",
          "Rehbere kayıt: karşı taraf sizi tek dokunuşla kaydedebiliyor mu?",
          "Geri dönüş: ziyaretçi size bilgisini bırakabiliyor mu?",
          "Gizlilik: profil adresi tahmin edilebilir mi, kaybolan kart kapatılabiliyor mu?",
          "Ekip: çalışan değişince kart yeniden basılmadan devredilebiliyor mu?",
          "Teslimat ve değişim: kaç günde geliyor, okunmayan kart değiştiriliyor mu?",
        ],
        link: {
          href: "/rehber/en-iyi-dijital-kartvizit-nasil-secilir",
          label: "Dijital kartvizit seçerken 7 kriter",
        },
      },
    ],
    faq: [
      {
        q: "Dijital kartvizit fiyatları ne kadar?",
        a: "Kasım 2026'da baktığımız sitelerde plastik ve PVC kartlar 999 TL ile 2.500 TL, metal kartlar 2.499 TL ile 4.000 TL arasında listeleniyordu; vTag'de dijital kartvizit \"₺199'dan\" başlıyor ve aylık planlar ayrıca ücretlendiriliyor. Toplam maliyete yıllık profil ücretini, KDV'yi ve kargoyu da ekleyin.",
      },
      {
        q: "Abonelik ücreti olmayan dijital kartvizit var mı?",
        a: 'Cool Card sitesinde "1 kez öder, ömür boyu kullanırsınız" ifadesi yer alıyor. Diğer markaların bazılarında abonelik bilgisi ana sayfada belirtilmemiş; satın almadan önce firmaya sorun.',
      },
      {
        q: "Bu karşılaştırma tarafsız mı?",
        a: 'Karşılaştırmayı Dijivizit hazırladı. Diğer markalar için yalnızca 5 Kasım 2026\'da kendi Türkçe ana sayfalarında herkese açık olarak gördüğümüz bilgileri yazdık; göremediğimiz bilgiyi tahmin etmedik ve "sitede belirtilmemiş" diye not ettik. Fiyatlar ve kampanyalar sık değişir; satın almadan önce firmanın kendi sitesinden doğrulayın. Hatalı ya da eskimiş bir bilgi görürseniz bize yazın, düzeltelim.',
      },
      {
        q: "Dijivizit'te ekip özellikleri var mı?",
        a: "Evet. Ekip panelinden kartları çalışanlara atarsınız, çalışan değişince kartı devredersiniz. 10 ve üzeri adette %20 indirim uygulanır ve kartlara firma logosu işlenir.",
      },
    ],
  },
  {
    slug: "dijital-kartvizit-uygulamasi",
    label: "Dijital kartvizit uygulaması",
    title: "Dijital Kartvizit Uygulaması: Uygulama Gerekir mi?",
    description:
      "Dijital kartvizit uygulaması indirmek şart mı? Uygulamalı ve uygulamasız dijital kartvizit farkları, karşı tarafın deneyimi ve seçerken bakılacaklar.",
    image: "/rehber/dijital-kartvizit-nasil-olusturulur.jpg",
    imageAlt: "Telefon ekranında Dijivizit dijital kartvizit profili",
    published: "2026-11-09",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Dijital kartvizit kullanmak için çoğu zaman uygulama gerekmez. Asıl önemli olan, kartvizitinizi alan kişinin hiçbir şey indirmeden profilinizi açıp sizi rehberine kaydedebilmesidir. Bazı hizmetler profilinizi düzenlemeniz için bir uygulama sunar; bu sizin tercihinizdir. Karşı tarafa uygulama indirtmek ise tanışmayı yavaşlatır.",
        ],
        link: { href: "/", label: "Dijital kartvizit" },
      },
      {
        heading: "Dijital kartvizit uygulaması ne işe yarar?",
        paragraphs: [
          "Dijital kartvizit uygulaması denince genellikle iki şey kastedilir: kendi kartvizitinizi oluşturup düzenlediğiniz bir yönetim aracı ya da başkalarının kartvizitlerini okuyup sakladığınız bir tarayıcı. İkisi de işe yarar, ama ikisi de kartvizitin kendisi değildir.",
          "Kartvizitin kendisi, bağlantıya, QR koda ya da NFC karta dokununca açılan profil sayfasıdır. Bu sayfa telefonun tarayıcısında açılıyorsa karşı taraf için hiçbir uygulama gerekmez.",
        ],
      },
      {
        heading: "Uygulamalı ve uygulamasız: farklar",
        paragraphs: [],
        list: [
          "Karşı taraf: uygulamasız profilde kişi yalnızca kartı okutur ya da linke dokunur; uygulama isteyen sistemlerde önce indirme ve kayıt adımı gelir.",
          "Telefon uyumu: tarayıcıda açılan profil iPhone'da da Android'de de aynı görünür; uygulamanın her iki mağazada güncel olması gerekir.",
          "Düzenleme: uygulamalı hizmetlerde profili telefondan düzenlersiniz; web tabanlı hizmetlerde aynı işi tarayıcıdaki panelden yaparsınız.",
          "Yer ve bildirim: uygulama telefonda yer kaplar, güncelleme ister; web paneli için bir şey kurmazsınız.",
          "Güncelleme: iki modelde de bilgileriniz değişince profili düzenlersiniz; kartı yeniden bastırmanız gerekmez.",
        ],
      },
      {
        heading: "Karşı tarafın gözünden",
        paragraphs: [
          "Tanışma birkaç saniyelik bir andır. Kartınızı okutan kişiye bir uygulama indirmesini söylemek, çoğu zaman o anın kaybolması demektir. Bu yüzden seçerken ilk soru şu olmalı: kartvizitimi alan kişi hiçbir şey kurmadan beni rehberine kaydedebiliyor mu?",
          "Güncel iPhone'lar NFC kartı kendiliğinden okur; Android telefonlarda NFC'nin açık olması yeterlidir. NFC'si olmayan ya da kapalı olan telefonlarda aynı profil QR kodla açılır.",
        ],
        link: {
          href: "/rehber/nfc-kartvizit-hangi-telefonlarda-calisir",
          label: "NFC kartvizit hangi telefonlarda çalışır?",
        },
      },
      {
        heading: "Dijivizit'te uygulama gerekir mi?",
        paragraphs: [
          'Hayır. Dijivizit profili her telefonun tarayıcısında açılır; karşınızdaki kişi "Rehberime Kaydet" ile sizi tek dokunuşla kaydeder. Siz de profilinizi, ziyaretçilerin bıraktığı bilgileri ve analitiği tarayıcıdan girdiğiniz panelden yönetirsiniz.',
        ],
        list: [
          "NFC kart, profil linki ve QR kod aynı profili açar.",
          'Ziyaretçi "Bilgilerimi bırak" ile kendi adını ve numarasını size iletir.',
          "Size verilen kâğıt kartvizitin fotoğrafını çekersiniz; ad, unvan, şirket ve telefon kendiliğinden dolar.",
          "Profilinizi Apple Cüzdan'a ekleyip kart yanınızda değilken QR'ı telefonunuzdan gösterebilirsiniz.",
          "Kaybolan kartı panelden tek tıkla kapatırsınız.",
        ],
        link: { href: "/dijital-kartvizit", label: "Dijital kartvizit özellikleri" },
      },
      {
        heading: "Seçerken nelere bakmalı?",
        paragraphs: [],
        list: [
          "Karşı taraftan uygulama istiyor mu?",
          "Tek dokunuşla rehbere kayıt var mı?",
          "NFC'nin yanında link ve QR kod da veriliyor mu?",
          "Profil adresi tahmin edilemez mi, kaybolan kart kapatılabiliyor mu?",
          "Toplam maliyet ne: kart, yıllık profil ücreti, KDV ve kargo?",
        ],
        link: {
          href: "/rehber/en-iyi-dijital-kartvizit-nasil-secilir",
          label: "Dijital kartvizit seçerken 7 kriter",
        },
      },
      {
        heading: "Uygulama indirmeden deneyin",
        paragraphs: [
          "Bilgilerinizi yazıp profilinizin telefonda nasıl görüneceğini ücretsiz önizleyebilir, rehbere kaydeden QR kodunuzu indirebilirsiniz. Kart istemiyorsanız kartsız dijital kartvizitle link ve QR kodunuz 2 saat içinde e-postanızda olur; aylık 59,90 TL, yıllık 718,80 TL olarak peşin ödenir.",
        ],
        link: { href: "/dijital-kartvizit-olustur", label: "Ücretsiz dijital kartvizit oluştur" },
      },
    ],
    faq: [
      {
        q: "Dijital kartvizit için hangi uygulamayı indirmeliyim?",
        a: "Karşı tarafın uygulama indirmesine gerek olmayan bir hizmet seçin. Dijivizit'te ne sizin ne de kartınızı okutan kişinin uygulama indirmesi gerekir; her şey tarayıcıda açılır.",
      },
      {
        q: "Uygulamasız dijital kartvizit iPhone'da çalışır mı?",
        a: "Evet. Güncel iPhone'lar NFC kartı ayrıca bir şey açmadan okur ve profil Safari'de açılır. Kart yanınızda değilse QR kodu okutmak yeterlidir.",
      },
      {
        q: "Uygulama olmadan profilimi nasıl güncellerim?",
        a: "Telefonunuzun ya da bilgisayarınızın tarayıcısından panele girip bilgilerinizi değiştirirsiniz. Değişiklik kaydedildiğinde kartınızı, linkinizi ya da QR kodunuzu okutan herkes yeni bilgileri görür.",
      },
      {
        q: "Ücretsiz dijital kartvizit uygulaması var mı?",
        a: "Ücretsiz seçenekler var; çoğu temel özellikleri ücretsiz verip diğerlerini ücretli plana bırakır. Dijivizit'te dijital kartvizitinizi ücretsiz önizleyebilir, rehbere kaydeden QR kodunuzu üyelik olmadan ücretsiz indirebilirsiniz.",
      },
    ],
  },
  {
    slug: "kartvizit-nasil-verilir",
    label: "Kartvizit nasıl verilir",
    title: "Kartvizit Nasıl Verilir? Görgü Kuralları ve İpuçları",
    description:
      "Kartvizit nasıl verilir ve nasıl alınır? Doğru zamanlama, tutuş, toplantı ve fuar görgü kuralları ile dijital ve NFC kartvizit paylaşırken dikkat edilecekler.",
    image: "/rehber/nfc-kartvizit-nereden-alinir.jpg",
    imageAlt: "İş toplantısında siyah metal NFC kartvizit karşı tarafa uzatılıyor",
    published: "2026-11-09",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Kartvizit, tanışma ve kısa bir sohbetten sonra, yazısı karşı tarafa dönük şekilde ve tercihen iki elle ya da sağ elle verilir. Alırken kartı birkaç saniye inceleyin, cebinize atmak yerine kartlığa ya da masaya koyun. Kartı ilk saniyede uzatmak yerine sohbetin doğal bir anını beklemek daha kibar durur.",
        ],
      },
      {
        heading: "Ne zaman verilir?",
        paragraphs: [
          "Kartvizit bir tanışmanın sonucudur, başlangıcı değil. En uygun an, karşınızdakiyle ortak bir konu bulduktan ya da tekrar görüşme fikri doğduktan sonradır.",
        ],
        list: [
          "Toplantıda: başta tanışırken ya da toplantı bitiminde verilir; toplantı sırasında araya girerek dağıtılmaz.",
          "Yemekte: yemek boyunca değil, sonunda verilir.",
          "Fuarda ve etkinlikte: birkaç dakikalık konuşmanın sonunda, karşı taraf ilgi gösterdiyse verilir.",
          "İstenmeden herkese dağıtmayın; bir kişiye birden fazla kart vermeyin.",
        ],
      },
      {
        heading: "Nasıl verilir?",
        paragraphs: [],
        list: [
          "Kartı yazısı karşı tarafa dönük ve okunacak yönde tutun.",
          "İki elle ya da sağ elle verin; kartı masaya fırlatmayın, uzatın.",
          "Verirken adınızı ve ne iş yaptığınızı tek cümleyle söyleyin.",
          "Kart temiz ve düz olsun; buruşuk, lekeli ya da üzerinde elle düzeltme olan kartı vermeyin.",
          "Kartlarınızı cüzdanın arkasında değil, kolayca çıkarabileceğiniz bir kartlıkta taşıyın.",
        ],
      },
      {
        heading: "Kartvizit alırken",
        paragraphs: [
          "Kartı veren kişiye saygı, kartı nasıl aldığınızla da anlaşılır. Kartı alın, adına ve unvanına birkaç saniye bakın, gerekirse adını telaffuz ederek teşekkür edin.",
        ],
        list: [
          "Kartı hemen arka cebe atmayın.",
          "Toplantıda kartları önünüze, karşınızdakilerin oturma sırasına göre dizebilirsiniz; adları karıştırmazsınız.",
          "Kişinin önünde kartın üzerine not almayın; notunuzu sonra yazın.",
          "Kartınız yanınızda değilse özür dileyip iletişim bilgilerinizi hemen başka bir yolla iletin.",
        ],
      },
      {
        heading: "Uluslararası görüşmelerde",
        paragraphs: [
          "Bazı kültürlerde kartvizit alışverişi daha resmîdir. Japonya'da kart iki elle, yazısı karşıya dönük ve hafifçe eğilerek verilir; alınan kart toplantı boyunca masada durur. Çin'de de iki elle vermek ve kartı dikkatle incelemek saygı göstergesidir. Yabancı iş ortaklarıyla görüşmeden önce o ülkenin alışkanlıklarına kısaca göz atmak iyi bir izlenim bırakır.",
        ],
      },
      {
        heading: "Dijital ve NFC kartvizitte görgü",
        paragraphs: [
          "NFC kartvizitte kart elden çıkmaz; karşınızdakinin telefonuna dokundurulur ve profiliniz açılır. Burada da aynı incelik geçerlidir: önce izin isteyin, kartı kendiniz okutun, telefonu karşınızdakinin elinden almayın.",
        ],
        list: [
          'Kısa bir cümle yeterli: "Telefonunuzu uzatır mısınız, bilgilerim rehberinize kaydolsun."',
          "Telefonda NFC kapalıysa ısrar etmeyin; QR kodu gösterin.",
          'Dijivizit profilinde karşınızdaki kişi "Bilgilerimi bırak" ile kendi numarasını size iletebilir; kartını unutmuşsa ona bu yolu önerin.',
          "Dijital kartvizit linkini mesajla gönderirken kısa bir tanıtım cümlesi ekleyin; yalnızca link göndermek soğuk durur.",
        ],
        link: {
          href: "/rehber/dijital-kartvizit-nasil-paylasilir",
          label: "Dijital kartvizit nasıl paylaşılır?",
        },
      },
      {
        heading: "Görüşmeden sonra",
        paragraphs: [
          "Kartvizitin değeri, sonrasında yapılan takiple ortaya çıkar. Görüşmeden sonraki birkaç gün içinde kısa bir mesaj ya da e-posta atın ve konuştuğunuz konuyu hatırlatın.",
          'Dijivizit panelinde aldığınız kâğıt kartvizitin fotoğrafını çekerek kişiyi kaydedebilir, "Bir hafta sonra hatırlat" dediğiniz kişiler için günü gelince e-posta alırsınız; WhatsApp mesajı hazır yazılmış olur.',
        ],
        link: { href: "/nfc-kartvizit", label: "NFC kartvizit nasıl çalışır?" },
      },
    ],
    faq: [
      {
        q: "Kartvizit tek elle verilir mi?",
        a: "Türkiye'de sağ elle vermek yeterince kibardır. İki elle vermek daha resmî ve saygılı durur; özellikle Japonya, Çin ve Kore'den iş ortaklarıyla görüşürken iki elle verin.",
      },
      {
        q: "Kartvizit kime önce verilir?",
        a: "Genellikle ziyaret eden taraf ya da kendini tanıtan kişi önce verir. Kalabalık bir toplantıda en kıdemli kişiden başlamak uygun olur.",
      },
      {
        q: "Kartvizitim bittiyse ne yapmalıyım?",
        a: "Özür dileyin ve bilgilerinizi hemen iletin: telefon numaranızı yazdırın ya da dijital kartvizit linkinizi mesajla gönderin. NFC kartvizit ya da QR kodlu profil kullanıyorsanız kart bitmez; aynı kart herkese okutulur.",
      },
      {
        q: "Fuarda kartvizit nasıl verilir?",
        a: "Kısa bir sohbetten sonra, ilgi gösteren kişiye verin. Kalabalıkta NFC ya da QR ile paylaşmak hızlıdır ve kartlarınızın bitmesi sorunu ortadan kalkar.",
      },
    ],
  },
  {
    slug: "kredi-karti-olculeri",
    label: "Kredi kartı ölçüleri",
    title: "Kredi Kartı Kaç cm? Ölçüsü 8,56 × 5,40 cm (ID-1)",
    description:
      "Kredi kartı kaç cm? ISO/IEC 7810 ID-1 standardında 85,60 × 53,98 mm, kalınlık 0,76 mm. Banka kartı, kimlik kartı ve kartvizitle ölçü karşılaştırması.",
    image: "/rehber/qr-kod-kartvizit.jpg",
    imageAlt: "Deri kartlıktan çıkarılan kredi kartı boyutunda siyah Dijivizit NFC kartvizit",
    published: "2026-11-13",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Kredi kartı 85,60 × 53,98 mm, yani yaklaşık 8,56 × 5,40 cm boyutunda ve 0,76 mm kalınlığındadır; bu ölçü ISO/IEC 7810 standardındaki ID-1 formatıdır ve köşeleri yaklaşık 3,18 mm yarıçapla yuvarlatılır.",
          "Kredi kartları ve banka kartları bu standarda göre üretilir; cüzdanların kart bölmeleri ve kartlıklar da bu ölçüye göre tasarlanır.",
        ],
      },
      {
        heading: "Kredi kartı ölçüleri: mm, cm ve inç",
        paragraphs: [],
        list: [
          "Uzun kenar: 85,60 mm = 8,56 cm = 3,370 inç",
          "Kısa kenar: 53,98 mm = 5,40 cm = 2,125 inç",
          "Kalınlık: 0,76 mm = 0,076 cm = 0,030 inç",
          "Köşe yarıçapı: yaklaşık 3,18 mm = 0,318 cm = 0,125 inç",
          "En-boy oranı: yaklaşık 1,586",
        ],
      },
      {
        heading: "Banka kartı, kimlik kartı ve ehliyet aynı boyutta mı?",
        paragraphs: [
          "Banka kartı ve kredi kartı aynı ID-1 standardını kullanır; ikisi de 85,60 × 53,98 mm'dir. Çipli T.C. kimlik kartı da ID-1, yani kredi kartı boyutundadır; eski kimlik kartlarından daha küçüktür.",
          "Sürücü belgesi bilgileri çipli kimlik kartına yüklenebilir; ehliyet özellikli kimlik kartı da aynı kart olduğu için ölçüsü aynıdır.",
        ],
      },
      {
        heading: "Kartvizit ile kredi kartı arasındaki fark",
        paragraphs: [
          "Türkiye'de standart kâğıt kartvizit 85 × 55 mm'dir. Kredi kartı 85,60 × 53,98 mm olduğu için kartvizitten 0,6 mm daha uzun, yaklaşık 1 mm daha kısadır. Elde fark neredeyse hissedilmez, ama baskı dosyası hazırlarken iki ölçü birbirinin yerine kullanılmamalıdır.",
        ],
        list: [
          "Kâğıt kartvizit: 85 × 55 mm, köşeler genellikle düz",
          "Kredi kartı ve NFC kart: 85,60 × 53,98 mm, köşeler yuvarlatılmış",
          "Kalınlık: kâğıt kartvizitte gramajla ölçülür (genellikle 300–400 gr/m²), kredi kartında 0,76 mm",
        ],
        link: { href: "/rehber/kartvizit-olculeri", label: "Kartvizit ölçüleri rehberi" },
      },
      {
        heading: "NFC kartvizit neden kredi kartı boyutunda?",
        paragraphs: [
          "NFC kartvizitler genellikle kredi kartı ölçüsündedir: cüzdanın kart bölmesine, kartlıklara ve telefon kılıflarının kart cebine banka kartınız gibi oturur. Kâğıt kartvizit gibi ayrı bir kutuda taşınmaz.",
          "Dijivizit'in PVC, metal ve ahşap NFC kartları da kredi kartı boyutundadır. Mat siyah PVC ve ahşap kartlar 2.500 TL, metal kartlar 4.000 TL'dir; KDV dahil, kargo ücretsiz, 72 saatte teslim.",
        ],
        link: { href: "/nfc-kartvizit", label: "NFC kartvizit modelleri" },
      },
      {
        heading: "Metal ve ahşap kartlarda ölçü",
        paragraphs: [
          "Metal ve ahşap NFC kartlar da aynı en ve boy ölçüsündedir. Malzeme farklı olduğu için elde hissi değişir; metal kart belirgin şekilde daha ağırdır ve lazer kazıma yüzeyi silinmez.",
        ],
        link: { href: "/metal-kartvizit", label: "Metal kartvizit" },
      },
      {
        heading: "Baskı ve tasarım için ölçüler",
        paragraphs: [
          "Kredi kartı boyutunda bir kart tasarlarken dosyayı net ölçüyle değil, kesim payıyla hazırlayın. Photoshop'ta yeni belgeyi 300 piksel/inç çözünürlükle açın; baskı için renk modunu CMYK seçin.",
        ],
        list: [
          "Net ölçü 85,6 × 54 mm: 300 dpi'da 1011 × 638 piksel",
          "2 mm kesim paylı dosya 89,6 × 58 mm: yaklaşık 1058 × 685 piksel",
          "3 mm kesim paylı dosya 91,6 × 60 mm: yaklaşık 1082 × 709 piksel",
          "Güvenli alan: yazı ve logoları kenardan en az 3–5 mm içeride tutun",
          "Köşeler yuvarlatıldığı için köşelere önemli bir öğe koymayın",
        ],
      },
    ],
    faq: [
      {
        q: "Kredi kartı kaç cm?",
        a: "Kredi kartı 8,56 × 5,40 cm'dir; milimetre olarak 85,60 × 53,98 mm. Bu ölçü ISO/IEC 7810 ID-1 standardıdır.",
      },
      {
        q: "Kredi kartı kalınlığı kaç mm?",
        a: "ID-1 standardındaki kartların kalınlığı 0,76 mm'dir.",
      },
      {
        q: "Banka kartı kaç cm?",
        a: "Banka kartı da kredi kartıyla aynı ölçüdedir: 8,56 × 5,40 cm (85,60 × 53,98 mm), 0,76 mm kalınlık.",
      },
      {
        q: "Kredi kartı ile kartvizit aynı boyutta mı?",
        a: "Neredeyse. Standart kartvizit 85 × 55 mm, kredi kartı 85,60 × 53,98 mm'dir. NFC kartvizitler genellikle kredi kartı ölçüsündedir.",
      },
      {
        q: "Kredi kartı kaç piksel?",
        a: "300 dpi'da 85,6 × 54 mm'lik bir kart 1011 × 638 pikseldir. 3 mm kesim payıyla dosya yaklaşık 1082 × 709 piksel olur.",
      },
    ],
  },
  {
    slug: "oppo-nfc-acma",
    label: "Oppo NFC açma",
    title: "Oppo NFC Nasıl Açılır? ColorOS'ta Adım Adım",
    description:
      "Oppo telefonda NFC nasıl açılır? ColorOS'ta Ayarlar > Bağlantı ve paylaşım > NFC yolu, hızlı ayarlar düğmesi ve NFC kartvizitin telefona doğru okutulması.",
    image: "/rehber/telefonda-nfc-nasil-acilir.jpg",
    imageAlt:
      "Siyah NFC kartvizit telefonun arkasına yaklaştırılmış, ekranda dijital kartvizit profili açık",
    published: "2026-11-13",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Oppo telefonlarda NFC, Ayarlar > Bağlantı ve paylaşım > NFC yolundan açılır. Daha hızlısı, ekranın üstünden aşağı kaydırıp hızlı ayarlardaki NFC düğmesine dokunmaktır. NFC açıldıktan sonra kartı telefonun arkasına 1-2 saniye tutmanız yeterlidir; uygulama gerekmez.",
        ],
      },
      {
        heading: "Ayarlardan NFC'yi açma",
        paragraphs: [
          "Menü adları ColorOS sürümüne göre küçük farklar gösterebilir; bazı eski sürümlerde NFC, Diğer kablosuz bağlantılar bölümündedir.",
        ],
        list: [
          "Ayarlar'ı açın.",
          '"Bağlantı ve paylaşım" bölümüne girin.',
          "NFC'ye dokunun ve anahtarı açın.",
          'Menüyü bulamazsanız ayarların arama kutusuna "NFC" yazın.',
          "Hızlı yol: ekranın üstünden aşağı kaydırın ve NFC düğmesine dokunun. Düğme yoksa düzenle simgesinden panele ekleyin.",
        ],
      },
      {
        heading: "Realme ve OnePlus'ta da aynı mı?",
        paragraphs: [
          "Realme ve OnePlus telefonlar da ColorOS tabanlı bir arayüz kullandığı için NFC ayarı genellikle aynı yerdedir: Ayarlar > Bağlantı ve paylaşım > NFC. Farklıysa arama kutusuna NFC yazmak en hızlı yoldur.",
        ],
      },
      {
        heading: "Telefonumda NFC yoksa?",
        paragraphs: [
          "Her Oppo modelinde NFC bulunmaz; özellikle bazı giriş seviyesi modellerde bu özellik olmayabilir. Ayarlarda arama yaptığınızda NFC çıkmıyorsa telefonunuzda NFC yoktur. Bu durumda karşınızdaki kişi profilinizin QR kodunu kamerayla okutur; Dijivizit kartlarıyla birlikte profil linkiniz ve QR kodunuz da verilir.",
        ],
        link: { href: "/nfc-kartvizit", label: "NFC kartvizit modelleri" },
      },
      {
        heading: "NFC kartvizit nasıl okutulur?",
        paragraphs: [
          "NFC açıkken ekranın kilidini açın ve kartı telefonun arka yüzünün orta ya da üst-orta kısmına yaklaştırın; okuma noktası modele göre biraz değişir. Kartı 1-2 saniye sabit tutun, ekranda çıkan bildirime dokununca profil tarayıcıda açılır. Kalın, metal plakalı ya da mıknatıslı kılıflar okumayı zorlaştırabilir.",
        ],
        link: { href: "/rehber/nfc-kartvizit-okumuyor", label: "NFC kartvizit okumuyor mu?" },
      },
      {
        heading: "Diğer markalar",
        paragraphs: [
          "Samsung, iPhone, Xiaomi, Huawei, General Mobile, Omix ve diğer telefonlarda NFC açma adımları genel rehberde.",
        ],
        link: { href: "/rehber/telefonda-nfc-nasil-acilir", label: "Telefonda NFC nasıl açılır?" },
      },
    ],
    faq: [
      {
        q: "Oppo telefonda NFC nerede?",
        a: "Ayarlar > Bağlantı ve paylaşım > NFC yolundadır. Ekranın üstünden aşağı kaydırınca açılan hızlı ayarlar panelinde de NFC düğmesi bulunur.",
      },
      {
        q: "Oppo'da NFC açık ama kart okunmuyor, ne yapmalıyım?",
        a: "Ekran kilidini açın, kartı arka yüzün ortasına 1-2 saniye sabit tutun ve kılıfı çıkarıp deneyin. Olmazsa profilin QR kodunu okutun.",
      },
      {
        q: "NFC açık kalırsa pil tüketir mi?",
        a: "Çok az. NFC yalnızca birkaç santimetre mesafede ve ekran açıkken çalışır; günlük pil kullanımında fark edilmez.",
      },
    ],
  },
  {
    slug: "samsung-nfc-acma",
    label: "Samsung NFC açma",
    title: "Samsung NFC Nasıl Açılır? One UI'da Adım Adım",
    description:
      "Samsung Galaxy telefonda NFC nasıl açılır? Ayarlar > Bağlantılar > NFC ve temassız ödemeler yolu, hızlı ayarlar düğmesi ve NFC kartvizitin okutulması.",
    image: "/rehber/nfc-kartvizit-hangi-telefonlarda-calisir.jpg",
    imageAlt: "Gold NFC kartvizit telefona yaklaştırılıyor",
    published: "2026-11-13",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Samsung Galaxy telefonlarda NFC, Ayarlar > Bağlantılar > NFC ve temassız ödemeler yolundan açılır. Hızlı ayarlar panelinde de NFC düğmesi vardır. NFC açıldıktan sonra kartı telefonun arkasına 1-2 saniye tutmanız yeterlidir; uygulama gerekmez.",
        ],
      },
      {
        heading: "Ayarlardan NFC'yi açma",
        paragraphs: [
          "Menü adları One UI sürümüne göre küçük farklar gösterebilir; bulamazsanız ayarların arama kutusuna NFC yazın.",
        ],
        list: [
          "Ayarlar'ı açın.",
          "Bağlantılar bölümüne girin.",
          '"NFC ve temassız ödemeler" anahtarını açın.',
        ],
      },
      {
        heading: "Hızlı ayarlardan açma",
        paragraphs: [],
        list: [
          "Ekranın üstünden iki kez aşağı kaydırın.",
          "NFC düğmesine dokunun.",
          "Düğme görünmüyorsa panelin düzenle (kalem) simgesinden NFC'yi ekleyin.",
        ],
      },
      {
        heading: "NFC ve temassız ödeme aynı ayar mı?",
        paragraphs: [
          "Evet. Samsung'da tek bir anahtar hem NFC veri okumayı hem temassız ödemeyi açar. NFC genellikle fabrikadan açık gelir, ama bir sistem güncellemesi ya da ağ ayarlarının sıfırlanması onu kapatabilir. NFC kartvizit okumak için bu anahtarın açık olması yeterlidir; ödeme uygulaması kurmanız gerekmez.",
        ],
        link: { href: "/nfc-kartvizit", label: "NFC kartvizit modelleri" },
      },
      {
        heading: "NFC kartvizit nasıl okutulur?",
        paragraphs: [
          "NFC açıkken ekranın kilidini açın ve kartı telefonun arka yüzünün orta ya da üst-orta kısmına yaklaştırın; okuma noktası modele göre biraz değişir. Kartı 1-2 saniye sabit tutun, ekranda çıkan bildirime dokununca profil tarayıcıda açılır. Kalın, metal plakalı ya da mıknatıslı kılıflar okumayı zorlaştırabilir.",
        ],
        link: { href: "/rehber/nfc-kartvizit-okumuyor", label: "NFC kartvizit okumuyor mu?" },
      },
      {
        heading: "Diğer markalar",
        paragraphs: [
          "Oppo, iPhone, Xiaomi, Huawei, General Mobile, Omix ve diğer telefonlarda NFC açma adımları genel rehberde.",
        ],
        link: { href: "/rehber/telefonda-nfc-nasil-acilir", label: "Telefonda NFC nasıl açılır?" },
      },
    ],
    faq: [
      {
        q: "Samsung'da NFC nerede?",
        a: "Ayarlar > Bağlantılar > NFC ve temassız ödemeler yolundadır. Hızlı ayarlar panelinde de NFC düğmesi bulunur.",
      },
      {
        q: "Telefonumda NFC olup olmadığını nasıl anlarım?",
        a: "Ayarların arama kutusuna NFC yazın. Sonuç çıkmıyorsa telefonunuzda NFC yoktur; bu durumda profilin QR kodunu kamerayla okutabilirsiniz.",
      },
      {
        q: "NFC açık kalırsa pil tüketir mi?",
        a: "Çok az. NFC yalnızca birkaç santimetre mesafede ve ekran açıkken çalışır; günlük pil kullanımında fark edilmez.",
      },
    ],
  },
  {
    slug: "iphone-nfc-acma",
    label: "iPhone NFC açma",
    title: "iPhone NFC Nasıl Açılır? Ayar Yok, Böyle Okutulur",
    description:
      "iPhone NFC nasıl açılır? Açma ayarı yoktur: XS ve sonrası etiketleri arka planda okur, iPhone 7, 8 ve X'te Denetim Merkezi'ndeki NFC Etiketi Okuyucu kullanılır.",
    image: "/rehber/nfc-kartvizit-nedir.jpg",
    imageAlt: "Siyah metal NFC kartvizit telefonun arkasına dokunuyor, ekranda dijital profil açık",
    published: "2026-11-13",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "iPhone'da NFC'yi açıp kapatan bir ayar yoktur. iPhone XS, XR ve sonraki modeller NFC etiketlerini arka planda kendiliğinden okur; ekran açıkken kartı telefonun üst arka kısmına yaklaştırmanız yeterlidir. iPhone 7, 8 ve X'te ise Denetim Merkezi'ndeki NFC Etiketi Okuyucu'ya dokunarak okutursunuz.",
        ],
      },
      {
        heading: "iPhone XS, XR ve sonrası",
        paragraphs: [],
        list: [
          "Ekranı açın.",
          "Kartı telefonun üst arka kısmına, kameraların yakınına yaklaştırın.",
          "Ekranın üstünde çıkan bildirime dokunun; telefon kilitliyse önce kilidi açmanız istenir.",
          "Profil tarayıcıda açılır.",
        ],
        link: {
          href: "/rehber/nfc-kartvizit-hangi-telefonlarda-calisir",
          label: "NFC kartvizit hangi telefonlarda çalışır?",
        },
      },
      {
        heading: "Arka planda okuma ne zaman çalışmaz?",
        paragraphs: ["Ekran açık olsa bile şu durumlarda iPhone etiketi arka planda okumaz:"],
        list: [
          "Kamera açıkken",
          "Cüzdan ya da Apple Pay kullanılırken",
          "Uçak modu açıkken",
          "Telefon yeniden başlatıldıktan sonra kilidi hiç açılmamışken",
          "Başka bir uygulama NFC okuması yaparken",
        ],
      },
      {
        heading: "iPhone 7, 8 ve X",
        paragraphs: [
          "Bu modeller etiketleri arka planda okumaz; Denetim Merkezi'ndeki NFC Etiketi Okuyucu'yu kullanırsınız. iPhone 6s ve daha eski modeller NFC etiketi okuyamaz; bu telefonlarda profilin QR kodunu kamerayla okutun.",
        ],
        list: [
          "Ayarlar > Denetim Merkezi'ne girin ve NFC Etiketi Okuyucu'yu ekleyin.",
          "Denetim Merkezi'ni açıp NFC Etiketi Okuyucu'ya dokunun.",
          "Kartı telefonun üst arka kısmına tutun.",
        ],
        link: { href: "/nfc-kartvizit", label: "NFC kartvizit modelleri" },
      },
      {
        heading: "NFC kartvizit nasıl okutulur?",
        paragraphs: [
          "iPhone'da NFC anteni üst kenara yakındır. Kartı arka yüzün üst kısmına, kameraların hemen altına yaklaştırın ve 1-2 saniye sabit tutun. Kalın, metal plakalı ya da mıknatıslı kılıflar okumayı zorlaştırabilir; okumazsa kılıfı çıkarıp deneyin ya da QR koda geçin. Dijivizit kartlarıyla birlikte profil linkiniz ve QR kodunuz da verilir.",
        ],
        link: { href: "/rehber/nfc-kartvizit-okumuyor", label: "NFC kartvizit okumuyor mu?" },
      },
      {
        heading: "Android telefonlar",
        paragraphs: [
          "Android'de NFC ayardan açılıp kapatılır. Samsung, Oppo, Xiaomi, Poco ve diğer markalarda NFC açma adımları genel rehberde.",
        ],
        link: { href: "/rehber/telefonda-nfc-nasil-acilir", label: "Telefonda NFC nasıl açılır?" },
      },
    ],
    faq: [
      {
        q: "iPhone'da NFC ayarı nerede?",
        a: "Ayarlarda NFC anahtarı yoktur. iPhone XS ve sonraki modeller ekran açıkken etiketleri kendiliğinden okur; iPhone 7, 8 ve X'te Denetim Merkezi'ndeki NFC Etiketi Okuyucu kullanılır.",
      },
      {
        q: "iPhone 11, 12, 13 ve sonrasında NFC nasıl açılır?",
        a: "Açmanız gerekmez. Bu modeller arka planda okur; kartı ekran açıkken üst arka kısma yaklaştırın ve çıkan bildirime dokunun.",
      },
      {
        q: "iPhone NFC kartvizit okumuyor, ne yapmalıyım?",
        a: "Kameranın ve Cüzdan'ın kapalı olduğundan, uçak modunun açık olmadığından emin olun; kartı üst arka kısma tutun ve kılıfı çıkarıp deneyin. Olmazsa profilin QR kodunu okutun.",
      },
      {
        q: "iPhone ile NFC karta yazılabilir mi?",
        a: "Evet. iOS 13 ve sonrası yüklü iPhone 7 ve sonrası modeller, NFC Tools gibi uygulamalarla etikete bağlantı yazabilir.",
      },
    ],
  },
  {
    slug: "xiaomi-poco-nfc-acma",
    label: "Xiaomi ve Poco NFC açma",
    title: "Xiaomi, Redmi ve Poco NFC Nasıl Açılır? HyperOS",
    description:
      "Xiaomi, Redmi ve Poco telefonda NFC nasıl açılır? HyperOS'ta Kontrol Merkezi düğmesi, Ayarlar'daki NFC yolu ve NFC kartvizitin telefona doğru okutulması.",
    image: "/rehber/dijital-kartvizit-nedir.jpg",
    imageAlt: "Siyah NFC kartvizit telefona dokunduruluyor, ekranda dijital kartvizit profili açık",
    published: "2026-11-13",
    sections: [
      {
        heading: "Kısa cevap",
        paragraphs: [
          "Xiaomi, Redmi ve Poco telefonlarda NFC'yi açmanın en hızlı yolu, ekranın sağ üstünden aşağı kaydırıp Kontrol Merkezi'ndeki NFC düğmesine dokunmaktır. Ayarlardan açmak için HyperOS'ta yol genellikle Ayarlar > Diğer bağlantı seçenekleri > NFC'dir; bazı model ve sürümlerde NFC, Bağlantı ve paylaşım bölümündedir.",
        ],
      },
      {
        heading: "Ayarlardan NFC'yi açma",
        paragraphs: [],
        list: [
          "Ayarlar'ı açın.",
          '"Diğer bağlantı seçenekleri"ne dokunun (bazı sürümlerde "Bağlantı ve paylaşım").',
          "NFC'ye dokunun ve anahtarı açın.",
          'Menüyü bulamazsanız ayarların arama kutusuna "NFC" yazın.',
        ],
      },
      {
        heading: "Kontrol Merkezi'nden açma",
        paragraphs: [],
        list: [
          "Ekranın sağ üstünden aşağı kaydırın.",
          "NFC simgesine dokunun.",
          "Simge yoksa Kontrol Merkezi'ni düzenleyip NFC'yi ekleyin.",
        ],
      },
      {
        heading: "Telefonumda NFC var mı?",
        paragraphs: [
          "Her Xiaomi, Redmi ve Poco modelinde NFC bulunmaz; aynı serinin NFC'li ve NFC'siz sürümleri de olabilir. Ayarların arama kutusuna NFC yazın; sonuç çıkmıyorsa telefonunuzda NFC yoktur. Bu durumda profilin QR kodu kamerayla okutulur; Dijivizit kartlarıyla birlikte profil linkiniz ve QR kodunuz da verilir.",
        ],
        link: { href: "/nfc-kartvizit", label: "NFC kartvizit modelleri" },
      },
      {
        heading: "NFC kartvizit nasıl okutulur?",
        paragraphs: [
          "NFC açıkken ekranın kilidini açın ve kartı telefonun arka yüzünün orta ya da üst-orta kısmına yaklaştırın; okuma noktası modele göre biraz değişir. Kartı 1-2 saniye sabit tutun, ekranda çıkan bildirime dokununca profil tarayıcıda açılır. NFC bir güncellemeden sonra çalışmayı bıraktıysa sistem güncellemelerini kontrol edin.",
        ],
        link: { href: "/rehber/nfc-kartvizit-okumuyor", label: "NFC kartvizit okumuyor mu?" },
      },
      {
        heading: "Diğer markalar",
        paragraphs: [
          "Samsung, Oppo, iPhone, Huawei, General Mobile, Omix ve diğer telefonlarda NFC açma adımları genel rehberde.",
        ],
        link: { href: "/rehber/telefonda-nfc-nasil-acilir", label: "Telefonda NFC nasıl açılır?" },
      },
    ],
    faq: [
      {
        q: "Poco'da NFC nasıl açılır?",
        a: "Ekranın sağ üstünden aşağı kaydırıp Kontrol Merkezi'ndeki NFC düğmesine dokunun. Ayarlardan açmak için Diğer bağlantı seçenekleri (bazı sürümlerde Bağlantı ve paylaşım) > NFC yolunu izleyin.",
      },
      {
        q: "Redmi telefonda NFC nerede?",
        a: "Redmi de Xiaomi'nin arayüzünü kullanır: Kontrol Merkezi'nde NFC düğmesi, ayarlarda Diğer bağlantı seçenekleri ya da Bağlantı ve paylaşım altında NFC bulunur.",
      },
      {
        q: "NFC açık kalırsa pil tüketir mi?",
        a: "Çok az. NFC yalnızca birkaç santimetre mesafede ve ekran açıkken çalışır; günlük pil kullanımında fark edilmez.",
      },
    ],
  },
];
