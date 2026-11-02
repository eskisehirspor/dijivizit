"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { ArrowRight, Download, Globe, Mail, Phone } from "lucide-react";

import { trackTool } from "@/lib/analytics";
import { savePrefill } from "@/lib/marketing/prefill";
import { PRICING, PROMISES, formatTry } from "@/lib/orders/finishes";
import { buildVcard30 } from "@/lib/share/vcard";
import { cn } from "@/lib/utils";

type Fields = {
  fullName: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
};

const EMPTY: Fields = { fullName: "", title: "", company: "", phone: "", email: "", website: "" };

const INPUTS: {
  key: keyof Fields;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete: string;
  inputMode?: "tel" | "email" | "url";
}[] = [
  { key: "fullName", label: "Ad soyad", placeholder: "Ayşe Demir", autoComplete: "name" },
  { key: "title", label: "Unvan", placeholder: "Kurucu Ortak", autoComplete: "organization-title" },
  { key: "company", label: "Şirket", placeholder: "Demir Mimarlık", autoComplete: "organization" },
  {
    key: "phone",
    label: "Telefon",
    placeholder: "0532 123 45 67",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
  },
  {
    key: "email",
    label: "E-posta",
    placeholder: "ayse@demirmimarlik.com",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
  },
  {
    key: "website",
    label: "Web sitesi",
    placeholder: "demirmimarlik.com",
    type: "url",
    autoComplete: "url",
    inputMode: "url",
  },
];

const inputClass =
  "h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0]!.charAt(0);
  const last = parts.length > 1 ? parts.at(-1)!.charAt(0) : "";
  return (first + last).toLocaleUpperCase("tr-TR");
}

function withScheme(url: string): string {
  const u = url.trim();
  if (!u) return "";
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
}

/**
 * Free tool: live profile preview plus a downloadable vCard QR code, built
 * entirely in the browser. The offer below it hands the details to the order
 * form for the card-less digital business card.
 */
