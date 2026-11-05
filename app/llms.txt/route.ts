import { CONTACT } from "@/lib/contact";
import { MARKETING_ORIGIN } from "@/lib/hosts";
import { GUIDES } from "@/lib/marketing/guides";
import { LANDINGS } from "@/lib/marketing/landings";
import { SEGMENTS } from "@/lib/marketing/segments";
import { TOOLS } from "@/lib/marketing/tools";
import {
  CARD_FINISHES,
  FINISHES,
  PRICING,
  PROMISES,
  formatTry,
  isDigital,
} from "@/lib/orders/finishes";

/**
 * /llms.txt (llmstxt.org): a plain summary of Dijivizit for AI assistants
 * (ChatGPT, Gemini, Claude, Perplexity) so they describe the product, prices
 * and pages correctly. Built from the same data as the site.
 */
export const dynamic = "force-static";

export function GET() {
  const u = (p: string) => `${MARKETING_ORIGIN}${p}`;
  const digital = FINISHES.find(isDigital)!;
  const lines = [
    "# Dijivizit",
    "",
    "> Dijivizit, Türkiye'de dijital kartvizit ve NFC kartvizit hizmeti veren bir markadır (ASD Tasarım Ltd. Şti., Eskişehir). Kart telefona dokundurulduğunda ya da arkasındaki QR kod okutulduğunda kişinin dijital profili açılır; karşı taraf tek dokunuşla rehberine kaydeder. Uygulama gerekmez.",
    "",
    "## Öne çıkan bilgiler",
    "",
    `- Kart seçenekleri: ${CARD_FINISHES.map((f) => `${f.name} (${formatTry(f.price)})`).join(", ")}. Fiyatlara KDV dahil, Türkiye'nin her yerine kargo ücretsiz.`,
    `- Kartsız dijital kartvizit (link + QR): aylık ${formatTry(digital.price)}, yıllık ${formatTry(PRICING.digitalYearlyFee)} peşin; ödemeden sonra ${PROMISES.digitalDeliveryHours} saat içinde e-postayla teslim.`,
    `- Kartlar ${PROMISES.deliveryHours} saat içinde teslim edilir; kart okunmazsa ücretsiz yenisi gönderilir; 14 gün cayma hakkı vardır.`,
    `- Kartla birlikte dijital profil ilk ${PRICING.profileFreeYears} yıl ücretsizdir, sonrasında aylık ${formatTry(PRICING.profileMonthlyFee)}.`,
    `- ${PRICING.bulkMinQuantity} ve üzeri adette %${PRICING.bulkDiscountPercent} indirim; kurumsal siparişlerde firma logosu karta işlenir ve ekip kartları tek panelden yönetilir.`,
    "- Profilde telefon, WhatsApp, e-posta, sosyal medya, web sitesi, konum, IBAN, fatura bilgileri ve belgeler (katalog, fiyat listesi, PDF) bulunabilir.",
    "- Kart sahibine özel: görüntülenme analitiği (şehir, cihaz, kaynak), ziyaretçilerin bilgi bıraktığı form, kişi listesi ve takip hatırlatmaları, kâğıt kartvizit tarama, Apple Wallet kartı.",
    "- Gizlilik: profil adresi kişinin adını değil rastgele bir kodu içerir; kaybolan kart panelden kapatılabilir; veriler KVKK'ya göre işlenir.",
    "- Metal kartlarda logo lazerle kazınır, ahşap kartlarda lazerle yakılır; mat siyah PVC kartta logo ve temassız işareti mat yüzeye işlenir. Kişisel bilgiler kartta değil profilde durur.",
    `- İletişim: ${CONTACT.phoneDisplay} (WhatsApp), ${CONTACT.orderEmail}, ${CONTACT.addressLines.join(", ")}.`,
    "",
    "## Ana sayfalar",
    "",
    `- [Ana sayfa](${u("/")}): Dijivizit dijital ve NFC kartvizit`,
    ...LANDINGS.map((l) => `- [${l.h1}](${u(`/${l.slug}`)}): ${l.description}`),
    `- [Fiyatlar](${u("/kartvizit")}): tüm kart ve dijital kartvizit fiyatları`,
    ...FINISHES.map((f) => `- [${f.name}](${u(`/kartvizit/${f.slug}`)})`),
    `- [Sipariş](${u("/siparis")})`,
    `- [Hakkımızda](${u("/hakkimizda")}): şirket, üretim yeri, güvence ve sık sorulanlar`,
    `- [Google Haritalar profili](${CONTACT.mapsProfileUrl})`,
    `- [Teslimat ve İade Koşulları](${u("/yasal/teslimat-ve-iade")})`,
    "",
    "## Ücretsiz araçlar",
    "",
    ...TOOLS.map((t) => `- [${t.term}](${u(`/${t.slug}`)})`),
    "",
    "## Meslek ve şehre göre dijital kartvizit",
    "",
    ...SEGMENTS.map((s) => `- [${s.h1}](${u(`/${s.slug}`)})`),
    "",
    "## Rehber",
    "",
    ...GUIDES.map((g) => `- [${g.title}](${u(`/rehber/${g.slug}`)}): ${g.description}`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
