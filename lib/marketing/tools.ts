/**
 * Free tools at dijivizit.com/<slug>. Each targets a "... oluştur" search, gives
 * something useful for free (a working vCard QR code) and offers the card-less
 * digital business card (59,90 TL a month) as the next step.
 */
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
          "Kartsız dijital kartvizit aylık 59,90 TL'dir ve yıllık 718,80 TL olarak peşin ödenir. Kart, kargo ya da kurulum ücreti yoktur. İstediğin zaman metal ya da ahşap NFC karta geçebilirsin; link ve QR kodun aynı kalır.",
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
];

export function getTool(slug: string): Tool {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return tool;
}
