import { getTranslations } from "next-intl/server";

import { LegalLinks } from "@/components/legal/legal-links";
import { Analytics } from "@/components/marketing/analytics";
import { CONSENT_KEY } from "@/lib/analytics";
import { SiteHeader } from "@/components/marketing/site-header";
import { CONTACT } from "@/lib/contact";
import { MARKETING_ORIGIN } from "@/lib/hosts";
import Link from "next/link";

/**
 * Site-wide Organization/LocalBusiness node. Rendered on every marketing page
 * so the `#organization` @id referenced by guides, tools and offers resolves.
 */
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${MARKETING_ORIGIN}/#organization`,
  name: "Dijivizit",
  legalName: "ASD Tasarım Ltd. Şti.",
  url: MARKETING_ORIGIN,
  logo: `${MARKETING_ORIGIN}/email/logomark.png`,
  image: `${MARKETING_ORIGIN}/landing/finishes/black.webp`,
  email: CONTACT.orderEmail,
  telephone: CONTACT.phoneE164,
  hasMap: CONTACT.mapsProfileUrl,
  sameAs: [CONTACT.mapsProfileUrl, CONTACT.instagramUrl],
  geo: { "@type": "GeoCoordinates", latitude: CONTACT.geo.lat, longitude: CONTACT.geo.lng },
  areaServed: { "@type": "Country", name: "Türkiye" },
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.street,
    addressLocality: CONTACT.district,
    addressRegion: CONTACT.city,
    addressCountry: CONTACT.country,
  },
};

/** Hub links only; the full guide list lives on /rehber. */
const FOOTER_LINKS = [
  { href: "/", label: "Dijital kartvizit" },
  { href: "/nfc-kartvizit", label: "NFC kartvizit" },
  { href: "/akilli-kartvizit", label: "Akıllı kartvizit" },
  { href: "/metal-kartvizit", label: "Metal kartvizit" },
  { href: "/kurumsal-kartvizit", label: "Kurumsal kartvizit" },
  { href: "/dijital-kartvizit-fiyatlari", label: "Dijital kartvizit fiyatları" },
  { href: "/dijital-kartvizit-olustur", label: "Ücretsiz dijital kartvizit oluştur" },
  { href: "/rehber", label: "Rehber" },
  { href: "/hakkimizda", label: "Hakkımızda" },
] as const;

/** Smaller pages that would otherwise lose their only site-wide link. */
const FOOTER_SECONDARY_LINKS = [
  { href: "/ahsap-kartvizit", label: "Ahşap kartvizit" },
  { href: "/pvc-kartvizit", label: "PVC kartvizit" },
  { href: "/kartvizit", label: "NFC kartvizit fiyatları" },
  { href: "/qr-kartvizit-olustur", label: "QR kartvizit oluştur" },
  { href: "/e-posta-imzasi-olustur", label: "E-posta imzası oluştur" },
  { href: "/kartvizit-maliyet-hesaplama", label: "Kartvizit maliyet hesaplama" },
] as const;

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations();

  return (
    <div className="flex min-h-full flex-col">
      {/* Runs before first paint: visitors who already chose don't see the
          server-rendered cookie banner flash (see Analytics). */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var c=localStorage.getItem(${JSON.stringify(CONSENT_KEY)});if(c==="granted"||c==="denied")document.documentElement.dataset.dvConsent=c}catch(e){}`,
        }}
      />
      <script
        type="application/ld+json"
        // JSON.stringify output is safe here: all values are static strings.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ORGANIZATION_JSON_LD).replace(/</g, "\\u003c"),
        }}
      />
      <Analytics />
      <SiteHeader />
      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 text-sm sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex flex-col gap-2 text-muted-foreground">
            <p className="font-medium text-foreground">{t("app.name")}</p>
            <p>{CONTACT.addressLines.join(", ")}</p>
            <p>
              <a href={`tel:${CONTACT.phoneE164}`} className="hover:text-foreground">
                {CONTACT.phoneDisplay}
              </a>
              {" · "}
              <a href={`mailto:${CONTACT.orderEmail}`} className="hover:text-foreground">
                {CONTACT.orderEmail}
              </a>
            </p>
            <p className="text-xs">
              © {new Date().getFullYear()} {t("app.name")}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <nav
              aria-label="Dijital kartvizit"
              className="flex flex-wrap gap-x-4 gap-y-2 font-medium text-foreground"
            >
              {FOOTER_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:underline">
                  {l.label}
                </Link>
              ))}
            </nav>
            <nav
              aria-label="Diğer sayfalar"
              className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground"
            >
              {FOOTER_SECONDARY_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-foreground">
                  {l.label}
                </Link>
              ))}
            </nav>
            <LegalLinks className="justify-start" />
          </div>
        </div>
      </footer>
    </div>
  );
}
