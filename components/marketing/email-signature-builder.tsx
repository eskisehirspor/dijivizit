"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy } from "lucide-react";

import { trackTool } from "@/lib/analytics";
import {
  SIGNATURE_ACCENTS,
  buildSignatureHtml,
  buildSignatureText,
  type SignatureFields,
} from "@/lib/marketing/email-signature";
import { PRICING, PROMISES, formatTry } from "@/lib/orders/finishes";
import { cn } from "@/lib/utils";

const TOOL = "e-posta-imzasi-olustur";

const EMPTY: SignatureFields = {
  fullName: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  website: "",
  profileUrl: "",
};

const INPUTS: {
  key: keyof SignatureFields;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete: string;
  inputMode?: "tel" | "email" | "url";
  wide?: boolean;
}[] = [
  {
    key: "fullName",
    label: "Ad soyad",
    placeholder: "Ayşe Demir",
    autoComplete: "name",
    wide: true,
  },
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
  {
    key: "profileUrl",
    label: "Dijital kartvizit ya da QR bağlantısı (isteğe bağlı)",
    placeholder: "dijivizit.com/p/AbCd1234",
    type: "url",
    autoComplete: "off",
    inputMode: "url",
    wide: true,
  },
];

const inputClass =
  "h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

const CLIENTS = [
  {
    name: "Gmail",
    steps: [
      "Sağ üstteki dişli > Tüm ayarları görün.",
      "Genel sekmesinde İmza > Yeni oluştur.",
      "Kutuya yapıştır (Ctrl+V / Cmd+V), sayfanın altında Değişiklikleri kaydet.",
    ],
  },
  {
    name: "Outlook",
    steps: [
      "Yeni Outlook ve web: Ayarlar > Hesaplar > İmzalar > Yeni imza.",
      "Klasik masaüstü: Dosya > Seçenekler > Posta > İmzalar > Yeni.",
      "Yapıştır, imzayı yeni iletiler için varsayılan seç ve kaydet.",
    ],
  },
  {
    name: "Apple Mail",
    steps: [
      "Mac'te Mail > Ayarlar > İmzalar, hesabını seç ve + ile yeni imza ekle.",
      "“Her zaman varsayılan yazı tipimle eşleştir” kutusunun işaretini kaldır.",
      "Sağdaki alana yapıştır; kaydetmeye gerek yok, hemen geçerli olur.",
    ],
  },
];

type CopyState = "idle" | "rich" | "html" | "error";

/**
 * Free tool: live HTML e-mail signature with rich-text copy, built entirely in
 * the browser. The offer below it leads to the card-less digital business card.
 */
