import {
  BellRing,
  ChartColumn,
  LockKeyhole,
  PackageCheck,
  RefreshCw,
  ScanLine,
  Smartphone,
  Truck,
  UserPlus,
  Users,
} from "lucide-react";

import { PROMISES } from "@/lib/orders/finishes";
import { cn } from "@/lib/utils";

/** What Dijivizit does that the usual NFC card services do not, all live in the panel. */
const FEATURES = [
  {
    icon: ScanLine,
    title: "Kartvizit tarama",
    body: "Size verilen kâğıt kartvizitin fotoğrafını çekin; yapay zekâ ad, unvan, şirket ve telefonu kendisi doldursun.",
  },
  {
    icon: UserPlus,
    title: "Karşılıklı tanışma",
    body: 'Kartınızı okutan kişi "Bilgilerimi bırak" ile adını ve numarasını anında size iletir.',
  },
  {
    icon: ChartColumn,
    title: "Şehir şehir analitik",
    body: "Profiliniz kaç kez açıldı, hangi şehirlerden, hangi cihazlardan ve nereden gelindi; hepsi grafiklerle panelde.",
  },
  {
    icon: BellRing,
    title: "Takip hatırlatma",
    body: '"Bir hafta sonra hatırlat" deyin; günü gelince e-postanıza düşer, WhatsApp mesajı hazır yazılmış olur.',
  },
  {
    icon: Users,
    title: "Kart şirkette kalır",
    body: "Ekip panelinden kartları dağıtın; çalışan ayrılınca kartı yenisine atayın, fiziksel kart aynı kalır.",
  },
  {
    icon: LockKeyhole,
    title: "Gizli link, kapatılabilir kart",
    body: "Profil adresiniz isminizi değil rastgele bir kodu içerir. Kaybolan kartı panelden tek tıkla kapatırsınız.",
  },
] as const;

export const PROMISE_ITEMS = [
  { icon: Truck, label: `${PROMISES.deliveryHours} saatte teslim` },
  { icon: RefreshCw, label: "Okunmazsa ücretsiz değişim" },
  { icon: PackageCheck, label: "Kargo ücretsiz" },
  { icon: Smartphone, label: "Uygulama gerekmez" },
] as const;

/** One row of the delivery and replacement promises. */
export function PromiseStrip({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-4 text-sm font-medium sm:flex sm:flex-wrap sm:gap-x-8",
        className,
      )}
    >
      {PROMISE_ITEMS.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2.5">
          <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}

export function WhyDijivizit({
  className,
  headingLevel = "h2",
}: {
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <section className={cn("flex flex-col gap-12", className)}>
      <div className="flex max-w-2xl flex-col gap-4">
        <p className="text-sm font-medium tracking-wide text-muted-foreground">Neden Dijivizit</p>
        <Heading className="text-3xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
          Kartvizitten fazlası, sadece Dijivizit&apos;te.
        </Heading>
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
          Kart herkesin elinde var. Kartı verdikten sonra olanlar bizde farklı.
        </p>
      </div>
      <ul className="grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex flex-col gap-3 bg-background p-7 sm:p-8">
            <span className="flex size-10 items-center justify-center rounded-full bg-neutral-950 text-white">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="leading-relaxed text-pretty text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>
      <PromiseStrip className="border-t border-border/60 pt-8" />
    </section>
  );
}
