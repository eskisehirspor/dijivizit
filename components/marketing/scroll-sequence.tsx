"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type SequenceSource = {
  /** Folder under /public, e.g. "/landing/desktop". Frames are 0000.webp… */
  base: string;
  count: number;
  width: number;
  height: number;
};

export type SequenceCaption = {
  start: number;
  end: number;
  kicker?: string;
  title: string;
  body?: string;
  /** Where the copy sits so it never covers the subject in that shot. */
  place: "top" | "bottom" | "left" | "right";
};

const pad = (n: number) => String(n).padStart(4, "0");

/** Coarse-to-fine order: 0, 64, 128, 32, 96, … so early scrubbing already has
 * frames spread across the whole range. */
function loadOrder(count: number): number[] {
  const order: number[] = [];
  const seen = new Set<number>();
  for (let step = 64; step >= 1; step = Math.floor(step / 2)) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

function fade(progress: number, start: number, end: number, edge = 0.04): number {
  if (progress < start - edge || progress > end + edge) return 0;
  const fadeIn = Math.min(1, (progress - (start - edge)) / edge);
  const fadeOut = Math.min(1, (end + edge - progress) / edge);
  return Math.max(0, Math.min(fadeIn, fadeOut));
}

/**
 * Apple-style scroll-scrubbed image sequence: a tall section whose sticky
 * canvas paints the rendered frame matching the scroll position, with captions
 * fading in and out over it.
 */
export function ScrollSequence({
  desktop,
  mobile,
  captions,
  heightVh = 520,
  children,
}: {
  desktop: SequenceSource;
  mobile?: SequenceSource;
  captions: SequenceCaption[];
  heightVh?: number;
  children?: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const portrait = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
    const source = portrait && mobile ? mobile : desktop;
    const frames: (HTMLImageElement | null)[] = new Array(source.count).fill(null);
    let current = -1;
    let raf = 0;
    let cancelled = false;

    const nearestLoaded = (index: number) => {
      for (let d = 0; d < source.count; d++) {
        const a = frames[index - d];
        if (a) return a;
        const b = frames[index + d];
        if (b) return b;
      }
      return null;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      current = -1;
    };

    const draw = (index: number) => {
      const img = nearestLoaded(index);
      if (!img) return;
      // object-fit: cover
      const scale = Math.max(canvas.width / source.width, canvas.height / source.height);
      const w = source.width * scale;
      const h = source.height * scale;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };

    const tick = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const span = Math.max(1, section.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -rect.top / span));
      setProgress(p);
      const index = Math.round(p * (source.count - 1));
      if (index !== current || !frames[index]) {
        current = index;
        draw(index);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = `${source.base}/${pad(i)}.webp`;
        img.onload = () => {
          if (!cancelled) {
            frames[i] = img;
            if (Math.abs(i - current) <= 1 || current === -1) schedule();
          }
          resolve();
        };
        img.onerror = () => resolve();
      });

    (async () => {
      const order = loadOrder(source.count);
      await load(order[0]!);
      // A few requests in flight at a time keeps the first frames snappy.
      const queue = order.slice(1);
      const worker = async () => {
        while (queue.length && !cancelled) await load(queue.shift()!);
      };
      await Promise.all([worker(), worker(), worker(), worker()]);
    })();

    resize();
    tick();
    window.addEventListener("scroll", schedule, { passive: true });
    const onResize = () => {
      resize();
      schedule();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [desktop, mobile]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-[#c9c6c1]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full"
          role="img"
          aria-label="Dijivizit metal kartvizitin telefona dokunup profili açtığı animasyon"
        />
        {/* Soft scrims keep copy legible over the brightest frames. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white/55 to-transparent" />

        {captions.map((caption) => {
          const opacity = fade(progress, caption.start, caption.end);
          return (
            <div
              key={caption.title}
              aria-hidden={opacity < 0.5}
              className={cn(
                "pointer-events-none absolute flex max-w-xl flex-col gap-3 px-6 text-balance",
                caption.place === "top" &&
                  "inset-x-0 top-24 mx-auto items-center text-center sm:top-28",
                caption.place === "bottom" &&
                  "inset-x-0 bottom-16 mx-auto items-center text-center sm:bottom-20",
                caption.place === "left" &&
                  "inset-x-0 bottom-16 mx-auto items-center text-center md:inset-x-auto md:top-1/2 md:bottom-auto md:left-[6vw] md:-translate-y-1/2 md:items-start md:text-left",
                caption.place === "right" &&
                  "inset-x-0 bottom-16 mx-auto items-center text-center md:inset-x-auto md:top-1/2 md:right-[6vw] md:bottom-auto md:-translate-y-1/2 md:items-start md:text-left",
              )}
              style={{
                opacity,
                transform: `translateY(${(1 - opacity) * 12}px)`,
              }}
            >
              {caption.kicker ? (
                <p className="text-sm font-medium tracking-wide text-neutral-600">
                  {caption.kicker}
                </p>
              ) : null}
              <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-neutral-950 sm:text-6xl">
                {caption.title}
              </h2>
              {caption.body ? (
                <p className="max-w-md text-base leading-relaxed text-pretty text-neutral-700 sm:text-lg">
                  {caption.body}
                </p>
              ) : null}
            </div>
          );
        })}

        {children}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center text-xs font-medium tracking-widest text-neutral-600 uppercase transition-opacity duration-500"
          style={{ opacity: progress < 0.03 ? 1 : 0 }}
          aria-hidden="true"
        >
          Kaydır
        </div>
      </div>
    </section>
  );
}