export function EmailSignatureBuilder() {
  const [fields, setFields] = useState<SignatureFields>(EMPTY);
  const [accent, setAccent] = useState<string>(SIGNATURE_ACCENTS[0].hex);
  const [cardLine, setCardLine] = useState(true);
  const [copied, setCopied] = useState<CopyState>("idle");
  const started = useRef(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const options = { accent, cardLine };
  const html = useMemo(
    () => buildSignatureHtml(fields, { accent, cardLine }),
    [fields, accent, cardLine],
  );
  const filled = Boolean(fields.fullName.trim());

  function markStarted() {
    if (!started.current) {
      started.current = true;
      trackTool(TOOL, "tool_start");
    }
  }

  function update(key: keyof SignatureFields, value: string) {
    if (value.trim()) markStarted();
    setFields((f) => ({ ...f, [key]: value }));
    setCopied("idle");
  }

  /** Copies the preview's DOM selection: the fallback for browsers without ClipboardItem. */
  function copySelection(): boolean {
    const node = previewRef.current;
    const sel = window.getSelection();
    if (!node || !sel) return false;
    const range = document.createRange();
    range.selectNodeContents(node);
    sel.removeAllRanges();
    sel.addRange(range);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    sel.removeAllRanges();
    return ok;
  }

  async function copyRich() {
    const text = buildSignatureText(fields, options);
    let ok = false;
    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) ok = copySelection();
    setCopied(ok ? "rich" : "error");
    if (ok) trackTool(TOOL, "signature_copy");
  }

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(html);
      setCopied("html");
      trackTool(TOOL, "signature_copy");
    } catch {
      setCopied("error");
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-10 rounded-3xl border border-border/60 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
        <form
          className="grid content-start gap-5 sm:grid-cols-2"
          onSubmit={(e) => e.preventDefault()}
          aria-label="İmza bilgileri"
        >
          {INPUTS.map((i) => (
            <div key={i.key} className={cn("flex flex-col gap-2", i.wide && "sm:col-span-2")}>
              <label htmlFor={`es-${i.key}`} className="text-sm font-medium">
                {i.label}
              </label>
              <input
                id={`es-${i.key}`}
                type={i.type ?? "text"}
                inputMode={i.inputMode}
                autoComplete={i.autoComplete}
                placeholder={i.placeholder}
                maxLength={i.key === "profileUrl" || i.key === "website" ? 200 : 120}
                value={fields[i.key]}
                onChange={(e) => update(i.key, e.target.value)}
                className={inputClass}
              />
            </div>
          ))}

          <fieldset className="flex flex-col gap-3 sm:col-span-2">
            <legend className="mb-3 text-sm font-medium">Vurgu rengi</legend>
            <div className="flex flex-wrap gap-2">
              {SIGNATURE_ACCENTS.map((a) => (
                <label
                  key={a.id}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-2 text-sm has-[:checked]:border-foreground has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50"
                >
                  <input
                    type="radio"
                    name="es-accent"
                    value={a.hex}
                    checked={accent === a.hex}
                    onChange={() => {
                      markStarted();
                      setAccent(a.hex);
                      setCopied("idle");
                    }}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="size-4 rounded-full"
                    style={{ backgroundColor: a.hex }}
                  />
                  {a.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex items-start gap-3 sm:col-span-2">
            <input
              id="es-cardline"
              type="checkbox"
              checked={cardLine}
              onChange={(e) => {
                setCardLine(e.target.checked);
                setCopied("idle");
              }}
              className="mt-1 size-4 accent-foreground"
            />
            <label htmlFor="es-cardline" className="text-sm leading-relaxed">
              “Dijital kartvizit bağlantım” satırını ekle
              <span className="block text-muted-foreground">
                Bağlantı yazarsan satır kendi profiline gider; boş bırakırsan dijivizit.com&apos;a.
              </span>
            </label>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground sm:col-span-2">
            Bilgilerin yalnızca tarayıcında işlenir; bize gönderilmez, saklanmaz.
          </p>
        </form>

        <div className="flex flex-col gap-5">
          {/* Mail window preview */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-white text-neutral-950 shadow-[0_30px_60px_-30px_rgba(40,34,26,0.3)]">
            <div className="flex flex-col gap-1 border-b border-neutral-200 px-5 py-4 text-sm">
              <p className="text-neutral-500">
                <span className="text-neutral-700">Kime:</span> musteri@ornek.com
              </p>
              <p className="text-neutral-500">
                <span className="text-neutral-700">Konu:</span> Görüşmemiz hakkında
              </p>
            </div>
            <div className="flex flex-col gap-6 px-5 pt-5 pb-8">
              <div className="flex flex-col gap-2 text-sm text-neutral-600">
                <p>Merhaba,</p>
                <p>Bugünkü görüşme için teşekkürler. Teklifi ekte bulabilirsiniz.</p>
                <p>İyi çalışmalar,</p>
              </div>
              <div
                ref={previewRef}
                aria-label="E-posta imzası önizlemesi"
                className="overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyRich}
              disabled={!filled}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-base font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
            >
              {copied === "rich" ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              İmzayı kopyala
            </button>
            <button
              type="button"
              onClick={copyHtml}
              disabled={!filled}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-6 text-base font-medium transition-colors hover:bg-muted disabled:opacity-50"
            >
              HTML kodunu kopyala
            </button>
          </div>
          <p role="status" aria-live="polite" className="min-h-6 text-sm text-muted-foreground">
            {!filled
              ? "Kopyalamak için önce adını yaz."
              : copied === "rich"
                ? "İmza kopyalandı. Şimdi e-posta programının imza alanına yapıştır."
                : copied === "html"
                  ? "HTML kodu kopyalandı. HTML imza kabul eden programlara yapıştır."
                  : copied === "error"
                    ? "Tarayıcın kopyalamaya izin vermedi. Önizlemedeki imzayı fareyle seçip Ctrl+C (Mac'te Cmd+C) ile kopyala."
                    : "Kopyaladığın imza biçimiyle birlikte yapıştırılır."}
          </p>
        </div>
      </div>

      <section aria-labelledby="es-howto" className="flex flex-col gap-6">
        <h2 id="es-howto" className="text-2xl font-semibold tracking-tight">
          İmzayı e-posta programına ekle
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {CLIENTS.map((c) => (
            <div
              key={c.name}
              className="flex flex-col gap-3 rounded-2xl border border-border/60 p-6"
            >
              <h3 className="text-lg font-semibold">{c.name}</h3>
              <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-foreground/85">
                {c.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl bg-neutral-950 p-8 text-white sm:p-12 lg:grid-cols-[minmax(0,1.3fr)_auto] lg:items-center">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-white/60">İmzandaki bağlantı için</p>
          <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
            İmzana tek tıkla rehbere kaydedilen bir kartvizit koy.
          </h2>
          <ul className="grid gap-2 text-white/80 sm:grid-cols-2">
            <li>Okuyan seni tek dokunuşla rehberine kaydeder</li>
            <li>Numaran değişince imzaya dokunmazsın, profili güncellersin</li>
            <li>Fotoğraf, WhatsApp, sosyal medya, konum</li>
            <li>Profilinin kaç kez açıldığını görürsün</li>
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
          <Link
            href="/kartvizit/dijital-kartvizit-qr"
            onClick={() => trackTool(TOOL, "tool_offer_click")}
            className="mt-2 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-base font-medium text-neutral-950 transition-colors hover:bg-white/90 focus-visible:ring-[3px] focus-visible:ring-white/60 focus-visible:outline-none"
          >
            Dijital kartvizite bak
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
