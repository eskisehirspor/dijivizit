import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type CardFinish = "matte-black" | "brushed-steel" | "brushed-gold" | "walnut" | "bamboo";
type EngraveTone = "light" | "dark";

type CardSpec = {
  finish: CardFinish;
  tone: EngraveTone;
  rotate: number;
  x: number;
  y: number;
  z: number;
  edge: string;
};

/**
 * Composition from the blank-card reference only:
 * front card nearly upright, each following card opens clockwise
 * and drops down-right until the last sits almost flat.
 */
const CARDS: CardSpec[] = [
  {
    finish: "matte-black",
    tone: "light",
    rotate: -72,
    x: -5.2,
    y: -5.6,
    z: 50,
    edge: "#0c0c0c",
  },
  {
    finish: "brushed-steel",
    tone: "dark",
    rotate: -48,
    x: -2.4,
    y: -3.4,
    z: 40,
    edge: "#5a5a58",
  },
  {
    finish: "brushed-gold",
    tone: "dark",
    rotate: -26,
    x: 0.4,
    y: -1.4,
    z: 30,
    edge: "#5c4a2e",
  },
  {
    finish: "walnut",
    tone: "light",
    rotate: -8,
    x: 2.6,
    y: 0.4,
    z: 20,
    edge: "#1c1008",
  },
  {
    finish: "bamboo",
    tone: "dark",
    rotate: 6,
    x: 3.8,
    y: 2.2,
    z: 10,
    edge: "#7a6438",
  },
];

function Surface({ finish }: { finish: CardFinish }) {
  if (finish === "walnut") {
    return (
      <>
        <div className="absolute inset-0 bg-[#4a2f1c]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(168deg, #6b4428 0%, #4a2f1c 22%, #3a2416 48%, #2c1a10 72%, #24150c 100%)",
              "repeating-linear-gradient(92deg, transparent 0px, transparent 1px, rgb(18 8 3 / 0.35) 1px, rgb(18 8 3 / 0.35) 2px, transparent 2px, transparent 5px, rgb(90 50 28 / 0.18) 5px, rgb(90 50 28 / 0.18) 6px)",
              "repeating-linear-gradient(88deg, transparent 0px, transparent 7px, rgb(20 8 4 / 0.22) 7px, rgb(20 8 4 / 0.22) 8px)",
              "repeating-linear-gradient(95deg, transparent 0px, transparent 18px, rgb(110 70 40 / 0.12) 18px, rgb(110 70 40 / 0.12) 20px)",
            ].join(", "),
          }}
        />
        <div
          className="absolute inset-0 opacity-40 mix-blend-soft-light"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 90% 40% at 20% 30%, rgb(140 90 50 / 0.5), transparent 50%), radial-gradient(ellipse 60% 50% at 75% 70%, rgb(30 12 5 / 0.45), transparent 55%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.06),transparent_35%,rgb(0_0_0/0.22))]" />
      </>
    );
  }

  if (finish === "bamboo") {
    return (
      <>
        <div className="absolute inset-0 bg-[#cbb892]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(168deg, #e8d9b4 0%, #d4c292 28%, #c4ae7a 55%, #b49a68 78%, #a68c58 100%)",
              "repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgb(130 100 50 / 0.14) 3px, rgb(130 100 50 / 0.14) 4px)",
              "repeating-linear-gradient(90deg, transparent 0px, transparent 11px, rgb(100 75 35 / 0.1) 11px, rgb(100 75 35 / 0.1) 12px)",
              "repeating-linear-gradient(0deg, transparent 0px, transparent 22px, rgb(150 120 60 / 0.16) 22px, rgb(150 120 60 / 0.16) 23px, transparent 23px, transparent 24px, rgb(90 70 30 / 0.1) 24px, rgb(90 70 30 / 0.1) 25px)",
            ].join(", "),
          }}
        />
        <div
          className="absolute inset-0 opacity-35 mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 40% 80% at 35% 50%, transparent 40%, rgb(120 90 40 / 0.15) 100%), radial-gradient(ellipse 50% 70% at 70% 40%, transparent 45%, rgb(100 80 35 / 0.12) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.12),transparent_38%,rgb(0_0_0/0.1))]" />
      </>
    );
  }

  if (finish === "matte-black") {
    return (
      <>
        <div className="absolute inset-0 bg-[#0e0e0e]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(152deg, #2a2a2a 0%, #1a1a1a 18%, #111111 42%, #0a0a0a 68%, #050505 100%)",
              "repeating-linear-gradient(108deg, transparent 0px, transparent 0.5px, rgb(255 255 255 / 0.04) 0.5px, rgb(255 255 255 / 0.04) 1px)",
              "repeating-linear-gradient(108deg, transparent 0px, transparent 2px, rgb(255 255 255 / 0.025) 2px, rgb(255 255 255 / 0.025) 3px)",
            ].join(", "),
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgb(255_255_255/0.09)_0%,transparent_22%,transparent_78%,rgb(0_0_0/0.4)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.05),transparent_40%,rgb(0_0_0/0.45))]" />
      </>
    );
  }

  if (finish === "brushed-steel") {
    return (
      <>
        <div className="absolute inset-0 bg-[#b8b8b6]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              "linear-gradient(152deg, #e8e8e6 0%, #d0d0ce 16%, #b4b4b2 38%, #9a9a98 62%, #8c8c8a 82%, #7e7e7c 100%)",
              "repeating-linear-gradient(112deg, transparent 0px, transparent 0.5px, rgb(255 255 255 / 0.45) 0.5px, rgb(255 255 255 / 0.45) 1px)",
              "repeating-linear-gradient(112deg, transparent 0px, transparent 1.5px, rgb(0 0 0 / 0.07) 1.5px, rgb(0 0 0 / 0.07) 2px)",
              "repeating-linear-gradient(112deg, transparent 0px, transparent 4px, rgb(255 255 255 / 0.12) 4px, rgb(255 255 255 / 0.12) 5px)",
            ].join(", "),
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(118deg,rgb(255_255_255/0.42)_0%,rgb(255_255_255/0.12)_18%,transparent_35%,transparent_68%,rgb(0_0_0/0.14)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.22),transparent_32%,rgb(0_0_0/0.16))]" />
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-0 bg-[#b8975c]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(152deg, #e0c894 0%, #d0b478 14%, #b8985c 36%, #a08048 58%, #8e6e3c 78%, #7a5c30 100%)",
            "repeating-linear-gradient(112deg, transparent 0px, transparent 0.5px, rgb(255 240 200 / 0.4) 0.5px, rgb(255 240 200 / 0.4) 1px)",
            "repeating-linear-gradient(112deg, transparent 0px, transparent 1.5px, rgb(60 40 15 / 0.1) 1.5px, rgb(60 40 15 / 0.1) 2px)",
            "repeating-linear-gradient(112deg, transparent 0px, transparent 4px, rgb(255 220 160 / 0.1) 4px, rgb(255 220 160 / 0.1) 5px)",
          ].join(", "),
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(118deg,rgb(255_245_210/0.38)_0%,rgb(255_230_180/0.1)_20%,transparent_38%,transparent_70%,rgb(50_35_12/0.18)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.18),transparent_34%,rgb(0_0_0/0.18))]" />
    </>
  );
}

