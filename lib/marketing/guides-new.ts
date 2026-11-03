/**
 * Guides published on 2026-11-03, merged into GUIDES. Same rules as guides.ts:
 * one search intent per guide, every product claim must match the product.
 */
import type { Guide } from "@/lib/marketing/guides";

export const NEW_GUIDES: Guide[] = [
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
          "Yüz yüze tanışmalar için fiziksel kart isterseniz NFC kartvizitlerde dijital profil ilk yıl ücretsizdir, sonrasında aylık 59,90 TL'dir. Kartsız dijital kartvizitle başlayıp sonradan metal ya da ahşap NFC karta geçebilirsiniz; link ve QR kodunuz aynı kalır.",
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
          "NFC kartvizitte iletişim bilgileriniz kartın içindeki bağlantıyla açılan profilde durur. Bu yüzden kartın yüzeyini sade tutabilirsiniz. Dijivizit kartlarında adınız, unvanınız ve logonuz metal yüzeye lazerle kazınır ya da ahşaba lazerle yakılır; kartın arkasında aynı profile açılan QR kod bulunur.",
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
          "Link-in-bio sayfaları çoğunlukla bir bağlantı olarak paylaşılır. Dijital kartvizitte aynı profil, telefona dokundurulan bir NFC kartla, kamerayla okutulan bir QR kodla ya da bir bağlantıyla açılır. Dijivizit'te metal ve ahşap NFC kartların arkasında aynı profile giden QR kod bulunur; kartsız dijital kartvizitte de profil linki ve QR kod verilir.",
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
      },
      {
        heading: "Üç parça: NFC, QR ve dijital profil",
        paragraphs: [],
        list: [
          "NFC çip: Kartın içindedir, telefona dokundurulunca profilinizi açar. Pili yoktur, şarj edilmez; enerjisini telefondan alır.",
          "QR kod: Kartın arkasındadır. NFC'si olmayan ya da kapalı olan telefonlar kamerayla okutarak aynı profili açar.",
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
          "Dijivizit akıllı kartvizitleri mat siyah metal, fırçalanmış gümüş, fırçalanmış gold, koyu ahşap ve açık ahşap kaplamalarda üretilir. Metal kartlar 4.000 TL, ahşap kartlar 2.500 TL'dir; KDV dahil, kargo ücretsizdir. Kartlar 72 saatte teslim edilir, okunmayan kart ücretsiz yenisiyle değiştirilir. Dijital profil ilk yıl ücretsizdir, sonrasında aylık 59,90 TL'dir.",
        ],
        link: { href: "/akilli-kartvizit", label: "Akıllı kartvizit modellerine bakın" },
      },
    ],
    faq: [
      {
        q: "Akıllı kartvizit ile NFC kartvizit aynı şey mi?",
        a: "Genellikle aynı anlamda kullanılır. Akıllı kartvizit; NFC kart, kartın arkasındaki QR kod ve dijital profilin birlikte sunulmasıdır.",
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
          "Fiziksel karta ihtiyacınız yoksa kartsız dijital kartvizitle başlayabilirsiniz: profil linkiniz ve QR kodunuz 2 saat içinde e-postanıza gelir; aylık 59,90 TL'dir, yıllık 718,80 TL olarak ödenir. Yüz yüze tanışmalar için metal ya da ahşap NFC kartvizite geçtiğinizde link ve QR kodunuz aynı kalır.",
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
];