export function CardBuilder({ tool }: { tool: string }) {
  const router = useRouter();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [qrData, setQr] = useState<string>("");
  const started = useRef(false);

  const filled = Object.values(fields).some((v) => v.trim());
  const qr = filled ? qrData : "";
  const vcard = useMemo(
    () =>
      buildVcard30({
        fullName: fields.fullName,
        title: fields.title,
        company: fields.company,
        phone: fields.phone,
        email: fields.email,
        website: withScheme(fields.website),
      }),
    [fields],
  );

  useEffect(() => {
    if (!filled) return;
    let cancelled = false;
    const t = setTimeout(() => {
      QRCode.toDataURL(vcard, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 1024,
        color: { dark: "#121213", light: "#ffffff" },
      })
        .then((url) => {
          if (!cancelled) setQr(url);
        })
        .catch(() => {
          if (!cancelled) setQr("");
        });
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [vcard, filled]);

  function update(key: keyof Fields, value: string) {
    if (!started.current && value.trim()) {
      started.current = true;
      trackTool(tool, "tool_start");
    }
    setFields((f) => ({ ...f, [key]: value }));
  }

  function download() {
    if (!qr) return;
    trackTool(tool, "qr_download");
    const a = document.createElement("a");
    a.href = qr;
    const slug = fields.fullName
      .trim()
      .toLocaleLowerCase("tr-TR")
      .replace(/ı/g, "i")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    a.download = `${slug || "kartvizit"}-qr.png`;
    a.click();
  }

  function offer() {
    trackTool(tool, "tool_offer_click");
    const details = [
      "Kartsız dijital kartvizit (link + QR).",
      fields.title && `Unvan: ${fields.title}`,
      fields.company && `Şirket: ${fields.company}`,
      fields.website && `Web: ${fields.website}`,
    ]
      .filter(Boolean)
      .join("\n");
    savePrefill({
      fullName: fields.fullName,
      phone: fields.phone,
      email: fields.email,
      note: details,
    });
    router.push("/siparis?kaplama=digital#siparis-formu");
  }

  const subtitle = [fields.title, fields.company].filter((v) => v.trim()).join(" · ");
  const rows = [
    { icon: Phone, label: "Cep", value: fields.phone },
    { icon: Mail, label: "E-posta", value: fields.email },
    { icon: Globe, label: "Web sitesi", value: fields.website },
  ].filter((r) => r.value.trim());

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-10 rounded-3xl border border-border/60 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
        <form
          className="grid content-start gap-5 sm:grid-cols-2"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Kartvizit bilgileri"
        >
          {INPUTS.map((i) => (
            <div
              key={i.key}
              className={cn("flex flex-col gap-2", i.key === "fullName" && "sm:col-span-2")}
            >
              <label htmlFor={`cb-${i.key}`} className="text-sm font-medium">
                {i.label}
              </label>
              <input
                id={`cb-${i.key}`}
                type={i.type ?? "text"}
                inputMode={i.inputMode}
                autoComplete={i.autoComplete}
                placeholder={i.placeholder}
                maxLength={120}
                value={fields[i.key]}
                onChange={(e) => update(i.key, e.target.value)}
                className={inputClass}
              />
            </div>
          ))}
          <p className="text-sm leading-relaxed text-muted-foreground sm:col-span-2">
            Bilgilerin yalnızca tarayıcında işlenir; bize gönderilmez, saklanmaz.
          </p>
        </form>

        <div className="grid items-start gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          {/* Profile preview */}
          <div
            aria-label="Dijital kartvizit önizlemesi"
            className="mx-auto w-full max-w-[280px] rounded-[2.4rem] bg-neutral-950 p-2.5 shadow-[0_30px_60px_-20px_rgba(40,34,26,0.35)]"
          >
            <div className="relative flex min-h-[500px] flex-col items-center gap-3 overflow-hidden rounded-[1.9rem] bg-white px-5 pt-12 pb-6 text-neutral-950">
              <span className="absolute top-3 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-neutral-950" />
              <span className="flex size-20 items-center justify-center rounded-full bg-neutral-200 text-2xl font-semibold text-neutral-600">
                {initials(fields.fullName) || "AD"}
              </span>
              <p className="mt-1 text-center text-lg leading-tight font-semibold">
                {fields.fullName.trim() || "Ad Soyad"}
              </p>
              <p className="-mt-1 text-center text-xs text-neutral-500">
                {subtitle || "Unvan · Şirket"}
              </p>
              <span className="mt-2 flex h-10 w-full items-center justify-center rounded-xl bg-neutral-950 text-sm font-medium text-white">
                Rehberime Kaydet
              </span>
              <div className="mt-2 flex w-full flex-col gap-2">
                {(rows.length
                  ? rows
                  : [
                      { icon: Phone, label: "Cep", value: "05xx xxx xx xx" },
                      { icon: Mail, label: "E-posta", value: "ornek@mail.com" },
                    ]
                ).map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 px-3 py-2.5"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                      <Icon className="size-4 text-neutral-600" aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-xs font-medium">{label}</span>
                      <span className="truncate text-[11px] text-neutral-500">{value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* vCard QR */}
          <div className="flex flex-col gap-4">
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-white p-3">
              {qr ? (
                // eslint-disable-next-line @next/next/no-img-element -- generated data URL
                <img
                  src={qr}
                  alt="Kartvizit QR kodu"
                  width={1024}
                  height={1024}
                  className="h-full w-full"
                />
              ) : (
                <p className="px-6 text-center text-sm text-muted-foreground">
                  Bilgilerini yaz, QR kodun burada belirsin.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={download}
              disabled={!qr}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
            >
              <Download className="size-4" aria-hidden="true" />
              QR kodu indir (PNG)
            </button>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Okutan telefon seni rehberine ekler. Ücretsiz, süresiz.
            </p>
          </div>
        </div>
      </div>

      <section className="grid gap-8 rounded-3xl bg-neutral-950 p-8 text-white sm:p-12 lg:grid-cols-[minmax(0,1.3fr)_auto] lg:items-center">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-white/60">Bir adım ötesi</p>
          <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
            Bu önizlemeyi gerçek dijital kartvizitin yap.
          </h2>
          <ul className="grid gap-2 text-white/80 sm:grid-cols-2">
            <li>QR hiç değişmez, bilgilerini panelden güncellersin</li>
            <li>Fotoğraf, WhatsApp, sosyal medya, konum</li>
            <li>Kimin, hangi şehirden açtığını görürsün</li>
            <li>Ziyaretçi kendi numarasını sana bırakır</li>
          </ul>
        </div>
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <p className="text-4xl font-semibold tracking-tight">
            {formatTry(PRICING.profileMonthlyFee)}
            <span className="text-lg font-normal text-white/60">/ay</span>
          </p>
          <p className="text-sm text-white/60">
            Yıllık {formatTry(PRICING.digitalYearlyFee)} · {PROMISES.digitalDeliveryHours} saatte
            e-postanda
          </p>
          <button
            type="button"
            onClick={offer}
            className="mt-2 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-base font-medium text-neutral-950 transition-colors hover:bg-white/90"
          >
            Dijital kartvizitimi al
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
