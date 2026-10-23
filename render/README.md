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
