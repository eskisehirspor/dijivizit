# Landing hero render

`scene.py` builds the dijivizit.com hero in Blender (bpy) and renders the
192-frame image sequence that the landing page scrubs on scroll.

- `tex/` — card and phone-screen textures, rendered from `textures-src/*.html`
  (Geist font from the `geist` package) with a headless browser.
- Full render: GitHub Actions → **Render landing hero** → Run workflow. It
  splits the frames over parallel runners, converts them to WebP, commits
  them to `public/landing/{desktop,mobile}` and redeploys.
- Local preview: `pip install bpy==5.2.3` then
  `python3 render/scene.py --out /tmp/frames --res 640x360 --samples 16 --frames 0,72,120,180`.
- Card finishes: `--finish black|silver|gold|wood` (`--hide-phone` for the
  finish stills shown on the landing page).
- Product shots: `--product --res 1600x2000 --frames 0` renders the card alone,
  close up at a three-quarter angle, for `/kartvizit`; they live in
  `public/landing/products/<finish>.webp`.
- Wood finishes: `tex/wood-dark.jpg` is a photo of a real Dijivizit wood card,
  flattened and evened out; `tex/wood-light.jpg` is the same grain re-toned.
- Profile photo in `textures-src/avatar.jpg`: Unsplash photo
  `photo-1494790108377-be9c29b29330` (Unsplash License).
