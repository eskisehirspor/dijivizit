/**
 * Legal texts shown under /yasal. Kept as data so the pages, the footer links
 * and the signup consent all point at the same versions.
 *
 * DRAFT: written from what the code actually collects (see the inventory in
 * each section). Have a lawyer review before relying on it, and fill in the
 * company details in LEGAL_ENTITY.
 */

import { CONTACT } from "@/lib/contact";
import { PROMISES } from "@/lib/orders/finishes";

export const LEGAL_ENTITY = {
  /** Dijivizit is a brand of this company (seller and data controller). */
  name: "ASD Tasarım Ltd. Şti. (Dijivizit)",
  taxNumber: "0860443493",
  address: `${CONTACT.street}, ${CONTACT.district} / ${CONTACT.city}`,
  email: "merhaba@dijivizit.com",
} as const;

/** Bump when a text changes materially; stored with each signup's consent. */
export const LEGAL_VERSION = "2026-11-03";

export type LegalSlug = "kvkk" | "gizlilik" | "kullanim-kosullari" | "teslimat-ve-iade";

export type LegalSection = { heading: string; paragraphs?: string[]; items?: string[] };

export type LegalDocument = {
  slug: LegalSlug;
  title: string;
  summary: string;
  sections: LegalSection[];
};

const contact = `${LEGAL_ENTITY.name}, ${LEGAL_ENTITY.address} — ${LEGAL_ENTITY.email}`;

