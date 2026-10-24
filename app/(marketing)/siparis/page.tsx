import type { Metadata } from "next";

import { ContactDetails } from "@/components/marketing/contact-details";
import { OrderForm } from "@/components/marketing/order-form";
import { isFinishId } from "@/lib/orders/finishes";

const TITLE = "NFC Kartvizit Sipariş | Dijivizit";
const DESCRIPTION =
  "Dijivizit NFC akıllı kartvizit sipariş talebi: siyah metal, gümüş, gold, koyu veya açık ahşap kaplamayı seç, bilgilerini bırak, seni arayalım.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/siparis" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/siparis" },
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ kaplama?: string }>;
}) {
  const { kaplama } = await searchParams;
  const initialFinish = isFinishId(kaplama) ? kaplama : "black";

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-32 pb-28 sm:pt-40">
      <div className="mb-16 flex max-w-2xl flex-col gap-4">
        <p className="text-sm font-medium tracking-wide text-muted-foreground">Sipariş</p>
        <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
          Kartını seç. Gerisini biz halledelim.
        </h1>
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
          Kaplamayı seç, iletişim bilgilerini bırak. Talebin bize ulaşır, en kısa sürede arayıp
          tasarım ve teslimatı birlikte netleştiririz.
        </p>
      </div>

      <OrderForm initialFinish={initialFinish} />

      <section className="mt-28 flex flex-col gap-8 border-t border-border/60 pt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Formla uğraşmak istemiyor musun?</h2>
        <ContactDetails />
      </section>
    </div>
  );
}
