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
  place: "top" | "bottom" | "left" | "right" | "hero";
  /** The page's main heading; its kicker becomes part of the h1. */
  heading?: "h1" | "h2";
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

/** Share of the screen height the mobile frames fill on phones (see paint). */
const PORTRAIT_SCALE = 0.86;
/** Room the bottom captions need on phones, in CSS pixels. */
const CAPTION_PX = 200;

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

    const portrait = window.matchMedia("(max-aspect-ratio: 11/10)").matches;
    const source = portrait && mobile ? mobile : desktop;
    const frames: (HTMLImageElement | null)[] = new Array(source.count).fill(null);
    // The image currently on the canvas. Repaint whenever the best loaded
    // frame for the scroll position changes (scrolling, or a closer frame
    // finishing its download).
    let drawn: HTMLImageElement | null = null;
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

    // Backdrop colour of a frame: its bottom corners, averaged, sampled once.
    const probe = document.createElement("canvas");
    probe.width = probe.height = 1;
    const probeCtx = probe.getContext("2d", { willReadFrequently: true });
    const backdrops = new WeakMap<HTMLImageElement, string>();
    const backdrop = (img: HTMLImageElement) => {
      const cached = backdrops.get(img);
      if (cached) return cached;
      let color = "rgb(233, 232, 230)";
      if (probeCtx) {
        const sw = img.naturalWidth;
        const sh = img.naturalHeight;
        const px = (sx: number) => {
          probeCtx.drawImage(img, sx, sh - 24, 24, 24, 0, 0, 1, 1);
          return probeCtx.getImageData(0, 0, 1, 1).data;
        };
        const a = px(0);
        const b = px(sw - 24);
        color = `rgb(${(a[0]! + b[0]!) >> 1}, ${(a[1]! + b[1]!) >> 1}, ${(a[2]! + b[2]!) >> 1})`;
      }
      backdrops.set(img, color);
      return color;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      drawn = null; // resizing clears the canvas
    };

    const paint = (img: HTMLImageElement) => {
      drawn = img;
      if (!portrait || !mobile) {
        // object-fit: cover
        const scale = Math.max(canvas.width / source.width, canvas.height / source.height);
        const w = source.width * scale;
        const h = source.height * scale;
        ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        return;
      }
      // Phones: draw the frame a little smaller and from the top, so the phone
      // in the render ends above the captions at the bottom of the screen.
      const cw = canvas.width;
      const ch = canvas.height;
      const cover = Math.max(cw / source.width, ch / source.height);
      // Keep the bottom of the rendered phone (at most about 78% down the frame) above
      // the caption block, whose height is fixed in CSS pixels.
      const dpr = cw / Math.max(1, canvas.clientWidth);
      const fit = (ch - CAPTION_PX * dpr) / 0.78;
      const scale = Math.min(cover, (PORTRAIT_SCALE * ch) / source.height, fit / source.height);
      const w = source.width * scale;
      const h = source.height * scale;
      const x = (cw - w) / 2;
      const y = Math.min(0, (ch - h) / 2);
      // Fill the screen with the frame's backdrop colour, then fade the frame's
      // edges into it, so objects cut by the frame edge (a card coming into
      // view) melt away instead of being smeared.
      const bg = backdrop(img);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, w, h);
      const clear = bg.replace("rgb(", "rgba(").replace(")", ", 0)");
      const fade = (x0: number, y0: number, x1: number, y1: number) => {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, clear);
        g.addColorStop(1, bg);
        return g;
      };
      if (y + h < ch) {
        const f = h * 0.18;
        ctx.fillStyle = fade(0, y + h - f, 0, y + h);
        ctx.fillRect(0, y + h - f, cw, f + 1);
      }
      if (x > 0) {
        const f = w * 0.08;
        ctx.fillStyle = fade(x + f, 0, x, 0);
        ctx.fillRect(x - 1, 0, f + 1, ch);
        ctx.fillStyle = fade(x + w - f, 0, x + w, 0);
        ctx.fillRect(x + w - f, 0, f + 1, ch);
      }
    };

    const tick = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const span = Math.max(1, section.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, -rect.top / span));
      setProgress(p);
      const img = nearestLoaded(Math.round(p * (source.count - 1)));
      if (img && img !== drawn) paint(img);
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
            schedule();
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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-white/85 via-white/40 to-transparent land:h-56 land:from-white/55 land:via-transparent" />

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
                // Hero: above the card on phones, beside it on wide screens
                // where the card fills the middle of the frame.
                caption.place === "hero" &&
                  "inset-x-0 top-24 mx-auto items-center text-center sm:top-28 land:inset-x-auto land:top-1/2 land:left-[5vw] land:max-w-[27vw] land:-translate-y-1/2 land:items-start land:px-0 land:text-left [@media(max-height:640px)]:top-20",
                caption.place === "bottom" &&
                  "inset-x-0 bottom-10 mx-auto items-center text-center sm:bottom-20",
                caption.place === "left" &&
                  "inset-x-0 bottom-10 mx-auto items-center text-center land:inset-x-auto land:top-1/2 land:bottom-auto land:left-[6vw] land:-translate-y-1/2 land:items-start land:text-left",
                caption.place === "right" &&
                  "inset-x-0 bottom-10 mx-auto items-center text-center land:inset-x-auto land:top-1/2 land:right-[6vw] land:bottom-auto land:-translate-y-1/2 land:items-start land:text-left",
              )}
              style={{
                opacity,
                transform: `translateY(${(1 - opacity) * 12}px)`,
              }}
            >
              {caption.heading === "h1" ? (
                <h1 className="flex flex-col gap-3">
                  {caption.kicker ? (
                    <span className="text-sm font-medium tracking-wide text-neutral-600">
                      {caption.kicker}
                    </span>
                  ) : null}
                  <span className="text-4xl leading-[1.05] font-semibold tracking-tight text-neutral-950 land:text-6xl [@media(max-height:640px)]:text-3xl">
                    {caption.title}
                  </span>
                </h1>
              ) : (
                <>
                  {caption.kicker ? (
                    <p className="text-sm font-medium tracking-wide text-neutral-600">
                      {caption.kicker}
                    </p>
                  ) : null}
                  <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-neutral-950 land:text-6xl [@media(max-height:640px)]:text-3xl">
                    {caption.title}
                  </h2>
                </>
              )}
              {caption.body ? (
                <p className="max-w-md text-base leading-relaxed text-pretty text-neutral-700 sm:text-lg [@media(max-height:640px)]:text-sm">
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
