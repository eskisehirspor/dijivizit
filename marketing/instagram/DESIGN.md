# Dijivizit Instagram — art direction "Temas"

Built by `studio.mjs` from `lux.py --theme light` renders, the real app
screenshots in `public/landing/ui` and the lifestyle photos in
`public/landing/lifestyle`. `export.py` turns the output into posts and stories.

## Three directions considered

1. **Dark editorial luxury** (the previous series): black stone, serif display,
   gold hairlines. Moody, but every post read the same in the grid, the black
   card disappeared into black backgrounds and the feed felt heavy.
2. **Warm paper and serif**: the usual "premium" shorthand. It says nothing
   specific about this product and looks like every other boutique brand.
3. **Temas (chosen)**: a light, precise system built from what the product
   actually is — a card you touch to a phone. The touch (NFC arcs), the card's
   materials and the real screen do the talking.

## System

- **Ground**: Paper `#F3F2EE`, a neutral light that keeps black metal black and
  wood warm. Graphite `#17171A` is used for a few punctuating posts (statements,
  numbers, order) so the grid has rhythm.
- **Colour comes from the product**: each finish has a field colour sampled from
  its render (black `#1C1C1F`, silver `#C9CBCD`, gold `#C7A877`, walnut
  `#6E4632`, oak `#DCC8A6`). No invented brand colour. A deep brass `#9A7743`
  marks indices only.
- **Type**: Geist and Geist Mono, the typefaces of the site and the app, so an
  ad, the website and the card the customer opens look like one brand.
  Display 620 weight with tight tracking; the second line of each headline drops
  to grey for hierarchy instead of switching fonts. Mono for labels and indices.
- **Grid**: 1080 × 1350, 72 px margins, headline block from y 168, meta row at
  the top (category / post number), lock-up and `dijivizit.com` at the bottom.
- **Device**: the contactless arcs from the logo, drawn large as a thin line
  figure on type-only posts. The only decoration in the system.
- **Images**: products are rendered on transparent film with a shadow catcher,
  so cards sit on the paper or on their own colour field without a horizon.
  Phone screens show the real profile screenshot; screens that never existed
  (an invented lock screen and an invented "saved" toast) were removed.

## Layout families

Hero (product under headline), Material (colour field + card crossing it),
Collection index (edition numeral), Statement (type + arcs), Photo (lifestyle,
full bleed above, message below), Interface (real screenshot in a device
outline, numbered notes), FAQ, Spec table, Steps, Numbers, Contact, Order.

## Open facts to confirm

- "Her kartın arkasında yedek bir QR kod bulunur" (post _qr-yedegi_, _teknik_)
  is existing copy, kept as is; the rendered card back has no QR. Confirm the
  physical card before posting.
