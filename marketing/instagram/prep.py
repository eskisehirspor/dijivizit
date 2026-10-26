"""Prepare lux.py light renders for studio.mjs.

- Removes the faint film of shadow-catcher alpha that covers the whole frame,
  so render boxes leave no visible edge on the paper.
- Writes tight crops of the top-down card shots (card-<finish>.png) for
  layouts that need the card at an exact size.

python3 marketing/instagram/prep.py <renders-light> <out-dir>
"""
import glob
import os
import sys

import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
for f in sorted(glob.glob(os.path.join(src, "*.png"))):
    name = os.path.basename(f)
    im = Image.open(f).convert("RGBA")
    a = np.asarray(im).astype(np.float32)
    alpha = a[..., 3]
    floor = min(np.percentile(alpha, 10), 12.0)
    cut = floor * 2.0
    alpha = np.clip((alpha - cut) * 255.0 / (255.0 - cut), 0, 255)
    a[..., 3] = alpha
    clean = Image.fromarray(a.astype(np.uint8), "RGBA")
    clean.save(os.path.join(out, name))
    if name.startswith("lux-top-"):
        solid = alpha > 200
        ys, xs = np.where(solid)
        y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
        pad = int((x1 - x0) * 0.08)
        box = (max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad))
        clean.crop(box).save(os.path.join(out, name.replace("lux-top-", "card-")))
print("prepared", src, "->", out)
