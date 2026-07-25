# Dijivizit UI Standards

Reference points: Apple, Linear, Notion, Stripe. Restrained, typographic, spacious.

This document describes the **current** design system as implemented in the app.
Every new feature should follow these values unless a change is explicitly approved.

Companion rule: `.cursor/rules/design-language.mdc`.

---

## Principles

- Whitespace carries hierarchy. Prefer spacing before borders, fills, or dividers.
- Typography does the work. At most two font weights per screen.
- One primary action per view. Everything else is a ghost button or a text link.
- Neutral-forward palette. `--brand` is for identity moments only; never large surfaces.
- Motion is subtle. Honour `prefers-reduced-motion` (global in `app/globals.css`).
- **Discoverability.** Every new page must be reachable through the application UI
  without typing a URL. A route that exists but has no obvious in-app navigation is
  incomplete. Text navigation links must look interactive (e.g. underline), never like
  inert muted copy.

### Never

- Gradient backgrounds, gradient text, or coloured blur blobs
- Eyebrow “pill” badges above headings
- Oversized illustrations, 3D renders, or stock hero imagery
- Marketing feature grids, testimonials, logo walls, or pricing tables unless asked
- Emoji as iconography
- Heavy multi-layer shadows on interactive UI chrome

---

## Layout

### Max content width

| Surface                       | Width            | Classes       |
| ----------------------------- | ---------------- | ------------- |
| Marketing, dashboard, profile | `48rem` (768px)  | `max-w-3xl`   |
| Auth forms                    | `24rem` (384px)  | `max-w-sm`    |
| Public card page              | `24rem` (384px)  | `max-w-sm`    |
| Dialogs                       | `24rem` on `sm+` | `sm:max-w-sm` |

Shells use `mx-auto w-full max-w-3xl`.

### Horizontal page padding (mobile + desktop)

- Standard inset: `px-6` (24px)
- Header height: `h-16` (64px)

### Vertical page padding

| Context                  | Mobile         | `sm+`          |
| ------------------------ | -------------- | -------------- |
| Dashboard / profile main | `py-12` (48px) | `py-16` (64px) |
| Auth shell               | `py-20` (80px) | same           |
| Empty / error pages      | `py-24` (96px) | same           |
| Marketing hero           | `pt-28 pb-32`  | `sm:pt-40`     |

### Section spacing

Vertical rhythm between major blocks on a page:

| Context              | Gap     | Classes           |
| -------------------- | ------- | ----------------- |
| Dashboard home       | 48px    | `gap-12`          |
| Profile edit / links | 40px    | `gap-10`          |
| Forms (field stacks) | 20–24px | `gap-5` / `gap-6` |
| Inline action groups | 24px    | `gap-6`           |

### Grid gaps

| Context                                | Gap           | Classes           |
| -------------------------------------- | ------------- | ----------------- |
| Quick-action / card grids              | 12–16px       | `gap-3` / `gap-4` |
| Two-column grids                       | break at `sm` | `sm:grid-cols-2`  |
| Form field internals (label → control) | 8px           | `gap-2`           |

### Mobile spacing

- Keep `px-6` on all primary shells; do not drop below 24px horizontal inset.
- Prefer single-column stacks by default; introduce `sm:grid-cols-2` only for peer cards.
- Stack URL + button and similar pairs with `flex-col gap-3`, then `sm:flex-row`.
- Touch targets for primary controls: prefer `h-10` (40px) on auth and profile forms.

---

## Cards

### When to use a card

Cards are for **interaction containers** (status panels, quick actions, link rows).
If removing the border does not hurt understanding, do not use a card.
Never put cards in a marketing hero.

### Internal card padding

- Standard: **24px** — `p-6`
- Applies to dashboard status, quick actions, link rows, and add-link forms

### Card spacing (between cards)

- List of cards: `gap-4` (16px)
- Quick-action grid: `gap-3` (12px)