function NfcGlyph({ tone }: { tone: EngraveTone }) {
  return (
    <div
      className={cn(
        "absolute top-3.5 right-3.5",
        tone === "light" ? "text-white/28" : "text-black/26",
      )}
      style={{
        filter:
          tone === "light"
            ? "drop-shadow(0 1px 0 rgb(0 0 0 / 0.55))"
            : "drop-shadow(0 1px 0 rgb(255 255 255 / 0.32))",
      }}
    >
      <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
        <circle cx="4.2" cy="8" r="1.05" fill="currentColor" />
        <path
          d="M6.7 5.3a3.8 3.8 0 0 1 0 5.4M9 3.6a6.2 6.2 0 0 1 0 8.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function EngravedCopy({
  tone,
  company,
  name,
}: {
  tone: EngraveTone;
  company: string;
  name: string;
}) {
  const light = tone === "light";
  const emboss = light
    ? "0 1px 0 rgb(0 0 0 / 0.55), 0 -0.5px 0 rgb(255 255 255 / 0.08)"
    : "0 1px 0 rgb(255 255 255 / 0.4), 0 -0.5px 0 rgb(0 0 0 / 0.25)";

  return (
    <div
      className={cn(
        "relative z-10 flex flex-col items-center gap-2 px-5 text-center",
        light ? "text-white/36" : "text-black/34",
      )}
    >
      <p
        className="text-[0.625rem] font-medium tracking-[0.16em] uppercase sm:text-[0.6875rem]"
        style={{ textShadow: emboss }}
      >
        {company}
      </p>
      <p
        className="text-[0.875rem] leading-none font-medium tracking-[-0.02em] sm:text-[0.9375rem]"
        style={{ textShadow: emboss }}
      >
        {name}
      </p>
    </div>
  );
}

function ProductCard({
  finish,
  tone,
  edge,
  company,
  name,
}: {
  finish: CardFinish;
  tone: EngraveTone;
  edge: string;
  company: string;
  name: string;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[65%] w-[80%] -translate-x-1/2 -translate-y-[8%] rounded-[100%] bg-black/14 blur-lg"
      />

      {/* Hairline CNC edge — ~0.8mm feel */}
      <div
        aria-hidden="true"
        className="absolute top-px left-px aspect-[1.586/1] w-[11.5rem] rounded-[0.85rem] sm:w-[14rem]"
        style={{
          background: `linear-gradient(145deg, ${edge} 0%, color-mix(in srgb, ${edge} 55%, black) 100%)`,
        }}
      />

      <div
        className={cn(
          "relative flex aspect-[1.586/1] w-[11.5rem] items-center justify-center overflow-hidden rounded-[0.85rem] sm:w-[14rem]",
          "shadow-[0_0.5px_1px_rgb(0_0_0/0.1),0_8px_22px_-16px_rgb(0_0_0/0.32)]",
        )}
      >
        <Surface finish={finish} />
        <div className="pointer-events-none absolute inset-0 rounded-[0.85rem] ring-1 ring-white/20 ring-inset" />
        <div className="pointer-events-none absolute inset-px rounded-[0.8rem] ring-1 ring-black/10 ring-inset" />
        <NfcGlyph tone={tone} />
        <EngravedCopy tone={tone} company={company} name={name} />
      </div>
    </div>
  );
}

export function MetalCardShowcase() {
  const t = useTranslations("marketing.metalCards");

  return (
    <div
      role="img"
      aria-label={t("label")}
      className="relative mx-auto h-[20rem] w-full max-w-3xl sm:h-[24rem]"
      style={{ perspective: "1200px" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {CARDS.map((card) => (
          <div
            key={card.finish}
            className="absolute origin-center"
            style={{
              zIndex: card.z,
              transform: `translate(${card.x}rem, ${card.y}rem) rotate(${card.rotate}deg)`,
            }}
          >
            <ProductCard
              finish={card.finish}
              tone={card.tone}
              edge={card.edge}
              company={t("company")}
              name={t("name")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
