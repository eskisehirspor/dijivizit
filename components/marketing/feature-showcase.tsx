import QRCode from "qrcode";
import type { ReactNode } from "react";

/* Small, static recreations of the real screens. Names and numbers are fictional. */

function Frame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={
        dark
          ? "flex h-72 items-center justify-center overflow-hidden rounded-3xl bg-neutral-950 p-6"
          : "flex h-72 items-center justify-center overflow-hidden rounded-3xl bg-neutral-100 p-6"
      }
    >
      {children}
    </div>
  );
}

function LeaveMock() {
  return (
    <Frame>
      <div className="w-full max-w-[15rem] rounded-2xl bg-white p-4 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)]">
        <p className="text-[13px] font-semibold">Bilgilerinizi bırakın</p>
        <p className="mt-0.5 text-[10px] leading-snug text-neutral-500">
          Elif Kaya sizi geri arasın ya da size yazsın.
        </p>
        {["Mert Aydın", "0532 418 27 60", "mert@aydinyapi.com"].map((v) => (
          <div
            key={v}
            className="mt-2 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-[11px] text-neutral-800"
          >
            {v}
          </div>
        ))}
        <div className="mt-3 rounded-lg bg-neutral-950 py-2 text-center text-[11px] font-medium text-white">
          Gönder
        </div>
      </div>
    </Frame>
  );
}

function ContactsMock() {
  const rows = [
    ["Mert Aydın", "Aydın Yapı · Karttan", "Takip: 28 Ekim"],
    ["Zeynep Arslan", "Mimar · #fuar", ""],
    ["Can Özdemir", "Özdemir Lojistik", "Takip: yarın"],
  ];
  return (
    <Frame>
      <div className="w-full max-w-[16rem] divide-y divide-neutral-200 rounded-2xl bg-white shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)]">
        {rows.map(([name, sub, due]) => (
          <div key={name} className="flex items-center justify-between gap-2 px-3.5 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium">{name}</p>
              <p className="truncate text-[10px] text-neutral-500">{sub}</p>
            </div>
            {due ? <span className="shrink-0 text-[10px] text-neutral-700">{due}</span> : null}
          </div>
        ))}
        <div className="px-3.5 py-2.5 text-[10px] leading-snug text-neutral-500">
          Not: Fuarda tanıştık, showroom için teklif istiyor.
        </div>
      </div>
    </Frame>
  );
}

