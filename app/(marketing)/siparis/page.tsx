import type { Metadata } from "next";

import { ContactDetails } from "@/components/marketing/contact-details";
import { OrderForm } from "@/components/marketing/order-form";
import { PromiseStrip } from "@/components/marketing/why-dijivizit";
import { isFinishId } from "@/lib/orders/finishes";
import { issueFormToken } from "@/lib/security/form-token";

const TITLE = "NFC ve Dijital Kartvizit Sipariş | Dijivizit";
const DESCRIPTION =
  "NFC kartvizit sipariş talebi: mat siyah PVC, siyah, gümüş ya da gold metal, koyu veya açık ahşap ya da kartsız dijital kartvizit (link + QR). 72 saatte teslim.";

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
  const formToken = await issueFormToken("order");

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-32 pb-28 sm:pt-40">
      <div className="mb-16 flex max-w-2xl flex-col gap-4">
        <p className="text-sm font-medium tracking-wide text-muted-foreground">Sipariş</p>
        <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
          Kartını seç. Gerisini biz halledelim.
        </h1>
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
          Kartını ya da kartsız dijital kartviziti seç, iletişim bilgilerini bırak. Talebin bize
          ulaşır, en kısa sürede arayıp tasarım ve teslimatı birlikte netleştiririz.
        </p>
        <PromiseStrip className="pt-2" />
      </div>

      <OrderForm initialFinish={initialFinish} formToken={formToken} />

      <section className="mt-28 flex flex-col gap-8 border-t border-border/60 pt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Formla uğraşmak istemiyor musun?</h2>
        <ContactDetails />
      </section>
    </div>
  );
}
