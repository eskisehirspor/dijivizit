import type { ReactNode } from "react";

/* Small, static recreations of the real screens. Names and numbers are fictional. */

function Frame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={
        dark
          ? "flex h-64 items-center justify-center overflow-hidden rounded-3xl bg-neutral-950 p-6"
          : "flex h-64 items-center justify-center overflow-hidden rounded-3xl bg-neutral-100 p-6"
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

function ScanMock() {
  return (
    <Frame dark>
      <div className="flex w-full max-w-[17rem] items-center gap-3">
        <div className="relative aspect-[1.75] w-28 shrink-0 rotate-[-4deg] rounded-md bg-[#f4efe6] p-2 shadow-lg">
          <div className="h-1.5 w-12 rounded bg-neutral-800" />
          <div className="mt-1 h-1 w-9 rounded bg-neutral-400" />
          <div className="mt-3 h-1 w-14 rounded bg-neutral-500" />
          <div className="mt-1 h-1 w-16 rounded bg-neutral-500" />
          <span className="absolute -inset-1.5 rounded-lg border-2 border-white/80" />
        </div>
        <div className="flex-1 rounded-xl bg-white p-3 text-[10px] leading-relaxed">
          <p className="font-semibold">Selin Yıldız</p>
          <p className="text-neutral-500">Satın Alma Müdürü</p>
          <p className="text-neutral-500">Kuzey Tekstil</p>
          <p className="mt-1">0533 702 14 88</p>
        </div>
      </div>
    </Frame>
  );
}

function QrGlyph() {
  // A decorative, non-scannable pattern.
  const cells = Array.from({ length: 81 }, (_, i) => ((i * 37 + (i % 7) * 11) % 5 < 2 ? 1 : 0));
  return (
    <svg viewBox="0 0 9 9" className="size-16 rounded bg-white p-1">
      {cells.map((on, i) =>
        on ? <rect key={i} x={i % 9} y={Math.floor(i / 9)} width="1" height="1" /> : null,
      )}
      {[
        [0, 0],
        [6, 0],
        [0, 6],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="3" height="3" fill="black" />
          <rect x={x! + 0.6} y={y! + 0.6} width="1.8" height="1.8" fill="white" />
          <rect x={x! + 1.1} y={y! + 1.1} width="0.8" height="0.8" fill="black" />
        </g>
      ))}
    </svg>
  );
}

function WalletMock() {
  return (
    <Frame>
      <div className="w-full max-w-[14rem] rounded-2xl bg-[#111] p-4 text-white shadow-[0_24px_44px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <span>Dijivizit</span>
          <span className="text-[9px] font-normal text-neutral-400">Cüzdan</span>
        </div>
        <p className="mt-4 text-[17px] font-semibold">Elif Kaya</p>
        <p className="text-[10px] text-neutral-400">İç Mimar · Kaya Tasarım</p>
        <div className="mt-4 flex justify-center">
          <QrGlyph />
        </div>
      </div>
    </Frame>
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
