/** A tall lifestyle photo shown beside a text section (below it on phones). */
export function LifestyleImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element -- static stills; no image optimizer on Workers */}
        <img
          src={src}
          alt={alt}
          width={928}
          height={1152}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