function FollowUpMock() {
  return (
    <Frame>
      <div className="w-full max-w-[16rem] rounded-2xl bg-white p-4 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)]">
        <p className="text-[10px] text-neutral-500">Bugün 08:00 · Dijivizit</p>
        <p className="mt-1 text-[13px] font-semibold">Günaydın Elif,</p>
        <p className="mt-0.5 text-[11px] leading-snug text-neutral-600">
          Bugün takip: <span className="font-medium text-neutral-900">Mert Aydın</span> · teklifi
          gönder
        </p>
        <div className="mt-3 flex gap-2">
          <div className="flex-1 rounded-lg bg-[#25D366] py-2 text-center text-[11px] font-medium text-white">
            WhatsApp&apos;tan yaz
          </div>
          <div className="rounded-lg border border-neutral-200 px-3 py-2 text-[11px]">Ara</div>
        </div>
      </div>
    </Frame>
  );
}

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[18.6rem] w-[8.6rem] shrink-0 self-start rounded-[1.6rem] bg-neutral-950 p-[5px] shadow-[0_24px_40px_-18px_rgba(0,0,0,0.55)]">
      <div className="relative h-full w-full overflow-hidden rounded-[1.3rem]">{children}</div>
      <span className="absolute top-[9px] left-1/2 h-[9px] w-10 -translate-x-1/2 rounded-full bg-neutral-950" />
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 12 12" className="size-2.5 shrink-0 text-emerald-600">
      <path
        d="M2.5 6.2 5 8.5l4.5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScanMock() {
  return (
    <Frame>
      <div className="flex items-center gap-4 self-start">
        <Phone>
          {/* Camera view: a printed card on a desk, framed by scan guides. */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,#8b7b68,#4a3f33_70%)]" />
          <div className="absolute inset-x-0 top-0 flex justify-between px-3 pt-6 text-[7px] font-medium text-white/80">
            <span>Kartvizit tara</span>
            <span>Otomatik</span>
          </div>
          <div className="absolute top-[24%] left-1/2 w-[86%] -translate-x-1/2 rotate-[-3deg]">
            <div className="aspect-[1.75] rounded-[3px] bg-[#fbfaf6] p-[7px] shadow-[0_6px_14px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between">
                <span className="text-[7px] font-bold tracking-wide text-[#1d3557]">KUZEY</span>
                <span className="size-2.5 rounded-sm bg-[#1d3557]" />
              </div>
              <p className="mt-[6px] text-[8px] leading-none font-semibold text-neutral-900">
                Selin Yıldız
              </p>
              <p className="mt-[2px] text-[5.5px] text-neutral-500">Satın Alma Müdürü</p>
              <div className="mt-[5px] space-y-[1.5px] text-[5px] text-neutral-700">
                <p>+90 533 702 14 88</p>
                <p>selin@kuzeytekstil.com</p>
              </div>
            </div>
            {[
              "top-[-5px] left-[-5px] border-t-2 border-l-2 rounded-tl-md",
              "top-[-5px] right-[-5px] border-t-2 border-r-2 rounded-tr-md",
              "bottom-[-5px] left-[-5px] border-b-2 border-l-2 rounded-bl-md",
              "bottom-[-5px] right-[-5px] border-b-2 border-r-2 rounded-br-md",
            ].map((c) => (
              <span key={c} className={`absolute size-3 border-white ${c}`} />
            ))}
            <span className="absolute inset-x-1 top-[88%] h-px bg-white/80 shadow-[0_0_6px_1px_rgba(255,255,255,0.6)]" />
          </div>
          <div className="absolute inset-x-0 bottom-4 flex justify-center">
            <span className="size-8 rounded-full border-2 border-white/90 p-[3px]">
              <span className="block size-full rounded-full bg-white" />
            </span>
          </div>
        </Phone>
        <div className="w-[9.6rem] rounded-xl bg-white p-3 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)]">
          <p className="text-[9px] font-semibold">Okunan bilgiler</p>
          <div className="mt-2 space-y-1.5 text-[8.5px]">
            {[
              ["Ad", "Selin Yıldız"],
              ["Unvan", "Satın Alma Müdürü"],
              ["Şirket", "Kuzey Tekstil"],
              ["Telefon", "0533 702 14 88"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5">
                <Check />
                <span className="w-8 shrink-0 text-neutral-400">{k}</span>
                <span className="truncate text-neutral-900">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-2.5 rounded-md bg-neutral-950 py-1.5 text-center text-[8.5px] font-medium text-white">
            Kişilere kaydet
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Qr({ text, className }: { text: string; className?: string }) {
  // A real, scannable QR code drawn as one SVG path.
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  let d = "";
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) if (qr.modules.get(x, y)) d += `M${x} ${y}h1v1h-1z`;
  return (
    <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} className={className} shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={n + 4} height={n + 4} fill="#fff" />
      <path d={d} fill="#0a0a0a" />
    </svg>
  );
}

function Glass({ children, className = "" }: { children: ReactNode; className?: string }) {
  // iOS "Liquid Glass" control: translucent fill, blur, bright rim.
  return (
    <span
      className={`flex items-center justify-center border border-white/25 bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_10px_rgba(0,0,0,0.25)] backdrop-blur-md ${className}`}
    >
      {children}
    </span>
  );
}

function WalletMock() {
  // A real iPhone proportion (≈ 9:19.5) at ~0.6 pt scale, cropped by the frame.
  return (
    <div
      aria-hidden="true"
      className="relative h-72 overflow-hidden rounded-3xl bg-[radial-gradient(120%_90%_at_50%_0%,#2b2b31,#0a0a0b_70%)]"
    >
      <div className="absolute top-5 left-1/2 h-[31rem] w-[14.6rem] -translate-x-1/2 rounded-[2.6rem] bg-[#1c1c1e] p-[6px] shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_30px_60px_-10px_rgba(0,0,0,0.8)]">
        <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] bg-black">
          {/* Status bar + Dynamic Island */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 pt-[13px] text-[10px] font-semibold text-white">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="flex items-end gap-[1.5px]">
                {[4, 5.5, 7, 8.5].map((h) => (
                  <span
                    key={h}
                    className="w-[2.5px] rounded-[1px] bg-white"
                    style={{ height: h }}
                  />
                ))}
              </span>
              <span className="h-[8px] w-[16px] rounded-[3px] border border-white/60 p-[1px]">
                <span className="block h-full w-[78%] rounded-[1.5px] bg-white" />
              </span>
            </span>
          </div>
          <span className="absolute top-[10px] left-1/2 h-[17px] w-[56px] -translate-x-1/2 rounded-full bg-[#050505]" />

          {/* Liquid Glass navigation */}
          <div className="absolute inset-x-3 top-[40px] flex items-center justify-between">
            <Glass className="h-[26px] rounded-full px-3 text-[10px] font-semibold">Bitti</Glass>
            <Glass className="size-[26px] rounded-full text-[13px] leading-none">⋯</Glass>
          </div>

          {/* Poster-style pass */}
          <div className="absolute inset-x-[10px] top-[76px] h-[12.6rem] overflow-hidden rounded-[20px] shadow-[0_14px_30px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 bg-[linear-gradient(140deg,#3b3b40_0%,#17171a_42%,#29292d_68%,#0e0e10_100%)]" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.045)_0px,rgba(255,255,255,0.045)_1px,transparent_1px,transparent_3px)]" />
            <div className="absolute inset-0 bg-[radial-gradient(80%_45%_at_25%_5%,rgba(255,255,255,0.2),transparent_70%)]" />
            <div className="relative flex h-full flex-col p-3.5 text-white">
              <div className="flex items-start justify-between">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold tracking-tight">
                  <span className="size-[18px]">
                    <svg viewBox="0 0 24 24" width="100%" height="100%">
                      <rect x="2" y="2" width="20" height="20" rx="6" fill="#fff" />
                      <circle cx="8.6" cy="12" r="1.35" fill="#17171a" />
                      <g fill="none" stroke="#17171a" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M12.1 8.3a4.6 4.6 0 0 1 0 7.4" />
                        <path d="M15.4 5.9a8.6 8.6 0 0 1 0 12.2" />
                      </g>
                    </svg>
                  </span>
                  Dijivizit
                </span>
                <span className="text-right text-[6.5px] leading-tight tracking-wider text-white/60">
                  KARTVİZİT
                  <span className="block text-[9px] tracking-normal text-white">Dijital</span>
                </span>
              </div>
              <p className="mt-3 text-[21px] leading-none font-semibold tracking-tight">
                Elif Kaya
              </p>
              <p className="mt-1.5 text-[9px] text-white/70">İç Mimar · Kaya Tasarım</p>
              <div className="mt-auto flex flex-col items-center gap-1.5">
                <span className="rounded-[10px] bg-white p-[5px]">
                  <Qr text="https://dijivizit.com" className="size-[4.6rem]" />
                </span>
                <span className="text-[7.5px] text-white/60">Okutun, kartım açılsın</span>
              </div>
            </div>
          </div>

          {/* Featured actions (cropped by the frame on small tiles) */}
          <div className="absolute inset-x-[10px] top-[286px] grid grid-cols-2 gap-2">
            {["Profili aç", "Rehbere kaydet"].map((label) => (
              <Glass key={label} className="h-[34px] rounded-[14px] text-[9px] font-medium">
                {label}
              </Glass>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamMock() {
  const rows = [
    ["Kart 01", "Ayşe Demir", "142"],
    ["Kart 02", "Burak Koç", "87"],
    ["Kart 03", "Atanmamış", "—"],
  ];
  return (
    <Frame>
      <div className="w-full max-w-[16.5rem] rounded-2xl bg-white p-3.5 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)]">
        <p className="text-[12px] font-semibold">Acme Mobilya · Şirket kartları</p>
        <div className="mt-2 divide-y divide-neutral-200">
          {rows.map(([card, who, views]) => (
            <div key={card} className="flex items-center gap-2 py-1.5 text-[10px]">
              <span className="w-10 shrink-0 text-neutral-500">{card}</span>
              <span className="flex-1 truncate rounded-md border border-neutral-200 px-1.5 py-0.5">
                {who} ▾
              </span>
              <span className="w-8 shrink-0 text-right text-neutral-500">{views}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[9px] text-neutral-500">30 günlük görüntülenme</p>
      </div>
    </Frame>
  );
}

const FEATURES = [
  {
    title: "Karşı taraf da bilgisini bırakır",
    body: 'Kartınızı açan kişi "Bilgilerimi bırak"a dokunur; adı ve numarası anında size gelir. Tanışma tek yönlü kalmaz.',
    mock: <LeaveMock />,
  },
  {
    title: "Kişi listesi ve notlar",
    body: "Kimle nerede tanıştığınızı unutmayın. Not alın, etiketleyin, arayın; listeyi Excel'e aktarın.",
    mock: <ContactsMock />,
  },
  {
    title: "Takip hatırlatması",
    body: '"Bir hafta sonra hatırlat" deyin. Günü gelince sabah e-postanıza düşer; WhatsApp mesajı hazır yazılmış olur.',
    mock: <FollowUpMock />,
  },
  {
    title: "Kâğıt kartvizit tarama",
    body: "Size verilen kâğıt kartın fotoğrafını çekin; ad, unvan, şirket ve telefon kendiliğinden doldurulsun.",
    mock: <ScanMock />,
  },
  {
    title: "Apple Cüzdan'da kartınız",
    body: "Kartınızı iPhone Cüzdan'a ekleyin. Fiziksel kart yanınızda değilken QR'ı gösterin, karşınızdaki okutsun.",
    mock: <WalletMock />,
  },
  {
    title: "Ekip paneli ve kart devri",
    body: "Şirket kartlarını tek yerden yönetin. Çalışan ayrılınca kartı yenisine atayın; fiziksel kart aynı kalır.",
    mock: <TeamMock />,
  },
];

export function FeatureShowcase() {
  return (
    <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((f) => (
        <li key={f.title} className="flex flex-col gap-5">
          {f.mock}
          <div className="flex flex-col gap-2 px-1">
            <h3 className="text-xl font-semibold tracking-tight">{f.title}</h3>
            <p className="text-base leading-relaxed text-pretty text-muted-foreground">{f.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
