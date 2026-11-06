/** More profession pages at /dijital-kartvizit/<slug>; same rules as segments.ts. */
import type { Landing } from "@/lib/marketing/landings";

const PARENT = { name: "Dijital kartvizit", href: "/dijital-kartvizit" };

export const MORE_MESLEK: Landing[] = [
  {
    slug: "dijital-kartvizit/mali-musavir",
    parent: PARENT,
    kind: "meslek",
    term: "Mali müşavirler ve muhasebeciler için",
    title: "Mali Müşavirler için Dijital Kartvizit | Dijivizit",
    description:
      "Mali müşavirler ve muhasebeciler için dijital kartvizit: büro adresi, KEP, IBAN, fatura bilgileri ve evrak listesi PDF'i tek profilde; sade ve bilgilendirici.",
    h1: "Mali müşavirler ve muhasebeciler için dijital kartvizit",
    lead: "Yeni şirket kuran girişimci, bankadaki kredi uzmanı ya da vergi dairesindeki muhatap sizi tek dokunuşla rehberine kaydetsin. Büronuz, KEP adresiniz, ödeme bilgileriniz ve mükelleften istediğiniz evrak listesi aynı profilde dursun.",
    sections: [
      {
        heading: "Mali müşavirin iletişim çevresi",
        paragraphs: [
          "Bir mali müşavir yalnızca mükellefleriyle değil; vergi dairesi, SGK il müdürlüğü, bankaların ticari şubeleri, ticaret sicil müdürlüğü ve diğer meslektaşlarla da sürekli yazışır. Yeni mükellef çoğu zaman bir tavsiyeyle gelir: “Benim muhasebecimin numarasını vereyim” denir ve elden ele dolaşan bir numara kalır.",
          "Dijital kartvizitte mükellef adayı “Rehberime Kaydet”e dokunduğunda adınız, unvanınız (SMMM ya da YMM), büro adınız, telefonlarınız ve e-posta adresiniz rehberine tek kayıt olarak eklenir. Büro taşındığında ya da sabit hat değiştiğinde kartı yeniden bastırmazsınız; profili güncellersiniz.",
        ],
      },
      {
        heading: "Meslek kurallarına uygun, bilgilendirici profil",
        paragraphs: [
          "Mali müşavirlikte tanıtım, TÜRMOB'un ve odaların meslek kurallarıyla sınırlıdır. Profilinizi bir reklam sayfası gibi değil, kâğıt kartvizitin ayrıntılı ve güncel hâli gibi hazırlayın. Kesin sınırlar için odanızın güncel düzenlemelerini esas alın.",
        ],
        list: [
          "Adınız, unvanınız, bağlı olduğunuz oda ve ruhsat ya da sicil numaranız, “Hakkımda” yazısında",
          "Büro adresi; dokununca haritada açılır",
          "Sabit hat, cep, WhatsApp ve e-posta; etiketiyle KEP adresiniz",
          "Hizmet bedeli için IBAN ve büronun fatura bilgileri; siz açmadıkça görünmez",
          "“Şirket kuruluşu için gerekenler” ya da “Ay sonu evrak teslim listesi” gibi genel bilgilendirme PDF'leri",
          "Eklememeniz gerekenler: “en uygun ücret” gibi karşılaştırmalar, indirim duyuruları, mükellef yorumları",
        ],
      },
      {
        heading: "Mükellefle, bankayla, vergi dairesiyle",
        list: [
          "Yeni mükellef görüşmesi: kartı dokundurun, ardından evrak listesi PDF'ini profilden açmasını söyleyin; aynı listeyi her seferinde yeniden yazmazsınız",
          "Banka ve kredi görüşmeleri: şube yöneticisinin kâğıt kartvizitinin fotoğrafını çekin; ad, unvan, şube ve telefon Kişiler listenize kaydolsun",
          "Odadaki eğitimler ve meslektaş toplantıları: tanıştığınız meslektaşlarla kartı dokundurarak bilgi alışverişi yapın",
          "Mükellef adayına dönüş: “Bilgilerimi bırak” ile gelen kişiye not ekleyip “1 hafta” hatırlatması kurun; o sabah e-postanıza gelir",
        ],
        paragraphs: [
          "Kişiler listesindeki notlara vergi numarası, ciro ya da bordro bilgisi gibi mükellefe ait mali veriler yazmanızı önermeyiz; o bilgiler muhasebe programınızda ve dosyalarınızda kalmalı. Dijivizit bir beyanname takip programı değildir; hatırlatmaları siz kurarsınız.",
        ],
      },
      {
        heading: "Muhasebe büroları için sipariş",
        paragraphs: [
          "Birkaç meslek mensubu, stajyer ve muhasebe elemanıyla çalışan bürolar kartları ekip panelinden yönetir. Stajyerlik bittiğinde ya da bir çalışan ayrıldığında kart yeni kişiye atanır; büro kartlarından gelen mükellef adayları büronun listesinde kalır.",
          "Mat siyah PVC ve gümüş metal kartlar sade bir büro kimliğine uyar. 10 ve üzeri adette %20 indirim uygulanır ve büronuzun logosu karta işlenir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
        ],
      },
    ],
    faq: [
      {
        q: "KEP adresimi profile ekleyebilir miyim?",
        a: "Evet. KEP adresinizi e-posta satırı olarak ekler, etiketine “KEP” yazarsınız. Normal e-posta adresiniz ayrı satırda kalır.",
      },
      {
        q: "Dijital kartvizit meslek kurallarına aykırı mı?",
        a: "Kartvizit kullanmak meslekte olağandır; önemli olan içeriktir. Unvan, ruhsat bilgisi, adres ve iletişimle sınırlı, vaat içermeyen bir profil öneririz. İçeriğin meslek kurallarına uygunluğu kullanıcının sorumluluğundadır.",
      },
      {
        q: "Mükelleflerime evrak listesini nasıl gönderirim?",
        a: "Listeyi PDF olarak profilinize yüklersiniz; en fazla 10 belge, her biri 10 MB'a kadar. Mükellef profilinizi her açtığında güncel listeyi görür. Mükellefe özel belgeleri profile değil, doğrudan mükellefe iletin.",
      },
      {
        q: "IBAN'ım herkese görünür mü?",
        a: "Hayır, siz açmadıkça görünmez. Açtığınızda ziyaretçi IBAN'ı tek dokunuşla kopyalar; elle yazarken hata yapılmaz.",
      },
    ],
    guides: [
      "kartvizite-ne-yazilir",
      "kurumsal-dijital-kartvizit",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
      "yeni-isletme-kontrol-listesi",
    ],
    siblings: [
      "dijital-kartvizit/avukat",
      "dijital-kartvizit/finans-danismani",
      "dijital-kartvizit/sigorta-acentesi",
      "nfc-kartvizit",
    ],
  },
  {
    slug: "dijital-kartvizit/eczaci",
    parent: PARENT,
    kind: "meslek",
    term: "Eczacılar için",
    title: "Eczacılar için Dijital Kartvizit | Dijivizit",
    description:
      "Eczacılar için dijital kartvizit: eczane adresi, telefon, WhatsApp ve çalışma saatleri tek profilde; tanıtım kurallarına uygun, sade ve yalnızca bilgilendirici.",
    h1: "Eczacılar için dijital kartvizit",
    lead: "Hasta eczanenizin numarasını internette aramasın, rehberinde bulsun. Eczanenizin adresi, telefonu ve çalışma saatleri tek dokunuşla kaydedilsin; depo temsilcisi ve meslektaşlarla tanışırken de aynı kartı kullanın.",
    sections: [
      {
        heading: "Eczacılar dijital kartviziti nerede kullanır?",
        paragraphs: [
          "Eczaneye gelen hasta çoğu zaman bir şey sormak için tekrar arar: ilacı gelmiş mi, eczane kaçta açılıyor, reçetesinde eksik bir şey var mı. Eczanenin numarası telefonunda kayıtlı değilse internette arar; karşısına çıkan numara eski olabilir ya da başka bir eczaneye ait olabilir.",
          "Tezgâhta ya da kasa önünde duran profil QR kodunu okutan ya da kartı telefonuna dokunduran hasta, “Rehberime Kaydet” ile eczanenin adını, telefonunu ve adresini tek kayıt olarak ekler. Eczacının iş çevresi de geniştir: ecza depoları, firma temsilcileri, odadaki meslektaşlar ve yakındaki hekimler. Bu tanışmalarda da aynı kartı dokundurursunuz.",
        ],
      },
      {
        heading: "Tanıtım kurallarına uygun bir eczane profili",
        paragraphs: [
          "Eczanelerin ve eczacıların tanıtımı Türkiye'de mevzuat ve meslek kurallarıyla sıkı biçimde sınırlanır. Profili bir reklam aracı olarak değil, eczanenin kimlik ve iletişim bilgisi olarak hazırlayın. Kesin sınırlar için güncel mevzuatı ve bağlı olduğunuz eczacı odasının yönlendirmelerini esas alın.",
        ],
        list: [
          "Koyun: eczane adı, sorumlu eczacının adı ve unvanı",
          "Koyun: adres, sabit hat, WhatsApp hattı ve çalışma saatleri; dokununca harita açılır",
          "Koyun: eczanenin fatura bilgileri; kurum ve şirket müşterileri için, siz açmadıkça görünmez",
          "Kaçının: ürün ve ilaç tanıtımları, fiyat, indirim ve kampanya duyuruları, “en ucuz” gibi ifadeler, hasta yorumları",
        ],
      },
      {
        heading: "Hasta iletişimi ve gizlilik",
        paragraphs: [
          "Hastalar WhatsApp'tan reçete fotoğrafı ya da ilaç kutusunun resmini göndermeye alışkındır. Profildeki WhatsApp satırı bu yazışmayı kolaylaştırır; ancak sağlık bilgisi içeren mesajları kendi iş akışınızda ve mevzuata uygun biçimde saklamak sizin sorumluluğunuzdadır.",
          "“Bilgilerimi bırak” formunu ilk temas için kullanın. Kişiler listesindeki notlara ilaç, tanı ya da reçete bilgisi yazmanızı önermeyiz; liste geri dönüş takibi içindir, hasta kaydı değildir.",
          "Ecza deposu temsilcisinin ya da firma mümessilinin verdiği kâğıt kartviziti fotoğrafını çekerek kaydedersiniz; ad, unvan, firma ve telefon kendiliğinden dolar.",
        ],
      },
      {
        heading: "Hangi ürün, nasıl teslim?",
        paragraphs: [
          "Yalnızca tezgâha ve kapı camına koyacağınız bir QR kod istiyorsanız kartsız dijital kartvizit yeterlidir: link ve QR kod 2 saat içinde e-postanıza gelir. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir.",
          "Odadaki toplantılarda, kongrelerde ve depo görüşmelerinde kullanmak için NFC kart; mat siyah PVC 2.500 TL, metal kartlar 4.000 TL'dir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Birden fazla eczacının çalıştığı eczanelerde her eczacıya ayrı kart verilebilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Nöbet bilgisini profile yazabilir miyim?",
        a: "Profil yalnızca sizin yazdığınız bilgiyi gösterir; nöbet listesini otomatik çekmez. Nöbet günlerini kendiniz güncellemeyecekseniz profile yazmayın; eskimiş bir nöbet bilgisi hastayı yanıltır.",
      },
      {
        q: "Eczanede ürün kataloğu paylaşabilir miyim?",
        a: "Teknik olarak PDF yüklenebilir; ancak eczanelerde ürün tanıtımı ve kampanya duyurusu mevzuatla sınırlıdır. Profilinizi adres, iletişim ve çalışma saatleriyle sınırlı tutmanızı öneririz. İçeriğin mevzuata uygunluğu kullanıcının sorumluluğundadır.",
      },
      {
        q: "Hastanın uygulama indirmesi gerekir mi?",
        a: "Hayır. Profil telefonun tarayıcısında açılır. NFC'si kapalı telefonlarda tezgâhtaki ya da telefonunuzun ekranındaki profil QR kodu kamerayla okutulur.",
      },
      {
        q: "Eczane taşınırsa ne olur?",
        a: "Panelden adresi ve telefonu güncellersiniz. Tezgâhtaki QR kod, kart ve daha önce sizi kaydedenlerin bağlantısı yeni bilgiyi gösterir.",
      },
    ],
    guides: [
      "qr-kod-kartvizit",
      "kartvizite-ne-yazilir",
      "dijital-kartvizit-nedir",
      "ucretsiz-dijital-kartvizit",
    ],
    siblings: [
      "dijital-kartvizit/doktor",
      "dijital-kartvizit/dis-hekimi",
      "dijital-kartvizit/veteriner",
    ],
  },
  {
    slug: "dijital-kartvizit/veteriner",
    parent: PARENT,
    kind: "meslek",
    term: "Veteriner hekimler için",
    title: "Veteriner Hekimler için Dijital Kartvizit | Dijivizit",
    description:
      "Veteriner hekimler için dijital kartvizit: klinik adresi, acil hattı, WhatsApp ve bakım bilgilendirme PDF'leri tek profilde; hayvan sahibi rehberine kaydetsin.",
    h1: "Veteriner hekimler için dijital kartvizit",
    lead: "Gece yarısı köpeği rahatsızlanan hayvan sahibi kliniğinizi internette aramasın; numaranız rehberinde dursun. Klinik adresi, çalışma saatleri ve ulaşabileceği hatlar tek dokunuşla kaydedilsin.",
    sections: [
      {
        heading: "Veteriner kliniğinde kartvizitin asıl işi",
        paragraphs: [
          "Hayvan sahibi kliniği en çok iki durumda arar: aşı ya da kontrol zamanı geldiğinde ve bir şeyler ters gittiğinde. İkinci an acildir; numara rehberde yoksa en yakın kliniği haritada arar, belki de sizin yerinize başka bir yere gider.",
          "İlk muayenede kartı hayvan sahibinin telefonuna dokundurduğunuzda klinik adı, hekimin adı, telefon, WhatsApp ve adres rehberine birlikte kaydolur. Saha veteriner hekimleri için de aynı şey geçerlidir: çiftlikte, ahırda ya da köy ziyaretinde tanıştığınız üretici sizi bir sonraki sefer için kaydeder.",
        ],
      },
      {
        heading: "Bilgilendirici bir klinik profili",
        paragraphs: [
          "Veteriner hekimlerin tanıtımı da meslek kuralları ve mevzuatla sınırlıdır. Profilde hayvan sahibinin size ulaşması ve kliniği bulması için gereken bilgiyi verin; tanıtım iddialarına yer vermeyin. Kesin sınırlar için güncel mevzuatı ve odanızın yönlendirmelerini esas alın.",
        ],
        list: [
          "Hekimin adı ve unvanı; ilgilendiğiniz alanlar (ör. kedi ve köpek, egzotik hayvanlar, büyükbaş)",
          "Klinik telefonu, varsa ayrı ve etiketli acil hattı, WhatsApp",
          "Adres ve çalışma saatleri; dokununca harita açılır",
          "“Yavru kedi ve köpeklerde genel aşı takvimi” ya da “Ameliyat sonrası genel bakım” gibi bilgilendirme PDF'leri",
          "Ödeme için IBAN ve fatura bilgileri; siz açmadıkça görünmez",
          "Kaçının: fiyat ve kampanya duyuruları, tedavi vaatleri, müşteri yorumları",
        ],
      },
      {
        heading: "Pet shop, pansiyon, barınak: iş çevresi",
        list: [
          "Pet shop, pansiyon ve eğitim merkezleri: sizi hayvan sahiplerine öneren işletmelere kartınızı dokundurun; profil bağlantınızı müşterilerine iletebilirler",
          "Barınak gönüllüleri ve sahiplendirme grupları: profil bağlantınızı WhatsApp gruplarına gönderin, gönüllüler numaranızı tek dokunuşla kaydetsin",
          "İlaç ve mama firması temsilcileri: verdikleri kâğıt kartvizitin fotoğrafını çekin, Kişiler listenize kaydolsun",
          "Kontrol zamanı: hayvan sahibi için tarih seçip hatırlatma kurun; o sabah e-postanıza gelir, WhatsApp mesajı hazır yazılmış olur",
        ],
        paragraphs: [
          "Kişiler listesi bir klinik kayıt programı değildir. Aşı karnesi, tanı ve tedavi bilgileri klinik yazılımınızda kalmalı; Kişiler listesini yalnızca geri dönüş takibi için kullanın.",
        ],
      },
      {
        heading: "Klinik ekibi için sipariş",
        paragraphs: [
          "Birden fazla hekim ve veteriner sağlık teknikeriyle çalışan klinikler kartları ekip panelinden yönetir. Bir hekim ayrıldığında kart yeniden basılmaz, yeni hekime atanır; klinik kartlarından gelen kişiler kliniğin listesinde kalır.",
          "Ahşap kartlar sıcak bir klinik kimliğiyle uyumludur; logo lazerle yakılır, silinmez. 10 ve üzeri adette %20 indirim uygulanır. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir; kart okunmazsa ücretsiz yenisiyle değiştirilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Acil hattını ayrı gösterebilir miyim?",
        a: "Evet. Birden fazla telefon satırı ekleyip birine “Acil” etiketi verirsiniz. Rehbere kaydedilirken bütün numaralar etiketleriyle aktarılır.",
      },
      {
        q: "Aşı hatırlatmasını hayvan sahibine otomatik gönderir mi?",
        a: "Hayır. Hatırlatma size gelir: seçtiğiniz gün sabah e-postanıza düşer, hayvan sahibine yazacağınız WhatsApp mesajı hazır olur. Mesajı siz gönderirsiniz.",
      },
      {
        q: "Profile genel bakım bilgisi koymak uygun mu?",
        a: "Herkese uygun genel bilgilendirme notlarını PDF olarak ekleyebilirsiniz. Hayvana özel tedavi planını profile koymayın; profildeki belgeler herkese açıktır. İçeriğin mevzuata uygunluğu kullanıcının sorumluluğundadır.",
      },
      {
        q: "Saha veteriner hekimiyim, konum ekleyebilir miyim?",
        a: "Sabit bir muayenehaneniz varsa adresi eklersiniz. Yalnızca sahada çalışıyorsanız adres yerine hizmet verdiğiniz ilçeleri “Hakkımda” yazısında belirtmeniz yeterlidir.",
      },
    ],
    guides: [
      "kartvizite-ne-yazilir",
      "ahsap-kartvizit",
      "qr-kod-kartvizit",
      "dijital-kartvizit-nasil-olusturulur",
    ],
    siblings: [
      "dijital-kartvizit/doktor",
      "dijital-kartvizit/eczaci",
      "dijital-kartvizit/dis-hekimi",
    ],
  },
  {
    slug: "dijital-kartvizit/insaat-muteahhit",
    parent: PARENT,
    kind: "meslek",
    term: "İnşaat firmaları ve müteahhitler için",
    title: "Müteahhitler için Dijital Kartvizit | Dijivizit",
    description:
      "Müteahhitler ve inşaat firmaları için dijital kartvizit: proje broşürü, satış ofisi, şantiye konumu ve yetki belgesi tek profilde. Şantiye levhasına QR koyun.",
    h1: "Müteahhitler ve inşaat firmaları için dijital kartvizit",
    lead: "Kentsel dönüşüm toplantısında kat maliklerine, satış ofisinde alıcıya, şantiyede tedarikçiye aynı kartı dokundurun. Proje broşürünüz, satış hattınız ve şantiye konumunuz tek profilde dursun.",
    sections: [
      {
        heading: "İnşaatta kartvizit kime verilir?",
        paragraphs: [
          "Bir müteahhidin muhatap listesi uzundur: arsa sahipleri, kentsel dönüşümde kat malikleri ve apartman yönetimi, alıcılar, belediye ve yapı denetim firması, taşeronlar, hazır beton, demir ve malzeme tedarikçileri. Her biriyle farklı ortamda, çoğu zaman ayakta ve kısa bir görüşmede tanışırsınız.",
          "Kentsel dönüşüm görüşmelerinde bilgiler genellikle apartmanın WhatsApp grubunda dolaşır. Toplantıda kartı birkaç kat malikinin telefonuna dokundurur, profil bağlantınızı gruba gönderirsiniz; herkes firmanızı, yetkili kişiyi ve proje sunumunu aynı yerden görür.",
        ],
      },
      {
        heading: "Firma profiline ne koyulur?",
        list: [
          "Devam eden ve tamamlanan projeler, “Broşür” ya da “Sunum” türünde PDF olarak",
          "Satış ofisi telefonu, şantiye şefi hattı ve WhatsApp; etiketli ayrı satırlar",
          "Merkez ofis adresi ve satış ofisinin konumu",
          "Yapı müteahhidi yetki belgesi numaranız ve firma unvanı, “Hakkımda” yazısında",
          "Kapora ve hakediş ödemeleri için IBAN ile fatura bilgileri; siz açmadıkça görünmez",
          "Firmanın web sitesi ve Instagram hesabı",
        ],
        paragraphs: [
          "Proje broşüründe kat planları değiştiğinde ya da satılan daireler çıktığında PDF'i panelden değiştirirsiniz; daha önce kart verdiğiniz kat malikleri ve alıcılar güncel dosyayı görür. Büyük görsel dosyaları birkaç PDF'e bölmek mobilde daha hızlı açılır.",
        ],
      },
      {
        heading: "Şantiye levhası, satış ofisi, tedarikçi",
        list: [
          "Şantiye levhası ve iskele brandası: profil QR kodunuzu panelden PNG ya da SVG olarak indirip bastırın; projeyi merak eden komşu satış hattınıza ulaşsın",
          "Satış ofisi: masaya QR kod koyun; ziyaretçi “Bilgilerimi bırak” ile adını ve “2+1, ara kat, krediyle” gibi bir not bırakır",
          "Tedarikçi ve taşeronlar: verdikleri kâğıt kartvizitin fotoğrafını çekin; ad, firma ve telefon Kişiler listenize kaydolsun, yanına “B blok sıva teklifi” notunu düşün",
          "Teklif ve ödeme günleri: kişiye tarih seçip hatırlatma kurun; o sabah e-postanıza gelir",
        ],
        paragraphs: [
          "Analitik panelinde profilin kaç kez açıldığını, ziyaretçilerin broşüre mi satış hattına mı dokunduğunu ve kaç kişinin sizi rehberine kaydettiğini görürsünüz. Levhayı astıktan sonra günlük görüntülenmelerin artıp artmadığını grafikten izlersiniz.",
        ],
      },
      {
        heading: "Saha ekibi için sipariş",
        paragraphs: [
          "Proje müdürleri, şantiye şefleri ve satış danışmanları için kartları ekip panelinden dağıtırsınız. Bir şantiye şefi başka projeye geçtiğinde ya da satış danışmanı ayrıldığında kart yeni kişiye atanır; satış ofisine gelen kişiler firmanın listesinde kalır.",
          "Metal kartlar şantiye ortamında dayanıklıdır; logo lazerle kazınır, silinmez. 10 ve üzeri adette %20 indirim uygulanır ve firmanızın logosu karta işlenir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Şantiye levhasına hangi QR kodu koyarım?",
        a: "Panelden indirdiğiniz profil QR kodunu. Levhayı bastırdıktan sonra telefon ya da broşür değişse bile kod aynı profili açar, yeniden bastırmanız gerekmez.",
      },
      {
        q: "Her proje için ayrı profil açabilir miyim?",
        a: "Her kart bir profile bağlıdır. Projeleri ayrı tutmak istiyorsanız her proje için ayrı bir kart ya da kartsız dijital kartvizit alıp ilgili satış danışmanına atayabilirsiniz; tek profilde de her proje için ayrı PDF ekleyebilirsiniz.",
      },
      {
        q: "Kat maliklerinin bilgileri nerede tutulur?",
        a: "“Bilgilerimi bırak” ile bilgi bırakan kişiler yalnızca sizin Kişiler listenizde, ekip kartlarında ise firma yöneticisinde görünür. Ziyaretçi bilgisini paylaşmadan önce onay verir.",
      },
      {
        q: "Rehbere kaydedince hangi bilgiler aktarılır?",
        a: "Adınız, unvanınız, firma adı, telefonlarınız, e-posta ve adres tek kayıt olarak rehbere eklenir. Etiketli telefon satırları etiketleriyle birlikte aktarılır.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "qr-kod-kartvizit",
      "metal-kartvizit",
      "dijital-kartvizit-ornekleri",
    ],
    siblings: [
      "dijital-kartvizit/mimar",
      "dijital-kartvizit/emlakci",
      "dijital-kartvizit/muhendis",
      "nfc-kartvizit",
    ],
  },
  {
    slug: "dijital-kartvizit/oto-galeri",
    parent: PARENT,
    kind: "meslek",
    term: "Oto galeriler için",
    title: "Oto Galeriler için Dijital Kartvizit | Dijivizit",
    description:
      "Oto galeriler için dijital kartvizit: stok listesi PDF'i, ilan bağlantıları, WhatsApp, kapora IBAN'ı ve konum tek profilde. Araç camına QR, alıcıya NFC kart.",
    h1: "Oto galeriler için dijital kartvizit",
    lead: "Galeriye bakmaya gelen alıcı aracı beğendi ama bugün karar vermiyor. Kartı telefonuna dokundurun; galerinizin numarası, güncel stok listeniz ve ilan sayfalarınız telefonunda kalsın, karar verdiğinde sizi arasın.",
    sections: [
      {
        heading: "Galericinin kartvizit sorunu",
        paragraphs: [
          "İkinci el araç alıcısı genellikle birkaç galeri gezer, aynı gün birkaç aracı karşılaştırır. Akşam eve döndüğünde cebinde üç dört kâğıt kartvizit vardır ve hangisinin hangi araç olduğunu hatırlamaz. Rehberine kaydettiği numara ise çoğu zaman sadece “Galeri” diye kalır.",
          "Dijital kartvizitte alıcı “Rehberime Kaydet”e dokunduğunda galerinizin adı, sizin adınız, telefon ve WhatsApp hattınız rehberine birlikte eklenir. Profilde stok listeniz de vardır; baktığı aracı ve benzerlerini evde yeniden açar.",
        ],
      },
      {
        heading: "Galeri profiline ne koyulur?",
        list: [
          "Güncel stok listesi, “Ürün Kataloğu” ya da “Fiyat Listesi” türünde PDF olarak",
          "İlanlarınızın yayınlandığı sayfaların bağlantıları, etiketli web satırları olarak",
          "Galeri telefonu, cep ve WhatsApp; alıcıların çoğu önce fotoğraf ister",
          "Galeri adresi; dokununca harita açılır",
          "Kapora için IBAN ve fatura bilgileri; siz açmadıkça görünmez",
          "Yetki belgesi numaranız ve çalıştığınız ekspertiz noktaları, “Hakkımda” yazısında",
        ],
        paragraphs: [
          "Araç satıldığında ya da yeni araç geldiğinde stok PDF'ini panelden değiştirirsiniz; daha önce kart verdiğiniz herkes güncel listeyi görür. Satılmış bir aracı soran alıcıyla zaman kaybetmezsiniz.",
        ],
      },
      {
        heading: "Araç camında, galeride, noterde",
        list: [
          "Araç camı ve fiyat kartı: profil QR kodunu bastırın; galeri kapalıyken bakan biri de numaranızı kaydetsin",
          "Kararsız alıcı: “Bilgilerimi bırak” ile adını ve “SUV, 2018 sonrası, takas aracı var” gibi bir not bıraksın; uygun araç geldiğinde dönmek için hatırlatma kurun",
          "Ekspertiz, noter, kredi ve sigorta: çalıştığınız kişilerin kâğıt kartvizitlerinin fotoğrafını çekin, Kişiler listenize kaydolsun",
          "Takas ve alım: aracını satmak isteyen kişiye kartınızı dokundurun; fotoğrafları WhatsApp'tan göndersin",
        ],
        paragraphs: [
          "Analitik panelinde profilin kaç kez açıldığını, ziyaretçilerin stok listesine mi WhatsApp'a mı dokunduğunu ve hangi şehirlerden baktığını görürsünüz. Şehir dışından araç soran alıcıların ilgisini buradan izlersiniz.",
        ],
      },
      {
        heading: "Galeri ve satış ekibi için sipariş",
        paragraphs: [
          "Birden fazla satış danışmanıyla çalışan galeriler kartları ekip panelinden yönetir. Danışman ayrıldığında kart yeni kişiye atanır; galeri kartlarından gelen alıcılar galerinin listesinde kalır, müşteri danışmanla birlikte gitmez.",
          "Mat siyah ve gold metal kartlar galeri kimliğiyle uyumludur. 10 ve üzeri adette %20 indirim uygulanır ve galerinizin logosu karta işlenir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
        ],
      },
    ],
    faq: [
      {
        q: "İlan sitelerindeki mağazamı ekleyebilir miyim?",
        a: "Evet. Mağaza ya da ilan sayfanızın bağlantısını web sitesi satırı olarak ekler, etiketine sitenin adını yazarsınız. Birden fazla bağlantı ekleyebilirsiniz.",
      },
      {
        q: "Profilden kapora ödemesi alınabilir mi?",
        a: "Hayır, profilde online ödeme yoktur. IBAN'ınızı profilde görünür yaparsınız; alıcı tek dokunuşla kopyalar ve kendi bankasından havale yapar.",
      },
      {
        q: "Her araç için ayrı QR gerekir mi?",
        a: "Hayır. Tek profilin tek QR kodu vardır; aynı kodu bütün araçların camına koyabilirsiniz. Alıcı profilde stok listesine ulaşır.",
      },
      {
        q: "Alıcı uygulama indirmek zorunda mı?",
        a: "Hayır. Kart dokundurulduğunda ya da QR okutulduğunda profil tarayıcıda açılır.",
      },
    ],
    guides: [
      "qr-kod-kartvizit",
      "kurumsal-dijital-kartvizit",
      "dijital-kartvizit-nasil-olusturulur",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
    ],
    siblings: [
      "dijital-kartvizit/sigorta-acentesi",
      "dijital-kartvizit/satis-temsilcisi",
      "dijital-kartvizit/emlakci",
    ],
  },
  {
    slug: "dijital-kartvizit/otel-turizm",
    parent: PARENT,
    kind: "meslek",
    term: "Otel ve turizm sektörü için",
    title: "Otel ve Turizm için Dijital Kartvizit | Dijivizit",
    description:
      "Otel ve turizm sektörü için dijital kartvizit: rezervasyon hattı, otel sunumu, toplantı salonu broşürü ve konum tek profilde. Fuarda acenteye kartı dokundurun.",
    h1: "Otel ve turizm sektörü için dijital kartvizit",
    lead: "Turizm fuarında acenteyle, şirket ziyaretinde toplantı organizatörüyle, resepsiyonda misafirle tanışırken aynı kartı kullanın. Otel sunumunuz, rezervasyon hattınız ve konumunuz tek dokunuşla karşı tarafın telefonunda olsun.",
    sections: [
      {
        heading: "Turizmde kartvizit kime verilir?",
        paragraphs: [
          "Bir otelin satış ve pazarlama ekibi yıl boyunca seyahat acenteleriyle, tur operatörleriyle, kurumsal seyahat sorumlularıyla, toplantı ve düğün organizatörleriyle görüşür. Fuarlarda bir günde onlarca kartvizit verilir; sezon kapandığında o kartların çoğu kimsenin aklında değildir.",
          "Dijital kartvizitte karşınızdaki kişi kartı telefonuna dokundurur, sizi rehberine kaydeder ve otel sunumunu açar. Siz de onun kâğıt kartvizitini fotoğrafını çekerek kaydedersiniz. Fuardan dönerken iki taraf da birbirinin bilgisine sahiptir.",
        ],
      },
      {
        heading: "Otel profiline ne koyulur?",
        list: [
          "Otel tanıtım sunumu, “Sunum” türünde PDF olarak; farklı diller için ayrı dosyalar",
          "Toplantı salonları, kapasite ve düğün paketleri için “Broşür” türünde PDF",
          "Rezervasyon hattı, satış müdürünün cebi, WhatsApp ve e-posta; etiketli satırlar",
          "Otelin web sitesi ve online rezervasyon sayfanızın bağlantısı, web sitesi satırı olarak",
          "Adres; dokununca harita açılır, transfer firması ve misafir oteli kolay bulur",
          "Instagram hesabınız ve acentelerin fatura kesebilmesi için fatura bilgileri",
        ],
        paragraphs: [
          "Profil arayüzü Türkçedir; ancak ad, telefon, e-posta ve adres gibi bilgiler dilden bağımsızdır. Yabancı acenteler ve misafirler için “Hakkımda” yazısına kısa bir İngilizce, Almanca ya da Rusça paragraf ekleyebilir, sunumunuzu her dilde ayrı PDF olarak yükleyebilirsiniz.",
        ],
      },
      {
        heading: "Fuarda, resepsiyonda, kurumsal ziyarette",
        list: [
          "Turizm fuarları: stantta profil QR kodunu gösterin; ziyaretçi “Bilgilerimi bırak” ile adını, acentesini ve “Mayıs'ta 40 kişilik grup” gibi bir not bıraksın",
          "Resepsiyon ve oda: QR kodu resepsiyon bankosuna ya da oda içi bilgilendirme kartına koyun; misafir bir sonraki konaklamada sizi doğrudan arasın",
          "Kurumsal satış ziyareti: insan kaynakları ya da idari işler sorumlusuna kartı dokundurun, toplantı salonu broşürü telefonunda kalsın",
          "Teklif takibi: fuardan sonra her kişiye not ekleyip “1 hafta” hatırlatması kurun; o sabah e-postanıza gelir",
        ],
        paragraphs: [
          "Analitik panelinde profilinizin hangi şehirlerden açıldığını görürsünüz; fuar sonrasında ilginin hangi bölgelerden geldiğini buradan izlersiniz.",
        ],
      },
      {
        heading: "Sezonluk ekipler için sipariş",
        paragraphs: [
          "Turizmde ekip her sezon değişebilir. Ekip panelinde satış, ön büro ve misafir ilişkileri çalışanlarının kartlarını yönetirsiniz; sezon sonunda ayrılan çalışanın kartını yeni sezonda gelen kişiye atarsınız, kart yeniden basılmaz. Kaybolan kart panelden kapatılır.",
          "Ahşap kartlar butik ve doğa otelleriyle, metal kartlar şehir ve iş otelleriyle uyumludur. 10 ve üzeri adette %20 indirim uygulanır ve otelinizin logosu karta işlenir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Profilden rezervasyon alınabilir mi?",
        a: "Dijivizit bir rezervasyon sistemi değildir. Misafir profilden rezervasyon hattınızı arar ya da WhatsApp'tan yazar; online rezervasyon sayfanızın bağlantısını web sitesi satırı olarak eklersiniz.",
      },
      {
        q: "Yabancı misafirler profili okuyabilir mi?",
        a: "Ad, telefon, e-posta ve adres her dilde aynı görünür. “Hakkımda” yazısına ve belgelerinize başka dillerde içerik ekleyebilirsiniz; profil arayüzünün kendisi Türkçedir.",
      },
      {
        q: "Sezon sonunda ayrılan çalışanın kartı ne olur?",
        a: "Ekip panelinden kartı yeni çalışana atarsınız; aynı kart yeni kişinin profilini açar. Kart geri alınamadıysa panelden kapatırsınız.",
      },
      {
        q: "Kaç belge ekleyebilirim?",
        a: "En fazla 10 PDF, her biri 10 MB'a kadar. Farklı diller için sunumu ayrı dosyalar hâlinde yüklemek mobilde daha hızlı açılır.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "ahsap-kartvizit",
      "qr-kod-kartvizit",
      "dijital-kartvizit-ornekleri",
    ],
    siblings: [
      "dijital-kartvizit/restoran-kafe",
      "dijital-kartvizit/dugun-organizasyon",
      "dijital-kartvizit/antalya",
      "dijital-kartvizit/tercuman",
    ],
  },
  {
    slug: "dijital-kartvizit/icerik-ureticisi",
    parent: PARENT,
    kind: "meslek",
    term: "İçerik üreticileri ve influencerlar için",
    title: "İçerik Üreticileri için Dijital Kartvizit | Dijivizit",
    description:
      "İçerik üreticileri ve influencerlar için dijital kartvizit: medya kiti PDF'i, iş e-postası, menajer hattı ve tüm hesaplarınız tek profilde. Lansmanda paylaşın.",
    h1: "İçerik üreticileri ve influencerlar için dijital kartvizit",
    lead: "Lansmanda tanıştığınız marka yöneticisi “size nereden ulaşırız” diye sorduğunda Instagram'ı açıp mesaj kutusunu tarif etmeyin. Kartı dokundurun; medya kitiniz, iş e-postanız ve menajerinizin numarası onun telefonunda kalsın.",
    sections: [
      {
        heading: "İşbirlikleri DM kutusunda kaybolmasın",
        paragraphs: [
          "Marka ve ajans temsilcileri içerik üreticileriyle çoğu zaman lansmanlarda, basın davetlerinde, festivallerde ve sektör buluşmalarında tanışır. O an numara istenir, takip edilir; ama işbirliği teklifi geldiğinde mesaj DM kutusundaki yüzlerce mesajın arasında kaybolur.",
          "Dijital kartvizit iş iletişimini sosyal medya hesabınızdan ayırır. Karşınızdaki kişi “Rehberime Kaydet” ile sizi kaydettiğinde iş e-postanız ve menajer hattınız da rehberine eklenir; teklifler doğru adrese gelir.",
        ],
      },
      {
        heading: "İçerik üreticisi profiline ne koyulur?",
        list: [
          "Medya kiti: kitle bilgisi, içerik türleri ve önceki işbirlikleri, “Sunum” türünde PDF olarak",
          "Instagram ve X hesaplarınız; YouTube, TikTok ve Twitch gibi kanallar etiketli web satırları olarak",
          "İş e-postası; DM yerine bu adrese yazılmasını isteyin",
          "Menajer ya da ajans telefonu, “Menajer” etiketiyle ayrı satırda",
          "Fatura kesebilmek için fatura bilgileriniz ve ödeme için IBAN; siz açmadıkça görünmez",
          "İçerik ürettiğiniz alanlar: yemek, seyahat, teknoloji, anne-çocuk gibi",
        ],
        paragraphs: [
          "Takipçi sayınız ve istatistikleriniz değiştikçe medya kitini panelden güncellersiniz; daha önce kart verdiğiniz marka yöneticileri güncel dosyayı görür. Eski bir PDF'i e-postayla yeniden göndermeniz gerekmez.",
        ],
      },
      {
        heading: "Biyografide, etkinlikte, sahnede",
        list: [
          "Biyografi bağlantısı: profil bağlantınızı Instagram biyografinize koyun; takipçi bütün kanallarınızı tek sayfada görür",
          "Lansman ve basın daveti: marka ve PR ajansı çalışanlarının kâğıt kartvizitlerinin fotoğrafını çekin, Kişiler listenize kaydolsun; yanına “Ekim kampanyası, brief bekleniyor” notu düşün",
          "Panel ve sahne: konuşmanızın son slaytına ya da ekrana profil QR kodunuzu koyun",
          "Teklif takibi: dönüş yapacağınız markalara tarih seçip hatırlatma kurun; o sabah e-postanıza gelir",
        ],
        paragraphs: [
          "Analitik panelinde profilinize nereden gelindiğini görürsünüz: Instagram'dan mı, WhatsApp'tan mı, yoksa kart, QR kod ya da doğrudan bağlantıdan mı. Ziyaretçilerin medya kitine mi, YouTube kanalınıza mı dokunduğunu da buradan izlersiniz.",
        ],
      },
      {
        heading: "Kartlı mı, kartsız mı?",
        paragraphs: [
          "İletişiminiz çoğunlukla çevrim içiyse kartsız dijital kartvizit yeterlidir: link ve QR kod 2 saat içinde e-postanıza gelir. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir.",
          "Etkinliklere sık katılıyorsanız NFC kart işinizi kolaylaştırır; kart bir aksesuar gibi de durur. Mat siyah PVC ve ahşap kartlar 2.500 TL, siyah, gümüş ve gold metal kartlar 4.000 TL'dir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Linktree yerine kullanılabilir mi?",
        a: "Evet. Profil bağlantınızı biyografinize eklersiniz; ziyaretçi bütün bağlantılarınızı tek sayfada görür ve ayrıca sizi rehberine kaydedebilir, bilgisini bırakabilir.",
      },
      {
        q: "YouTube ve TikTok hesabımı ekleyebilir miyim?",
        a: "Evet. Kanal bağlantınızı web sitesi satırı olarak ekler, etiketine platformun adını yazarsınız. Instagram, X ve LinkedIn için hazır alanlar vardır.",
      },
      {
        q: "Profil adresim adımı içeriyor mu?",
        a: "Hayır. Profil adresi adınızı değil rastgele bir kodu içerir; tahmin edilemez. Kart kaybolursa panelden kapatırsınız.",
      },
      {
        q: "Medya kitimi kimin açtığını görebilir miyim?",
        a: "Kişi bazında değil, toplam olarak görürsünüz: analitik panelinde profilin kaç kez açıldığı ve ziyaretçilerin hangi bağlantılara ve belgelere dokunduğu yer alır.",
      },
    ],
    guides: [
      "instagram-kartvizit",
      "linktree-alternatifi",
      "ucretsiz-dijital-kartvizit",
      "dijital-kartvizit-ornekleri",
    ],
    siblings: [
      "dijital-kartvizit/fotografci",
      "dijital-kartvizit/freelancer-yazilimci",
      "dijital-kartvizit/butik-magaza",
    ],
  },
  {
    slug: "dijital-kartvizit/kisisel-antrenor",
    parent: PARENT,
    kind: "meslek",
    term: "Kişisel antrenörler için",
    title: "Kişisel Antrenörler için Dijital Kartvizit | Dijivizit",
    description:
      "Kişisel antrenörler için dijital kartvizit: ders paketleri PDF'i, sertifikalar, WhatsApp ve Instagram tek profilde. Salonda dokundurun, adayı takip edin.",
    h1: "Kişisel antrenörler için dijital kartvizit",
    lead: "Salonda size soru soran üye bir gün özel ders almak isteyecek; o gün numaranız telefonunda olsun. Ders paketleriniz, sertifikalarınız ve WhatsApp hattınız tek dokunuşla kaydedilsin.",
    sections: [
      {
        heading: "Antrenörün müşterisi salonda başlar",
        paragraphs: [
          "Kişisel antrenörlerin yeni öğrencilerinin çoğu salonun içinden gelir: makinede yardım isteyen üye, ağırlığı soran yeni başlayan, bir arkadaşının sizinle çalıştığını gören kişi. O an kâğıt kartvizit taşımazsınız; antrenman kıyafetinin cebi yoktur.",
          "Dijital kartvizitte kartı telefona dokundurmak birkaç saniye sürer. Üye “Rehberime Kaydet” ile sizi kaydeder, ders paketlerinizi açar; siz antrenmana dönersiniz. Kart yanınızda değilse profil QR kodunu Apple Cüzdan'a ekleyip telefonunuzdan da gösterebilirsiniz.",
        ],
      },
      {
        heading: "Antrenör profiline ne koyulur?",
        list: [
          "Birebir, ikili ve online ders paketleri, “Fiyat Listesi” türünde PDF olarak",
          "Antrenörlük belgeleriniz ve aldığınız eğitimler, PDF olarak ya da “Hakkımda” yazısında",
          "WhatsApp hattı; ders saatleri çoğunlukla mesajla ayarlanır",
          "Instagram hesabınız; antrenman videolarınızı görmek isteyen oradan bakar",
          "Çalıştığınız salonlar ve günleriniz; özel stüdyonuz varsa adresi",
          "Paket ödemeleri için IBAN; siz açmadıkça görünmez",
        ],
        paragraphs: [
          "Uzmanlık alanlarınızı (ör. kuvvet antrenmanı, fonksiyonel antrenman, hamilelik sonrası, ileri yaş) profildeki “Uzmanlık Alanları” bölümüne ekleyin; aday, kendi hedefine uygun antrenör olup olmadığınızı ilk bakışta görür.",
        ],
      },
      {
        heading: "Deneme dersinden düzenli öğrenciye",
        paragraphs: [
          "Özel derse ilgi gösteren üye profilinizdeki “Bilgilerimi bırak” ile adını, numarasını ve “Akşam saatleri, haftada 2 gün” gibi kısa bir not bırakır. Kişi Kişiler listenize düşer; deneme dersi için tarih seçip hatırlatma kurarsınız, o sabah e-postanıza gelir ve WhatsApp mesajı hazır yazılmış olur.",
          "Paketi biten öğrenciye yenileme için “1 ay” hatırlatması kurun. Kişiler listesindeki notlara sağlık geçmişi ya da sakatlık bilgisi yazmanızı önermeyiz; bu bilgileri öğrencinizle kendi takip yönteminizde tutun.",
          "Takviye ve ekipman firmalarının, fizyoterapistlerin ve diyetisyenlerin kâğıt kartvizitlerini fotoğrafını çekerek kaydedersiniz; öğrencinizi yönlendirmeniz gerektiğinde numara elinizin altındadır.",
        ],
      },
      {
        heading: "Salonlar ve stüdyolar için",
        paragraphs: [
          "Birden fazla antrenörle çalışan salonlar ve stüdyolar kartları ekip panelinden yönetir. Antrenör ayrıldığında kart yeni antrenöre atanır; salon kartlarından gelen kişiler salonun listesinde kalır. 10 ve üzeri adette %20 indirim uygulanır ve salonun logosu karta işlenir.",
          "Metal kartlar terli bir el ve spor çantasıyla iyi anlaşır; logo lazerle kazınır, silinmez. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Yalnızca online ders veriyorsanız kartsız dijital kartvizit 2 saat içinde e-postanıza gelir.",
        ],
      },
    ],
    faq: [
      {
        q: "Profilden ders randevusu alınabilir mi?",
        a: "Dijivizit bir randevu sistemi değildir. Ders saatlerini WhatsApp ya da telefonla ayarlarsınız; kullandığınız bir online randevu sayfası varsa bağlantısını web sitesi satırı olarak eklersiniz.",
      },
      {
        q: "Sertifikalarımı nasıl gösteririm?",
        a: "Belgelerinizi PDF olarak yükleyebilirsiniz; en fazla 10 belge, her biri 10 MB'a kadar. Yalnızca adlarını göstermek isterseniz “Hakkımda” yazısında listeleyin.",
      },
      {
        q: "Birden fazla salonda çalışıyorum, ne yazmalıyım?",
        a: "Salonları, adreslerini ve günlerinizi “Hakkımda” yazısında belirtin. Salon değiştirdiğinizde profili güncellersiniz, kart aynı kalır.",
      },
      {
        q: "Telefonumu kaybedersem ne olur?",
        a: "Kart ve profil telefonunuza bağlı değildir. Kartı kaybederseniz panelden kapatırsınız; profilinize ve Kişiler listenize başka bir cihazdan giriş yaparak ulaşırsınız.",
      },
    ],
    guides: [
      "instagram-kartvizit",
      "metal-kartvizit",
      "linktree-alternatifi",
      "dijital-kartvizit-nasil-olusturulur",
    ],
    siblings: [
      "dijital-kartvizit/diyetisyen",
      "dijital-kartvizit/danisman-koc",
      "dijital-kartvizit/icerik-ureticisi",
    ],
  },
  {
    slug: "dijital-kartvizit/dugun-organizasyon",
    parent: PARENT,
    kind: "meslek",
    term: "Düğün ve organizasyon firmaları için",
    title: "Düğün Organizasyonu için Dijital Kartvizit | Dijivizit",
    description:
      "Düğün ve organizasyon firmaları için dijital kartvizit: paket broşürü, kapora IBAN'ı, WhatsApp ve Instagram tek profilde. Fuarda çiftlerin bilgisini toplayın.",
    h1: "Düğün ve organizasyon firmaları için dijital kartvizit",
    lead: "Düğün fuarında, mekân gezisinde ya da bir düğünün sonunda “bu organizasyonu kim yaptı” diye soran çift sizi tek dokunuşla kaydetsin. Paketleriniz, kapora bilgileriniz ve WhatsApp hattınız onun telefonunda kalsın.",
    sections: [
      {
        heading: "Organizasyon işinde müşteri nereden gelir?",
        paragraphs: [
          "Düğün, nişan, kına ve kurumsal etkinlik organizasyonunda yeni müşterinin büyük kısmı başka bir etkinlikten gelir. Misafirler arasında yakında evlenecek biri vardır; masa düzenini, süslemeyi beğenir, sizi sorar. O an elinizde telsiz, kablo ve bir program vardır; kartvizit değil.",
          "Kartı telefonuna dokundurursunuz; çift Instagram hesabınızı ve paketlerinizi açar, “Rehberime Kaydet” ile sizi kaydeder. Masa kartlarına ya da karşılama panosuna koyduğunuz küçük bir QR kod, sizi sormaya fırsat bulamayan misafirlere de ulaşır.",
        ],
      },
      {
        heading: "Organizasyon profiline ne koyulur?",
        list: [
          "Düğün, nişan, kına ve kurumsal etkinlik paketleri, “Broşür” ya da “Fiyat Listesi” türünde PDF olarak",
          "Instagram hesabınız ve web siteniz; geçmiş organizasyonların görüldüğü yerler",
          "WhatsApp hattı ve ofis telefonu; çiftler tarih sormak için önce yazar",
          "Kapora için IBAN ve fatura bilgileri; siz açmadıkça görünmez, tek dokunuşla kopyalanır",
          "Showroom ya da ofis adresi; dokununca harita açılır",
          "Çalıştığınız mekânlar ve hizmet verdiğiniz şehirler, “Hakkımda” yazısında",
        ],
        paragraphs: [
          "Sezon değiştiğinde paket PDF'ini panelden güncellersiniz; fuarda kart verdiğiniz bütün çiftler yeni paketleri görür.",
        ],
      },
      {
        heading: "Fuardan düğün gününe takip",
        paragraphs: [
          "Düğün fuarlarında standınıza gelen çift profilinizdeki “Bilgilerimi bırak” ile adını, numarasını ve “14 Haziran, 250 kişi, kır düğünü” gibi bir not bırakır. Fuar akşamı Kişiler listenizde bütün çiftleri notlarıyla görürsünüz; her birine teklif göndereceğiniz gün için hatırlatma kurarsınız. O sabah e-postanıza gelir, WhatsApp mesajı hazır yazılmış olur.",
          "Organizasyonun asıl işi tedarikçi ağıdır: çiçekçi, pastane, DJ, ses ve ışık, fotoğrafçı, ikram firması. Her birinin kâğıt kartvizitini fotoğrafını çekerek kaydedersiniz; ad, firma ve telefon kendiliğinden dolar, yanına “kır düğünlerinde jeneratör getiriyor” gibi bir not düşersiniz.",
          "Prova, son ödeme ve teslim tarihleri için de hatırlatma kurabilirsiniz. Dijivizit bir etkinlik planlama programı değildir; hatırlatmalar kişi takibi içindir.",
        ],
      },
      {
        heading: "Ekip ve sipariş",
        paragraphs: [
          "Etkinlik koordinatörleri ve satış ekibi için kartları ekip panelinden dağıtırsınız. Sezonluk çalışan ayrıldığında kart yeni kişiye atanır; firma kartlarından gelen çiftler firmanın listesinde kalır.",
          "Açık ahşap kartlar düğün kimlikleriyle, gold metal kartlar daha şık organizasyonlarla uyumludur. 10 ve üzeri adette %20 indirim uygulanır ve firmanızın logosu karta işlenir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Profilden kapora ödemesi alınabilir mi?",
        a: "Hayır, profilde online ödeme yoktur. IBAN'ınızı profilde görünür yaparsınız; çift tek dokunuşla kopyalar ve kendi bankasından gönderir.",
      },
      {
        q: "Masa kartlarına koyacağım QR kodu nereden alırım?",
        a: "Panelden profil QR kodunuzu PNG ya da SVG olarak indirirsiniz. Kod, kartınızla aynı profili açar; bilgileriniz değişse de geçerli kalır.",
      },
      {
        q: "Fuarda toplanan bilgiler kimde kalır?",
        a: "“Bilgilerimi bırak” ile gelen bilgiler sizin Kişiler listenizde, ekip kartlarında firma yöneticisinde görünür. Ziyaretçi bilgisini paylaşmadan önce onay verir.",
      },
      {
        q: "Tarih müsaitliği profilde görünür mü?",
        a: "Hayır, Dijivizit bir takvim ya da rezervasyon sistemi değildir. Çift tarih sormak için WhatsApp'tan yazar; kullandığınız bir takvim sayfası varsa bağlantısını ekleyebilirsiniz.",
      },
    ],
    guides: ["instagram-kartvizit", "qr-kod-kartvizit", "ahsap-kartvizit", "linktree-alternatifi"],
    siblings: [
      "dijital-kartvizit/fotografci",
      "dijital-kartvizit/kuafor-guzellik-salonu",
      "dijital-kartvizit/restoran-kafe",
      "dijital-kartvizit/otel-turizm",
    ],
  },
  {
    slug: "dijital-kartvizit/butik-magaza",
    parent: PARENT,
    kind: "meslek",
    term: "Butik mağazalar için",
    title: "Butik Mağazalar için Dijital Kartvizit | Dijivizit",
    description:
      "Butik mağazalar için dijital kartvizit: yeni sezon kataloğu, WhatsApp sipariş hattı, Instagram, IBAN ve konum tek profilde. Vitrine QR, poşete QR, kasaya NFC.",
    h1: "Butik mağazalar için dijital kartvizit",
    lead: "Mağazadan alışveriş yapan müşteri bir dahaki sefere Instagram'da sizi aramasın; WhatsApp hattınız ve yeni sezon kataloğunuz telefonunda dursun. Vitrin, poşet ve kasa aynı profile çıksın.",
    sections: [
      {
        heading: "Butik mağazada müşteri nasıl geri gelir?",
        paragraphs: [
          "Butik mağazaların satışlarının önemli bir kısmı mağazanın dışında, WhatsApp'tan ve Instagram'dan gelir: “Bu elbisenin M bedeni var mı?”, “Fotoğrafını atar mısınız?”, “Kargoyla gönderir misiniz?”. Bunun için müşterinin mağazanın numarasını kaydetmiş olması gerekir.",
          "Kasada kartı müşterinin telefonuna dokundurduğunuzda mağaza adı, WhatsApp hattı, adres ve Instagram rehberine birlikte kaydolur. Vitrine koyduğunuz QR kod, mağaza kapalıyken önünden geçen kişiye de aynı profili açar.",
        ],
      },
      {
        heading: "Mağaza profiline ne koyulur?",
        list: [
          "Yeni sezon kataloğu ya da lookbook, “Ürün Kataloğu” türünde PDF olarak",
          "WhatsApp sipariş hattı ve mağaza telefonu, ayrı ve etiketli satırlarda",
          "Instagram hesabınız ve varsa online mağazanızın bağlantısı",
          "Havale ile ödeme için IBAN; siz açmadıkça görünmez, tek dokunuşla kopyalanır",
          "Mağaza adresi ve çalışma saatleri; dokununca harita açılır",
          "Kargo, değişim ve iade koşullarınızı anlatan kısa bir PDF",
        ],
        paragraphs: [
          "Dijivizit bir e-ticaret sitesi değildir; profilde sepet ya da online ödeme yoktur. Müşteri ürünü WhatsApp'tan sorar, siz IBAN'ı ya da online mağazanızın bağlantısını gösterirsiniz.",
        ],
      },
      {
        heading: "Vitrin, poşet, etiket",
        list: [
          "Vitrin ve kapı camı: profil QR kodunu panelden PNG ya da SVG olarak indirip bastırın",
          "Poşet, ürün etiketi ve kargo paketi: QR kodu ekleyin; hediye alan kişi de mağazanızı bulsun",
          "“Beden gelince haber verin”: müşteri “Bilgilerimi bırak” ile adını, numarasını ve “Siyah ceket, 38” notunu bıraksın; ürün geldiğinde dönmek için hatırlatma kurun",
          "Atölye ve toptancılar: verdikleri kâğıt kartvizitin fotoğrafını çekin, Kişiler listenize kaydolsun",
        ],
        paragraphs: [
          "Analitik panelinde profilin kaç kez açıldığını, müşterilerin kataloğa mı WhatsApp'a mı Instagram'a mı dokunduğunu ve profile Instagram'dan mı yoksa kart ve QR koddan mı geldiğini görürsünüz.",
        ],
      },
      {
        heading: "Hangi ürün, nasıl teslim?",
        paragraphs: [
          "Yalnızca vitrine ve poşete koyacağınız bir QR kod istiyorsanız kartsız dijital kartvizit yeterlidir: link ve QR kod 2 saat içinde e-postanıza gelir. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir.",
          "Kasada kullanmak ve tedarikçilerle tanışırken vermek için NFC kart; ahşap kartlar butik bir mağaza kimliğiyle, gold metal kartlar daha iddialı vitrinlerle uyumludur. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Birden fazla şubeniz varsa her şube sorumlusuna kart verip ekip panelinden yönetebilirsiniz.",
        ],
      },
    ],
    faq: [
      {
        q: "Profilden satış yapılabilir mi?",
        a: "Hayır. Profilde sepet ya da online ödeme yoktur. Kataloğu PDF olarak gösterir, siparişi WhatsApp'tan alır, ödemeyi IBAN ya da online mağazanız üzerinden alırsınız.",
      },
      {
        q: "Katalog değişince QR kodu yeniden bastırmam gerekir mi?",
        a: "Hayır. PDF'i panelden değiştirirsiniz; vitrindeki ve poşetteki QR kod aynı kalır, yeni kataloğu gösterir.",
      },
      {
        q: "Online mağazamın bağlantısını ekleyebilir miyim?",
        a: "Evet. Web sitesi satırı olarak ekler, etiketine “Online mağaza” yazarsınız. Pazar yerlerindeki mağaza sayfalarınızı da ayrı satırlar olarak ekleyebilirsiniz.",
      },
      {
        q: "Müşteri uygulama indirmek zorunda mı?",
        a: "Hayır. Profil tarayıcıda açılır. NFC'si kapalı telefonlarda vitrindeki ya da telefonunuzun ekranındaki profil QR kodu okutulur.",
      },
    ],
    guides: [
      "instagram-kartvizit",
      "qr-kod-kartvizit",
      "yeni-isletme-kontrol-listesi",
      "ucretsiz-dijital-kartvizit",
    ],
    siblings: [
      "dijital-kartvizit/kuafor-guzellik-salonu",
      "dijital-kartvizit/restoran-kafe",
      "dijital-kartvizit/icerik-ureticisi",
    ],
  },
  {
    slug: "dijital-kartvizit/muhendis",
    parent: PARENT,
    kind: "meslek",
    term: "Mühendisler için",
    title: "Mühendisler için Dijital Kartvizit | Dijivizit",
    description:
      "Mühendisler için dijital kartvizit: teknik doküman, referans listesi, özgeçmiş, LinkedIn ve oda sicil bilgisi tek profilde. Sahada ve fuarda dokundurun.",
    h1: "Mühendisler için dijital kartvizit",
    lead: "Fabrika ziyaretinde, saha kabulünde ya da teknik fuarda tanıştığınız kişi sizi ve dokümanlarınızı tek dokunuşla alsın. Teknik föyleriniz, referanslarınız ve LinkedIn profiliniz kartınızla birlikte karşı tarafa geçsin.",
    sections: [
      {
        heading: "Mühendisin kartviziti teknik bilgi de taşımalı",
        paragraphs: [
          "Mühendislerin tanıştığı kişiler genellikle bir sonraki adımda bir belge ister: ürün föyü, test raporu, referans listesi, yetkinlik belgesi ya da özgeçmiş. Kâğıt kartvizitten sonra bu belgeler e-postayla gönderilir; gönderilmeyi unutur ya da karşı tarafın spam klasöründe kalır.",
          "Dijital kartvizitte belgeler profilinizde durur. Satın almacı, proje müdürü ya da danışman firmadaki muhatabınız kartı telefonuna dokundurduğunda sizi rehberine kaydeder ve ihtiyaç duyduğu dokümanı o an açar.",
        ],
      },
      {
        heading: "Mühendis profiline ne koyulur?",
        list: [
          "Ürün föyleri, test raporları ve kullanım kılavuzları, “Teknik Doküman” türünde PDF olarak",
          "Tamamlanan projeler ve referans listesi; serbest çalışıyorsanız özgeçmişiniz, “Özgeçmiş” türüyle",
          "Kurumsal e-posta, cep telefonu ve LinkedIn profiliniz",
          "Bağlı olduğunuz TMMOB odası ve sicil numaranız, “Hakkımda” yazısında",
          "Uzmanlık alanlarınız: otomasyon, HVAC, statik, enerji verimliliği, kalite gibi",
          "Serbest çalışan ve müşavir mühendisler için fatura bilgileri ve IBAN; siz açmadıkça görünmez",
        ],
        paragraphs: [
          "Her belge en fazla 10 MB olabilir, profile en fazla 10 belge eklenir. Büyük kılavuzları bölümlere ayırmak sahada, zayıf mobil bağlantıda daha hızlı açılır. Belgeler güncellendiğinde panelden değiştirirsiniz; daha önce kart verdiğiniz herkes son revizyonu görür.",
        ],
      },
      {
        heading: "Sahada, fabrikada, fuarda",
        list: [
          "Saha kabulü ve denetim: muhataplarınızın kâğıt kartvizitlerinin fotoğrafını çekin; ad, unvan, şirket ve telefon Kişiler listenize kaydolsun, yanına “revizyon 3 bekleniyor” gibi bir not düşün",
          "Teknik fuarlar: stantta profil QR kodunuzu gösterin; ziyaretçi “Bilgilerimi bırak” ile adını, şirketini ve ihtiyacını not olarak bıraksın",
          "Teklif ve dönüş: her kişiye tarih seçip hatırlatma kurun; o sabah e-postanıza gelir",
          "Sunum ve eğitimler: son slayta profil QR kodunuzu koyun; katılımcılar sunumu ve iletişim bilgilerinizi aynı yerden alsın",
        ],
        paragraphs: [
          "Analitik panelinde profilinizin hangi şehirlerden açıldığını ve ziyaretçilerin hangi dokümanlara dokunduğunu görürsünüz. Bir fuardan sonra en çok hangi ürün föyünün açıldığını buradan anlarsınız.",
        ],
      },
      {
        heading: "Mühendislik firmaları için sipariş",
        paragraphs: [
          "Proje, satış ve servis mühendisleri için kartları ekip panelinden dağıtırsınız. Mühendis başka projeye ya da şirkete geçtiğinde kart yeni kişiye atanır; firmanın kartlarından gelen kişiler firmanın listesinde kalır. Kaybolan kart panelden kapatılır.",
          "Mat siyah ve gümüş metal kartlar teknik bir kurum kimliğine uyar; logo lazerle kazınır, silinmez. 10 ve üzeri adette %20 indirim uygulanır ve firmanızın logosu karta işlenir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Hangi belge türlerini yükleyebilirim?",
        a: "PDF dosyaları yüklersiniz; her birine Teknik Doküman, Ürün Kataloğu, Sunum, Özgeçmiş gibi bir tür seçersiniz. En fazla 10 belge, her biri 10 MB'a kadar.",
      },
      {
        q: "Bazı belgeleri yalnızca istediğim kişiye gösterebilir miyim?",
        a: "Her belgenin herkese açık profilde görünüp görünmeyeceğini siz seçersiniz. Profilde görünen belgeler herkese açıktır; gizli kalması gereken çizim ve raporları doğrudan muhatabınıza gönderin.",
      },
      {
        q: "Şirket değiştirince kartım ne olur?",
        a: "Kart sizinse profildeki şirket adını ve bilgileri güncellersiniz. Kart şirketin ekip panelindeyse şirket kartı başka bir çalışana atar; siz yeni kartınızı alırsınız.",
      },
      {
        q: "GitHub ya da proje sayfalarımı ekleyebilir miyim?",
        a: "Evet. Bağlantıyı web sitesi satırı olarak ekleyip etiketine platformun adını yazarsınız.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "metal-kartvizit",
      "kartvizite-ne-yazilir",
      "akilli-kartvizit-nedir",
    ],
    siblings: [
      "dijital-kartvizit/mimar",
      "dijital-kartvizit/insaat-muteahhit",
      "dijital-kartvizit/kocaeli",
      "dijital-kartvizit/satis-temsilcisi",
    ],
  },
  {
    slug: "dijital-kartvizit/danisman-koc",
    parent: PARENT,
    kind: "meslek",
    term: "Danışmanlar ve koçlar için",
    title: "Danışman ve Koçlar için Dijital Kartvizit | Dijivizit",
    description:
      "Danışmanlar ve koçlar için dijital kartvizit: hizmet broşürü, program PDF'i, LinkedIn ve görüşme bağlantısı tek profilde. Seminerde QR ile katılımcıyı tanıyın.",
    h1: "Danışmanlar ve koçlar için dijital kartvizit",
    lead: "Seminerin, atölyenin ya da kurum içi eğitimin sonunda katılımcılar size ulaşmak ister. Son slayttaki QR kodla hizmetlerinizi, programlarınızı ve görüşme bağlantınızı açsınlar; ilgilenenler bilgisini size bıraksın.",
    sections: [
      {
        heading: "Danışmanlıkta müşteri sahnede başlar",
        paragraphs: [
          "Yönetim danışmanları, kariyer ve iş koçları, eğitmenler ve uzman danışmanlar yeni müşterilerinin çoğunu bir sunumdan, panelden, LinkedIn paylaşımından ya da tavsiyeden kazanır. Sunumdan sonra yanınıza gelen birkaç kişiyle kartvizit alışverişi yaparsınız; salondaki diğer kişiler ise sizi daha sonra aramaya niyet eder ve çoğu bulamaz.",
          "Dijital kartvizitte son slayta profil QR kodunuzu koyarsınız. Salondaki herkes telefonunun kamerasıyla okutur, sizi rehberine kaydeder; ilgilenen kişi “Bilgilerimi bırak” ile adını ve şirketini size iletir. Yanınıza gelenlerle de kartı dokundurarak tanışırsınız.",
        ],
      },
      {
        heading: "Danışman profiline ne koyulur?",
        list: [
          "Hizmetleriniz ve programlarınız, “Broşür” ya da “Sunum” türünde PDF olarak",
          "LinkedIn profiliniz ve web siteniz",
          "Online ilk görüşme için takvim sayfanızın bağlantısı, web sitesi satırı olarak",
          "Aldığınız akreditasyonlar ve eğitimler, “Hakkımda” yazısında ya da PDF olarak",
          "Uzmanlık alanlarınız: liderlik, satış ekipleri, aile şirketleri, kariyer geçişi gibi",
          "Kurumsal müşterileriniz için fatura bilgileri ve IBAN; siz açmadıkça görünmez",
        ],
        paragraphs: [
          "Koçluk ve danışmanlıkta vaat dili kolayca abartıya kaçar. Profilde “garantili sonuç” gibi ifadeler yerine ne yaptığınızı, kimlerle çalıştığınızı ve nasıl çalıştığınızı sade biçimde anlatın; karar veren kişi bunu arar.",
        ],
      },
      {
        heading: "Seminerden sözleşmeye takip",
        paragraphs: [
          "Seminer ya da atölye sonrasında “Bilgilerimi bırak” ile gelen kişiler Kişiler listenize düşer. Her kişiye “Satış ekibi 12 kişi, Ocak'ta eğitim istiyor” gibi bir not ekler, dönüş yapacağınız gün için hatırlatma kurarsınız; o sabah e-postanıza gelir, WhatsApp mesajı hazır yazılmış olur.",
          "Kurum içi eğitimlerde insan kaynakları sorumlusunun, konferanslarda organizatörlerin kâğıt kartvizitlerini fotoğrafını çekerek kaydedersiniz; ad, unvan, şirket ve telefon kendiliğinden dolar.",
          "Bireysel koçluk danışanlarıyla ilgili kişisel ve hassas bilgileri Kişiler listesindeki notlara yazmanızı önermeyiz; liste geri dönüş takibi içindir. Analitik panelinde bir etkinlikten sonra profilinizin kaç kez açıldığını, kaç kişinin sizi rehberine kaydettiğini ve kaç kişinin bilgi bıraktığını görürsünüz.",
        ],
      },
      {
        heading: "Kartlı mı, kartsız mı?",
        paragraphs: [
          "Çoğunlukla online çalışıyorsanız kartsız dijital kartvizit yeterlidir: link ve QR kod 2 saat içinde e-postanıza gelir; e-posta imzanıza ve sunumlarınıza eklersiniz. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir.",
          "Yüz yüze toplantılar ve etkinlikler için NFC kart; metal kartlar resmî bir izlenim bırakır, ahşap kartlar daha sıcaktır. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Danışmanlık firmaları ekipteki danışmanların kartlarını ekip panelinden yönetir; 10 ve üzeri adette %20 indirim uygulanır.",
        ],
      },
    ],
    faq: [
      {
        q: "Görüşme randevusu profilden alınabilir mi?",
        a: "Dijivizit bir randevu sistemi değildir. Kullandığınız online takvim sayfasının bağlantısını web sitesi satırı olarak eklersiniz; ziyaretçi oradan görüşme saati seçer.",
      },
      {
        q: "Sunumdaki QR kod sunumdan sonra da çalışır mı?",
        a: "Evet. Profil QR kodu bilgileriniz değişse de aynı profili açar. Sunum dosyanızı yıllarca kullanabilirsiniz.",
      },
      {
        q: "Katılımcıların bilgileri kimde kalır?",
        a: "“Bilgilerimi bırak” ile gelen bilgiler yalnızca sizin Kişiler listenizde görünür. Ziyaretçi bilgisini paylaşmadan önce onay verir.",
      },
      {
        q: "LinkedIn profilimi ekleyebilir miyim?",
        a: "Evet. LinkedIn için hazır bir alan vardır; kullanıcı adınızı yazmanız yeterlidir.",
      },
    ],
    guides: [
      "linktree-alternatifi",
      "qr-kod-kartvizit",
      "ucretsiz-dijital-kartvizit",
      "kartvizite-ne-yazilir",
    ],
    siblings: [
      "dijital-kartvizit/psikolog",
      "dijital-kartvizit/ogretmen-egitmen",
      "dijital-kartvizit/finans-danismani",
      "dijital-kartvizit/satis-temsilcisi",
    ],
  },
  {
    slug: "dijital-kartvizit/freelancer-yazilimci",
    parent: PARENT,
    kind: "meslek",
    term: "Freelancer ve yazılımcılar için",
    title: "Freelancer ve Yazılımcılar için Dijital Kartvizit | Dijivizit",
    description:
      "Freelancer ve yazılımcılar için dijital kartvizit: GitHub, portfolyo, özgeçmiş, LinkedIn ve fatura bilgileri tek profilde. Meetup'ta dokundurun, imzaya ekleyin.",
    h1: "Freelancer ve yazılımcılar için dijital kartvizit",
    lead: "Meetup'ta, hackathonda ya da teknoloji konferansında tanıştığınız kişi GitHub'ınızı, portfolyonuzu ve iletişim bilgilerinizi tek dokunuşla alsın. Müşteriye fatura bilgisi ve IBAN göndermek de bir mesaj kadar kısa sürsün.",
    sections: [
      {
        heading: "Yazılımcının kartvizite neden ihtiyacı var?",
        paragraphs: [
          "Yazılım dünyasında iş çoğu zaman tanışıklıkla gelir: bir meetup'ta konuştuğunuz kişi aylar sonra bir proje için birini arar, bir konferansta tanıştığınız ekip lideri pozisyon açıldığında sizi hatırlar. O an aklında adınız değil, “şu React'çı” gibi belirsiz bir hatıra vardır.",
          "Dijital kartvizitte karşınızdaki kişi “Rehberime Kaydet”e dokunduğunda adınız, unvanınız ve iletişim bilgileriniz rehberine eklenir; GitHub'ınız ve portfolyonuz da tek dokunuş uzaklıktadır. Serbest çalışıyorsanız aynı profil müşteriye fatura bilgilerinizi ve IBAN'ınızı da gösterir.",
        ],
      },
      {
        heading: "Freelancer profiline ne koyulur?",
        list: [
          "GitHub, GitLab ya da kişisel portfolyo siteniz, etiketli web satırları olarak",
          "LinkedIn ve X hesaplarınız",
          "Özgeçmişiniz, “Özgeçmiş” türünde PDF olarak; iş arıyorsanız güncel tutun",
          "Kullandığınız teknolojiler, profildeki “Yetenekler” bölümünde",
          "Serbest çalışıyorsanız fatura bilgileriniz ve IBAN; siz açmadıkça görünmez, tek dokunuşla kopyalanır",
          "Tasarımcıysanız Behance ya da Dribbble bağlantınız",
        ],
        paragraphs: [
          "Profil adresi adınızı değil rastgele bir kodu içerir; tahmin edilemez ve arama motorlarında adınızla eşleşmez. Kişisel telefonunuzu göstermek istemiyorsanız yalnızca e-posta ve iş için kullandığınız bir hattı ekleyebilirsiniz.",
        ],
      },
      {
        heading: "Meetup, konferans, müşteri görüşmesi",
        list: [
          "Meetup ve hackathon: kartı dokundurun; telefonlar zaten elde olduğu için kâğıt kartvizitten daha hızlıdır",
          "Konuşmacıysanız: son slayta profil QR kodunuzu koyun; sunum sonrası soru sormak isteyen size ulaşsın",
          "E-posta imzası ve GitHub profili: profil bağlantınızı ekleyin; kartsız ulaşan herkes aynı sayfayı görsün",
          "İşe alımcılar ve müşteri adayları: verdikleri kâğıt kartvizitin fotoğrafını çekin, Kişiler listenize kaydolsun; dönüş için hatırlatma kurun",
        ],
        paragraphs: [
          "Analitik panelinde profilinizin LinkedIn'den mi, X'ten mi, yoksa kart ve QR koddan mı açıldığını ve ziyaretçilerin GitHub'ınıza mı özgeçmişinize mi dokunduğunu görürsünüz.",
        ],
      },
      {
        heading: "Kartlı mı, kartsız mı?",
        paragraphs: [
          "İletişiminiz çoğunlukla çevrim içiyse kartsız dijital kartvizit yeterlidir: link ve QR kod 2 saat içinde e-postanıza gelir. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir. Daha sonra NFC karta geçtiğinizde link ve QR aynı kalır.",
          "Etkinliklere sık katılıyorsanız NFC kart işinizi kolaylaştırır. Mat siyah PVC kart 2.500 TL, metal kartlar 4.000 TL'dir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir; kart okunmazsa ücretsiz yenisiyle değiştirilir.",
        ],
      },
    ],
    faq: [
      {
        q: "GitHub için hazır bir alan var mı?",
        a: "GitHub bağlantınızı web sitesi satırı olarak ekler, etiketine “GitHub” yazarsınız. LinkedIn, Instagram ve X için hazır alanlar vardır.",
      },
      {
        q: "Profilimde kod örneği ya da proje gösterebilir miyim?",
        a: "Profil kod çalıştırmaz; projelerinizin bağlantılarını ve PDF olarak hazırladığınız proje özetlerini eklersiniz. En fazla 20 bağlantı ve 10 belge eklenebilir.",
      },
      {
        q: "Müşteriye fatura bilgilerimi nasıl gönderirim?",
        a: "Fatura bilgilerinizi ve IBAN'ınızı panelden ekleyip görünür yaparsınız. Müşteri profilinizden tek dokunuşla kopyalar; ayrıca mesaj yazmanız gerekmez.",
      },
      {
        q: "Uzaktan çalışıyorum, kart işime yarar mı?",
        a: "Yalnızca çevrim içi çalışıyorsanız kartsız dijital kartvizit yeterlidir. Kart, yüz yüze etkinliklerde tanışmayı hızlandırır.",
      },
    ],
    guides: [
      "linktree-alternatifi",
      "ucretsiz-dijital-kartvizit",
      "dijital-kartvizit-nedir",
      "dijital-kartvizit-ornekleri",
    ],
    siblings: [
      "dijital-kartvizit/muhendis",
      "dijital-kartvizit/icerik-ureticisi",
      "dijital-kartvizit/akademisyen-ogrenci",
    ],
  },
  {
    slug: "dijital-kartvizit/akademisyen-ogrenci",
    parent: PARENT,
    kind: "meslek",
    term: "Akademisyenler ve öğrenciler için",
    title: "Akademisyen ve Öğrenciler için Dijital Kartvizit | Dijivizit",
    description:
      "Akademisyenler ve öğrenciler için dijital kartvizit: akademik özgeçmiş, ORCID, yayın listesi ve LinkedIn tek profilde. Kongre posterine ve kariyer fuarına QR.",
    h1: "Akademisyenler ve öğrenciler için dijital kartvizit",
    lead: "Kongrede posterinizin başında, kariyer fuarında bir şirket standında ya da staj görüşmesinde kendinizi tek dokunuşla tanıtın. Özgeçmişiniz, yayınlarınız ve akademik profilleriniz karşı tarafın telefonunda kalsın.",
    sections: [
      {
        heading: "Akademide ve kampüste kartvizit",
        paragraphs: [
          "Akademik hayatta tanışmaların çoğu kongrelerde, çalıştaylarda ve misafir öğretim üyesi ziyaretlerinde olur. Kahve arasında konuştuğunuz araştırmacı aylar sonra ortak bir proje için sizi arar; adınızı hatırlasa bile hangi üniversitede olduğunuzu ya da güncel e-posta adresinizi bilmeyebilir.",
          "Öğrenciler için ilk temas genellikle kariyer fuarında, staj başvurusunda ya da bir şirketin kampüs etkinliğinde olur. İnsan kaynakları standında onlarca özgeçmiş toplanır; sizin özgeçmişiniz telefonda, adınızla birlikte kalırsa ayrışır.",
        ],
      },
      {
        heading: "Profilinize ne koymalısınız?",
        list: [
          "Akademisyenler: unvanınız, üniversite ve bölümünüz, kurumsal e-posta ve ofis adresiniz",
          "Akademik özgeçmiş ve yayın listesi, “Özgeçmiş” türünde PDF olarak",
          "ORCID, Google Scholar, ResearchGate ya da kurum sayfanız, etiketli web satırları olarak",
          "Araştırma alanlarınız, profildeki “Uzmanlık Alanları” bölümünde",
          "Öğrenciler: güncel özgeçmiş, LinkedIn, varsa portfolyo ya da GitHub bağlantısı",
          "Öğrenciler: bölümünüz, mezuniyet yılınız ve aradığınız staj ya da pozisyon, “Hakkımda” yazısında",
        ],
        paragraphs: [
          "Yeni bir makale yayımlandığında ya da başka bir üniversiteye geçtiğinizde profili güncellersiniz; kongrede kart verdiğiniz herkes güncel bilgiyi görür. Öğrenciyken aldığınız kart, mezun olduğunuzda da çalışmaya devam eder; yalnızca profildeki bilgiler değişir.",
        ],
      },
      {
        heading: "Kongrede, posterde, kariyer fuarında",
        list: [
          "Poster ve sunum: profil QR kodunuzu posterin köşesine ya da son slayta koyun; tam metni ve özgeçmişinizi isteyen kişi oradan alsın",
          "Kongre arası: tanıştığınız araştırmacıların kâğıt kartvizitlerinin fotoğrafını çekin; ad, unvan ve kurum Kişiler listenize kaydolsun",
          "Kariyer fuarı: şirket temsilcisine kartı dokundurun, özgeçmişiniz telefonunda kalsın; standdan aldığınız kartvizitleri aynı gün tarayın",
          "Başvuru takibi: başvurduğunuz şirket ya da laboratuvar için tarih seçip hatırlatma kurun; o sabah e-postanıza gelir",
        ],
        paragraphs: [
          "Analitik panelinde özgeçmişinizin kaç kez açıldığını görürsünüz; kariyer fuarından sonra ilginin olup olmadığını buradan anlarsınız.",
        ],
      },
      {
        heading: "Hangi ürün, ne kadar?",
        paragraphs: [
          "Bütçeniz sınırlıysa kartsız dijital kartvizit yeterli olabilir: link ve QR kod 2 saat içinde e-postanıza gelir; posterinize, özgeçmişinize ve e-posta imzanıza eklersiniz. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir.",
          "NFC kartlarda mat siyah PVC ve ahşap kartlar 2.500 TL, metal kartlar 4.000 TL'dir; kartla birlikte profil ilk yıl ücretsizdir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Bölümler, araştırma grupları ve öğrenci kulüpleri 10 ve üzeri adette %20 indirimle toplu sipariş verebilir.",
        ],
      },
    ],
    faq: [
      {
        q: "ORCID ya da Google Scholar için hazır alan var mı?",
        a: "Bağlantıyı web sitesi satırı olarak ekler, etiketine platformun adını yazarsınız. Ziyaretçi dokunduğunda doğrudan o sayfa açılır.",
      },
      {
        q: "Öğrenci indirimi var mı?",
        a: "Ayrı bir öğrenci indirimi yoktur. 10 ve üzeri adetteki toplu siparişlerde %20 indirim uygulanır; kulüp ya da bölüm olarak birlikte sipariş verebilirsiniz.",
      },
      {
        q: "Mezun olunca kartım ne olur?",
        a: "Kart aynı kalır; profildeki unvanı, kurumu ve özgeçmişi güncellersiniz. Daha önce kart verdiğiniz kişiler güncel bilgilerinizi görür.",
      },
      {
        q: "Profilimi kimler bulabilir?",
        a: "Profil adresi adınızı değil rastgele bir kodu içerir; yalnızca kartınızı okutan ya da bağlantınızı paylaştığınız kişiler ulaşır. Kartı kaybederseniz panelden kapatırsınız.",
      },
    ],
    guides: [
      "dijital-kartvizit-nasil-olusturulur",
      "ucretsiz-dijital-kartvizit",
      "qr-kod-kartvizit",
      "kartvizite-ne-yazilir",
    ],
    siblings: [
      "dijital-kartvizit/ogretmen-egitmen",
      "dijital-kartvizit/freelancer-yazilimci",
      "dijital-kartvizit/doktor",
    ],
  },
  {
    slug: "dijital-kartvizit/finans-danismani",
    parent: PARENT,
    kind: "meslek",
    term: "Finans ve yatırım danışmanları için",
    title: "Finans Danışmanları için Dijital Kartvizit | Dijivizit",
    description:
      "Finans ve yatırım danışmanları için dijital kartvizit: kurum bilgisi, lisanslar, şube adresi ve iletişim tek profilde; vaat içermeyen, sade ve güvenilir bilgi.",
    h1: "Finans ve yatırım danışmanları için dijital kartvizit",
    lead: "Müşteri ziyaretinde, seminerde ya da şube görüşmesinde kendinizi ve kurumunuzu tek dokunuşla tanıtın. Unvanınız, lisanslarınız ve size ulaşma yolları müşterinin telefonunda olsun; vaat değil, bilgi.",
    sections: [
      {
        heading: "Finans danışmanının kartvizitten beklentisi",
        paragraphs: [
          "Bankalarda portföy yöneticileri, aracı kurumlarda yatırım danışmanları, bireysel emeklilik ve kredi danışmanları müşterileriyle uzun süreli bir ilişki kurar. Müşteri sizi yılda birkaç kez arar: bir yatırım kararı öncesinde, piyasa dalgalandığında, bir ürünün vadesi dolduğunda.",
          "Dijital kartvizitte müşteri “Rehberime Kaydet”e dokunduğunda adınız, unvanınız, kurumunuz, şube telefonu ve cep numaranız rehberine birlikte eklenir. Şube değiştirdiğinizde kartı yeniden bastırmazsınız; profili güncellersiniz.",
        ],
      },
      {
        heading: "Mevzuata uygun, sade bir profil",
        paragraphs: [
          "Yatırım danışmanlığı ve finansal ürünlerin tanıtımı Türkiye'de mevzuata ve kurumunuzun iç kurallarına tabidir. Profili bir ürün tanıtım sayfası gibi değil, kim olduğunuzu ve size nasıl ulaşılacağını gösteren bir bilgi kartı gibi hazırlayın. Kesin sınırlar için kurumunuzun uyum biriminin yönlendirmelerini esas alın.",
        ],
        list: [
          "Koyun: adınız, unvanınız, kurumunuz ve şubeniz",
          "Koyun: sahip olduğunuz lisanslar, “Hakkımda” yazısında",
          "Koyun: şube telefonu, cep, kurumsal e-posta ve şube adresi",
          "Koyun: kurumunuzun web sitesi ve LinkedIn profiliniz",
          "Kaçının: getiri vaadi, “garantili kazanç” gibi ifadeler, belirli ürünlerin tavsiyesi, müşteri yorumları",
        ],
      },
      {
        heading: "Müşteri ilişkisi ve gizlilik",
        paragraphs: [
          "Seminerde ya da müşteri etkinliğinde profilinizi açan kişi “Bilgilerimi bırak” ile adını ve numarasını size iletir; Kişiler listenize düşer, dönüş için hatırlatma kurarsınız. O sabah e-postanıza gelir.",
          "Kişiler listesindeki notlara müşterinin portföy büyüklüğü, hesap bilgisi ya da risk profili gibi finansal veriler yazmanızı önermeyiz. Bu bilgiler kurumunuzun sistemlerinde kalmalı; Kişiler listesi yalnızca ilk temas ve dönüş takibi içindir.",
          "Muhasebeci, avukat ve sigorta acentesi gibi iş ortaklarınızın kâğıt kartvizitlerini fotoğrafını çekerek kaydedersiniz; ad, unvan, şirket ve telefon kendiliğinden dolar.",
        ],
      },
      {
        heading: "Şube ve kurumlar için sipariş",
        paragraphs: [
          "Şubeler ve danışmanlık ekipleri kartları ekip panelinden yönetir. Danışman başka şubeye geçtiğinde ya da ayrıldığında kart yeni kişiye atanır; kurum kartlarından gelen kişiler kurumun listesinde kalır. Kaybolan kart panelden kapatılır.",
          "Mat siyah ve gümüş metal kartlar finans kurumlarının kimliğiyle uyumludur; logo lazerle kazınır, silinmez. 10 ve üzeri adette %20 indirim uygulanır ve kurumunuzun logosu karta işlenir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Profile ürün sunumu ekleyebilir miyim?",
        a: "Teknik olarak PDF yüklenebilir; ancak finansal ürün tanıtımı mevzuata ve kurum kurallarına tabidir. Kurumunuzun onayladığı genel bilgilendirme belgeleri dışında ürün sunumu eklememenizi öneririz. İçeriğin mevzuata uygunluğu kullanıcının sorumluluğundadır.",
      },
      {
        q: "Profilde müşteri bilgisi görünür mü?",
        a: "Hayır. Profil yalnızca sizin bilgilerinizi gösterir. Ziyaretçinin bıraktığı bilgiler yalnızca sizin Kişiler listenizde, ekip kartlarında kurum yöneticisinde görünür.",
      },
      {
        q: "Profil adresim tahmin edilebilir mi?",
        a: "Hayır. Profil adresi adınızı değil rastgele bir kodu içerir. Kart kaybolursa panelden tek tıkla kapatırsınız.",
      },
      {
        q: "Şube değiştirince yeni kart gerekir mi?",
        a: "Hayır. Şube adını, adresi ve telefonu panelden güncellersiniz; aynı kart yeni bilgileri gösterir.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "metal-kartvizit",
      "kartvizite-ne-yazilir",
      "en-iyi-dijital-kartvizit-nasil-secilir",
    ],
    siblings: [
      "dijital-kartvizit/mali-musavir",
      "dijital-kartvizit/sigorta-acentesi",
      "dijital-kartvizit/danisman-koc",
      "dijital-kartvizit/avukat",
    ],
  },
  {
    slug: "dijital-kartvizit/tercuman",
    parent: PARENT,
    kind: "meslek",
    term: "Tercümanlar için",
    title: "Tercümanlar için Dijital Kartvizit | Dijivizit",
    description:
      "Tercümanlar için dijital kartvizit: dil çiftleri, yeminli tercüme bilgisi, fiyat PDF'i ve WhatsApp tek profilde. Müşteri belgesini tek dokunuşla göndersin.",
    h1: "Tercümanlar için dijital kartvizit",
    lead: "Noterde, adliyede, konferans salonunda ya da bir fabrika ziyaretinde tanıştığınız kişi hangi dillerde çalıştığınızı ve size nasıl belge göndereceğini tek bakışta görsün. Numaranız onun rehberinde, dil çiftleriniz profilinizde dursun.",
    sections: [
      {
        heading: "Tercümanlar dijital kartviziti nerede kullanır?",
        paragraphs: [
          "Tercümanların işi çok farklı yerlerden gelir: noterlerde ve tercüme bürolarında yeminli çeviri, adliyede ve emniyette sözlü tercüme, fuarlarda ve fabrika ziyaretlerinde refakat tercümesi, konferanslarda simultane çeviri. Her birinde sizi bir sonraki iş için hatırlamaları gereken kişi farklıdır: noter çalışanı, organizasyon firması, yabancı misafiri ağırlayan şirket.",
          "Dijital kartvizitte karşınızdaki kişi “Rehberime Kaydet”e dokunduğunda adınız, dilleriniz ve iletişim bilgileriniz rehberine eklenir. Yabancı bir misafire de aynı kartı dokundurursunuz; telefon numarası ve e-posta her dilde aynı görünür.",
        ],
      },
      {
        heading: "Tercüman profiline ne koyulur?",
        list: [
          "Çalıştığınız dil çiftleri ve uzmanlık alanlarınız (hukuki, tıbbi, teknik, ticari), “Uzmanlık Alanları” bölümünde",
          "Yeminli tercümansanız hangi noterde yeminli olduğunuz, “Hakkımda” yazısında",
          "WhatsApp hattı; müşteriler çevrilecek belgenin fotoğrafını çoğunlukla buradan gönderir",
          "Belge gönderimi için e-posta adresiniz",
          "Fiyatlandırma ve teslim süreleriniz, “Fiyat Listesi” türünde PDF olarak",
          "Ödeme için IBAN ve fatura bilgileri; siz açmadıkça görünmez",
        ],
        paragraphs: [
          "Profil arayüzü Türkçedir; “Hakkımda” yazısına çalıştığınız dillerde kısa birer paragraf ekleyerek yabancı müşterilerin de sizi anlamasını sağlayabilirsiniz. Özgeçmişinizi her dilde ayrı PDF olarak da yükleyebilirsiniz.",
        ],
      },
      {
        heading: "Noter, büro, organizasyon: iş çevresi",
        list: [
          "Noterler ve tercüme büroları: çalıştığınız bürolara kartınızı dokundurun; acil bir iş geldiğinde sizi rehberde bulsunlar",
          "Fuar ve organizasyon firmaları: verdikleri kâğıt kartvizitin fotoğrafını çekin, Kişiler listenize kaydolsun; yanına “Mart fuarı, Almanca refakat” notunu düşün",
          "Yabancı misafirler ve şirketler: refakat tercümesi bittiğinde kartı dokundurun; bir sonraki ziyarette doğrudan size yazsınlar",
          "Teslim tarihleri: iş takibi için kişiye tarih seçip hatırlatma kurun; o sabah e-postanıza gelir",
        ],
        paragraphs: [
          "Müşterinin gönderdiği belgelerdeki kişisel bilgileri Kişiler listesindeki notlara yazmanızı önermeyiz. Profildeki belgeler herkese açıktır; çevrilmiş belgeleri profile değil, doğrudan müşteriye gönderin.",
        ],
      },
      {
        heading: "Kartlı mı, kartsız mı?",
        paragraphs: [
          "İşleriniz çoğunlukla e-postayla geliyorsa kartsız dijital kartvizit yeterlidir: link ve QR kod 2 saat içinde e-postanıza gelir; e-posta imzanıza ve tercüme platformlarındaki profilinize eklersiniz. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir.",
          "Sözlü ve refakat tercümesi yapıyorsanız NFC kart tanışmayı hızlandırır. Mat siyah PVC kart 2.500 TL, metal kartlar 4.000 TL'dir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Tercüme büroları ekipteki tercümanların kartlarını ekip panelinden yönetebilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Profil başka dillerde görüntülenebilir mi?",
        a: "Profil arayüzü Türkçedir. Ad, telefon, e-posta ve adres her dilde aynı görünür; “Hakkımda” yazısına ve belgelerinize istediğiniz dilde içerik ekleyebilirsiniz.",
      },
      {
        q: "Müşteri belge fotoğrafını nasıl gönderir?",
        a: "Profilinizdeki WhatsApp satırına dokunur ve doğrudan size yazar ya da e-posta satırına dokunarak e-posta gönderir. Profilde dosya yükleme alanı yoktur.",
      },
      {
        q: "Yeminli tercümanlık belgemi ekleyebilir miyim?",
        a: "Belgenizi PDF olarak yükleyebilir ya da yalnızca bilgisini “Hakkımda” yazısında belirtebilirsiniz. Profildeki belgeler herkese açıktır; kişisel bilgilerinizi içeren sayfaları eklemeden önce kontrol edin.",
      },
      {
        q: "Kaç belge ekleyebilirim?",
        a: "En fazla 10 PDF, her biri 10 MB'a kadar.",
      },
    ],
    guides: [
      "kartvizite-ne-yazilir",
      "ucretsiz-dijital-kartvizit",
      "dijital-kartvizit-nasil-olusturulur",
      "nfc-kartvizit-hangi-telefonlarda-calisir",
    ],
    siblings: [
      "dijital-kartvizit/avukat",
      "dijital-kartvizit/otel-turizm",
      "dijital-kartvizit/freelancer-yazilimci",
    ],
  },
  {
    slug: "dijital-kartvizit/nakliye-lojistik",
    parent: PARENT,
    kind: "meslek",
    term: "Nakliye ve lojistik firmaları için",
    title: "Nakliye ve Lojistik için Dijital Kartvizit | Dijivizit",
    description:
      "Nakliye ve lojistik firmaları için dijital kartvizit: hizmet bölgeleri, yetki belgesi, WhatsApp ve fatura bilgileri tek profilde. Araç kasasına QR koyun.",
    h1: "Nakliye ve lojistik firmaları için dijital kartvizit",
    lead: "Evden eve taşınacak müşteri, yükünü göndermek isteyen işletme ya da depoda tanıştığınız tedarikçi sizi tek dokunuşla kaydetsin. Kamyon kasasındaki QR kod da trafikte sizi gören kişiyi aynı profile götürsün.",
    sections: [
      {
        heading: "Nakliyede kartvizitin işi",
        paragraphs: [
          "Nakliye müşterisi genellikle bir kez taşınır ama çevresine sizi önerir: komşusuna, iş yerine, apartmandaki başka bir aileye. Lojistikte ise ilişki süreklidir; fabrika sevkiyat sorumlusu, depo yöneticisi ve gümrük müşaviri sizi her hafta arar. İki durumda da numaranızın doğru adla rehberde olması gerekir.",
          "Taşıma bittiğinde kartı müşterinin telefonuna dokundurursunuz; firma adı, telefon, WhatsApp ve adres rehberine birlikte kaydolur. Kamyonun ya da kamyonetin kasasına koyduğunuz büyük bir QR kod, trafikte ya da sitede aracı gören kişiye de aynı profili açar.",
        ],
      },
      {
        heading: "Firma profiline ne koyulur?",
        list: [
          "Telefon, WhatsApp ve operasyon hattı; “Fiyat teklifi” ya da “Operasyon” gibi etiketlerle",
          "Hizmet verdiğiniz bölgeler ve şehirler arası güzergâhlar, “Hakkımda” yazısında",
          "Yetki belgesi türünüz ve numaranız; taşıma sigortası bilgisi",
          "“Taşınmadan önce yapılacaklar” ya da hizmet broşürü, PDF olarak",
          "Kurumsal müşteriler için fatura bilgileri ve IBAN; siz açmadıkça görünmez",
          "Ofis ya da depo adresi; dokununca harita açılır",
        ],
        paragraphs: [
          "Hizmet bölgeniz ya da numaranız değiştiğinde profili güncellersiniz; araç kasasındaki QR kod ve dağıttığınız kartlar yeni bilgiyi gösterir. Kasayı yeniden giydirmeniz gerekmez.",
        ],
      },
      {
        heading: "Keşiften teslimata takip",
        paragraphs: [
          "Teklif almak isteyen müşteri profilinizdeki “Bilgilerimi bırak” ile adını, numarasını ve “3+1, 4. kat, asansör yok, Ankara'dan İzmir'e, 15 Eylül” gibi bir not bırakır. Kişi Kişiler listenize düşer; keşif ya da teklif günü için hatırlatma kurarsınız, o sabah e-postanıza gelir ve WhatsApp mesajı hazır yazılmış olur.",
          "Lojistikte tanıştığınız sevkiyat sorumlularının, depo yöneticilerinin ve gümrük müşavirlerinin kâğıt kartvizitlerini fotoğrafını çekerek kaydedersiniz; ad, unvan, şirket ve telefon kendiliğinden dolar. Analitik panelinde profilinizin hangi şehirlerden açıldığını görürsünüz; şehirler arası taleplerin nereden geldiğini buradan izlersiniz.",
        ],
      },
      {
        heading: "Şoförler ve saha ekibi için",
        paragraphs: [
          "Şoförler, ekip başları ve satış sorumluları için kartları ekip panelinden dağıtırsınız. Şoför ayrıldığında kart yeni kişiye atanır; firma kartlarından gelen müşteriler firmanın listesinde kalır. Kaybolan kart panelden kapatılır, diğer kartlar çalışmaya devam eder.",
          "Mat siyah PVC kartlar hafif ve uygun fiyatlıdır, metal kartlar daha dayanıklıdır. 10 ve üzeri adette %20 indirim uygulanır ve firmanızın logosu karta işlenir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Araç kasasına hangi QR kodu koyarım?",
        a: "Panelden profil QR kodunuzu PNG ya da SVG olarak indirirsiniz; SVG büyük baskıda bozulmaz. Bilgileriniz değişse de kod aynı profili açar.",
      },
      {
        q: "Profilden fiyat teklifi verilebilir mi?",
        a: "Hayır, profil otomatik fiyat hesaplamaz. Müşteri “Bilgilerimi bırak” ile taşınacak eşyayı ve tarihi not olarak yazar ya da WhatsApp'tan fotoğraf gönderir; teklifi siz verirsiniz.",
      },
      {
        q: "Şoför ayrılırsa kartı ne yaparız?",
        a: "Ekip panelinden kartı yeni şoföre atarsınız. Kart geri alınamadıysa panelden kapatırsınız; kapatılan kart artık profil açmaz.",
      },
      {
        q: "Müşteri uygulama indirmek zorunda mı?",
        a: "Hayır. Kart dokundurulduğunda ya da QR okutulduğunda profil tarayıcıda açılır.",
      },
    ],
    guides: [
      "qr-kod-kartvizit",
      "kurumsal-dijital-kartvizit",
      "yeni-isletme-kontrol-listesi",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
    ],
    siblings: [
      "dijital-kartvizit/usta-teknik-servis",
      "dijital-kartvizit/satis-temsilcisi",
      "dijital-kartvizit/kocaeli",
    ],
  },
  {
    slug: "dijital-kartvizit/usta-teknik-servis",
    parent: PARENT,
    kind: "meslek",
    term: "Ustalar ve teknik servisler için",
    title: "Usta ve Teknik Servis için Dijital Kartvizit | Dijivizit",
    description:
      "Elektrikçi, tesisatçı ve teknik servisler için dijital kartvizit: WhatsApp, hizmet bölgesi, IBAN ve fatura bilgisi tek profilde. Kombiye, sigorta kutusuna QR.",
    h1: "Ustalar ve teknik servisler için dijital kartvizit",
    lead: "Kombi bir sonraki kışta yine arıza verdiğinde müşteri sizi aramasın da kimi arasın? İşi bitirdiğinizde kartı telefonuna dokundurun; numaranız rehberinde, QR kodunuz kombinin üstünde dursun.",
    sections: [
      {
        heading: "Ustanın asıl sorunu: “Geçen sefer gelen usta kimdi?”",
        paragraphs: [
          "Elektrikçi, tesisatçı, kombi ve klima servisi, beyaz eşya tamircisi ya da çilingir; hepsinin müşterisi bir arıza olduğunda arar ve o an hızlı karar verir. Geçen sefer gelen ustanın numarası telefonda “Usta” diye kayıtlıysa ya da hiç kayıtlı değilse, müşteri internette ilk çıkan numarayı arar.",
          "İşi bitirdiğinizde kartı müşterinin telefonuna dokundurursunuz; adınız, firma adınız, telefon ve WhatsApp hattınız rehberine birlikte kaydolur. Kombinin, sigorta kutusunun ya da klima iç ünitesinin yanına yapıştırdığınız küçük bir QR etiket, bir sonraki arızada müşteriyi doğrudan size getirir.",
        ],
      },
      {
        heading: "Usta profiline ne koyulur?",
        list: [
          "Telefon ve WhatsApp hattı; müşteri arızanın fotoğrafını ya da videosunu gönderebilsin",
          "Yaptığınız işler: elektrik tesisatı, pano, kombi bakımı, su kaçağı, klima montajı gibi; “Uzmanlık Alanları” bölümünde",
          "Hizmet verdiğiniz ilçeler ve çalışma saatleri, “Hakkımda” yazısında",
          "Ustalık belgeniz ya da yetkili servis olduğunuz markalar",
          "Ödeme için IBAN ve fatura bilgileri; siz açmadıkça görünmez, müşteri tek dokunuşla kopyalar",
          "Varsa dükkânınızın adresi; dokununca harita açılır",
        ],
        paragraphs: [
          "Numaranızı değiştirdiğinizde ya da yeni bir ilçeye hizmet vermeye başladığınızda profili güncellersiniz; müşterilerin elindeki kartlar ve kombilerin üstündeki QR etiketler yeni bilgiyi gösterir.",
        ],
      },
      {
        heading: "Bakım zamanı ve iş takibi",
        list: [
          "Yıllık bakım: kombi ya da klima bakımı yaptığınız müşteriye “1 yıl sonra” için tarih seçip hatırlatma kurun; o sabah e-postanıza gelir, WhatsApp mesajı hazır yazılmış olur",
          "Keşif talepleri: müşteri “Bilgilerimi bırak” ile adını ve “banyoda su kaçağı, alt kata sızıyor” gibi bir not bıraksın",
          "Malzeme ve yedek parça: toptancıların ve yetkili bayilerin kâğıt kartvizitlerinin fotoğrafını çekin, Kişiler listenize kaydolsun",
          "Site ve apartman yöneticileri: kartı dokundurun; ortak alan arızalarında sizi arasınlar",
        ],
        paragraphs: [
          "Analitik panelinde profilinizin kaç kez açıldığını ve müşterilerin aramaya mı WhatsApp'a mı dokunduğunu görürsünüz. Kış başında arızaların arttığını grafikten de izlersiniz.",
        ],
      },
      {
        heading: "Kart seçimi ve servis ekipleri",
        paragraphs: [
          "Metal kartlar alet çantasında, cepte ve iş kıyafetinde dayanıklıdır; logo lazerle kazınır, silinmez. Mat siyah PVC kart hafiftir ve 2.500 TL'dir, metal kartlar 4.000 TL. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir; kart okunmazsa ücretsiz yenisiyle değiştirilir.",
          "Birden fazla teknisyeni olan servisler kartları ekip panelinden yönetir. Teknisyen ayrıldığında kart yeni kişiye atanır; servis kartlarından gelen müşteriler servisin listesinde kalır. 10 ve üzeri adette %20 indirim uygulanır ve servisinizin logosu karta işlenir.",
        ],
      },
    ],
    faq: [
      {
        q: "Kombiye yapıştıracağım QR etiketi nereden alırım?",
        a: "Panelden profil QR kodunuzu PNG ya da SVG olarak indirir, etiket olarak bastırırsınız. Kod, kartınızla aynı profili açar; numaranız değişse de etiket geçerli kalır.",
      },
      {
        q: "Bakım hatırlatması müşteriye otomatik gider mi?",
        a: "Hayır. Hatırlatma size gelir: seçtiğiniz gün sabah e-postanıza düşer, müşteriye yazacağınız WhatsApp mesajı hazır olur. Mesajı siz gönderirsiniz.",
      },
      {
        q: "Akıllı telefonu olmayan müşteri ne yapar?",
        a: "Profil akıllı telefon ya da bilgisayar gerektirir. Telefonunda NFC ya da kamera olmayan müşteriye numaranızı söylemeniz yeterlidir; kart ve QR, akıllı telefonu olanlar içindir.",
      },
      {
        q: "Müşteri uygulama indirmek zorunda mı?",
        a: "Hayır. Kart dokundurulduğunda ya da QR okutulduğunda profil tarayıcıda açılır.",
      },
    ],
    guides: [
      "qr-kod-kartvizit",
      "metal-kartvizit",
      "yeni-isletme-kontrol-listesi",
      "telefonda-nfc-nasil-acilir",
    ],
    siblings: [
      "dijital-kartvizit/nakliye-lojistik",
      "dijital-kartvizit/insaat-muteahhit",
      "dijital-kartvizit/berber",
    ],
  },
  {
    slug: "dijital-kartvizit/berber",
    parent: PARENT,
    kind: "meslek",
    term: "Berberler için",
    title: "Berberler için Dijital Kartvizit | Dijivizit",
    description:
      "Berberler için dijital kartvizit: WhatsApp randevu hattı, fiyat listesi, Instagram ve konum tek profilde. Aynaya QR, koltukta NFC; müşteri rehberine kaydetsin.",
    h1: "Berberler için dijital kartvizit",
    lead: "Düzenli müşteriniz iki üç haftada bir gelir ve her seferinde “müsait misin” diye sorar. Numaranız, Instagram'ınız ve fiyat listeniz telefonunda olsun; sırayı WhatsApp'tan bir mesajla alsın.",
    sections: [
      {
        heading: "Berberde müşteri sadakati numarayla başlar",
        paragraphs: [
          "Berber müşterisi büyük ölçüde sadıktır; bir kez memnun kaldığı berbere yıllarca gider. Ama ilk birkaç ziyarette numaranızı kaydetmediyse, yoğun bir cumartesi dükkânın önünden geçip sırayı görünce başka bir yere gider.",
          "Koltuktan kalkarken kartı müşterinin telefonuna dokundurursunuz; dükkânın adı, WhatsApp hattı, adres ve Instagram rehberine birlikte kaydolur. Aynanın kenarına koyduğunuz QR kodu, sıra bekleyen müşteri o arada kendisi okutur.",
        ],
      },
      {
        heading: "Berber profiline ne koyulur?",
        list: [
          "WhatsApp hattı; sıra ve randevu çoğunlukla mesajla alınır",
          "Saç, sakal, cilt bakımı ve damat tıraşı fiyatları, “Fiyat Listesi” türünde PDF olarak",
          "Instagram hesabınız; kesim ve model fotoğraflarınızı görmek isteyen oradan bakar",
          "Dükkân adresi ve çalışma saatleri, hangi gün kapalı olduğunuz",
          "Damat tıraşı paketleri için kapora IBAN'ı; siz açmadıkça görünmez",
          "Online randevu sayfanız varsa bağlantısı, web sitesi satırı olarak",
        ],
        paragraphs: [
          "Fiyatlar değiştiğinde PDF'i panelden değiştirirsiniz; aynadaki QR kod ve müşterilerin telefonundaki bağlantı yeni listeyi gösterir. Duvardaki fiyat panosunu her zamda yeniden yazdırmanız gerekmez.",
        ],
      },
      {
        heading: "Damat tıraşı, yeni müşteri, tedarikçi",
        list: [
          "Damat tıraşı: damat adayı “Bilgilerimi bırak” ile adını ve “22 Haziran, sabah 9” gibi bir not bıraksın; o günden bir gün öncesine hatırlatma kurun",
          "Yeni müşteri: ilk kesimden sonra kartı dokundurun; Instagram'ınızı takip etsin, bir sonraki sefer doğrudan yazsın",
          "Ürün ve ekipman tedarikçileri: verdikleri kâğıt kartvizitin fotoğrafını çekin, Kişiler listenize kaydolsun",
          "Dükkân dışında: profil bağlantınızı Google Haritalar işletme profilinize ve Instagram biyografinize ekleyin",
        ],
        paragraphs: [
          "Analitik panelinde profilin kaç kez açıldığını ve müşterilerin WhatsApp'a mı, Instagram'a mı, fiyat listesine mi dokunduğunu görürsünüz; hangi gün ve saatlerde bakıldığını da izlersiniz.",
        ],
      },
      {
        heading: "Dükkân ve ekip için",
        paragraphs: [
          "Birden fazla ustanın çalıştığı dükkânlarda her ustaya ayrı kart verip ekip panelinden yönetebilirsiniz; müşterisi ustaya bağlı çalışan dükkânlar için uygundur. Usta ayrıldığında kartı yeni ustaya atarsınız. Sırayı tek hattan alıyorsanız dükkân adına tek profil daha pratiktir.",
          "Mat siyah metal ve koyu ahşap kartlar berber dükkânlarının kimliğiyle uyumludur; logo lazerle işlenir, silinmez. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Yalnızca aynaya koyacağınız bir QR kod istiyorsanız kartsız dijital kartvizit 2 saat içinde e-postanıza gelir.",
        ],
      },
    ],
    faq: [
      {
        q: "Sıra ya da randevu sistemi var mı?",
        a: "Dijivizit bir randevu sistemi değildir. Müşteri WhatsApp'tan yazar ya da arar; kullandığınız bir online randevu sayfası varsa bağlantısını profilinize eklersiniz.",
      },
      {
        q: "Aynaya koyacağım QR kodu nereden alırım?",
        a: "Panelden profil QR kodunuzu PNG ya da SVG olarak indirip bastırırsınız. Kod, kartınızla aynı profili açar.",
      },
      {
        q: "Müşterinin uygulama indirmesi gerekir mi?",
        a: "Hayır. Kart dokundurulduğunda ya da QR okutulduğunda profil telefonun tarayıcısında açılır.",
      },
      {
        q: "Dükkân taşınırsa ne olur?",
        a: "Panelden adresi güncellersiniz; aynı kart ve QR kod yeni adresi gösterir. Daha önce sizi rehberine kaydeden müşteriler profilinizi açtığında yeni adresi görür.",
      },
    ],
    guides: [
      "instagram-kartvizit",
      "qr-kod-kartvizit",
      "ahsap-kartvizit",
      "yeni-isletme-kontrol-listesi",
    ],
    siblings: [
      "dijital-kartvizit/kuafor-guzellik-salonu",
      "dijital-kartvizit/butik-magaza",
      "dijital-kartvizit/usta-teknik-servis",
    ],
  },
  {
    slug: "dijital-kartvizit/ogretmen-egitmen",
    parent: PARENT,
    kind: "meslek",
    term: "Öğretmenler ve eğitmenler için",
    title: "Öğretmen ve Eğitmenler için Dijital Kartvizit | Dijivizit",
    description:
      "Öğretmenler ve eğitmenler için dijital kartvizit: branş, ders ücretleri PDF'i, online ders bağlantısı ve WhatsApp tek profilde; veli sizi rehberine kaydetsin.",
    h1: "Öğretmenler ve eğitmenler için dijital kartvizit",
    lead: "Özel ders veren öğretmen, kurs eğitmeni ya da müzik, dil ve sanat eğitmeni olarak velilerle ve öğrencilerle bilgi alışverişini tek dokunuşa indirin. Branşınız, ders seçenekleriniz ve iletişim bilgileriniz veli telefonunda dursun.",
    sections: [
      {
        heading: "Eğitmenler dijital kartviziti nerede kullanır?",
        paragraphs: [
          "Özel ders ve kurs öğrencilerinin çoğu tavsiyeyle gelir: bir veli diğerine “bizim öğretmenin numarasını vereyim” der, numara WhatsApp gruplarında elden ele dolaşır. Numara rehbere çoğu zaman sadece “Matematik hoca” diye kaydedilir; öğretmenin hangi seviyelerde ders verdiği, online ders verip vermediği bilinmez.",
          "Dijital kartvizitte veli “Rehberime Kaydet”e dokunduğunda adınız, branşınız ve iletişim bilgileriniz rehberine birlikte eklenir. Profil bağlantınızı veli gruplarına gönderdiğinizde herkes aynı güncel bilgiye ulaşır.",
        ],
      },
      {
        heading: "Eğitmen profiline ne koyulur?",
        list: [
          "Branşınız ve ders verdiğiniz seviyeler (ör. LGS matematik, YDS İngilizce, başlangıç piyano), “Uzmanlık Alanları” bölümünde",
          "Ders seçenekleri, süreler ve ücretler, “Fiyat Listesi” türünde PDF olarak",
          "WhatsApp hattı ve e-posta; dersler çoğunlukla mesajla planlanır",
          "Online ders veriyorsanız kullandığınız platformun ya da randevu sayfanızın bağlantısı, web sitesi satırı olarak",
          "Mezun olduğunuz okul, deneyiminiz ve sertifikalarınız, “Hakkımda” yazısında ya da “Özgeçmiş” türünde PDF olarak",
          "Ders ücretleri için IBAN; siz açmadıkça görünmez",
        ],
        paragraphs: [
          "Bir kurumda kadrolu ya da sözleşmeli çalışıyorsanız, özel ders vermeyle ve tanıtımla ilgili kurallar için bağlı olduğunuz kurumun düzenlemelerini esas alın. Profil yalnızca sizin yazdığınız bilgiyi gösterir.",
        ],
      },
      {
        heading: "Veli görüşmesi, deneme dersi, kurs",
        list: [
          "Deneme dersi: veli “Bilgilerimi bırak” ile adını, numarasını ve “7. sınıf, hafta sonu” gibi bir not bıraksın; dönüş için hatırlatma kurun",
          "Dönem başı: ders paketini yenileyecek veliler için “1 ay” hatırlatması kurun; o sabah e-postanıza gelir, WhatsApp mesajı hazır yazılmış olur",
          "Kurs ve atölyeler: ilk derste tahtaya ya da projeksiyona profil QR kodunuzu yansıtın; katılımcılar sizi rehberine kaydetsin",
          "Yayınevi temsilcileri ve kurum yöneticileri: verdikleri kâğıt kartvizitin fotoğrafını çekin, Kişiler listenize kaydolsun",
        ],
        paragraphs: [
          "Çocuklarla çalışıyorsanız iletişimi velinin numarası üzerinden yürütün. Kişiler listesindeki notlara öğrencinin notları, sağlık ya da aile durumu gibi kişisel bilgiler yazmanızı önermeyiz; liste yalnızca geri dönüş takibi içindir.",
        ],
      },
      {
        heading: "Kurslar ve eğitim merkezleri için",
        paragraphs: [
          "Dil kursları, müzik okulları ve etüt merkezleri eğitmenlerin kartlarını ekip panelinden yönetir. Dönem sonunda ayrılan eğitmenin kartı yeni eğitmene atanır; kurum kartlarından gelen veliler kurumun listesinde kalır. 10 ve üzeri adette %20 indirim uygulanır ve kurumunuzun logosu karta işlenir.",
          "Yalnızca online ders veriyorsanız kartsız dijital kartvizit yeterlidir: link ve QR kod 2 saat içinde e-postanıza gelir. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir. NFC kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Ders programımı profilde gösterebilir miyim?",
        a: "Ders seçeneklerinizi ve uygun gün ve saatlerinizi PDF olarak ya da “Hakkımda” yazısında paylaşabilirsiniz. Dijivizit bir randevu ya da ders planlama sistemi değildir; dersleri WhatsApp ya da telefonla ayarlarsınız.",
      },
      {
        q: "Veli gruplarına nasıl paylaşırım?",
        a: "Profil bağlantınızı gruba gönderirsiniz. Veliler bağlantıya dokunup “Rehberime Kaydet” ile sizi kaydeder; uygulama gerekmez.",
      },
      {
        q: "Profilimde kişisel numaram görünmek zorunda mı?",
        a: "Hayır. Hangi numarayı ve bilgiyi göstereceğinizi siz seçersiniz; yalnızca ders için kullandığınız bir hattı ve e-postanızı ekleyebilirsiniz. Profil adresi de adınızı değil rastgele bir kodu içerir.",
      },
      {
        q: "Kurum olarak toplu sipariş verebilir miyiz?",
        a: "Evet. 10 ve üzeri adette %20 indirim uygulanır, kurumunuzun logosu karta işlenir ve kartları ekip panelinden yönetirsiniz.",
      },
    ],
    guides: [
      "dijital-kartvizit-nasil-olusturulur",
      "ucretsiz-dijital-kartvizit",
      "kartvizite-ne-yazilir",
      "kurumsal-dijital-kartvizit",
    ],
    siblings: [
      "dijital-kartvizit/akademisyen-ogrenci",
      "dijital-kartvizit/danisman-koc",
      "dijital-kartvizit/kisisel-antrenor",
    ],
  },
];
