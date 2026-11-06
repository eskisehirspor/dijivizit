/**
 * Profession and city pages at dijivizit.com/dijital-kartvizit/<slug>. Each
 * page answers how a dijital kartvizit is used in that job or city, so it is
 * useful on its own rather than a copy of the parent page with a word swapped.
 * Same rules as landings.ts: every claim must match the product.
 */
import type { Landing } from "@/lib/marketing/landings";
import { MORE_MESLEK } from "@/lib/marketing/segments-meslek-2";
import { MORE_SEHIR } from "@/lib/marketing/segments-sehir-2";

const PARENT = { name: "Dijital kartvizit", href: "/dijital-kartvizit" };

const BASE_SEGMENTS: Landing[] = [
  // ---------------------------------------------------------------- meslekler
  {
    slug: "dijital-kartvizit/emlakci",
    parent: PARENT,
    kind: "meslek",
    term: "Emlakçılar için",
    title: "Emlakçılar için Dijital Kartvizit | Dijivizit",
    description:
      "Emlakçılar için dijital kartvizit: portföy PDF'i, WhatsApp, ofis konumu ve yetki belgesi tek profilde. Gösterimde dokundurun, alıcı sizi rehberine kaydetsin.",
    h1: "Emlakçılar için dijital kartvizit",
    lead: "Yer gösteriminde, site girişinde ya da tapu randevusunda tanıştığınız alıcı numaranızı elle yazmasın. Kartı telefonuna dokundurun; adınız, ofisiniz, WhatsApp hattınız ve güncel portföyünüz bir dokunuşla ekranına gelsin.",
    sections: [
      {
        heading: "Emlak danışmanı dijital kartviziti nerede kullanır?",
        paragraphs: [
          "Emlakta müşteri adayı çoğu zaman ofis dışında karşınıza çıkar: daire gösteriminde, komşunun yönlendirmesiyle, kapıcıdan numaranızı alarak. Kâğıt kartvizit bu anlarda bir cebe girer; birkaç hafta sonra o kişi sizi değil, ilanı ilk gören başka bir danışmanı arar.",
          "Dijital kartvizitte alıcı “Rehberime Kaydet”e dokunduğunda adınız, ofisinizin adı ve unvanınız telefon rehberine birlikte eklenir. Aylar sonra “o emlakçı kimdi” diye aradığında sizi ofis adıyla bulur.",
          "Satılık ve kiralık tabelalarına, vitrindeki ilan föylerine ya da broşüre profilinizin QR kodunu koyabilirsiniz. Ofis kapalıyken önünden geçen biri de numaranızı kaydeder ya da “Bilgilerimi bırak” ile size ulaşır.",
        ],
      },
      {
        heading: "Profilinize ne koymalısınız?",
        list: [
          "Cep telefonunuz ve ayrı bir WhatsApp satırı; alıcıların çoğu önce yazmayı tercih eder",
          "Ofis adresi; dokununca haritada açılır, gösterim sonrası ofise davet etmek kolaylaşır",
          "Güncel portföy ya da proje broşürü, PDF belge olarak",
          "İlanlarınızın yayınlandığı web sayfası ve Instagram hesabınız",
          "Taşınmaz ticareti yetki belgesi numaranız ve çalıştığınız bölgeler (ör. “Kadıköy konut, Ataşehir ofis”)",
          "Kapora ya da hizmet bedeli için IBAN; siz açmadıkça profilde görünmez",
        ],
        paragraphs: [
          "Portföy hızlı değişir. PDF'i panelden değiştirdiğinizde aynı kart, aynı QR ve aynı bağlantı yeni dosyayı gösterir; satılan dairenin föyü kimsenin telefonunda kalmaz. Ofis değiştirdiğinizde de kartı yeniden bastırmazsınız, profili güncellersiniz.",
        ],
      },
      {
        heading: "Gösterimden sonra takip",
        paragraphs: [
          "Gösterimde kartı alıcının telefonuna dokundurursunuz; o da “Bilgilerimi bırak” ile adını ve numarasını size iletir. Kişi, panelinizdeki Kişiler listesine düşer. Yanına “3+1, okula yakın arıyor, bütçesi net değil” gibi bir not yazın, “1 hafta sonra” hatırlatması kurun. O gün sabah e-postanıza hatırlatma gelir, WhatsApp mesajı hazır yazılmış olur.",
          "Tapuda, ekspertizde ya da kredi görüşmesinde tanıştığınız bankacının, eksperin, başka ofisin danışmanının kâğıt kartvizitini de fotoğrafını çekerek kaydedersiniz; ad, unvan, şirket ve telefon kendiliğinden dolar.",
          "Analitik panelinde profilinizin kaç kez ve hangi şehirlerden açıldığını görürsünüz. Şehir dışından ya da yurt dışından alıcıya ilan gönderiyorsanız, bağlantının gerçekten açılıp açılmadığını buradan anlarsınız.",
        ],
      },
      {
        heading: "Emlak ofisleri için sipariş",
        paragraphs: [
          "Birkaç danışmanla çalışan ofisler kartları ekip panelinden yönetir. Bir danışman ayrıldığında kart yeniden basılmaz; kartın kimin profilini açacağını değiştirir, kartı yeni danışmana verirsiniz. Ofis kartlarından gelen kişileri de tek listede görürsünüz.",
          "10 ve üzeri adette %20 indirim uygulanır. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Fiziksel kart istemeyen danışmanlar için kartsız dijital kartvizit var: link ve QR kod 2 saat içinde e-postayla gelir.",
        ],
      },
    ],
    faq: [
      {
        q: "Alıcının uygulama indirmesi gerekir mi?",
        a: "Hayır. Profil telefonun tarayıcısında açılır. NFC'si kapalı telefonlarda profilinizin QR kodunu kendi telefonunuzdan okutabilir ya da linki paylaşabilirsiniz.",
      },
      {
        q: "Portföyümü kartvizitte gösterebilir miyim?",
        a: "Evet. Portföyünüzü ya da proje broşürünüzü PDF olarak yükleyebilirsiniz; en fazla 10 belge, her biri 10 MB'a kadar. İlan sayfanızın bağlantısını da web sitesi satırı olarak eklersiniz.",
      },
      {
        q: "Tabelada ya da vitrinde hangi QR kodu kullanırım?",
        a: "Panelden indirdiğiniz profil QR kodunu. Kartınızla aynı profili açar; tabelaya bastırdıktan sonra bilgileriniz değişse de kod geçerli kalır.",
      },
      {
        q: "Ofisten ayrılırsam kartım ne olur?",
        a: "Kart sizinse profildeki ofis adını ve adresi güncellemeniz yeter. Kart ofisin ekip panelindeyse ofis sahibi kartı başka bir danışmana atar.",
      },
    ],
    guides: [
      "qr-kod-kartvizit",
      "kurumsal-dijital-kartvizit",
      "kartvizite-ne-yazilir",
      "dijital-kartvizit-ornekleri",
    ],
    siblings: [
      "dijital-kartvizit/sigorta-acentesi",
      "dijital-kartvizit/mimar",
      "dijital-kartvizit/satis-temsilcisi",
      "nfc-kartvizit",
    ],
  },
  {
    slug: "dijital-kartvizit/diyetisyen",
    parent: PARENT,
    kind: "meslek",
    term: "Diyetisyenler için",
    title: "Diyetisyenler için Dijital Kartvizit | Dijivizit",
    description:
      "Diyetisyenler için dijital kartvizit: unvan, çalışma alanları, klinik adresi ve randevu iletişimi tek, bilgilendirici profilde. Online danışana linkle gönderin.",
    h1: "Diyetisyenler için dijital kartvizit",
    lead: "Klinikte, kurumsal sunumda ya da online görüşmede tanıştığınız kişi size nasıl ulaşacağını tek sayfada görsün. Unvanınız, çalıştığınız alanlar, adresiniz ve randevu iletişiminiz; reklam değil, bilgi.",
    sections: [
      {
        heading: "Diyetisyenler dijital kartviziti nerede kullanır?",
        paragraphs: [
          "Diyetisyenlerin danışanlarının bir kısmı klinikten, bir kısmı spor salonu, iş yeri sunumu ya da tavsiye yoluyla gelir. Online danışmanlık yapıyorsanız danışanın bir kısmını hiç yüz yüze görmezsiniz; ilk temas WhatsApp'tan gönderdiğiniz bir bağlantıdır.",
          "Dijital kartvizit bu üç yolu tek adrese bağlar: klinikte kartı dokundurursunuz, sunumda QR kodu son slayta koyarsınız, online danışana bağlantıyı mesajla gönderirsiniz. Üçünde de aynı profil açılır, danışan sizi tek dokunuşla rehberine kaydeder.",
        ],
      },
      {
        heading: "Tanıtım kurallarına uygun, bilgilendirici bir profil",
        paragraphs: [
          "Sağlık meslek mensuplarının tanıtımı Türkiye'de mevzuat ve meslek kurallarıyla sınırlıdır. Profilinizi bir reklam sayfası gibi değil, kartvizitin dijital karşılığı gibi düşünün: kim olduğunuzu ve size nasıl ulaşılacağını söyler, vaat vermez. Kesin sınırlar için güncel mevzuatı ve meslek kuruluşunuzun yönlendirmelerini esas alın.",
        ],
        list: [
          "Koyun: unvanınız (Dyt.), mezun olduğunuz okul, çalıştığınız alanlar (ör. çocuk beslenmesi, sporcu beslenmesi)",
          "Koyun: klinik adresi, telefon, WhatsApp ve e-posta; online randevu sayfanız varsa bağlantısı",
          "Koyun: çalışma saatleri ya da “ilk görüşmeye gelmeden önce” gibi genel bilgilendirme PDF'i",
          "Kaçının: kilo kaybı vaatleri, önce-sonra fotoğrafları, danışan yorumları, indirim ve kampanya duyuruları",
        ],
      },
      {
        heading: "Danışan iletişimi ve gizlilik",
        paragraphs: [
          "Profildeki belgeler herkese açıktır; kişiye özel beslenme planını profile değil, doğrudan danışana gönderin. Profil, herkesin görebileceği genel bilgiler içindir.",
          "“Bilgilerimi bırak” formunda ziyaretçi adını, telefonunu ya da e-postasını ve isteğe bağlı kısa bir not bırakır. Bu kişiler Kişiler listenize düşer; kontrol görüşmesi için tarih seçip hatırlatma kurabilirsiniz. Notlarınıza sağlık bilgisi yazmamanızı öneririz; o bilgiler klinik kayıtlarınızda kalsın.",
          "Kurum içi sağlıklı yaşam sunumu yaptıysanız, analitik panelinde sunumdan sonra profilinizin kaç kez açıldığını görürsünüz.",
        ],
      },
      {
        heading: "Hangi kart, nasıl teslim?",
        paragraphs: [
          "Koyu ve açık ahşap kartlar sıcak bir görünüm verir; mat siyah, gümüş ve gold metal kartlar daha resmîdir; mat siyah PVC ise hafif ve sadedir. Metal ve ahşap kartlarda logo lazerle işlenir, baskı olmadığı için silinmez; adınız ve unvanınız profilde yer alır. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Yalnızca online çalışıyorsanız kartsız dijital kartvizit yeterli olabilir: link ve QR kod 2 saat içinde e-postanıza gelir; Instagram biyografinize ve e-posta imzanıza eklersiniz. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir.",
        ],
      },
    ],
    faq: [
      {
        q: "Dijital kartvizit reklam yasağına takılır mı?",
        a: "Profil yalnızca sizin yazdığınız bilgiyi gösterir. Unvan, çalışma alanları, adres ve iletişim gibi bilgilendirici içerikle sınırlı tutmanızı, vaat ve yorum eklememenizi öneririz. İçeriğin mevzuata uygunluğu kullanıcının sorumluluğundadır.",
      },
      {
        q: "Danışanın beslenme listesini profile koyabilir miyim?",
        a: "Koymayın. Profildeki belgeler herkese açıktır. Kişiye özel planları doğrudan danışanınıza iletin; profile yalnızca genel bilgilendirme belgeleri ekleyin.",
      },
      {
        q: "Online danışanlarla nasıl paylaşırım?",
        a: "Profil bağlantınızı WhatsApp'tan ya da e-postayla gönderirsiniz. Danışan “Rehberime Kaydet” ile numaranızı kaydeder; uygulama gerekmez.",
      },
      {
        q: "Klinikte birden fazla diyetisyen çalışıyor, ortak sipariş verebilir miyiz?",
        a: "Evet. Ekip panelinden her diyetisyene ayrı kart atanır; 10 ve üzeri adette %20 indirim uygulanır.",
      },
    ],
    guides: [
      "dijital-kartvizit-nasil-olusturulur",
      "kartvizite-ne-yazilir",
      "instagram-kartvizit",
      "ahsap-kartvizit",
      "linktree-alternatifi",
    ],
    siblings: [
      "dijital-kartvizit/psikolog",
      "dijital-kartvizit/doktor",
      "dijital-kartvizit/dis-hekimi",
    ],
  },
  {
    slug: "dijital-kartvizit/avukat",
    parent: PARENT,
    kind: "meslek",
    term: "Avukatlar için",
    title: "Avukatlar için Dijital Kartvizit | Dijivizit",
    description:
      "Avukatlar için dijital kartvizit: baro sicili, büro adresi, KEP ve IBAN tek profilde; reklam yasağına uygun, sade bilgi. Adliyede dokundurun, rehbere kaydolsun.",
    h1: "Avukatlar için dijital kartvizit",
    lead: "Adliye koridorunda, arabuluculuk toplantısında ya da baro etkinliğinde numara alışverişi bir dakikadan uzun sürmesin. Dokundurulan kart; adınızı, büronuzu, sicil numaranızı ve iletişim bilgilerinizi karşı tarafın rehberine tek seferde ekler.",
    sections: [
      {
        heading: "Avukatlar dijital kartviziti nasıl kullanır?",
        paragraphs: [
          "Avukatın gün içinde bilgi verdiği kişi sayısı az değildir: duruşma çıkışında müvekkilin yakını, karşı taraf vekili, bilirkişi, arabulucu, icra dairesindeki muhatap. Bu kişilerin çoğu numaranızı o an telefonuna kaydetmek ister; kâğıt kartvizit ise genellikle dosyanın arasında kaybolur.",
          "Dijital kartvizitte karşınızdaki kişi “Rehberime Kaydet”e dokunur; adınız, “Av.” unvanınız, büronuz, telefonlarınız, e-posta adresiniz ve büro adresiniz rehberine birlikte eklenir. Büro taşındığında ya da ortaklık değiştiğinde kartı yeniden bastırmazsınız, profili güncellersiniz.",
        ],
      },
      {
        heading: "Reklam yasağına uygun profil",
        paragraphs: [
          "Avukatlık mesleğinde reklam yasağı vardır; Türkiye Barolar Birliği'nin bu konudaki düzenlemeleri tanıtımın bilgilendirme sınırında kalmasını ister. Dijital kartvizit de bu çerçevede düşünülmelidir: kâğıt kartvizitte ne yazıyorsa onun ayrıntılı ve güncel hâli. Kesin sınırlar için baronuzun güncel düzenlemelerini esas alın.",
        ],
        list: [
          "Adınız, unvanınız, bağlı olduğunuz baro ve sicil numaranız",
          "Büro adı ve adresi; dokununca harita açılır",
          "Telefon, e-posta ve etiketiyle KEP adresiniz",
          "Çalışma alanlarınız, sade bir listeyle; yabancı dil biliyorsanız o da",
          "Eklememeniz gerekenler: başarı oranı, “en iyi” gibi nitelemeler, müvekkil yorumları, ücret indirimi",
        ],
      },
      {
        heading: "Büroda pratik kullanım",
        paragraphs: [
          "Vekâlet ücreti ya da masraf avansı için IBAN'ı her seferinde mesajla yazmak hataya açıktır. Profilinizdeki IBAN ve fatura bilgileri tek dokunuşla kopyalanır ve siz açmadıkça görünmez.",
          "“Bilgilerimi bırak” formu yalnızca ad, telefon ya da e-posta ve kısa bir not ister. Formu ilk temas için kullanın; dosya ayrıntılarını bu yoldan istemeyin, görüşmede alın.",
          "Bilirkişinin, arabulucunun ya da karşı taraf vekilinin size verdiği kâğıt kartviziti fotoğrafını çekerek kaydedersiniz; ad, unvan, kurum ve telefon kendiliğinden dolar. Profil adresiniz adınızı değil rastgele bir kodu içerir; kart kaybolursa panelden kapatırsınız.",
        ],
      },
      {
        heading: "Hukuk büroları için sipariş",
        paragraphs: [
          "Ekip panelinden büronun bütün avukat ve stajyerlerinin kartlarını yönetirsiniz. Stajyer ayrıldığında ya da bir avukat başka büroya geçtiğinde kart yeni kişiye devredilir. Mat siyah ve gümüş metal kartlar, klasik bir büro kimliğiyle en çok tercih edilen kaplamalardır.",
          "10 ve üzeri adette %20 indirim uygulanır. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir; fiyatlara KDV dahildir.",
        ],
      },
    ],
    faq: [
      {
        q: "Dijital kartvizit avukatlıkta reklam sayılır mı?",
        a: "Kartvizit vermek meslekte olağandır; önemli olan içeriktir. Profilinizi unvan, sicil, iletişim ve çalışma alanları gibi bilgilendirici içerikle sınırlı tutun. İçeriğin baro düzenlemelerine uygunluğu kullanıcının sorumluluğundadır.",
      },
      {
        q: "KEP adresimi ekleyebilir miyim?",
        a: "Evet. KEP adresinizi e-posta satırı olarak ekler, etiketine “KEP” yazarsınız.",
      },
      {
        q: "Müvekkil bilgisi kartta ya da profilde saklanır mı?",
        a: "Kartta yalnızca profilinize giden bağlantı vardır. Profil sizin bilgilerinizi gösterir; ziyaretçi “Bilgilerimi bırak” ile kendi iletişim bilgisini bırakırsa bu yalnızca size iletilir.",
      },
      {
        q: "Büro adresi değişince ne yaparım?",
        a: "Panelden adresi güncellersiniz. Aynı kart ve QR kod yeni adresi gösterir; daha önce rehbere kaydedenler profilinizi açtığında güncel bilgiyi görür.",
      },
    ],
    guides: [
      "kartvizite-ne-yazilir",
      "metal-kartvizit",
      "kurumsal-dijital-kartvizit",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
    ],
    siblings: [
      "dijital-kartvizit/sigorta-acentesi",
      "dijital-kartvizit/mimar",
      "dijital-kartvizit/psikolog",
      "nfc-kartvizit",
    ],
  },
  {
    slug: "dijital-kartvizit/doktor",
    parent: PARENT,
    kind: "meslek",
    term: "Doktorlar için",
    title: "Doktorlar için Dijital Kartvizit | Dijivizit",
    description:
      "Doktorlar için dijital kartvizit: unvan, uzmanlık dalı, muayenehane adresi, randevu hattı ve akademik özgeçmiş tek profilde. Kongrede ve klinikte paylaşın.",
    h1: "Doktorlar için dijital kartvizit",
    lead: "Kongrede tanıştığınız meslektaş, konsültasyon istediğiniz hekim ya da muayene sonrası hasta size nasıl ulaşacağını tek sayfada görsün. Unvanınız, uzmanlık dalınız, çalıştığınız kurum ve randevu hattınız; hepsi bilgi amaçlı, hepsi güncel.",
    sections: [
      {
        heading: "Hekimler dijital kartviziti nerede kullanır?",
        paragraphs: [
          "Hekimlerin iletişim ağı iki yönlüdür: bir yanda meslektaşlar, kongreler, sempozyumlar ve konsültasyonlar; öbür yanda hastalar ve hasta yakınları. Kâğıt kartvizit iki tarafta da aynı sorunu yaşar: kurum değiştiğinde, muayenehane taşındığında ya da sekreterlik hattı değiştiğinde dağıtılan kartların hepsi eskir.",
          "Dijital kartvizitte bilgiler profilde durur. Hastane değiştirdiğinizde kurum adını ve adresi panelden güncellersiniz; elinizdeki kart, kongre posterindeki QR kod ve daha önce sizi rehberine kaydeden herkesin bağlantısı yeni bilgiyi gösterir.",
        ],
      },
      {
        heading: "Sağlık tanıtım kurallarına uygun profil",
        paragraphs: [
          "Türkiye'de hekimlerin ve sağlık kuruluşlarının tanıtım ve reklam faaliyetleri mevzuatla sıkı biçimde sınırlanır. Profilinizi tanıtım sayfası olarak değil, hastanın ve meslektaşın ihtiyaç duyduğu bilgilerin toplandığı bir bilgi kartı olarak hazırlayın. Kesin sınırlar için güncel mevzuatı ve tabip odanızın yönlendirmelerini esas alın.",
        ],
        list: [
          "Akademik unvanınız ve tescilli uzmanlık dalınız (ör. Uzm. Dr., Doç. Dr.)",
          "Çalıştığınız hastane ya da muayenehane adresi; dokununca harita açılır",
          "Randevu ya da sekreterlik hattı, e-posta",
          "Akademik özgeçmişiniz, “Özgeçmiş” türünde PDF olarak",
          "Eklememeniz gerekenler: tedavi vaatleri, önce-sonra görselleri, hasta yorumları, fiyat ve kampanya bilgisi",
        ],
      },
      {
        heading: "Kongrede, hastanede, muayenehanede",
        list: [
          "Kongre: sunumunuzun son slaytına ya da posterinize profil QR kodunuzu koyun; soru sormak isteyen meslektaş size doğrudan ulaşır",
          "Firma temsilcileri ve meslektaşlarla tanışma: aldığınız kâğıt kartvizitin fotoğrafını çekin, bilgiler Kişiler listenize geçsin",
          "Muayene sonrası: hastaya kartı dokundurun, randevu hattınız rehberine kaydolsun",
          "Birden fazla kurumda çalışıyorsanız: kurumları ve günlerinizi “Hakkımda” yazısında belirtin",
        ],
        paragraphs: [
          "Profilinizi açanlar “Bilgilerimi bırak” ile size geri dönüş için ad ve telefon bırakabilir. Bu formun not alanını tıbbi bilgi için kullandırmayın; kısa bir iletişim talebiyle sınırlı kalması hem sizin hem hastanın lehinedir.",
        ],
      },
      {
        heading: "Klinik ve hastaneler için sipariş",
        paragraphs: [
          "Poliklinik ve özel hastaneler hekim kartlarını ekip panelinden yönetir; bir hekim ayrıldığında kart yeniden basılmaz, yeni hekime atanır. 10 ve üzeri adette %20 indirim uygulanır.",
          "Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Logo metal kartlara lazerle kazınır, ahşap kartlara lazerle yakılır; silinmez. Kart istemeyen hekimler için kartsız dijital kartvizit, link ve QR kodla 2 saat içinde e-postayla teslim edilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Hekimler dijital kartvizit kullanabilir mi?",
        a: "Kartvizit kullanmak hekimlikte olağandır. Profilinizi unvan, uzmanlık, adres ve randevu iletişimi gibi bilgilendirici içerikle sınırlı tutmanızı öneririz. İçeriğin mevzuata uygunluğu kullanıcının sorumluluğundadır.",
      },
      {
        q: "Akademik özgeçmişimi ekleyebilir miyim?",
        a: "Evet. Özgeçmişinizi PDF olarak yüklersiniz; profilde “Özgeçmiş” başlığıyla görünür. En fazla 10 belge, her biri 10 MB'a kadar eklenebilir.",
      },
      {
        q: "Hastane değiştirince yeni kart gerekir mi?",
        a: "Hayır. Kurum adını, adresi ve randevu hattını panelden güncellersiniz; aynı kart yeni bilgileri gösterir.",
      },
      {
        q: "Kartta hasta bilgisi bulunur mu?",
        a: "Hayır. Kartın içinde yalnızca profilinize giden bağlantı vardır; profil de yalnızca sizin bilgilerinizi gösterir.",
      },
    ],
    guides: [
      "kartvizite-ne-yazilir",
      "dijital-kartvizit-nedir",
      "qr-kod-kartvizit",
      "metal-kartvizit",
    ],
    siblings: [
      "dijital-kartvizit/dis-hekimi",
      "dijital-kartvizit/psikolog",
      "dijital-kartvizit/diyetisyen",
    ],
  },
  {
    slug: "dijital-kartvizit/dis-hekimi",
    parent: PARENT,
    kind: "meslek",
    term: "Diş hekimleri için",
    title: "Diş Hekimleri için Dijital Kartvizit | Dijivizit",
    description:
      "Diş hekimleri için dijital kartvizit: muayenehane adresi, randevu hattı, WhatsApp, fatura bilgileri ve tedavi sonrası bilgilendirme belgeleri tek profilde.",
    h1: "Diş hekimleri için dijital kartvizit",
    lead: "Muayenehanenizin adresi, randevu hattınız ve tedavi sonrası bilgilendirme notlarınız hastanın telefonunda tek dokunuşla dursun. Klinik ekibinizin kartlarını da tek panelden yönetin.",
    sections: [
      {
        heading: "Diş hekimliğinde dijital kartvizit ne işe yarar?",
        paragraphs: [
          "Diş tedavisi çoğu zaman birkaç seansa yayılır; hasta kontrol randevusu, ağrı ya da dolgunun düşmesi gibi durumlarda kliniğe hızlı ulaşmak ister. Kliniğin numarası telefonda kayıtlı değilse internette arar ve çoğu zaman eski bir numaraya ya da başka bir kliniğe denk gelir.",
          "İlk muayenede kartı hastanın telefonuna dokundurduğunuzda klinik adı, randevu hattı, WhatsApp ve adres rehberine birlikte kaydolur. Çocuk hastalarda bunu veliye yaparsınız.",
        ],
      },
      {
        heading: "Bilgilendirici bir klinik profili",
        paragraphs: [
          "Diş hekimlerinin tanıtım faaliyetleri de sağlık mevzuatı ve meslek kurallarıyla sınırlıdır. Profilde hastanın size ulaşması ve muayenehaneyi bulması için gereken bilgiyi verin, tanıtım iddialarına yer vermeyin. Kesin sınırlar için güncel mevzuatı ve odanızın yönlendirmelerini esas alın.",
        ],
        list: [
          "Unvanınız ve varsa uzmanlık dalınız (ör. ortodonti, pedodonti)",
          "Muayenehane adresi, randevu hattı ve WhatsApp",
          "Ödeme için IBAN ve fatura bilgileri; siz açmadıkça görünmez",
          "“Diş çekimi sonrası dikkat edilecekler” gibi genel bilgilendirme PDF'leri",
          "Eklememeniz gerekenler: önce-sonra fotoğrafları, hasta yorumları, fiyat ve kampanya duyuruları",
        ],
      },
      {
        heading: "Klinik içinde ve dışında kullanım",
        list: [
          "Resepsiyonda: tedavi sonrası bakım bilgilerinin bulunduğu profilin QR kodunu hastaya gösterin; kâğıt broşür basmanıza gerek kalmaz",
          "Dental depo temsilcileri ve laboratuvarlar: verdikleri kâğıt kartvizitin fotoğrafını çekin, bilgiler Kişiler listenize kaydolsun",
          "Meslektaşa yönlendirme: hastayı yönlendirdiğiniz hekimin profil bağlantısını WhatsApp'tan iletin",
          "Kontrol randevusu: hasta için tarih seçip hatırlatma kurun; o sabah e-postanıza gelir",
        ],
        paragraphs: [
          "Kişiler listesindeki notlara tedavi bilgisi yazmanızı önermeyiz; o kayıtlar hasta dosyanızda kalmalı. Kişiler listesini yalnızca geri dönüş takibi için kullanın.",
        ],
      },
      {
        heading: "Klinik ekibi için sipariş",
        paragraphs: [
          "Birden fazla hekimin ve klinik asistanının çalıştığı muayenehanelerde kartlar ekip panelinden dağıtılır. Bir hekim ayrıldığında kart yeni hekime devredilir; klinik kartlarından gelen kişileri tek listede görürsünüz.",
          "10 ve üzeri adette %20 indirim uygulanır. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir; kart okunmazsa ücretsiz yenisiyle değiştirilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Tedavi sonrası bakım bilgilerini profile koyabilir miyim?",
        a: "Evet. Herkese uygun genel bilgilendirme notlarını PDF olarak ekleyebilirsiniz. Hastaya özel bilgi ve tedavi planı profile konmamalıdır; profildeki belgeler herkese açıktır.",
      },
      {
        q: "Hem kliniğin hem kendi numaramı ekleyebilir miyim?",
        a: "Evet. Birden fazla telefon satırı ekleyip her birine “Randevu” ya da “Klinik” gibi etiket verebilirsiniz. Rehbere kaydedilirken bütün numaralar birlikte aktarılır.",
      },
      {
        q: "Reklam kurallarına uygun mu?",
        a: "Profil yalnızca sizin yazdığınız içeriği gösterir. Unvan, adres ve randevu iletişimiyle sınırlı, bilgilendirici bir profil öneririz. İçeriğin mevzuata uygunluğu kullanıcının sorumluluğundadır.",
      },
      {
        q: "Kaç günde teslim edilir?",
        a: "Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Kartsız dijital kartvizit ise 2 saat içinde e-postayla gelir.",
      },
    ],
    guides: [
      "kartvizite-ne-yazilir",
      "qr-kod-kartvizit",
      "kurumsal-dijital-kartvizit",
      "dijital-kartvizit-nasil-olusturulur",
    ],
    siblings: [
      "dijital-kartvizit/doktor",
      "dijital-kartvizit/diyetisyen",
      "dijital-kartvizit/psikolog",
    ],
  },
  {
    slug: "dijital-kartvizit/psikolog",
    parent: PARENT,
    kind: "meslek",
    term: "Psikologlar için",
    title: "Psikologlar için Dijital Kartvizit | Dijivizit",
    description:
      "Psikologlar için dijital kartvizit: unvan, çalışılan yaklaşımlar, merkez adresi ve randevu iletişimi; adınızı içermeyen gizli bir bağlantıyla sade bir profil.",
    h1: "Psikologlar için dijital kartvizit",
    lead: "Danışanın size ulaşması kolay, profiliniz sade, bağlantınız gizli olsun. Unvanınız, çalıştığınız yaklaşımlar, adresiniz ve randevu iletişiminiz tek sayfada; reklam değil, bilgi.",
    sections: [
      {
        heading: "Psikologlar dijital kartviziti nasıl kullanır?",
        paragraphs: [
          "Psikolojik danışmada ilk adım çoğu zaman bir yakının tavsiyesiyle atılır: “Şu psikoloğun numarasını sana göndereyim.” Kâğıt kartvizitin fotoğrafı ya da ekran görüntüsü elden ele dolaşırken bilgiler eskir. Dijital kartvizitte gönderilen şey bir bağlantıdır; açıldığında her zaman güncel profil görünür.",
          "Online seans yapıyorsanız danışanınızla hiç yüz yüze tanışmayabilirsiniz. Profil bağlantınızı mesajla gönderirsiniz; danışan “Rehberime Kaydet” ile numaranızı kaydeder, randevu ve görüşme bağlantınıza profilden ulaşır.",
        ],
      },
      {
        heading: "Gizlilik ön planda",
        paragraphs: [
          "Danışanlar için mahremiyet önemlidir. Dijivizit profil adresi adınızı değil rastgele bir kodu içerir; bağlantı tahmin edilemez. Analitik panelinde profilinizin kaç kez, hangi şehirlerden ve hangi cihazlarla açıldığını görürsünüz, kimin açtığını görmezsiniz. Ziyaretçilerin IP adresi saklanmaz.",
          "“Bilgilerimi bırak” formu ziyaretçiden yalnızca ad, telefon ya da e-posta ve isteğe bağlı kısa bir not ister. Bu formu ilk iletişim talebi için kullanın; ayrıntılı bilgiyi görüşmede alın. Kişiler listesindeki notlarınıza danışanla ilgili klinik bilgi yazmamanızı öneririz.",
        ],
      },
      {
        heading: "Profile ne yazılır, ne yazılmaz?",
        paragraphs: [
          "Psikologların ve özellikle klinik psikologların tanıtımı sağlık mevzuatı ve meslek etiğiyle sınırlıdır. Unvanınızı diplomanıza ve aldığınız eğitime uygun yazın; profili bilgilendirme amacıyla sınırlı tutun. Kesin sınırlar için güncel mevzuatı ve meslek kuruluşunuzun etik ilkelerini esas alın.",
        ],
        list: [
          "Yazın: unvanınız, mezun olduğunuz program, çalıştığınız yaş grupları ve yaklaşımlar",
          "Yazın: danışmanlık merkezinin adresi, randevu telefonu, e-posta; online seans yapıyorsanız bunu belirtin",
          "Yazın: seans ücretinin ödemesi için IBAN; siz açmadıkça görünmez, tek dokunuşla kopyalanır",
          "Yazmayın: “kesin çözüm”, “X seansta sonuç” gibi vaatler, danışan yorumları ve hikâyeleri",
        ],
      },
      {
        heading: "Kart seçimi ve teslimat",
        paragraphs: [
          "Ahşap kartlar sıcak ve sakin bir görünüm verir, mat siyah metal ise sadedir. Kartın üzerinde adınız yazmaz, yalnızca logo ve temassız işareti bulunur; adınız, unvanınız ve geri kalan her şey profilde durur. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Danışmanlık merkezleri psikologların kartlarını ekip panelinden yönetir; 10 ve üzeri adette %20 indirim uygulanır. Yalnızca online çalışıyorsanız kartsız dijital kartvizit (link ve QR kod) 2 saat içinde e-postanıza gelir.",
        ],
      },
    ],
    faq: [
      {
        q: "Profilimi kimlerin açtığını görebilir miyim?",
        a: "Hayır. Analitik panelinde açılma sayısını, şehir ve cihaz bilgisini görürsünüz; tek tek kişileri görmezsiniz. Yalnızca “Bilgilerimi bırak” formunu dolduran kişiler size iletilir.",
      },
      {
        q: "Profil bağlantım adımı içeriyor mu?",
        a: "Hayır. Profil adresi rastgele bir koddan oluşur; adınızla tahmin edilemez.",
      },
      {
        q: "Online seans bağlantımı ekleyebilir miyim?",
        a: "Randevu ya da görüşme sayfanızın bağlantısını web sitesi satırı olarak ekleyip “Online randevu” gibi bir etiket verebilirsiniz.",
      },
      {
        q: "Merkezden ayrılırsam kartım ne olur?",
        a: "Kart sizinse profilinizdeki adresi güncellersiniz. Kart merkezin ekip panelindeyse merkez kartı başka bir psikoloğa atar; kişisel profilinizi ayrıca kullanmaya devam edebilirsiniz.",
      },
    ],
    guides: [
      "dijital-kartvizit-nedir",
      "kartvizite-ne-yazilir",
      "ahsap-kartvizit",
      "ucretsiz-dijital-kartvizit",
    ],
    siblings: [
      "dijital-kartvizit/diyetisyen",
      "dijital-kartvizit/doktor",
      "dijital-kartvizit/avukat",
    ],
  },
  {
    slug: "dijital-kartvizit/kuafor-guzellik-salonu",
    parent: PARENT,
    kind: "meslek",
    term: "Kuaför ve güzellik salonları için",
    title: "Kuaför ve Güzellik Salonu için Dijital Kartvizit | Dijivizit",
    description:
      "Kuaför ve güzellik salonları için dijital kartvizit: Instagram, WhatsApp randevu hattı, fiyat listesi ve konum tek profilde. Aynada QR, kasada NFC kart.",
    h1: "Kuaför ve güzellik salonları için dijital kartvizit",
    lead: "Müşteriniz salondan çıkarken Instagram hesabınızı, WhatsApp randevu hattınızı ve fiyat listenizi telefonuna kaydetsin. Kâğıt kartvizit yerine tek dokunuş; bir sonraki randevu bir mesaj uzaklıkta.",
    sections: [
      {
        heading: "Salonlarda dijital kartvizit nasıl kullanılır?",
        paragraphs: [
          "Kuaför ve güzellik salonlarında randevuların büyük kısmı WhatsApp'tan ve Instagram'dan gelir. Müşteri sizi beğenir, “numaranızı alayım” der; ama çoğu zaman salonun değil, sizi tavsiye eden arkadaşının numarası telefonda kalır.",
          "Kasada ya da koltukta kartı müşterinin telefonuna dokundurduğunuzda salon adı, randevu hattı, WhatsApp, adres ve Instagram rehberine birlikte kaydolur. Aynanın kenarına ya da bekleme alanına koyduğunuz QR kod da aynı profili açar; sırada bekleyen müşteri o arada sizi kaydeder.",
        ],
      },
      {
        heading: "Salon profiline ne koyulur?",
        list: [
          "WhatsApp randevu hattı ve salon telefonu, ayrı satırlarda",
          "Instagram hesabınız; çalışmalarınızı görmek isteyen oradan bakar",
          "Fiyat listesi ya da hizmet menüsü, “Fiyat Listesi” türünde PDF olarak",
          "Adres; dokununca harita açılır, ilk kez gelen müşteri kaybolmaz",
          "Gelin ve özel gün paketleri için kapora IBAN'ı; siz açmadıkça görünmez",
          "Online randevu sayfanız varsa bağlantısı, web sitesi satırı olarak",
        ],
        paragraphs: [
          "Fiyatlarınız değiştiğinde PDF'i panelden değiştirirsiniz; aynı QR ve aynı kart yeni listeyi gösterir. Basılı fiyat kartlarını yenilemek zorunda kalmazsınız.",
        ],
      },
      {
        heading: "Müşteriyi geri getirmek",
        paragraphs: [
          "Gelin adayı ya da ilk kez gelen müşteri, profilinizdeki “Bilgilerimi bırak” ile adını ve numarasını size iletir; “Haziran'da düğün, prova istiyor” gibi bir not da yazabilir. Kişi Kişiler listenize düşer, prova tarihine hatırlatma kurarsınız.",
          "Boya tazeleme ya da bakım için belli aralıklarla gelen müşteriler için “1 ay” hatırlatması kurun; o sabah e-postanıza gelir, WhatsApp mesajı hazır yazılmış olur. Analitik panelinde ziyaretçilerin en çok neye dokunduğunu görürsünüz: Instagram mı, WhatsApp mı, fiyat listesi mi.",
        ],
      },
      {
        heading: "Salon ve ekip için sipariş",
        paragraphs: [
          "Her kuaför, manikürist ya da cilt bakım uzmanı için ayrı kart verip ekip panelinden yönetebilirsiniz. Bir çalışan ayrıldığında kartı yeni çalışana atarsınız; salonun kartlarından gelen kişiler salonun listesinde kalır.",
          "10 ve üzeri adette %20 indirim uygulanır. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Yalnızca aynaya ve vitrine koyacağınız bir QR kod istiyorsanız kartsız dijital kartvizit 2 saat içinde e-postanıza gelir.",
        ],
      },
    ],
    faq: [
      {
        q: "Müşterinin uygulama indirmesi gerekir mi?",
        a: "Hayır. Kart dokundurulduğunda ya da QR okutulduğunda profil tarayıcıda açılır.",
      },
      {
        q: "Online randevu sistemi var mı?",
        a: "Dijivizit bir randevu sistemi değildir. Randevular WhatsApp ya da telefonla alınır; kullandığınız bir online randevu sayfası varsa bağlantısını profilinize eklersiniz.",
      },
      {
        q: "Fiyat listemi nasıl eklerim?",
        a: "Belgeler bölümünden PDF olarak yüklersiniz; belge türü olarak “Fiyat Listesi”ni seçersiniz. Dosya en fazla 10 MB olabilir.",
      },
      {
        q: "Salon için tek kart mı, her çalışana ayrı kart mı?",
        a: "İkisi de olur. Müşterisi kişiye bağlı çalışan salonlarda her çalışana ayrı kart, randevuları tek hattan alan salonlarda salon adına tek profil daha pratiktir.",
      },
    ],
    guides: [
      "instagram-kartvizit",
      "qr-kod-kartvizit",
      "linktree-alternatifi",
      "yeni-isletme-kontrol-listesi",
    ],
    siblings: [
      "dijital-kartvizit/fotografci",
      "dijital-kartvizit/restoran-kafe",
      "dijital-kartvizit/diyetisyen",
    ],
  },
  {
    slug: "dijital-kartvizit/sigorta-acentesi",
    parent: PARENT,
    kind: "meslek",
    term: "Sigorta acenteleri için",
    title: "Sigorta Acenteleri için Dijital Kartvizit | Dijivizit",
    description:
      "Sigorta acenteleri için dijital kartvizit: acente hattı, WhatsApp, asistans numaraları ve teklif belgeleri tek profilde. Hasar anında müşteri rehberindesiniz.",
    h1: "Sigorta acenteleri için dijital kartvizit",
    lead: "Müşteriniz kaza yaptığında ya da poliçesi yenileneceğinde aradığı numara siz olun. Acente hattınız, WhatsApp'ınız ve teklif için gereken belgeler listesi müşterinin rehberinde ve telefonunda dursun.",
    sections: [
      {
        heading: "Sigortacılıkta kartvizitin asıl işi",
        paragraphs: [
          "Sigorta müşterisi acentesini yılda bir ya da iki kez arar: poliçe yenilenirken ve bir hasar olduğunda. İkinci an en kritik olanıdır; müşteri telaşla telefonda acenteyi arar, bulamazsa başka yere sorar. Kâğıt kartvizit o anda torpidoda ya da çekmecede kalmıştır.",
          "Poliçe teslim ederken kartı müşterinin telefonuna dokundurursanız acente adı, sabit hat, cep, WhatsApp ve adres rehberine tek kayıt olarak eklenir. Hasar anında arayacağı yer telefonundadır.",
        ],
      },
      {
        heading: "Acente profiline ne koyulur?",
        list: [
          "Acente telefonu, cep telefonunuz ve WhatsApp; “Hasar” ya da “Teklif” gibi etiketlerle",
          "Çalıştığınız sigorta şirketlerinin asistans hatları, etiketli telefon satırları olarak",
          "Levha kayıt numaranız ve acente unvanı, Hakkımda yazısında",
          "“Kasko teklifi için gerekenler”, “Hasar anında yapılacaklar” gibi PDF belgeler",
          "Ofis adresi ve web siteniz",
        ],
        paragraphs: [
          "Çalıştığınız şirketler ya da numaralar değiştiğinde profili güncellersiniz; müşterinin elindeki kart ve rehberindeki bağlantı yeni bilgiyi gösterir.",
        ],
      },
      {
        heading: "Teklif, takip, yenileme",
        paragraphs: [
          "Teklif isteyen kişi profilinizdeki “Bilgilerimi bırak” ile adını, numarasını ve “Kasko, aracım 2019 model” gibi kısa bir not bırakır. Kişiler listenize düşer, yanına not ekler, teklifi göndereceğiniz güne hatırlatma kurarsınız.",
          "Hatırlatmanın tarihini siz seçersiniz; poliçe bitiş tarihinden birkaç hafta öncesine kurduğunuz hatırlatma o sabah e-postanıza gelir, WhatsApp mesajı hazır yazılmış olur. Bayi ziyaretinde, oto galeride ya da galeri sahibinin önerdiği müşteride aldığınız kâğıt kartvizitleri de fotoğrafını çekerek kaydedersiniz.",
        ],
      },
      {
        heading: "Acente ekibi için sipariş",
        paragraphs: [
          "Birden fazla çalışanı olan acenteler kartları ekip panelinden yönetir. Çalışan ayrıldığında kart yeni çalışana devredilir; acente kartlarından gelen kişiler acentede kalır, müşteri ilişkisi kişiyle birlikte gitmez.",
          "10 ve üzeri adette %20 indirim uygulanır. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir; kart okunmazsa ücretsiz yenisiyle değiştirilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Asistans hatlarını profile ekleyebilir miyim?",
        a: "Evet. Her numarayı ayrı telefon satırı olarak ekleyip etiketine şirketin adını yazarsınız. Müşteri dokunduğunda doğrudan arama başlar.",
      },
      {
        q: "Poliçe yenileme hatırlatması kurabilir miyim?",
        a: "Kişiler listesindeki her kişi için istediğiniz tarihe takip hatırlatması kurabilirsiniz; hatırlatma o gün sabah e-postanıza gelir. Dijivizit poliçe takip programı değildir; hatırlatmaları siz kurarsınız.",
      },
      {
        q: "Müşteri bilgileri nerede saklanır?",
        a: "“Bilgilerimi bırak” ile gelen bilgiler yalnızca sizin Kişiler listenizde görünür; ekip kartlarında acente yöneticisi de görür. Ziyaretçi bilgisini paylaşmadan önce onay verir.",
      },
      {
        q: "Kartsız kullanabilir miyim?",
        a: "Evet. Kartsız dijital kartvizitte link ve QR kod 2 saat içinde e-postanıza gelir; poliçe e-postalarınızın imzasına eklersiniz. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "dijital-kartvizit-nasil-olusturulur",
      "kartvizite-ne-yazilir",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
    ],
    siblings: [
      "dijital-kartvizit/emlakci",
      "dijital-kartvizit/satis-temsilcisi",
      "dijital-kartvizit/avukat",
      "nfc-kartvizit",
    ],
  },
  {
    slug: "dijital-kartvizit/mimar",
    parent: PARENT,
    kind: "meslek",
    term: "Mimarlar için",
    title: "Mimarlar için Dijital Kartvizit | Dijivizit",
    description:
      "Mimarlar için dijital kartvizit: portfolyo PDF'i, web sitesi, Instagram ve ofis adresi tek profilde. Şantiyede, showroomda ve fuarda dokundurun.",
    h1: "Mimarlar için dijital kartvizit",
    lead: "Bir mimarın kartviziti işini de göstermeli. Portfolyonuz, web siteniz ve Instagram hesabınız tek profilde; kart ise lazerle işlenmiş ahşap ya da metal, yani tasarımın kendisi.",
    sections: [
      {
        heading: "Mimarlar dijital kartviziti nerede kullanır?",
        paragraphs: [
          "Mimarın iletişim çevresi geniştir: işveren, müteahhit, şantiye şefi, mühendisler, belediyedeki muhatap, seramik, aydınlatma ve mobilya tedarikçileri. Her biriyle farklı yerde tanışırsınız: şantiyede, showroomda, yapı fuarında, bir açılışta.",
          "Kâğıt kartvizit bu karşılaşmalarda adınızı verir ama işinizi göstermez. Dijital kartvizitte karşınızdaki kişi kartı telefonuna dokundurduğunda portfolyonuza tek dokunuşla ulaşır, sizi rehberine kaydeder.",
        ],
      },
      {
        heading: "Mimar profiline ne koyulur?",
        list: [
          "Portfolyo ya da seçili projeler, “Sunum” veya “Broşür” türünde PDF olarak (her biri en fazla 10 MB)",
          "Web siteniz ve kullandığınız portfolyo sayfaları, etiketli web satırları olarak",
          "Instagram hesabınız",
          "Ofis adresi; dokununca harita açılır",
          "Uzmanlık alanlarınız: konut, iç mimari, restorasyon, kentsel dönüşüm gibi",
          "Mimarlar Odası sicil numaranız, Hakkımda yazısında",
        ],
        paragraphs: [
          "Yeni bir proje tamamlandığında portfolyo PDF'ini panelden değiştirirsiniz; daha önce kart verdiğiniz herkes güncel portfolyoyu görür. Büyük dosyalar yerine projeleri birkaç ayrı PDF'e bölmek mobilde daha hızlı açılır.",
        ],
      },
      {
        heading: "Şantiye, showroom, fuar",
        list: [
          "İşverenle ilk görüşme: toplantı sonunda kartı dokundurun, portfolyonuz ve iletişim bilgileriniz telefonunda kalsın",
          "Tedarikçi ziyareti: size verilen kâğıt kartvizitlerin fotoğrafını çekin; ad, şirket ve telefon Kişiler listenize kaydolsun, yanına “bu karo X projesi için” notu düşün",
          "Yapı fuarı ve açılışlar: aldığınız kartvizitleri aynı gün tarayın, teklif isteyeceğiniz tedarikçilere hatırlatma kurun",
          "Proje panosu ve şantiye levhası: profil QR kodunuzu ekleyin, merak eden komşu ya da müteahhit size ulaşsın",
        ],
      },
      {
        heading: "Malzeme ve sipariş",
        paragraphs: [
          "Koyu ve açık ahşap kartlarda logo lazerle yakılır; her kartın damar dokusu kendine özgüdür. Mat siyah, gümüş ve gold metal kartlarda logo lazerle kazınır. Baskı olmadığı için silinmez, solmaz. 10 ve üzeri adetteki ofis siparişlerinde ofisinizin logosunu karta işletebilirsiniz.",
          "Ofisinizde birden fazla mimar varsa kartları ekip panelinden yönetirsiniz; 10 ve üzeri adette %20 indirim uygulanır. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
        ],
      },
    ],
    faq: [
      {
        q: "Portfolyomu karta nasıl eklerim?",
        a: "Belgeler bölümünden PDF olarak yüklersiniz; en fazla 10 belge, her biri 10 MB'a kadar. Web sitenizdeki ya da başka bir portfolyo sayfasındaki çalışmalarınızın bağlantısını da ekleyebilirsiniz.",
      },
      {
        q: "Ahşap mı metal mi seçmeliyim?",
        a: "Ahşap sıcak ve doğal bir izlenim bırakır, metal daha ağır ve resmîdir. Daha hafif ve uygun fiyatlı bir seçenek isterseniz mat siyah PVC de var. Hepsinde NFC çip vardır ve profil linkiyle QR kod da verilir; işlev aynıdır.",
      },
      {
        q: "Logomu karta koyabilir miyim?",
        a: "10 ve üzeri adetteki kurumsal siparişlerde evet; firma logonuz metalde lazerle kazınır, ahşapta lazerle yakılır. Standart kartlarda Dijivizit logosu bulunur, bilgileriniz profilde yer alır.",
      },
      {
        q: "Behance gibi platformları ekleyebilir miyim?",
        a: "Evet. Bağlantıyı web sitesi satırı olarak ekleyip etiketine platformun adını yazarsınız.",
      },
    ],
    guides: [
      "ahsap-kartvizit",
      "metal-kartvizit",
      "dijital-kartvizit-ornekleri",
      "kartvizite-ne-yazilir",
    ],
    siblings: [
      "dijital-kartvizit/fotografci",
      "dijital-kartvizit/emlakci",
      "dijital-kartvizit/satis-temsilcisi",
      "nfc-kartvizit",
    ],
  },
  {
    slug: "dijital-kartvizit/fotografci",
    parent: PARENT,
    kind: "meslek",
    term: "Fotoğrafçılar için",
    title: "Fotoğrafçılar için Dijital Kartvizit | Dijivizit",
    description:
      "Fotoğrafçılar için dijital kartvizit: Instagram, paket PDF'leri, kapora IBAN'ı ve WhatsApp tek profilde. Düğünde dokundurun, gelen talepleri panelden izleyin.",
    h1: "Fotoğrafçılar için dijital kartvizit",
    lead: "Düğünde ya da etkinlikte misafirler sizi sorar; o an elinizde kamera vardır, kartvizit değil. Kartı telefona dokundurun; Instagram'ınız, paketleriniz ve WhatsApp hattınız karşı tarafın telefonunda kalsın.",
    sections: [
      {
        heading: "Fotoğrafçılar müşteriyi nerede bulur?",
        paragraphs: [
          "Fotoğrafçının en iyi reklamı çektiği iştir; yeni müşteri çoğu zaman bir düğünde, nişanda, kurumsal etkinlikte ya da ürün çekiminde “bu fotoğrafçı kim” diye sorulduğunda gelir. O an sizden numara isteyen misafir, birkaç gün sonra sizi Instagram'da arar ve bulamayabilir.",
          "Dijital kartvizitte kartı telefona dokundurursunuz; misafir Instagram hesabınızı açar, “Rehberime Kaydet” ile sizi kaydeder. Çekim sırasında kısa bir dokunuş yeter, işinize geri dönersiniz.",
        ],
      },
      {
        heading: "Fotoğrafçı profiline ne koyulur?",
        list: [
          "Instagram hesabınız ve web siteniz; çalışmalarınızın görüldüğü yerler",
          "Düğün, nişan, ürün ya da kurumsal çekim paketleri, “Fiyat Listesi” veya “Broşür” türünde PDF olarak",
          "WhatsApp hattı; çiftlerin çoğu tarih sormak için önce yazar",
          "Kapora için IBAN; siz açmadıkça görünmez, tek dokunuşla kopyalanır",
          "Çalıştığınız alanlar: düğün, doğum, ürün, mimari, etkinlik gibi",
        ],
        paragraphs: [
          "Sezon değiştiğinde paket PDF'ini panelden güncellersiniz; daha önce kart verdiğiniz herkes yeni fiyatları görür.",
        ],
      },
      {
        heading: "Etkinlikten sonra takip",
        paragraphs: [
          "Düğünde tanıştığınız ve yakında evlenecek olan misafir, profilinizdeki “Bilgilerimi bırak” ile adını, numarasını ve “Eylül'de düğünümüz var” gibi bir not bırakır. Kişi Kişiler listenize düşer, ona dönmek için tarih seçip hatırlatma kurarsınız.",
          "Organizasyon firmaları, düğün mekânları ve gelinlik mağazaları gibi iş ortaklarının kâğıt kartvizitlerini fotoğrafını çekerek kaydedersiniz. Analitik panelinde profilinizin kaç kez açıldığını ve ziyaretçilerin Instagram'a mı, paketlere mi dokunduğunu görürsünüz.",
          "Teslim ettiğiniz albümün ya da USB kutusunun içine profil QR kodunuzu koyabilirsiniz; albüme bakan herkes sizi bulur.",
        ],
      },
      {
        heading: "Kart seçimi ve teslimat",
        paragraphs: [
          "Mat siyah metal kart çekim günü kıyafetinizle uyumlu ve sadedir; ahşap kartlar daha sıcak bir izlenim bırakır. Kartın logosu lazerle işlenir, silinmez; stüdyonuzun adı ve bilgileri profilde yer alır. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Stüdyo olarak birden fazla fotoğrafçı ve asistanla çalışıyorsanız kartları ekip panelinden yönetirsiniz; 10 ve üzeri adette %20 indirim uygulanır.",
        ],
      },
    ],
    faq: [
      {
        q: "Portfolyomu profile koyabilir miyim?",
        a: "Evet. Seçili çalışmalarınızı PDF olarak yükleyebilir ya da web sitenizin ve Instagram hesabınızın bağlantısını ekleyebilirsiniz. Belgeler en fazla 10 MB olabilir; mobilde hızlı açılması için görselleri sıkıştırmanızı öneririz.",
      },
      {
        q: "Linktree yerine kullanılabilir mi?",
        a: "Evet. Profil bağlantınızı Instagram biyografinize eklersiniz; ziyaretçi tek sayfada bütün bağlantılarınızı görür ve sizi rehberine kaydedebilir.",
      },
      {
        q: "Kapora için IBAN'ı nasıl paylaşırım?",
        a: "IBAN'ınızı panelden ekleyip profilde görünür yaparsınız. Müşteri tek dokunuşla kopyalar, elle yazarken hata yapmaz.",
      },
      {
        q: "Kart olmadan kullanabilir miyim?",
        a: "Evet. Kartsız dijital kartvizitte link ve QR kod 2 saat içinde e-postanıza gelir. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir.",
      },
    ],
    guides: [
      "instagram-kartvizit",
      "linktree-alternatifi",
      "metal-kartvizit",
      "dijital-kartvizit-ornekleri",
    ],
    siblings: [
      "dijital-kartvizit/mimar",
      "dijital-kartvizit/kuafor-guzellik-salonu",
      "dijital-kartvizit/restoran-kafe",
    ],
  },
  {
    slug: "dijital-kartvizit/satis-temsilcisi",
    parent: PARENT,
    kind: "meslek",
    term: "Satış temsilcileri için",
    title: "Satış Temsilcileri için Dijital Kartvizit | Dijivizit",
    description:
      "Satış temsilcileri için dijital kartvizit: katalog, fiyat listesi ve teknik doküman profilde; bayide dokundurun, gelen kişileri not ve hatırlatmayla takip edin.",
    h1: "Satış temsilcileri için dijital kartvizit",
    lead: "Bayi ziyaretinde, fuarda ya da müşteri toplantısında kartınızı verdiğiniz an kataloğunuz da karşı tarafın telefonuna geçsin. Sonra kimin ilgilendiğini görün, takip gününü kaçırmayın.",
    sections: [
      {
        heading: "Sahada satışın kartvizit sorunu",
        paragraphs: [
          "Satış temsilcisi gün içinde onlarca kişiyle görüşür ve her görüşme sonunda iki şey ister: karşı tarafın onu hatırlaması ve kendisinin karşı tarafı takip etmesi. Kâğıt kartvizit ilkine kısmen yardım eder, ikincisine hiç etmez.",
          "Dijital kartvizitte bayi sahibi ya da satın almacı kartınızı telefonuna dokundurur, sizi rehberine kaydeder, kataloğunuzu açar. Siz de onun kâğıt kartvizitini fotoğrafını çekerek kaydedersiniz. Toplantıdan çıktığınızda iki taraf da birbirinin bilgisine sahiptir.",
        ],
      },
      {
        heading: "Satış profiline ne koyulur?",
        list: [
          "Ürün kataloğu ve güncel fiyat listesi, PDF olarak",
          "Teknik doküman ve ürün föyleri; “Teknik Doküman” türüyle",
          "Cep telefonu, WhatsApp, kurumsal e-posta",
          "Şirketin web sitesi ve LinkedIn profiliniz",
          "Fatura bilgileri; cari kart açmak isteyen müşteri vergi numarasını tek dokunuşla kopyalar",
        ],
        paragraphs: [
          "Fiyat listesi güncellendiğinde PDF'i panelden değiştirirsiniz; müşterilerin elindeki bağlantı eski fiyatı göstermez. Her belge en fazla 10 MB olabilir, profile en fazla 10 belge eklenir.",
        ],
      },
      {
        heading: "Toplantıdan siparişe: takip",
        paragraphs: [
          "Profilinizi açan kişi “Bilgilerimi bırak” ile adını, şirketini ve “Fuarda tanıştık, teklif istiyorum” gibi bir not bırakır. Bu kişiler ve sizin taradığınız kartvizitler aynı Kişiler listesinde toplanır. Her kişiye not ekler, “Yarın”, “1 hafta” ya da seçtiğiniz bir tarih için hatırlatma kurarsınız; o sabah e-postanıza gelir, WhatsApp mesajı hazır yazılmış olur.",
          "Analitik panelinde profilinizin kaç kez, hangi şehirlerden açıldığını, ziyaretçilerin kataloğa mı fiyat listesine mi dokunduğunu ve kaç kişinin sizi rehberine kaydettiğini görürsünüz. Bölgenizde hangi şehirde ilginin arttığını buradan izlersiniz.",
        ],
      },
      {
        heading: "Satış ekibi için",
        paragraphs: [
          "Ekip panelinde bütün satış temsilcilerinin kartlarını tek yerden yönetirsiniz. Temsilci ayrıldığında ya da bölge değiştirdiğinde fiziksel kart yeni kişiye atanır; şirket kartlarından gelen kişiler şirkette kalır.",
          "10 ve üzeri adette %20 indirim uygulanır. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Kaybolan kart panelden kapatılır, diğer kartlar çalışmaya devam eder.",
        ],
      },
    ],
    faq: [
      {
        q: "CRM yerine geçer mi?",
        a: "Hayır, bir CRM değildir. Kişiler listesi, notlar ve takip hatırlatmaları sahadaki ilk teması kaybetmemeniz için vardır; kapsamlı satış süreçleri için mevcut CRM'inizi kullanmaya devam edersiniz.",
      },
      {
        q: "Aldığım kâğıt kartvizitleri nasıl kaydederim?",
        a: "Panelden kartvizitin fotoğrafını çekersiniz; ad, unvan, şirket ve telefon otomatik okunur. Kontrol edip kaydedersiniz.",
      },
      {
        q: "Temsilci ayrılırsa müşteriler ne olur?",
        a: "Şirket kartlarından “Bilgilerimi bırak” ile gelen kişiler ekip panelinde görünür. Kart yeni temsilciye atandığında aynı kart yeni kişinin profilini açar.",
      },
      {
        q: "Kataloğu kaç kişinin açtığını görebilir miyim?",
        a: "Analitik panelinde ziyaretçilerin hangi bağlantılara ve belgelere dokunduğunu görürsünüz.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "en-iyi-dijital-kartvizit-nasil-secilir",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
      "qr-kod-kartvizit",
    ],
    siblings: [
      "dijital-kartvizit/sigorta-acentesi",
      "dijital-kartvizit/emlakci",
      "dijital-kartvizit/istanbul",
      "nfc-kartvizit",
    ],
  },
  {
    slug: "dijital-kartvizit/restoran-kafe",
    parent: PARENT,
    kind: "meslek",
    term: "Restoran ve kafeler için",
    title: "Restoran ve Kafeler için Dijital Kartvizit | Dijivizit",
    description:
      "Restoran ve kafeler için dijital kartvizit: menü PDF'i, rezervasyon hattı, WhatsApp, konum ve Instagram tek profilde. Masaya QR, kasaya NFC; uygulama gerekmez.",
    h1: "Restoran ve kafeler için dijital kartvizit",
    lead: "Masadaki misafir menünüze, rezervasyon hattınıza, Instagram hesabınıza ve konumunuza tek QR koddan ulaşsın. Sahibi olarak tedarikçi ve kurumsal müşterilerle tanıştığınızda da kartınızı dokundurun.",
    sections: [
      {
        heading: "Restoran ve kafede iki ayrı ihtiyaç",
        paragraphs: [
          "Restoranın kartvizitinin iki muhatabı vardır. Birincisi misafirdir: menüyü görmek, rezervasyon yapmak, konumu bir arkadaşına göndermek, Instagram'ı takip etmek ister. İkincisi işletmenin iş çevresidir: toptancılar, tedarikçiler, catering isteyen şirketler, organizasyon firmaları.",
          "Dijital kartvizit ikisine de aynı profilden hizmet eder. Misafir masadaki ya da kasadaki QR kodu okutur; siz tedarikçiyle tanıştığınızda NFC kartı onun telefonuna dokundurursunuz.",
        ],
      },
      {
        heading: "İşletme profiline ne koyulur?",
        list: [
          "Menü, “Fiyat Listesi” türünde PDF olarak; fiyat değişince dosyayı değiştirirsiniz",
          "Rezervasyon telefonu ve WhatsApp hattı",
          "Adres; dokununca haritada açılır",
          "Instagram hesabınız ve web siteniz",
          "Catering ya da grup menüsü için ayrı bir PDF",
          "Kurumsal müşterilerin fatura kesebilmesi için fatura bilgileri; siz açmadıkça görünmez",
        ],
        paragraphs: [
          "Dijivizit bir QR menü ya da sipariş sistemi değildir. Menü profildeki bir PDF olarak açılır; misafir profilde menüye bir dokunuşla ulaşır. Masada doğrudan sipariş verilen bir sistem kullanıyorsanız onun bağlantısını profilinize ekleyebilirsiniz.",
        ],
      },
      {
        heading: "Masada, kasada, iş görüşmesinde",
        list: [
          "Masa ve kasa: profil QR kodunuzu panelden PNG ya da SVG olarak indirip masa kartına, kasa önüne bastırın",
          "Paket servis: paket poşetine ya da fişe QR kodu ekleyin; misafir bir dahaki siparişte numaranızı arar",
          "Catering ve grup talepleri: şirketler “Bilgilerimi bırak” ile ad, şirket ve kişi sayısını not olarak iletir; teklif için hatırlatma kurarsınız",
          "Tedarikçi ve toptancılar: size verilen kâğıt kartvizitin fotoğrafını çekin, Kişiler listenize kaydolsun",
        ],
        paragraphs: [
          "Analitik panelinde profilin kaç kez açıldığını ve misafirlerin en çok neye dokunduğunu görürsünüz: menüye mi, rezervasyon hattına mı, Instagram'a mı.",
        ],
      },
      {
        heading: "Hangi ürün, nasıl teslim?",
        paragraphs: [
          "Yalnızca masalara ve vitrine koyacağınız bir QR kod istiyorsanız kartsız dijital kartvizit yeterlidir: link ve QR kod 2 saat içinde e-postanıza gelir. Aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir.",
          "İşletme sahibi ve müdürler için NFC kart; ahşap kartlar özellikle kafe kimlikleriyle uyumludur. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Birden fazla şubeniz varsa her şube müdürüne kart verip ekip panelinden yönetebilirsiniz.",
        ],
      },
    ],
    faq: [
      {
        q: "QR menü olarak kullanılabilir mi?",
        a: "Menünüzü PDF olarak profilinize ekleyebilirsiniz; QR okutulduğunda profil açılır, menü bir dokunuş uzaktadır. Sipariş ya da ödeme alan bir QR menü sistemi değildir.",
      },
      {
        q: "Menü fiyatları değişince QR kodu yeniden bastırmam gerekir mi?",
        a: "Hayır. Panelden PDF'i değiştirirsiniz; masalardaki QR kod aynı kalır ve yeni menüyü gösterir.",
      },
      {
        q: "Masalar için kaç QR kod gerekir?",
        a: "Tek profil için tek QR kod yeterlidir; aynı kodu bütün masalara bastırabilirsiniz.",
      },
      {
        q: "Rezervasyon alınabiliyor mu?",
        a: "Dijivizit rezervasyon sistemi değildir. Misafir profilden rezervasyon hattınızı arar ya da WhatsApp'tan yazar; kullandığınız bir rezervasyon sayfası varsa bağlantısını eklersiniz.",
      },
    ],
    guides: [
      "qr-kod-kartvizit",
      "yeni-isletme-kontrol-listesi",
      "instagram-kartvizit",
      "ucretsiz-dijital-kartvizit",
    ],
    siblings: [
      "dijital-kartvizit/kuafor-guzellik-salonu",
      "dijital-kartvizit/fotografci",
      "dijital-kartvizit/antalya",
    ],
  },

  // ---------------------------------------------------------------- şehirler
  {
    slug: "dijital-kartvizit/istanbul",
    parent: PARENT,
    kind: "sehir",
    term: "İstanbul",
    title: "İstanbul NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "İstanbul'da NFC kartvizit ve dijital kartvizit: Tüyap'ta, plaza toplantısında dokundurun, rehbere kaydettirin. Akıllı kartvizitiniz ücretsiz kargoyla gelir.",
    h1: "İstanbul'da NFC ve dijital kartvizit",
    lead: "İstanbul'da bir gün içinde Maslak'ta toplantı, Kadıköy'de müşteri, akşam Harbiye'de bir etkinlik olabilir. Bu tempoda kartvizitin işi hızlı olmaktır: dokundur, rehbere kaydettir, devam et.",
    sections: [
      {
        heading: "İstanbul iş hayatında akıllı kartvizit",
        paragraphs: [
          "İstanbul'da tanışmaların çoğu kısa sürer: plaza lobisinde beş dakikalık bir görüşme, fuarda stand önünde iki cümle, bir panelin çıkışında el sıkışma. Finans, ticaret, tekstil ve hazır giyim, lojistik, medya ve teknoloji şirketlerinin yoğunlaştığı şehirde aynı gün onlarca kişiyle bilgi değiştirebilirsiniz.",
          "Dijital kartvizit bu hızda işe yarar. Kartı telefona dokundurduğunuzda adınız, şirketiniz, unvanınız ve telefonlarınız karşı tarafın rehberine tek seferde eklenir. Akşam trafikte kartvizit destesini elle rehbere geçirmeye uğraşmazsınız.",
        ],
      },
      {
        heading: "Fuarlarda ve kongrelerde",
        paragraphs: [
          "İstanbul, Türkiye'nin fuar ve kongre takviminin büyük kısmına ev sahipliği yapar. Tüyap Fuar ve Kongre Merkezi, İstanbul Fuar Merkezi ve Harbiye'deki İstanbul Kongre Merkezi yıl boyunca sektör fuarları, kongreler ve zirveler düzenler.",
        ],
        list: [
          "Stand panosuna ve broşürlere profil QR kodunuzu koyun; standda kimse yokken gelen ziyaretçi de sizi kaydeder",
          "Ziyaretçiler “Bilgilerimi bırak” ile ad, şirket ve kısa bir not bırakır; fuar bitince bu liste panelinizde hazırdır",
          "Size verilen kâğıt kartvizitleri aynı gün fotoğrafını çekerek kaydedin; ad, şirket ve telefon otomatik okunur",
          "Fuar dönüşü her kişiye “1 hafta” hatırlatması kurun; o sabah e-postanıza gelir",
        ],
      },
      {
        heading: "İstanbul'daki ekipler için",
        paragraphs: [
          "Çalışan sirkülasyonunun yüksek olduğu İstanbul'da şirket kartlarının en büyük maliyeti yeniden basımdır. Dijivizit ekip panelinde kart çalışana atanır; çalışan ayrıldığında aynı fiziksel kart yeni çalışana devredilir. Unvan ya da ofis değişince de yalnızca profil güncellenir.",
          "Analitik panelinde profillerin hangi şehirlerden açıldığını görürsünüz; İstanbul dışındaki ya da yurt dışındaki müşterilere ulaşan bağlantıları ayrıca izlersiniz. 10 ve üzeri adette %20 indirim uygulanır.",
        ],
      },
      {
        heading: "İstanbul'a sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in fiziksel şubesi ya da mağazası yoktur; siparişler bu siteden verilir ve İstanbul'un her ilçesine kargoyla gönderilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Fuara yetişmesi gereken bir siparişiniz varsa kartsız dijital kartvizitle başlayabilirsiniz: link ve QR kod 2 saat içinde e-postanıza gelir. Sonradan NFC karta geçtiğinizde link ve QR aynı kalır.",
        ],
      },
    ],
    faq: [
      {
        q: "İstanbul'da NFC kartvizit nereden alınır?",
        a: "Dijivizit'ten online sipariş verirsiniz. İstanbul'da mağazamız ya da teslim noktamız yoktur; kartlar Eskişehir'den İstanbul'un her ilçesine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "İstanbul'a kaç günde gelir?",
        a: "Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
      },
      {
        q: "Fuardan önce kart yetişmezse ne yaparım?",
        a: "Kartsız dijital kartvizitle başlayın: link ve QR kod 2 saat içinde e-postanıza gelir, stand panonuza ve broşürlerinize koyarsınız. Kart geldiğinde aynı profili açar.",
      },
      {
        q: "Şirketimiz için toplu sipariş verebilir miyiz?",
        a: "Evet. 10 ve üzeri adette %20 indirim uygulanır; kartları ekip panelinden çalışanlara atarsınız.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "nfc-kartvizit-nereden-alinir",
      "qr-kod-kartvizit",
      "en-iyi-dijital-kartvizit-nasil-secilir",
    ],
    siblings: [
      "dijital-kartvizit/kocaeli",
      "dijital-kartvizit/ankara",
      "dijital-kartvizit/izmir",
      "dijital-kartvizit/satis-temsilcisi",
    ],
  },
  {
    slug: "dijital-kartvizit/ankara",
    parent: PARENT,
    kind: "sehir",
    term: "Ankara",
    title: "Ankara NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Ankara'da NFC kartvizit ve dijital kartvizit: kurum ziyaretinde, ATO Congresium'da dokundurun. Unvanınız değişince akıllı kartvizit güncellenir; kargo ücretsiz.",
    h1: "Ankara'da NFC ve dijital kartvizit",
    lead: "Ankara'da iş, kurum ziyaretleri, toplantılar ve resmî görüşmelerle döner. Unvanların, birimlerin ve numaraların sık değiştiği bu ortamda kartvizitin güncel kalması, bastırılmasından önemlidir.",
    sections: [
      {
        heading: "Ankara'da kartvizit neden sık eskir?",
        paragraphs: [
          "Başkentte iş hayatının önemli bir kısmı kamu kurumları, bakanlıklar, meslek kuruluşlarının genel merkezleri ve bunlarla çalışan şirketler etrafında şekillenir. Savunma sanayii, mühendislik, bilişim ve danışmanlık firmaları; OSTİM ve İvedik gibi sanayi bölgeleri; üniversitelerin teknokentleri bu ekosistemin parçasıdır.",
          "Bu ortamda görev yeri, unvan ve dahili numara sık değişir. Kâğıt kartvizit her değişiklikte çöpe gider. Dijital kartvizitte bilgiler profilde durur; birim değiştiğinde unvanı ve numarayı panelden güncellersiniz, elinizdeki kart yeni bilgileri gösterir.",
        ],
      },
      {
        heading: "Ankara'da kurum ziyaretinde akıllı kartvizit",
        list: [
          "Toplantı sonunda kartı muhatabınızın telefonuna dokundurun; adınız, şirketiniz, unvanınız ve telefonlarınız rehberine tek kayıt olarak eklenir",
          "Sabit hat, dahili ve cep numaralarınızı ayrı satırlarda, etiketleriyle ekleyin",
          "Şirket sunumunuzu ve referans listenizi “Sunum” türünde PDF olarak profile koyun",
          "Size verilen kâğıt kartvizitlerin fotoğrafını çekin; ad, unvan, kurum ve telefon Kişiler listenize kaydolsun",
          "Toplantıdan sonra teklif ya da dönüş için tarih seçip hatırlatma kurun",
        ],
        paragraphs: [
          "Kartın içindeki çipte yalnızca profilinize giden bağlantı bulunur; profil adresi adınızı değil rastgele bir kodu içerir. Kart kaybolursa panelden kapatırsınız.",
        ],
      },
      {
        heading: "ATO Congresium ve etkinlikler",
        paragraphs: [
          "Ankara'daki fuar, kongre ve sektör buluşmalarının önemli bir kısmı ATO Congresium'da yapılır; teknokentlerde ve üniversitelerde de düzenli olarak girişimcilik etkinlikleri, demo günleri ve kariyer günleri düzenlenir.",
          "Bu etkinliklerde profil QR kodunuzu yaka kartınıza, sunumunuzun son slaytına ya da standınıza koyabilirsiniz. Ziyaretçiler “Bilgilerimi bırak” ile size ulaşır; analitik panelinde etkinlik günü profilinizin kaç kez açıldığını görürsünüz.",
        ],
      },
      {
        heading: "Ankara'ya sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Ankara'da şubesi ya da ofisi yoktur; siparişler online verilir, kartlar kargoyla gönderilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Kartsız dijital kartvizit ise link ve QR kodla 2 saat içinde e-postanıza gelir. Şirketler için ekip paneli ve 10 ve üzeri adette %20 indirim vardır; fiyatlara KDV dahildir.",
        ],
      },
    ],
    faq: [
      {
        q: "Ankara'da NFC kartvizit nereden alınır?",
        a: "Siparişi bu siteden online verirsiniz. Dijivizit'in Ankara'da ofisi ya da teslim noktası yoktur; kartlar Ankara'ya ücretsiz kargoyla gönderilir ve 72 saat içinde teslim edilir.",
      },
      {
        q: "Unvanım ya da birimim değişirse ne olur?",
        a: "Panelden profilinizi güncellersiniz. Aynı kart ve QR kod yeni unvanınızı gösterir; kartı yeniden bastırmazsınız.",
      },
      {
        q: "Kurum ya da şirket olarak toplu sipariş verebilir miyiz?",
        a: "Evet. 10 ve üzeri adette %20 indirim uygulanır; kartları ekip panelinden çalışanlara atarsınız. Fiyatlara KDV dahildir.",
      },
      {
        q: "Kartın içinde kişisel bilgilerim mi var?",
        a: "Hayır. Çipte yalnızca profilinizin bağlantısı bulunur; bilgiler profilde durur ve siz yönetirsiniz.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "dijital-kartvizit-nedir",
      "metal-kartvizit",
      "akilli-kartvizit-nedir",
    ],
    siblings: [
      "dijital-kartvizit/istanbul",
      "dijital-kartvizit/eskisehir",
      "dijital-kartvizit/konya",
      "dijital-kartvizit/avukat",
    ],
  },
  {
    slug: "dijital-kartvizit/izmir",
    parent: PARENT,
    kind: "sehir",
    term: "İzmir",
    title: "İzmir NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "İzmir'de NFC kartvizit ve dijital kartvizit: Fuar İzmir'de, ihracat görüşmesinde dokundurun; katalog profilde. Akıllı kartvizit ücretsiz kargoyla gelir.",
    h1: "İzmir'de NFC ve dijital kartvizit",
    lead: "İzmir'de iş çoğu zaman ihracatla, limanla, fuarla ve turizmle iç içedir. Alıcıyla, acenteyle ya da tedarikçiyle tanıştığınızda kataloğunuz ve iletişim bilgileriniz tek dokunuşla karşı tarafın telefonunda olsun.",
    sections: [
      {
        heading: "İzmir'in iş hayatında akıllı kartvizit",
        paragraphs: [
          "İzmir; limanı, organize sanayi bölgeleri, tarım ürünleri ve gıda ihracatı, tekstil, turizm ve hizmet sektörüyle Ege'nin ticaret merkezidir. Bu yapıda tanıştığınız kişilerin bir kısmı yurt içinden, bir kısmı yurt dışından gelir; görüşme bir fuarda, bir fabrika ziyaretinde ya da Alsancak'ta bir kahve masasında olabilir.",
          "Dijital kartvizit, görüşme nerede olursa olsun aynı şeyi yapar: karşı taraf kartınızı telefonuna dokundurur ya da QR kodu okutur, sizi rehberine kaydeder, kataloğunuzu açar. Uygulama gerekmez; profil iPhone'da ve Android'de tarayıcıda açılır.",
        ],
      },
      {
        heading: "Fuar İzmir ve fuar dönemleri",
        paragraphs: [
          "İzmir'in köklü bir fuar geleneği vardır; Türkiye'nin en eski fuarlarından İzmir Enternasyonal Fuarı bu şehirdedir. Gaziemir'deki Fuar İzmir de yıl boyunca birçok sektör fuarına ev sahipliği yapar.",
        ],
        list: [
          "Stand panosuna ve ürün föylerine profil QR kodunuzu koyun",
          "Kataloğunuzu ve fiyat listenizi PDF olarak profile ekleyin; ziyaretçi standdan ayrılmadan inceler",
          "Yabancı ziyaretçiler için “Hakkımda” yazısına kısa bir İngilizce paragraf ekleyebilirsiniz",
          "Fuarda topladığınız kâğıt kartvizitleri fotoğrafını çekerek kaydedin, her birine not ve hatırlatma ekleyin",
        ],
      },
      {
        heading: "İhracat ve saha satışında",
        paragraphs: [
          "İhracatçı firmalarda alıcıyla ilk tanışma çoğu zaman kısa bir görüşmedir; ardından numune, teklif ve uzun bir yazışma gelir. Profilinizdeki teknik doküman ve katalog bu süreçte güncel kalır; fiyat listesi değiştiğinde PDF'i panelden değiştirirsiniz, alıcının elindeki bağlantı eski fiyatı göstermez.",
          "Analitik panelinde profilinizin hangi şehirlerden ve hangi cihazlardan açıldığını görürsünüz; yurt dışındaki bir alıcıya gönderdiğiniz bağlantının açılıp açılmadığını buradan anlarsınız.",
        ],
      },
      {
        heading: "İzmir'e sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in İzmir'de fiziksel şubesi yoktur; siparişler online verilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir. Kartsız dijital kartvizit 2 saat içinde e-postanıza gelir.",
          "Firmanızın satış ve ihracat ekibi için 10 ve üzeri adette %20 indirim uygulanır; kartları ekip panelinden çalışanlara atarsınız.",
        ],
      },
    ],
    faq: [
      {
        q: "İzmir'de NFC kartvizit nereden alınır?",
        a: "Bu siteden online sipariş verirsiniz. Dijivizit'in İzmir'de mağazası yoktur; kartlar İzmir'in her ilçesine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Yabancı müşteriler profilimi okuyabilir mi?",
        a: "Profil her telefonda tarayıcıda açılır. Ad, şirket, telefon ve e-posta gibi bilgiler dilden bağımsızdır; “Hakkımda” yazısına ve belgelerinize İngilizce içerik ekleyebilirsiniz.",
      },
      {
        q: "Fuar için kaç gün önce sipariş vermeliyim?",
        a: "Kartlar 72 saat içinde teslim edilir; yine de fuardan birkaç gün önce sipariş vermenizi öneririz. Acil durumda kartsız dijital kartvizit 2 saat içinde e-postanıza gelir.",
      },
      {
        q: "Kataloğumu güncellediğimde ne olur?",
        a: "Panelden yeni PDF'i yüklersiniz; kartınız ve QR kodunuz güncel kataloğu gösterir.",
      },
    ],
    guides: [
      "qr-kod-kartvizit",
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "kurumsal-dijital-kartvizit",
      "dijital-kartvizit-ornekleri",
    ],
    siblings: [
      "dijital-kartvizit/istanbul",
      "dijital-kartvizit/antalya",
      "dijital-kartvizit/bursa",
      "dijital-kartvizit/satis-temsilcisi",
    ],
  },
  {
    slug: "dijital-kartvizit/bursa",
    parent: PARENT,
    kind: "sehir",
    term: "Bursa",
    title: "Bursa NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Bursa'da NFC kartvizit ve dijital kartvizit: otomotiv ve tekstil tedarikçileri için akıllı kartvizit. Fabrika ziyaretinde dokundurun, teknik doküman profilde.",
    h1: "Bursa'da NFC ve dijital kartvizit",
    lead: "Bursa'da iş çoğu zaman bir fabrika kapısında, bir tedarikçi ziyaretinde ya da bir satın alma toplantısında başlar. Teknik dokümanınız ve iletişim bilgileriniz, kartınızı dokundurduğunuz an karşı tarafın telefonunda olsun.",
    sections: [
      {
        heading: "Bursa sanayisinde akıllı kartvizit",
        paragraphs: [
          "Bursa otomotiv ve otomotiv yan sanayi, tekstil, makine ve mobilya üretimiyle Türkiye'nin önde gelen sanayi şehirlerindendir. Organize sanayi bölgelerinde tedarikçiyle ana sanayi arasında her gün çok sayıda ziyaret, denetim ve teklif görüşmesi yapılır.",
          "Bu görüşmelerde masaya gelen yalnızca isim değildir: teknik föy, ürün kataloğu, kalite belgeleri. Dijital kartvizitte bunları PDF olarak profilinize eklersiniz; satın almacı kartınızı dokundurduğunda sizi rehberine kaydeder ve dokümanlarınıza tek dokunuşla ulaşır.",
        ],
      },
      {
        heading: "Tedarikçi ziyaretinde ne paylaşılır?",
        list: [
          "Ürün kataloğu ve teknik doküman, ilgili belge türleriyle",
          "Kalite ve sertifika belgeleri, “Diğer” türünde PDF olarak",
          "Fabrika adresi; dokununca harita açılır, ilk kez gelen ziyaretçi kolayca bulur",
          "Satış, teknik destek ve sevkiyat için ayrı, etiketli telefon satırları",
          "Fatura bilgileri; cari kart açacak satın alma birimi vergi numarasını tek dokunuşla kopyalar",
        ],
        paragraphs: [
          "Belgeler değiştiğinde panelden yenisini yüklersiniz; daha önce kart verdiğiniz satın almacının elindeki bağlantı güncel dosyayı açar.",
        ],
      },
      {
        heading: "Merinos AKKM ve fuarlar",
        paragraphs: [
          "Bursa'daki kongre, panel ve iş dünyası buluşmalarının bir kısmı Merinos Atatürk Kongre Kültür Merkezi'nde yapılır; sektör fuarları da şehirde düzenli olarak düzenlenir. Bu etkinliklerde profil QR kodunuzu yaka kartınıza ya da standınıza koyabilirsiniz.",
          "Etkinlikte aldığınız kâğıt kartvizitleri fotoğrafını çekerek kaydedersiniz; ad, unvan, şirket ve telefon otomatik okunur. Her kişiye not ekler, teklif göndereceğiniz güne hatırlatma kurarsınız; o sabah e-postanıza gelir.",
        ],
      },
      {
        heading: "Bursa'ya sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Bursa'da fiziksel şubesi yoktur; siparişler online verilir ve kartlar ücretsiz kargoyla gönderilir. Kartlar 72 saat içinde teslim edilir.",
          "Satış ve satın alma ekipleri için ekip paneli vardır: çalışan ayrıldığında kart yeni çalışana devredilir. 10 ve üzeri adette %20 indirim uygulanır. Kartsız dijital kartvizit 2 saat içinde e-postanıza gelir.",
        ],
      },
    ],
    faq: [
      {
        q: "Bursa'da NFC kartvizit nereden alınır?",
        a: "Siparişi bu siteden online verirsiniz. Dijivizit'in Bursa'da teslim noktası yoktur; kartlar Bursa'nın tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Profilime kaç belge ekleyebilirim?",
        a: "En fazla 10 PDF belge, her biri 10 MB'a kadar. Katalog, fiyat listesi, teknik doküman, sunum ve broşür gibi türler seçilebilir.",
      },
      {
        q: "Fabrikada NFC'yi açık olmayan telefonlar ne olacak?",
        a: "Profilinizin QR kodunu kendi telefonunuzun ekranından okutursunuz ya da linki paylaşırsınız; aynı profil açılır.",
      },
      {
        q: "Kartlara şirket logomuzu koyabilir miyiz?",
        a: "Evet, 10 ve üzeri adetteki kurumsal siparişlerde. Firma logonuz metal kartlarda lazerle kazınır, ahşap kartlarda lazerle yakılır.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "metal-kartvizit",
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
    ],
    siblings: [
      "dijital-kartvizit/kocaeli",
      "dijital-kartvizit/istanbul",
      "dijital-kartvizit/eskisehir",
      "dijital-kartvizit/satis-temsilcisi",
    ],
  },
  {
    slug: "dijital-kartvizit/antalya",
    parent: PARENT,
    kind: "sehir",
    term: "Antalya",
    title: "Antalya NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Antalya'da NFC kartvizit ve dijital kartvizit: otel satış ekipleri, acenteler ve emlakçılar için. Sezonluk ekipte akıllı kartvizit devri; ücretsiz kargoyla.",
    h1: "Antalya'da NFC ve dijital kartvizit",
    lead: "Antalya'da iş sezonla döner: ekipler değişir, misafirler farklı ülkelerden gelir, görüşmeler otel lobisinde ve kongre salonunda yapılır. Dijital kartvizit bu değişkenliğe uyar; kart aynı kalır, bilgiler güncellenir.",
    sections: [
      {
        heading: "Antalya'da turizm için akıllı kartvizit",
        paragraphs: [
          "Antalya'nın iş hayatında turizm başı çeker: oteller, seyahat acenteleri, transfer ve tur firmaları, kongre ve etkinlik organizatörleri. Bunun yanında seracılık ve tarım, inşaat ve yabancılara konut satışı da şehrin önemli sektörleridir.",
          "Bu sektörlerde tanıştığınız kişilerin bir kısmı Türkçe konuşmaz, bir kısmı telefonunda Türk numaralarını kaydetmeye alışık değildir. Dijital kartvizitte “Rehberime Kaydet” düğmesi adınızı, şirketinizi ve numaralarınızı tek seferde kaydeder; kimse numaranızı elle yazmaz. Numaralarınızı +90 ile başlayarak girerseniz yurt dışı hatlardan da doğrudan aranır.",
        ],
      },
      {
        heading: "Sezonluk ekipler ve kart devri",
        paragraphs: [
          "Otel satış ve misafir ilişkileri ekipleri, acente temsilcileri sezondan sezona değişebilir. Her yeni çalışana kâğıt kartvizit bastırmak, her ayrılanın kartlarını çöpe atmak demektir.",
          "Dijivizit ekip panelinde fiziksel kart çalışana atanır. Çalışan ayrıldığında aynı kartı yeni çalışana devredersiniz; kart artık yeni kişinin profilini açar. Şirket kartlarından “Bilgilerimi bırak” ile gelen kişiler şirkette kalır.",
        ],
      },
      {
        heading: "Otelde, kongrede, emlak ofisinde",
        list: [
          "Otel satış ekibi: acente ve kongre organizatörleriyle görüşmede kartı dokundurun, sunum ve salon bilgilerinizi PDF olarak paylaşın",
          "Kongre ve fuarlar: Antalya'nın kongre otellerinde ve ANFAŞ'ta düzenlenen etkinliklerde profil QR kodunu yaka kartına ve standa koyun",
          "Emlak danışmanları: yabancı alıcıya bağlantınızı WhatsApp'tan gönderin, “Hakkımda” yazısına İngilizce ya da Rusça kısa bir paragraf ekleyin",
          "Transfer ve tur firmaları: araçta ya da masada duran QR kodla misafir sizi rehberine kaydeder, dönüş transferi için WhatsApp'tan yazar",
        ],
        paragraphs: [
          "Analitik panelinde profilinizin hangi şehirlerden ve cihazlardan açıldığını görürsünüz; yurt dışındaki misafire gönderdiğiniz bağlantının açılıp açılmadığını buradan anlarsınız.",
        ],
      },
      {
        heading: "Antalya'ya sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Antalya'da fiziksel şubesi yoktur; siparişler online verilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Sezon başında hızlıca çok sayıda profile ihtiyaç duyarsanız kartsız dijital kartvizit 2 saat içinde e-postayla gelir. Ekip siparişlerinde 10 ve üzeri adette %20 indirim uygulanır.",
        ],
      },
    ],
    faq: [
      {
        q: "Yabancı misafirlerin telefonlarında çalışır mı?",
        a: "Evet. Profil, NFC'li iPhone ve Android telefonlarda dokundurunca, diğer telefonlarda sizin ekranınızdaki QR kodla tarayıcıda açılır. Uygulama gerekmez.",
      },
      {
        q: "Sezon bitince ayrılan çalışanın kartı ne olur?",
        a: "Ekip panelinden kartı yeni çalışana atarsınız; aynı fiziksel kart yeni kişinin profilini açar. Kart kaybolduysa panelden kapatırsınız.",
      },
      {
        q: "Profilimi farklı dillerde hazırlayabilir miyim?",
        a: "Ad, şirket ve iletişim bilgileri dilden bağımsızdır. “Hakkımda” yazısına ve belgelerinize istediğiniz dilde içerik ekleyebilirsiniz.",
      },
      {
        q: "Antalya'da NFC kartvizit nereden alınır?",
        a: "Siparişi bu siteden online verirsiniz. Dijivizit'in Antalya'da şubesi ya da teslim noktası yoktur; kartlar Antalya'nın tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "qr-kod-kartvizit",
      "dijital-kartvizit-nasil-olusturulur",
    ],
    siblings: [
      "dijital-kartvizit/izmir",
      "dijital-kartvizit/emlakci",
      "dijital-kartvizit/restoran-kafe",
      "dijital-kartvizit/istanbul",
    ],
  },
  {
    slug: "dijital-kartvizit/eskisehir",
    parent: PARENT,
    kind: "sehir",
    term: "Eskişehir",
    title: "Eskişehir NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Eskişehir'de NFC kartvizit ve dijital kartvizit: kartlarımız Eskişehir'de üretilir. Akademisyen, öğrenci ve sanayi için akıllı kartvizit; ücretsiz kargo.",
    h1: "Eskişehir'de NFC ve dijital kartvizit",
    lead: "Dijivizit kartları Eskişehir'de üretilir. Üniversiteleri, sanayisi ve genç nüfusuyla Eskişehir'de akademisyenden mühendise, esnaftan yeni mezuna kadar herkes için tek profil, tek kart.",
    sections: [
      {
        heading: "Eskişehir'de akıllı kartviziti kimler kullanır?",
        paragraphs: [
          "Eskişehir; Anadolu Üniversitesi, Eskişehir Osmangazi Üniversitesi ve Eskişehir Teknik Üniversitesi ile bir üniversite şehridir. Aynı zamanda raylı sistemler ve havacılık gibi alanlarda köklü bir sanayi geçmişine, geniş bir organize sanayi bölgesine sahiptir.",
          "Bu iki dünyanın kesiştiği yerde kartvizit ihtiyacı da çeşitlidir: akademisyenler konferanslarda, mühendisler tedarikçi görüşmelerinde, yeni mezunlar kariyer günlerinde, esnaf ve hizmet işletmeleri müşteriyle tanıştığında bilgi paylaşır.",
        ],
      },
      {
        heading: "Akademisyenler ve öğrenciler için",
        list: [
          "Akademisyenler: unvanınızı, bölümünüzü, ofis adresinizi ve özgeçmişinizi “Özgeçmiş” türünde PDF olarak ekleyin; kongrede sunumunuzun son slaytına QR kodunuzu koyun",
          "Yeni mezunlar ve son sınıf öğrencileri: kariyer günlerinde özgeçmişinizi ve LinkedIn profilinizi tek bağlantıda verin",
          "Teknoloji girişimleri: demo günlerinde yatırımcıya ve iş ortağına sunumunuzu PDF olarak profilden gösterin",
        ],
        paragraphs: [
          "Mezuniyet sonrası şehir ya da iş değiştirdiğinizde kartı yeniden bastırmazsınız; profili güncellersiniz. Fiziksel kart istemeyenler için kartsız dijital kartvizit aylık 59,90 TL'dir, yıllık 718,80 TL olarak peşin ödenir.",
        ],
      },
      {
        heading: "Sanayi ve hizmet işletmeleri için",
        paragraphs: [
          "Organize sanayi bölgesindeki firmalarda tedarikçi ziyareti ve satın alma görüşmesi gündelik iştir. Teknik dokümanınızı ve kataloğunuzu profile ekler, görüşmede kartı dokundurursunuz. Size verilen kâğıt kartvizitleri fotoğrafını çekerek kaydeder, her birine not ve takip hatırlatması eklersiniz.",
          "Kafe, restoran, kuaför ve butik gibi şehir merkezindeki işletmeler ise profil QR kodunu masaya, kasaya ya da vitrine koyar; müşteri Instagram'a, menüye ya da WhatsApp hattına tek dokunuşla ulaşır.",
        ],
      },
      {
        heading: "Eskişehir'e sipariş ve teslimat",
        paragraphs: [
          "Kartlar Eskişehir'de üretilse de Dijivizit'in mağazası ya da teslim noktası yoktur; siparişler bu siteden verilir ve Eskişehir'e de diğer şehirlere olduğu gibi kargoyla gönderilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Kartsız dijital kartvizit 2 saat içinde e-postanıza gelir. Bölüm, laboratuvar ya da şirket olarak 10 ve üzeri adette sipariş verirseniz %20 indirim uygulanır ve kartları ekip panelinden yönetirsiniz.",
        ],
      },
    ],
    faq: [
      {
        q: "Eskişehir'de NFC kartvizit nereden alınır?",
        a: "Bu siteden online sipariş verirsiniz. Dijivizit Odunpazarı'nda, Osmangazi Mah. Basın Şehitleri Cad. No:174 adresindedir ancak mağaza satışı ya da elden teslim yoktur; kartlar Eskişehir'e de ücretsiz kargoyla 72 saat içinde teslim edilir.",
      },
      {
        q: "Öğrenciler için uygun bir seçenek var mı?",
        a: "Kartsız dijital kartvizit aylık 59,90 TL'dir ve yıllık olarak ödenir; ahşap ve mat siyah PVC kartlar metal kartlardan daha uygun fiyatlıdır. Güncel fiyatlar Fiyatlar sayfasında yazar.",
      },
      {
        q: "Akademik özgeçmişimi ve yayın listemi ekleyebilir miyim?",
        a: "Evet. PDF olarak yüklersiniz; en fazla 10 belge, her biri 10 MB'a kadar.",
      },
      {
        q: "Bölüm olarak toplu sipariş verebilir miyiz?",
        a: "Evet. 10 ve üzeri adette %20 indirim uygulanır; kartlar ekip panelinden kişilere atanır.",
      },
    ],
    guides: [
      "ahsap-kartvizit",
      "ucretsiz-dijital-kartvizit",
      "dijital-kartvizit-nasil-olusturulur",
      "linktree-alternatifi",
    ],
    siblings: [
      "dijital-kartvizit/ankara",
      "dijital-kartvizit/bursa",
      "dijital-kartvizit/konya",
      "nfc-kartvizit",
    ],
  },
  {
    slug: "dijital-kartvizit/konya",
    parent: PARENT,
    kind: "sehir",
    term: "Konya",
    title: "Konya NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Konya'da NFC kartvizit ve dijital kartvizit: tarım makineleri, döküm ve gıda firmalarının bayi ve fuar görüşmeleri için akıllı kartvizit. Kargo ücretsiz.",
    h1: "Konya'da NFC ve dijital kartvizit",
    lead: "Konya'da satış çoğu zaman bayiye, çiftçiye ve fuara dayanır. Kataloğunuz ve iletişim bilgileriniz, kartınızı dokundurduğunuz ya da QR kodu okuttuğunuz an karşı tarafın telefonunda olsun; telefon eski de olsa.",
    sections: [
      {
        heading: "Konya'nın sanayisi ve bayi ağı",
        paragraphs: [
          "Konya; tarım makineleri, makine imalatı, döküm, otomotiv yan sanayi ve gıda üretimiyle İç Anadolu'nun büyük sanayi merkezlerindendir. Bu firmaların satışının önemli bir kısmı il ve ilçelerdeki bayiler, distribütörler ve doğrudan çiftçiler üzerinden yapılır.",
          "Bayi ağıyla çalışan firmalarda aynı katalog ve fiyat listesi yüzlerce kişiye ulaşmalıdır. Kâğıt katalog her fiyat değişikliğinde eskir. Dijital kartvizitte katalog ve fiyat listesi PDF olarak profildedir; değiştiğinde yenisini yüklersiniz, bayinin telefonundaki bağlantı güncel dosyayı açar.",
        ],
      },
      {
        heading: "Konya'da akıllı kartvizit her telefonda çalışmalı",
        paragraphs: [
          "Sahada karşılaştığınız herkesin telefonu yeni değildir, herkesin telefonunda NFC açık değildir. NFC çalışmazsa profilinizin QR kodunu kendi telefonunuzdan okutursunuz ya da linki paylaşırsınız; aynı profil açılır. Profil tarayıcıda açılır, uygulama indirmek gerekmez.",
          "“Rehberime Kaydet” düğmesi adınızı, firmanızı, bütün telefonlarınızı ve adresinizi tek seferde rehbere ekler. Bayi sahibi numaranızı elle yazmak zorunda kalmaz; servis ve yedek parça hattınızı ayrı, etiketli satırlarda görür.",
        ],
      },
      {
        heading: "KTO Tüyap Konya Fuar Merkezi ve fuar dönemi",
        list: [
          "Konya'daki tarım, makine ve sanayi fuarlarının önemli bir kısmı KTO Tüyap Konya Fuar Merkezi'nde düzenlenir",
          "Stand panosuna ve ürün föylerine profil QR kodunuzu koyun; ziyaretçi kataloğu standdan ayrılmadan açar",
          "Ziyaretçiler “Bilgilerimi bırak” ile ad, telefon ve “Bayilik için bilgi istiyorum” gibi bir not bırakır",
          "Fuarda aldığınız kâğıt kartvizitleri fotoğrafını çekerek kaydedin, her birine takip hatırlatması kurun",
        ],
        paragraphs: [
          "Analitik panelinde profilinizin hangi şehirlerden açıldığını görürsünüz; fuardan sonra ilginin hangi bölgelerden geldiğini izlersiniz.",
        ],
      },
      {
        heading: "Konya'ya sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Konya'da fiziksel şubesi yoktur; siparişler online verilir ve kartlar ücretsiz kargoyla gönderilir. Kartlar 72 saat içinde teslim edilir.",
          "Satış ve bayi ekipleri için ekip paneli vardır; temsilci değiştiğinde kart yeni temsilciye devredilir. 10 ve üzeri adette %20 indirim uygulanır. Kartsız dijital kartvizit 2 saat içinde e-postanıza gelir.",
        ],
      },
    ],
    faq: [
      {
        q: "NFC'si olmayan telefonlarda çalışır mı?",
        a: "Evet. Profilinizin QR kodunu kendi telefonunuzdan okutabilir ya da linki paylaşabilirsiniz; aynı profil açılır.",
      },
      {
        q: "Bayilerimize fiyat listesini nasıl güncel tutarız?",
        a: "Fiyat listesini PDF olarak profile eklersiniz; fiyat değiştiğinde panelden yeni dosyayı yüklersiniz. Bayilerdeki bağlantı ve QR kod aynı kalır, yeni listeyi açar.",
      },
      {
        q: "Konya'da NFC kartvizit nereden alınır?",
        a: "Siparişi bu siteden online verirsiniz. Dijivizit'in Konya'da teslim noktası yoktur; kartlar Konya'nın tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Servis ve satış numaralarını ayrı gösterebilir miyim?",
        a: "Evet. Her numarayı ayrı telefon satırı olarak ekleyip “Satış”, “Servis”, “Yedek parça” gibi etiketler verebilirsiniz.",
      },
    ],
    guides: [
      "nfc-kartvizit-hangi-telefonlarda-calisir",
      "qr-kod-kartvizit",
      "kurumsal-dijital-kartvizit",
      "telefonda-nfc-nasil-acilir",
    ],
    siblings: [
      "dijital-kartvizit/ankara",
      "dijital-kartvizit/eskisehir",
      "dijital-kartvizit/satis-temsilcisi",
      "nfc-kartvizit",
    ],
  },
  {
    slug: "dijital-kartvizit/kocaeli",
    parent: PARENT,
    kind: "sehir",
    term: "Kocaeli",
    title: "Kocaeli NFC Kartvizit ve Dijital Kartvizit | Dijivizit",
    description:
      "Kocaeli'de NFC kartvizit ve dijital kartvizit: Gebze ve İzmit'teki fabrikalarda dokundurun, teknik doküman profilde. Ekip paneliyle akıllı kartvizit.",
    h1: "Kocaeli'de NFC ve dijital kartvizit",
    lead: "Kocaeli'de günler fabrika ziyaretleri, tedarikçi denetimleri ve satın alma toplantılarıyla geçer. Güvenlikte kimlik bırakır gibi kolay: kartı dokundurun, bilgileriniz ve teknik dokümanınız karşı tarafın telefonuna geçsin.",
    sections: [
      {
        heading: "Kocaeli sanayisinde akıllı kartvizit",
        paragraphs: [
          "Kocaeli; otomotiv, kimya ve petrokimya, metal, lastik ve plastik gibi sektörlerde Türkiye'nin en yoğun sanayi bölgelerindendir. Körfez boyunca sıralanan limanlar lojistiği, Gebze'deki organize sanayi bölgeleri ve teknoloji alanları ise üretimi ve Ar-Ge'yi taşır.",
          "Bu yoğunlukta bir mühendis, satın almacı ya da satış temsilcisi aynı hafta içinde Gebze'de, Dilovası'nda ve İzmit'te farklı tesislere gidebilir. Her ziyarette birkaç yeni kişiyle tanışır; kartvizitin hızlı ve güncel olması bu yüzden önemlidir.",
        ],
      },
      {
        heading: "Fabrika ziyaretinde ve denetimde",
        list: [
          "Teknik doküman, ürün föyü ve kalite belgelerinizi PDF olarak profile ekleyin; toplantıda ekrandan gösterin",
          "Satış, teknik destek ve lojistik için ayrı, etiketli telefon satırları kullanın",
          "Satın alma biriminin cari kart açması için fatura bilgilerinizi ekleyin; siz açmadıkça görünmez",
          "Size verilen kâğıt kartvizitlerin fotoğrafını çekin; ad, unvan, şirket ve telefon otomatik okunur",
          "Denetim sonrası düzeltici faaliyet ya da teklif için tarih seçip hatırlatma kurun",
        ],
        paragraphs: [
          "Toplantı odasında telefonlar çoğu zaman masadadır; kartı dokundurmak, kartvizit uzatmaktan daha kısa sürer. NFC'si kapalı telefonlarda profilinizin QR kodunu kendi ekranınızdan okutursunuz.",
        ],
      },
      {
        heading: "Kocaeli Fuar Merkezi ve sektör buluşmaları",
        paragraphs: [
          "İzmit'teki Kocaeli Fuar Merkezi sanayi, inşaat ve sektör fuarlarına ev sahipliği yapar; Kocaeli'deki firmaların çoğu İstanbul'daki büyük fuarlara da katılır. Fuarda profil QR kodunuzu standa ve broşürlere koyar, ziyaretçinin “Bilgilerimi bırak” ile bıraktığı bilgileri panelinizde toplarsınız.",
          "Analitik panelinde fuar boyunca profillerin kaç kez açıldığını, ziyaretçilerin hangi belgelere dokunduğunu ve kaç kişinin sizi rehberine kaydettiğini görürsünüz.",
        ],
      },
      {
        heading: "Kocaeli'ye sipariş ve teslimat",
        paragraphs: [
          "Dijivizit'in Kocaeli'de fiziksel şubesi yoktur; siparişler online verilir. Kartlar 72 saat içinde ücretsiz kargoyla teslim edilir.",
          "Çok sayıda çalışanı olan firmalar kartları ekip panelinden yönetir: çalışan ayrıldığında ya da başka tesise geçtiğinde kart yeni kişiye devredilir, kaybolan kart panelden kapatılır. 10 ve üzeri adette %20 indirim uygulanır.",
        ],
      },
    ],
    faq: [
      {
        q: "Kocaeli'de NFC kartvizit nereden alınır?",
        a: "Siparişi bu siteden online verirsiniz. Dijivizit'in Kocaeli'de teslim noktası yoktur; kartlar Gebze'den Kandıra'ya Kocaeli'nin tüm ilçelerine ücretsiz kargoyla gönderilir.",
      },
      {
        q: "Şirket logomuz ve kurumsal renklerimiz kullanılabilir mi?",
        a: "10 ve üzeri adetteki kurumsal siparişlerde logonuz kartın yüzeyine işlenir; metal ve ahşapta bu iş lazerle yapılır. Kart altı kaplamadan biridir: mat siyah PVC, mat siyah metal, gümüş, gold, koyu ahşap ya da açık ahşap.",
      },
      {
        q: "Çalışan ayrıldığında kartı ne yaparız?",
        a: "Ekip panelinden kartı yeni çalışana atarsınız; aynı kart yeni kişinin profilini açar. Kart geri alınamadıysa panelden kapatırsınız.",
      },
      {
        q: "Profildeki belgelerin boyut sınırı var mı?",
        a: "Her PDF en fazla 10 MB olabilir; profile en fazla 10 belge eklenir.",
      },
    ],
    guides: [
      "kurumsal-dijital-kartvizit",
      "metal-kartvizit",
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
      "akilli-kartvizit-nedir",
    ],
    siblings: [
      "dijital-kartvizit/istanbul",
      "dijital-kartvizit/bursa",
      "dijital-kartvizit/satis-temsilcisi",
      "nfc-kartvizit",
    ],
  },
];

export const SEGMENTS: Landing[] = [
  ...BASE_SEGMENTS.filter((s) => s.kind === "meslek"),
  ...MORE_MESLEK,
  ...BASE_SEGMENTS.filter((s) => s.kind === "sehir"),
  ...MORE_SEHIR,
];

export function getSegment(segment: string): Landing | undefined {
  return SEGMENTS.find((s) => s.slug === `dijital-kartvizit/${segment}`);
}