### Card chrome

```
rounded-lg border border-border/60 p-6
```

- Hover (interactive): `hover:border-border hover:bg-muted/40`
- Disabled / coming soon: `opacity-50 cursor-not-allowed`
- Inner stack (icon → title → description): `gap-3` (12px)

---

## Radius

Base token: `--radius: 0.5rem` (8px).

| Token / class  | Approx. size     | Typical use                     |
| -------------- | ---------------- | ------------------------------- |
| `rounded-lg`   | 8px (`--radius`) | Inputs, buttons, cards, selects |
| `rounded-xl`   | ~11px            | Dialogs, shadcn Card primitive  |
| `rounded-full` | pill / circle    | Switch, avatars, icon chips     |

Do not invent one-off radii for new features.

---

## Controls

### Input height

- Auth and profile forms: **`h-10`** (40px)
- Base `Input` primitive defaults denser (`h-8`); override with `h-10` in product forms via `FormField`
- Textarea: `min-h-24` / about field `min-h-32`, `rounded-lg`

### Button height

| Context                                      | Height                      | Notes                |
| -------------------------------------------- | --------------------------- | -------------------- |
| Primary form actions (login, save, add link) | `h-10`                      | Explicit override    |
| Header / compact chrome                      | `size="sm"` → `h-7`         | Logout, nav          |
| Icon-only row actions                        | `size="icon-sm"` → `size-7` | Move up/down, delete |

Variants in use: `default` (primary), `outline`, `ghost`, `destructive`.
One filled primary per view.

### Icon sizes

| Use                               | Size               | Classes  |
| --------------------------------- | ------------------ | -------- |
| Default UI icons (`lucide-react`) | 16px               | `size-4` |
| Toast icons                       | 16px               | `size-4` |
| Dense icon buttons                | follow button size | —        |

No emoji as icons. Prefer `strokeWidth={1.75}` only when matching existing product chrome (e.g. card preview).

---

## Typography hierarchy

Fonts: Geist (`--font-sans`) and Geist Mono (`--font-geist-mono`). Latin + latin-ext.

| Role                             | Typical classes                                                    |
| -------------------------------- | ------------------------------------------------------------------ |
| Page title (dashboard / profile) | `text-2xl font-semibold tracking-tight text-balance`               |
| Marketing hero                   | `text-4xl` (or larger) `font-semibold tracking-tight text-balance` |
| Auth title                       | `~text-[1.75rem]` / `text-2xl font-semibold text-balance`          |
| Section label                    | `text-sm font-medium`                                              |
| Body / subtitle                  | `text-sm text-pretty text-muted-foreground`                        |
| Field label                      | `text-xs font-medium text-muted-foreground`                        |
| Meta / counters                  | `text-xs text-muted-foreground tabular-nums`                       |
| Monospace (URLs, IDs)            | `font-mono text-sm`                                                |

Weights: prefer `font-medium` and `font-semibold` only. Avoid bold + black on the same screen.
Headings use `tracking-tight` globally for `h1–h3`.

---

## Color usage

Neutral interface palette via CSS variables (`--background`, `--foreground`, `--muted-foreground`, `--border`, `--primary`, etc.).

| Token                              | Use                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| `--foreground` / `text-foreground` | Primary text                                                                      |
| `--muted-foreground`               | Secondary text, labels, hints                                                     |
| `--primary`                        | Primary buttons (near-black / near-white by theme)                                |
| `--border` / `border-border/60`    | Hairline card and header rules                                                    |
| `--destructive`                    | Errors, destructive actions                                                       |
| `--brand`                          | Identity moments only (wordmark accents, rare highlights) — **never** large fills |
| `--success` / `--warning`          | Status semantics when needed; keep low chroma                                     |

No purple-on-white startup gradients. No large brand-colored surfaces.

---

## Borders

