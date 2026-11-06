/**
 * Product photos as a swipeable strip (CSS scroll-snap, no JS). With one
 * image it is just the image.
 */
export function ProductGallery({ images }: { images: { src: string; alt: string }[] }) {
  const many = images.length > 1;
  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Ürün fotoğrafları"
        tabIndex={0}
      >
        {images.map((img, i) => (
          <div
            key={img.src}
            className={`relative aspect-[4/5] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#d9d6d1] ${many ? "w-[88%]" : "w-full"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static stills; no image optimizer on Workers */}
            <img
              src={img.src}
              alt={img.alt}
              width={1600}
              height={2000}
              fetchPriority={i === 0 ? "high" : "auto"}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
      {many ? (
        <p className="text-xs text-muted-foreground">
          {images.length} fotoğraf · kaydırarak görün
        </p>
      ) : null}
    </div>
  );
}
