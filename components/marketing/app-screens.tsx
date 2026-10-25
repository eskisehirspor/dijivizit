const SCREENS = [
  {
    src: "/landing/ui/profil.webp",
    title: "Profil ve iletişim",
    body: "Fotoğraf, unvan ve tek dokunuşla arama, WhatsApp, e-posta ve konum.",
    alt: "Dijivizit dijital kartvizit profili: fotoğraf, ad, unvan, Rehberime Kaydet butonu ve iletişim bağlantıları",
  },
  {
    src: "/landing/ui/banka.webp",
    title: "IBAN ve fatura bilgisi",
    body: "Tek dokunuşla kopyalanır. Yanlış yazılan IBAN derdi biter.",
    alt: "Dijivizit profilinde kopyalanabilir banka ve fatura bilgileri",
  },
  {
    src: "/landing/ui/belgeler.webp",
    title: "Belgeler ve uzmanlık",
    body: "Katalog, özgeçmiş ve uzmanlık alanlarınız aynı sayfada.",
    alt: "Dijivizit profilinde belgeler ve uzmanlık alanları",
  },
  {
    src: "/landing/ui/panel.webp",
    title: "Panelden yönetin",
    body: "Bilgileriniz değişince panelden güncelleyin; kartınız aynı kalır.",
    alt: "Dijivizit yönetim paneli: profil, bağlantılar, banka, fatura ve belgeler",
  },
];

/** Real screens of the app inside simple phone frames. */
export function AppScreens() {
  return (
    <ul className="-mx-6 mt-16 flex snap-x snap-mandatory scroll-pl-6 gap-6 overflow-x-auto px-6 pb-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
      {SCREENS.map((s) => (
        <li key={s.src} className="flex w-[15.5rem] shrink-0 snap-start flex-col gap-5 lg:w-auto">
          <div className="rounded-[2.6rem] bg-neutral-950 p-2.5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]">
            <div className="relative aspect-[390/844] overflow-hidden rounded-[2.1rem] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element -- static screenshots */}
              <img
                src={s.src}
                alt={s.alt}
                width={585}
                height={1266}
                loading="lazy"
                decoding="async"
                className="absolute inset-x-0 top-9 bottom-0 h-[calc(100%-2.25rem)] w-full object-cover object-top"
              />
              <span className="absolute top-2.5 left-1/2 h-6 w-20 -translate-x-1/2 rounded-full bg-neutral-950" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 px-1">
            <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
            <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{s.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
