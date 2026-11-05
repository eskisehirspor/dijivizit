/**
 * Free tools at dijivizit.com/<slug>. Each targets a "... oluştur" search, gives
 * something useful for free (a working vCard QR code) and offers the card-less
 * digital business card (59,90 TL a month) as the next step.
 */
import { FREE_PERIOD, PAPER_PACK_SIZE } from "@/lib/marketing/card-cost";
import { FINISHES, PRICING, formatTry } from "@/lib/orders/finishes";

const PVC_PRICE = FINISHES.find((f) => f.material === "pvc")!.price;

export type Tool = {
  slug: string;
  /** Short name for links and breadcrumbs. */
  term: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  sections: { heading: string; paragraphs?: string[]; list?: string[] }[];
  faq: { q: string; a: string }[];
  guides: string[];
};

export const TOOLS: Tool[] = [
  {
    slug: "qr-kartvizit-olustur",
    term: "QR kartvizit oluştur",
    title: "QR Kartvizit Oluştur: Ücretsiz Kartvizit QR Kodu | Dijivizit",
    description:
      "Ücretsiz QR kartvizit oluşturucu: adını, telefonunu ve e-postanı yaz, okutulunca rehbere kaydedilen kartvizit QR kodunu PNG olarak indir. Üyelik gerekmez.",
    h1: "QR kartvizit oluştur",
    lead: "Bilgilerini yaz, QR kodun anında hazır. Okutan kişinin telefonu seni doğrudan rehberine kaydeder. Ücretsiz, üyelik yok, bilgilerin bize gönderilmez.",
    sections: [
      {
        heading: "Nasıl kullanılır?",
        list: [
          "Ad soyad, unvan, şirket, telefon, e-posta ve web siteni yaz.",
          "Sağdaki QR kod sen yazdıkça güncellenir; telefonunla okutup dene.",
          "QR kodu PNG olarak indir; kâğıt kartvizitine, broşürüne, sunumuna ya da e-posta imzana ekle.",
        ],
      },
      {
        heading: "QR kartvizit nasıl çalışır?",
        paragraphs: [
          'Bu araç bilgilerini vCard biçiminde QR koda yazar. vCard, iPhone ve Android rehberlerinin tanıdığı standart kişi kartıdır. QR kodu kamerayla okutan kişiye "Kişiyi ekle" seçeneği çıkar; bilgilerin tek dokunuşla rehbere kaydedilir.',
          "QR kod tamamen tarayıcında oluşturulur. Yazdığın bilgiler sunucumuza gönderilmez ve saklanmaz.",
        ],
      },
      {
        heading: "Statik QR mı, dijital kartvizit mi?",
        paragraphs: [
          "Buradan indirdiğin QR kod statiktir: bilgilerin kodun içine yazılır. Numaran ya da unvanın değişirse yeni kod üretip yeniden bastırman gerekir; kaç kişinin okuttuğunu da göremezsin.",
          "Dijital kartvizitte QR kod bir profil linkine gider. Bilgilerini panelden değiştirirsin, QR hiç değişmez. Profil fotoğraf, WhatsApp, sosyal medya, konum ve belgeleri de taşır; kaç kez açıldığını ve hangi şehirlerden görüntülendiğini görürsün.",
        ],
      },
    ],
    faq: [
      {
        q: "QR kartvizit oluşturmak ücretsiz mi?",
        a: "Evet. Bu sayfadaki QR kod ücretsizdir ve süresiz çalışır; üyelik ya da e-posta istemez.",
      },
      {
        q: "QR kod iPhone ve Android'de çalışır mı?",
        a: "Evet. Kamerayla okutulduğunda iPhone ve Android telefonlar kişi kartını tanır ve rehbere ekleme seçeneği sunar.",
      },
      {
        q: "Bilgilerim değişirse ne yapmalıyım?",
        a: "Statik QR kodda yeni bir kod üretmen gerekir. Bilgilerin sık değişiyorsa dijital kartvizit daha uygundur: QR aynı kalır, profilini güncellersin.",
      },
      {
        q: "QR kodu kartvizitime ne boyutta basmalıyım?",
        a: "Kenarı en az 2 cm olacak şekilde basmanı öneririz. İndirdiğin PNG yüksek çözünürlüklüdür, baskıda bozulmaz.",
      },
    ],
    guides: ["qr-kod-kartvizit", "dijital-kartvizit-nedir", "nfc-kartvizit-mi-kagit-kartvizit-mi"],
  },
  {
    slug: "dijital-kartvizit-olustur",
    term: "Dijital kartvizit oluştur",
    title: "Dijital Kartvizit Oluştur: Online, Uygulamasız | Dijivizit",
    description:
      "Dijital kartvizit oluştur: bilgilerini yaz, profilinin telefonda nasıl görüneceğini anında gör, QR kodunu ücretsiz indir. Link + QR dijital kartvizit aylık 59,90 TL.",
    h1: "Dijital kartvizit oluştur",
    lead: "Bilgilerini yaz, dijital kartvizitinin telefonda nasıl görüneceğini hemen gör. Rehbere kaydeden QR kodu ücretsiz indir; hazır olduğunda profilini link ve QR koduyla yayına al.",
    sections: [
      {
        heading: "Üç adımda dijital kartvizit",
        list: [
          "Bilgilerini yaz: ad, unvan, şirket, telefon, e-posta ve web sitesi.",
          "Önizlemede profilinin nasıl göründüğüne bak; QR kodu okutup dene.",
          "Yayına al: link ve QR kodun 2 saat içinde e-postanda olur.",
        ],
      },
      {
        heading: "Yayına aldığında neler olur?",
        list: [
          "Profilin uygulama gerekmeden her telefonun tarayıcısında açılır.",
          "Karşındaki kişi seni tek dokunuşla rehberine kaydeder.",
          "Fotoğraf, WhatsApp, sosyal medya, konum, IBAN ve belgeler ekleyebilirsin.",
          'Ziyaretçi "Bilgilerimi bırak" ile kendi numarasını sana iletir.',
          "Profilinin kaç kez açıldığını, hangi şehirlerden ve cihazlardan görüntülendiğini görürsün.",
          "Bilgilerin değişince panelden güncellersin; link ve QR aynı kalır.",
        ],
      },
      {
        heading: "Ne kadar?",
        paragraphs: [
          "Kartsız dijital kartvizit aylık 59,90 TL'dir ve yıllık 718,80 TL olarak peşin ödenir. Kart, kargo ya da kurulum ücreti yoktur. İstediğin zaman PVC, metal ya da ahşap NFC karta geçebilirsin; link ve QR kodun aynı kalır.",
        ],
      },
    ],
    faq: [
      {
        q: "Dijital kartvizit oluşturmak için uygulama gerekir mi?",
        a: "Hayır. Ne senin ne de karşındakinin uygulama indirmesi gerekir; profil tarayıcıda açılır.",
      },
      {
        q: "Ücretsiz dijital kartvizit var mı?",
        a: "Bu sayfada rehbere kaydeden QR kodunu ücretsiz indirebilirsin. Güncellenebilen profil, link, analitik ve bilgi bırakma formu dijital kartvizitte aylık 59,90 TL'dir.",
      },
      {
        q: "Dijital kartvizitim ne zaman hazır olur?",
        a: "Siparişten sonra link ve QR kodun 2 saat içinde e-postana gönderilir.",
      },
      {
        q: "Profil linkim adımı içerir mi?",
        a: "Hayır. Gizliliğin için profil adresin rastgele bir kod içerir; linki bilmeyen biri profilini tahmin edemez.",
      },
    ],
    guides: [
      "dijital-kartvizit-nasil-olusturulur",
      "dijital-kartvizit-nedir",
      "en-iyi-dijital-kartvizit-nasil-secilir",
    ],
  },
  {
    slug: "e-posta-imzasi-olustur",
    term: "E-posta imzası oluştur",
    title: "E-posta İmzası Oluştur: Ücretsiz HTML İmza | Dijivizit",
    description:
      "Ücretsiz e-posta imzası oluşturucu: adını, unvanını ve iletişim bilgilerini yaz, Gmail, Outlook ve Apple Mail'de çalışan HTML imzayı tek tıkla kopyala.",
    h1: "E-posta imzası oluştur",
    lead: "Bilgilerini yaz, imzan anında hazır. Kopyala, Gmail, Outlook ya da Apple Mail'in imza alanına yapıştır. Ücretsiz, üyelik yok, bilgilerin bize gönderilmez.",
    sections: [
      {
        heading: "İyi bir e-posta imzasında ne olmalı?",
        list: [
          "Ad soyad ve unvan: karşındaki kiminle yazıştığını hemen anlasın.",
          "Şirket adı ve web sitesi.",
          "Tek bir telefon numarası; tıklanınca arama başlar.",
          "İsteğe bağlı bir bağlantı: dijital kartvizitin, randevu sayfan ya da portfolyon.",
          "Hepsi bu. Uzun yasal metinler, alıntılar ve beş ayrı logo imzayı okunmaz yapar.",
        ],
      },
      {
        heading: "Bu imza neden her programda düzgün görünür?",
        paragraphs: [
          "E-posta programları web sayfalarının kullandığı modern düzenleri desteklemez. Bu araç imzayı tablolarla ve satır içi stillerle kurar; Gmail, Outlook (yeni, klasik ve web) ve Apple Mail bu yapıyı aynı şekilde gösterir.",
          "İmzada resim yoktur, yalnızca metin ve bağlantı. Bu yüzden alıcının programı görselleri engellese bile imzan eksiksiz görünür ve iletin spam filtresine takılmaz.",
        ],
      },
      {
        heading: "İmzana dijital kartvizit bağlantısı ekle",
        paragraphs: [
          "İmzadaki telefon ve e-posta okunur ama rehbere kaydedilmez. Dijital kartvizit bağlantısına tıklayan kişi ise seni tek dokunuşla rehberine ekler; fotoğrafın, WhatsApp'ın ve sosyal medya hesapların da aynı sayfadadır.",
          "Numaran ya da unvanın değişince yüzlerce kişiye giden imzayı düzeltmek yerine profilini güncellersin; bağlantı aynı kalır.",
        ],
      },
    ],
    faq: [
      {
        q: "E-posta imzası oluşturmak ücretsiz mi?",
        a: "Evet. Bu sayfadaki araç ücretsizdir, üyelik istemez ve imzan süresiz kullanılabilir.",
      },
      {
        q: "Kopyaladığım imza yapıştırınca bozuluyor, ne yapmalıyım?",
        a: 'İmzayı düz metin kutusuna değil, programın imza düzenleyicisine yapıştır. Apple Mail\'de "Her zaman varsayılan yazı tipimle eşleştir" seçeneğini kapat. Tarayıcın kopyalamaya izin vermezse önizlemedeki imzayı fareyle seçip kopyalayabilirsin.',
      },
      {
        q: "İmzaya logo ya da fotoğraf ekleyebilir miyim?",
        a: "Bu araç bilerek yalnızca metin kullanır, çünkü birçok program imzadaki görselleri ek olarak gönderir ya da engeller. Fotoğrafını ve logonu dijital kartvizit profiline koyup imzaya bağlantısını eklemek daha güvenilir bir yoldur.",
      },
      {
        q: "Telefonda da çalışır mı?",
        a: "İmza Gmail ve Outlook uygulamalarında, hesabına bilgisayardan eklediğin haliyle görünür. iPhone Mail uygulamasının imza alanı biçimlendirmeyi kısmen korur; en iyi sonuç için imzayı bilgisayardan ekle.",
      },
    ],
    guides: ["dijital-kartvizit-nedir", "kartvizite-ne-yazilir", "qr-kod-kartvizit"],
  },
  {
    slug: "kartvizit-maliyet-hesaplama",
    term: "Kartvizit maliyet hesaplama",
    title: "Kartvizit Maliyeti Hesaplama: Kâğıt mı NFC mi? | Dijivizit",
    description: `Kartvizit maliyeti hesaplama: kişi sayısı, yıllık kart adedi ve matbaa fiyatını gir; kâğıt kartviziti ${formatTry(PVC_PRICE)}'den başlayan NFC kartvizitle yıl yıl kıyasla.`,
    h1: "Kartvizit maliyet hesaplama",
    lead: "Kâğıt kartvizit mi daha ucuz, NFC kartvizit mi? Kendi rakamlarını gir, 1 ile 5 yıl arasındaki toplam maliyeti yan yana gör. Kâğıt daha ucuzsa bunu da açıkça söyleriz.",
    sections: [
      {
        heading: "Hesaplama nasıl yapılıyor?",
        list: [
          `Kâğıt: girdiğin ${PAPER_PACK_SIZE.toLocaleString("tr-TR")} adetlik paket fiyatı esas alınır. Bilgiler değişmezse artan kartlar sonraki yıla devreder; her değişiklikte elde kalan kartlar kullanılamaz ve yeni paket basılır.`,
          `NFC kart: kart bedeli bir kez ödenir; ${PRICING.bulkMinQuantity} ve üzeri kişide %${PRICING.bulkDiscountPercent} indirim uygulanır.`,
          `Profil: ${FREE_PERIOD} ücretsiz, sonrasında kişi başı aylık ${formatTry(PRICING.profileMonthlyFee)}.`,
          `Kartsız dijital kartvizit: kişi başı yıllık ${formatTry(PRICING.digitalYearlyFee)}.`,
        ],
      },
      {
        heading: "Kâğıt kartvizit ne zaman daha ucuz?",
        paragraphs: [
          "Tek kişiysen, yılda birkaç yüz kart dağıtıyorsan ve bilgilerin yıllarca değişmiyorsa kâğıt kartvizit genellikle daha ucuzdur. Hesaplayıcı bu durumda bunu açıkça gösterir.",
          "Maliyet ekiplerde ve bilgilerin sık değiştiği işlerde döner: her unvan, numara ya da adres değişikliği herkes için yeni bir baskı demektir. NFC kartta değişiklik panelden yapılır, kart aynı kalır.",
        ],
      },
      {
        heading: "Rakamın dışında kalanlar",
        paragraphs: [
          "Hesaplama yalnızca para maliyetini karşılaştırır. Kâğıt kartvizit çoğunlukla rehbere hiç kaydedilmeden çekmecede kalır; NFC kartı okutan kişi seni tek dokunuşla kaydeder, sen de profilinin kaç kez açıldığını görürsün.",
        ],
      },
    ],
    faq: [
      {
        q: "Kartvizit maliyeti nasıl hesaplanır?",
        a: "Yıllık kart ihtiyacını, baskı fiyatını ve bilgilerin kaç kez değiştiğini çarp: her değişiklik elde kalan kartları çöpe atar ve yeni baskı gerektirir. Bu sayfadaki hesaplayıcı bunu kişi sayısı ve yıl sayısına göre otomatik yapar.",
      },
      {
        q: "NFC kartvizit kâğıt kartvizitten ucuz mu?",
        a: `Duruma göre. Az kart dağıtan ve bilgileri değişmeyen tek kişi için kâğıt daha ucuz olabilir. Ekiplerde ve sık değişen bilgilerde NFC kart genellikle birkaç yıl içinde kendini çıkarır; ${PRICING.bulkMinQuantity} ve üzeri kişide %${PRICING.bulkDiscountPercent} indirim de uygulanır.`,
      },
      {
        q: "Dijivizit'in yıllık ücreti var mı?",
        a: `Kart tek seferlik ödenir. Profil ${FREE_PERIOD} ücretsizdir; sonra aylık ${formatTry(PRICING.profileMonthlyFee)} ile devam eder. Otomatik çekim yapılmaz, devam etmek isteyip istemediğine sen karar verirsin.`,
      },
      {
        q: "Hesaplamaya hangi masraflar dahil değil?",
        a: "Tasarım ücreti, kargo, kaybolan ya da dağıtılmadan eskiyen kartlar hesaba katılmaz. Kendi matbaa fiyatını girdiğinde sonuç gerçeğe en yakın olur.",
      },
    ],
    guides: [
      "nfc-kartvizit-mi-kagit-kartvizit-mi",
      "kurumsal-dijital-kartvizit",
      "dijital-kartvizit-nedir",
    ],
  },
];

export function getTool(slug: string): Tool {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}