export const LEGAL_DOCUMENTS: Record<LegalSlug, LegalDocument> = {
  kvkk: {
    slug: "kvkk",
    title: "KVKK Aydınlatma Metni",
    summary:
      "6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi uyarınca, kişisel verilerinizin nasıl işlendiğine dair bilgilendirme.",
    sections: [
      {
        heading: "Veri sorumlusu",
        paragraphs: [`Kişisel verileriniz veri sorumlusu sıfatıyla ${contact} tarafından işlenir.`],
      },
      {
        heading: "Hangi verileri işliyoruz",
        paragraphs: ["Hesap sahipleri için:"],
        items: [
          "Kimlik ve iletişim: ad soyad, e-posta adresi, kartınıza eklediğiniz telefon, adres ve bağlantılar",
          "Mesleki bilgiler: unvan, şirket, hakkında metni, yetenekler, yüklediğiniz belgeler (ör. özgeçmiş)",
          "Görsel: profil fotoğrafınız (Google ile girişte Google profil fotoğrafınız)",
          "Finansal: kartınızda göstermek üzere girdiğiniz IBAN ve banka bilgisi, fatura unvanı, vergi numarası ve vergi dairesi",
          "Hesap güvenliği: şifrenizin geri döndürülemez özeti, giriş zamanları, kullandığınız davet kodu",
        ],
      },
      {
        heading: "Kart ziyaretçileri için",
        paragraphs: [
          "Bir Dijivizit kartını görüntüleyen ziyaretçilerin adı veya iletişim bilgisi alınmaz. Kart sahibine istatistik sunmak için tarayıcıda rastgele bir ziyaretçi kimliği saklanır ve görüntüleme ile tıklama (ör. telefon, WhatsApp, rehbere kaydet) olayları bu kimlikle kaydedilir. Bu olaylarla birlikte IP adresinden yaklaşık olarak bulunan ülke ve şehir, cihaz türü (iPhone, Android, bilgisayar) ve kartın hangi siteden açıldığı da kaydedilir; IP adresinin kendisi saklanmaz.",
          'Ziyaretçi kartta "Bilgilerimi bırak" formunu kendi isteğiyle doldurursa; ad soyad, telefon ve/veya e-posta, varsa şirket ve mesaj yalnızca o kartın sahibine iletilir ve sahibinin kişi listesinde saklanır. Bu verilerin veri sorumlusu kart sahibidir; Dijivizit bu verileri kart sahibi adına barındıran veri işleyendir.',
        ],
      },
      {
        heading: "Sipariş talebi gönderenler için",
        paragraphs: [
          "dijivizit.com üzerindeki sipariş formunda ad soyad, telefon, e-posta, seçtiğiniz kaplama, adet ve notunuz alınır. Bu bilgiler talebinize dönüş yapmak, teklif ve sipariş sürecini yürütmek için kullanılır.",
        ],
      },
      {
        heading: "İşleme amaçları ve hukuki sebepler",
        items: [
          "Hesabınızı oluşturmak ve dijital kartvizit hizmetini sunmak — sözleşmenin kurulması ve ifası (KVKK m. 5/2-c)",
          "Kartınızı sizin seçtiğiniz bilgilerle herkese açık yayınlamak — sözleşmenin ifası ve bilgileri bizzat alenileştirmeniz (m. 5/2-c, 5/2-d)",
          "Hesap güvenliği, kötüye kullanımın önlenmesi, davet sisteminin işletilmesi — meşru menfaat (m. 5/2-f)",
          "Kart görüntüleme istatistikleri — meşru menfaat (m. 5/2-f)",
          "Sipariş talebinize dönüş yapmak ve satış öncesi görüşme — bir sözleşmenin kurulması (m. 5/2-c)",
          "Tanıtım sitesinde ölçüm ve reklam performansı — yalnızca çerez bildiriminde verdiğiniz açık rıza (m. 5/1)",
          "Yasal yükümlülükler ve olası uyuşmazlıklar — hukuki yükümlülük ve hakkın tesisi (m. 5/2-ç, 5/2-e)",
        ],
      },
      {
        heading: "Aktarım ve yurt dışı",
        paragraphs: [
          "Hizmeti sunabilmek için verileriniz aşağıdaki altyapı sağlayıcılarında barındırılır ve işlenir. Bu sağlayıcıların sunucuları yurt dışında bulunduğundan, verileriniz KVKK m. 9 kapsamında, sağlayıcılarla imzalanan ve Kişisel Verileri Koruma Kurulu'na bildirilen standart sözleşmeler çerçevesinde yurt dışına aktarılmaktadır:",
        ],
        items: [
          "Supabase (veritabanı, dosya depolama, kimlik doğrulama) — Singapur",
          "Cloudflare (web sunucusu, güvenlik ve kötüye kullanım önleme) — küresel ağ, ABD merkezli",
          "Resend (davet, sipariş ve bildirim e-postaları) — ABD",
          "Anthropic (yalnızca kartvizit tarama özelliğini kullandığınızda, fotoğraftaki bilgileri okumak için; fotoğraf saklanmaz) — ABD",
          "Google (Google ile giriş yaparsanız; tanıtım sitesinde yalnızca onay verirseniz Google Analytics ve Google Ads)",
          "Meta Platforms (tanıtım sitesinde yalnızca onay verirseniz Meta Pikseli; Facebook ve Instagram reklamlarının sonucunu ölçmek için)",
        ],
      },
      {
        heading: "Saklama süresi",
        paragraphs: [
          "Verileriniz hesabınız açık olduğu sürece saklanır. Hesabınızı Ayarlar sayfasından sildiğinizde profiliniz, bağlantılarınız, belgeleriniz, banka ve fatura bilgileriniz, kişi listeniz ile kartınıza ait istatistikler kalıcı olarak silinir.",
        ],
        items: [
          "Kart görüntüleme ve tıklama kayıtları: en fazla 13 ay, sonra otomatik silinir.",
          "Kart sahibine bırakılan iletişim bilgileri: kart sahibi silene veya hesabını kapatana kadar.",
          "Sipariş talepleri: talep sonuçlandıktan sonra en fazla 2 yıl; satışa dönüşen talepler için kanuni saklama süreleri (ör. Türk Ticaret Kanunu ve Vergi Usul Kanunu kapsamında 10 yıl).",
          "Güvenlik amaçlı sunucu kayıtları: en fazla 30 gün.",
        ],
      },
      {
        heading: "Haklarınız",
        paragraphs: [
          "KVKK m. 11 uyarınca; verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, işleme amacını öğrenme, aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, silinmesini isteme, itiraz etme ve zarara uğramanız hâlinde tazminat talep etme haklarına sahipsiniz.",
        ],
        items: [
          `Başvurularınızı ${LEGAL_ENTITY.email} adresine iletebilirsiniz. Talebiniz en geç 30 gün içinde ücretsiz olarak yanıtlanır.`,
          "Profil bilgilerinizi istediğiniz zaman panelden düzenleyebilir, hesabınızı Ayarlar sayfasından silebilirsiniz.",
          "Bir ekibe katıldığınızda ekip yöneticileri adınızı, e-posta adresinizi, size atanan şirket kartlarının görüntülenme sayılarını ve bu kartlardan bırakılan iletişim bilgilerini görebilir. Kişisel kartlarınızın verilerini göremez.",
        ],
      },
    ],
  },
  gizlilik: {
    slug: "gizlilik",
    title: "Gizlilik ve Çerez Politikası",
    summary:
      "Dijivizit'i kullanırken neyi topladığımız, neyi toplamadığımız ve çerezleri nasıl kullandığımız.",
    sections: [
      {
        heading: "Kısaca",
        items: [
          "Kartınızda yalnızca sizin eklediğiniz ve yayınladığınız bilgiler görünür.",
          "Verilerinizi satmayız, reklam için kullanmayız.",
          "Kart ziyaretçilerinin kimliğini toplamayız; yalnızca anonim görüntüleme ve tıklama sayıları tutulur. Ziyaretçi bilgilerini yalnızca kendi isteğiyle formu doldurursa kart sahibine bırakır.",
          "Gizli olarak işaretlediğiniz bağlantı ve belgeler ile yayında olmayan kartlar herkese açık değildir.",
        ],
      },
      {
        heading: "Herkese açık kart",
        paragraphs: [
          "Kartınızı yayınladığınızda, karta eklediğiniz bilgiler kart adresini bilen herkes tarafından görülebilir ve rehbere kaydedilebilir. IBAN ve fatura bilgilerinizi kartta göstermek istemiyorsanız panelden gizleyebilir veya silebilirsiniz. Kartınızı yayından kaldırdığınızda kart adresi artık açılmaz.",
        ],
      },
      {
        heading: "Belgeler",
        paragraphs: [
          "Yüklediğiniz belgeler herkese açık bir klasörde değil, erişimi kısıtlı bir depoda tutulur. Ziyaretçiler belgeye yalnızca kartınız yayındayken ve belge görünürken, kısa süre geçerli bir bağlantıyla erişebilir.",
        ],
      },
      {
        heading: "Çerezler ve tarayıcı depolama",
        items: [
          "Oturum çerezleri: giriş yaptığınızda oturumunuzu sürdürmek için zorunlu çerezler kullanılır. Bunlar olmadan panel çalışmaz.",
          "Ziyaretçi kimliği: kart sayfasında, aynı ziyaretçinin tekrar eden görüntülemelerini ayırt etmek için tarayıcı depolamasında rastgele bir kimlik saklanır. Kişisel bilgi içermez ve tarayıcınızdan silebilirsiniz.",
          "Tanıtım sitesi (dijivizit.com): yalnızca çerez bildiriminde onay verirseniz Google Analytics, Google Ads ve Meta Pikseli (Facebook, Instagram) ölçüm çerezleri kullanılır. Ziyaret ettiğiniz sayfalar ve sipariş talebi gibi işlemler anonim olarak ölçülür. Onay vermezseniz bu çerezler yüklenmez; tercihinizi tarayıcı depolamasını silerek değiştirebilirsiniz.",
          "Kart sayfalarında ve panelde reklam, yeniden hedefleme veya üçüncü taraf takip çerezi kullanılmaz.",
        ],
      },
      {
        heading: "Güvenlik",
        paragraphs: [
          "Bağlantılar HTTPS ile şifrelenir, şifreler geri döndürülemez şekilde saklanır ve her kullanıcı yalnızca kendi verilerine erişebilir.",
        ],
      },
      {
        heading: "İletişim",
        paragraphs: [
          `Sorularınız için: ${LEGAL_ENTITY.email}. Ayrıntılı bilgi için KVKK Aydınlatma Metni'ne bakabilirsiniz.`,
        ],
      },
    ],
  },
  "kullanim-kosullari": {
    slug: "kullanim-kosullari",
    title: "Kullanım Koşulları",
    summary: "Dijivizit hesabı açarak kabul ettiğiniz kurallar.",
    sections: [
      {
        heading: "Hizmet",
        paragraphs: [
          "Dijivizit; NFC kart, QR kod ve bağlantı ile paylaşılabilen dijital kartvizit sayfaları oluşturmanızı sağlar. Kayıt şu an davet koduyla yapılmaktadır.",
        ],
      },
      {
        heading: "Hesabınız",
        items: [
          "Kayıt olurken doğru bilgi vermeyi ve hesabınızın güvenliğini korumayı kabul edersiniz.",
          "Davet kodları kişiseldir; başkasıyla paylaşılması veya satılması yasaktır.",
          "Hesabınızı dilediğiniz zaman Ayarlar sayfasından silebilirsiniz.",
        ],
      },
      {
        heading: "İçerik",
        items: [
          "Kartınıza eklediğiniz bilgi ve belgelerden siz sorumlusunuz; bunları paylaşma hakkına sahip olduğunuzu kabul edersiniz.",
          "Başkasını taklit eden, yanıltıcı, hukuka aykırı veya üçüncü kişilerin haklarını ihlal eden içerik yayınlanamaz.",
          "Bu kurallara aykırı içerik içeren kartları yayından kaldırma ve hesapları askıya alma hakkımız saklıdır.",
        ],
      },
      {
        heading: "Sorumluluk",
        paragraphs: [
          "Hizmeti kesintisiz ve hatasız sunmak için çalışırız, ancak olduğu gibi sunulur. Yasal olarak izin verilen ölçüde, hizmetin kullanımından doğan dolaylı zararlardan sorumlu değiliz.",
        ],
      },
      {
        heading: "Değişiklikler",
        paragraphs: [
          "Bu koşulları güncelleyebiliriz. Önemli değişikliklerde e-posta ile veya panelde bilgilendirme yaparız.",
        ],
      },
      {
        heading: "Uygulanacak hukuk",
        paragraphs: [`Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. İletişim: ${contact}.`],
      },
    ],
  },
  "teslimat-ve-iade": {
    slug: "teslimat-ve-iade",
    title: "Teslimat ve İade Koşulları",
    summary:
      "Kart ve kartsız dijital kartvizit siparişlerinde teslimat süresi, değişim, cayma hakkı ve iade. 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği'ne göre hazırlanmıştır.",
    sections: [
      {
        heading: "Satıcı",
        paragraphs: [
          `${LEGAL_ENTITY.name}, ${LEGAL_ENTITY.address}. Vergi numarası: ${LEGAL_ENTITY.taxNumber}. Telefon: ${CONTACT.phoneDisplay}. E-posta: ${CONTACT.orderEmail}.`,
          "Online ödemeler Shopier üzerinden alınır. Ön bilgilendirme formu ve mesafeli satış sözleşmesi ödeme sırasında size sunulur; bu sayfa o metinleri tamamlar.",
        ],
      },
      {
        heading: "Teslimat",
        items: [
          `Kartlar siparişten itibaren ${PROMISES.deliveryHours} saat içinde Türkiye'nin her yerine ücretsiz kargoyla teslim edilir. Kargo takip bilgisi e-posta ya da WhatsApp ile iletilir.`,
          `Kartsız dijital kartvizitte kayıt bağlantınız ödemeden sonra ${PROMISES.digitalDeliveryHours} saat içinde e-posta adresinize gönderilir.`,
          "Resmî tatiller, kargo firmasından kaynaklanan gecikmeler ve mücbir sebepler bu süreleri uzatabilir; böyle bir durumda sizi hemen bilgilendiririz. Teslimat yasal olarak en geç 30 gün içinde yapılır.",
          "Paket hasarlı geldiyse kargo görevlisine tutanak tutturun ve bize fotoğrafıyla yazın; yenisini ücretsiz göndeririz.",
        ],
      },
      {
        heading: "Kart okunmazsa ücretsiz değişim",
        paragraphs: [
          "Kartınız NFC ya da QR ile okunmuyorsa bize yazın. Sorunu birlikte kontrol ederiz; karttan kaynaklanıyorsa kargo dahil ücretsiz yenisini göndeririz.",
        ],
      },
      {
        heading: "Cayma hakkı (14 gün)",
        items: [
          "Kart siparişlerinde, kartı teslim aldığınız günden itibaren 14 gün içinde hiçbir gerekçe göstermeden ve cezai şart ödemeden sözleşmeden cayabilirsiniz.",
          "Kartsız dijital kartvizitte cayma süresi ödeme gününden itibaren 14 gündür.",
          `Cayma bildiriminizi ${CONTACT.orderEmail} adresine e-postayla ya da ${CONTACT.phoneDisplay} numarasına WhatsApp'tan yazılı olarak iletmeniz yeterlidir. Sipariş numaranızı eklemeniz işlemi hızlandırır.`,
          "Kartı, cayma bildiriminizden itibaren 10 gün içinde size ileteceğimiz anlaşmalı kargo koduyla geri gönderin; bu yolla yapılan iadelerde kargo ücretini biz öderiz.",
          "Kart, kullanım ve inceleme için olağan olanın dışında hasar görmüşse değer kaybı oranında kesinti yapılabilir.",
        ],
      },
      {
        heading: "Ücret iadesi",
        paragraphs: [
          "Cayma bildiriminiz bize ulaştıktan sonra en geç 14 gün içinde ödediğiniz tutarın tamamını, ödemeyi yaptığınız yöntemle iade ederiz. Kartınıza yansıma süresi bankanıza göre değişebilir.",
        ],
      },
      {
        heading: "Cayma hakkının kullanılamadığı durumlar",
        items: [
          "Firma logonuzla kişiye özel üretilen kurumsal kartlar, Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi uyarınca tüketicinin istekleri doğrultusunda hazırlanan mal olduğundan cayma hakkı kapsamında değildir. Bu kartlarda da okunmama ve üretim hatası durumunda ücretsiz değişim geçerlidir.",
          "Standart Dijivizit kartları kişiye özel üretilmez; bu kartlarda cayma hakkı her zaman geçerlidir.",
        ],
      },
      {
        heading: "Abonelik ve yenileme",
        paragraphs: [
          "Kartsız dijital kartvizit yıllık olarak peşin ödenir; otomatik yenileme ve otomatik çekim yapılmaz. Kartla birlikte gelen dijital profil ilk yıl ücretsizdir.",
        ],
      },
      {
        heading: "Şikâyet ve uyuşmazlık",
        paragraphs: [
          `Her türlü talep ve şikâyetiniz için ${CONTACT.orderEmail} adresine yazabilirsiniz. Uyuşmazlıklarda, Ticaret Bakanlığı'nca her yıl ilan edilen parasal sınırlar içinde yerleşim yerinizdeki ya da işlemi yaptığınız yerdeki Tüketici Hakem Heyeti'ne, bu sınırların üzerinde Tüketici Mahkemesi'ne başvurabilirsiniz.`,
        ],
      },
    ],
  },
};

export const LEGAL_SLUGS = Object.keys(LEGAL_DOCUMENTS) as LegalSlug[];