- Default card / panel: `border border-border/60`
- Header rule: `border-b border-border/60`
- Inputs: `border-input`
- Prefer opacity-softened borders over thick rules
- Prefer spacing over extra dividers

---

## Shadows

- Default interactive UI: **no shadow** — elevation from hairline border
- Exception: marketing `CardPreview` product mock uses a deliberate layered shadow; do not copy that onto dashboard chrome
- Dialogs use `ring-1 ring-foreground/10`, not drop shadows

---

## Motion

| Token                   | Duration   | Easing / notes                                   |
| ----------------------- | ---------- | ------------------------------------------------ |
| `animate-rise`          | 260ms      | `cubic-bezier(0.22, 1, 0.36, 1)`, translateY 6px |
| `animate-fade`          | 200ms      | `ease-out`                                       |
| Interactive transitions | ~150–250ms | `transition-colors`, `transition-opacity`        |
| Dialog open/close       | 100ms      | fade + slight zoom                               |

Rules:

- Translations of **8px or less**
- No decorative bounce or spin (loading spinners are fine)
- `prefers-reduced-motion: reduce` collapses animation/transition durations globally

Page shells commonly use `animate-rise` once on enter.

---

## Empty states

Pattern (see `not-found`, dashboard empty copy, links empty):

- Centered or in-flow, not a heavy illustration
- Short title (optional) + one sentence of muted body: `text-sm text-pretty text-muted-foreground`
- At most one text link or primary action
- No empty-state illustrations or emoji

Example copy shape: “Henüz bir bağlantı eklemediniz.”

---

## Toasts

- Library: Sonner via `components/ui/sonner.tsx`
- Position: **`top-center`** (root layout)
- Icons: lucide at `size-4`
- Colors: popover tokens (`--popover`, `--popover-foreground`, `--border`)
- Radius: `var(--radius)`
- Usage: short past-tense Turkish confirmations (`Profil güncellendi.`, `Bağlantı eklendi.`)
- Prefer success/error toasts for mutations; do not toast for every navigation

---

## Dialogs

- Primitive: `components/ui/dialog.tsx` (Radix)
- Overlay: `bg-black/10` + light backdrop blur
- Panel: `rounded-xl bg-popover p-4 ring-1 ring-foreground/10 sm:max-w-sm`
- Footer: muted bar with border-t, actions right-aligned on `sm+`
- Destructive flows (e.g. delete link): confirm title + body + Cancel (ghost) + destructive confirm
- Motion: 100ms fade/zoom; respect reduced motion
- Do not use alerts/browser `confirm()` for product deletes

---

## Component inventory (use these)

| Need            | Use                             |
| --------------- | ------------------------------- |
| Buttons         | `components/ui/button.tsx`      |
| Inputs / labels | `FormField` + `Input` / `Label` |
| Textarea        | `components/ui/textarea.tsx`    |
| Switch          | `components/ui/switch.tsx`      |
| Dialog          | `components/ui/dialog.tsx`      |
| Badge           | `components/ui/badge.tsx`       |
| Alert           | `components/ui/alert.tsx`       |
| Toast           | `toast` from `sonner`           |
| Brand mark      | `Wordmark` / `Logomark`         |

Prefer extending these over inventing parallel primitives.

---

## Quick reference (Tailwind)

```
max-w-3xl          /* content width */
px-6               /* page inset */
p-6                /* card padding = 24px */
gap-10 / gap-12    /* major sections */
gap-3 / gap-4      /* card grids */
gap-5 / gap-6      /* form stacks */
h-10               /* form controls & primary buttons */
rounded-lg         /* cards, inputs, buttons */
border-border/60   /* card / header borders */
size-4             /* icons */
text-2xl font-semibold tracking-tight text-balance   /* page titles */
text-sm text-muted-foreground text-pretty            /* supporting copy */
animate-rise       /* page enter */
```

When in doubt: more whitespace, fewer borders, one primary action, muted secondary text.
