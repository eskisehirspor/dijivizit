"""Replace the engraved artwork on a card in a photo with the new card front.

The card face is rectified with a homography, the old engraving is removed
with a large median filter (the face is smooth), the new mask is engraved in a
light tone sampled from the old engraving, and the result is warped back.
Only neutral (low-chroma) pixels inside the card polygon are replaced, so
fingers, leather and phones that overlap the card stay untouched.
"""
import argparse, json
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

W, H = 1712, 1080  # rectified face, 85.6 x 54 mm

def homography(src, dst):
    A = []
    for (x, y), (u, v) in zip(src, dst):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y, -u])
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y, -v])
    _, _, vt = np.linalg.svd(np.array(A, float))
    h = vt[-1].reshape(3, 3)
    return h / h[2, 2]

def warp(img, Hinv, size):
    """Sample img (HxWxC float) at Hinv * output pixel."""
    w, h = size
    ys, xs = np.mgrid[0:h, 0:w]
    pts = np.stack([xs.ravel(), ys.ravel(), np.ones(xs.size)])
    m = Hinv @ pts
    u, v = m[0] / m[2], m[1] / m[2]
    ih, iw = img.shape[:2]
    u0 = np.clip(np.floor(u).astype(int), 0, iw - 2); v0 = np.clip(np.floor(v).astype(int), 0, ih - 2)
    fu = np.clip(u - u0, 0, 1)[:, None]; fv = np.clip(v - v0, 0, 1)[:, None]
    p = img[v0, u0] * (1 - fu) * (1 - fv) + img[v0, u0 + 1] * fu * (1 - fv) + img[v0 + 1, u0] * (1 - fu) * fv + img[v0 + 1, u0 + 1] * fu * fv
    inside = (u >= 0) & (u < iw - 1) & (v >= 0) & (v < ih - 1)
    return p.reshape(h, w, -1), inside.reshape(h, w)

def run(photo, corners, artwork, out, ink=None, strength=1.0, chroma_max=28, exclude=None, filt=41, debug=None, old_art=None, grow=3):
    src = Image.open(photo).convert("RGB")
    S = 2  # supersample the photo for cleaner resampling
    big = src.resize((src.width * S, src.height * S), Image.LANCZOS)
    img = np.asarray(big, float) / 255
    c = np.array(corners, float) * S
    face_pts = [(0, 0), (W, 0), (W, H), (0, H)]
    H_face_to_img = homography(face_pts, c)
    H_img_to_face = np.linalg.inv(H_face_to_img)

    face, _ = warp(img, H_face_to_img, (W, H))
    face_img = Image.fromarray((face * 255).clip(0, 255).astype(np.uint8))
    # Remove old engraving: find it (brighter than the local surface), then
    # rebuild the surface underneath with a normalized (masked) blur.
    small = face_img.resize((W // 4, H // 4), Image.BILINEAR)
    local = np.asarray(small.filter(ImageFilter.MedianFilter(filt // 4 | 1)).resize((W, H), Image.BICUBIC), float) / 255
    lift = (face - local).mean(axis=2)
    old_ink = lift > 0.025
    grown = Image.fromarray((old_ink * 255).astype(np.uint8))
    for _ in range(grow):
        grown = grown.filter(ImageFilter.MaxFilter(9))
    hole = np.asarray(grown, float)[..., None] / 255
    if old_art:
        # The previous layout, generously dilated, is erased too.
        o = Image.open(old_art).convert("L").resize((W, H), Image.LANCZOS)
        o = o.point(lambda v: 255 if v > 40 else 0)
        for _ in range(5):
            o = o.filter(ImageFilter.MaxFilter(9))
        hole = np.maximum(hole, np.asarray(o, float)[..., None] / 255)
    inner = Image.new("L", (W, H), 0)
    ImageDraw.Draw(inner).rounded_rectangle([50, 50, W - 51, H - 51], radius=60, fill=255)
    inner = np.asarray(inner, float)[..., None] / 255
    face_chroma = (face.max(axis=2) - face.min(axis=2))[..., None]
    keep = (1 - hole) * inner * (face_chroma < chroma_max / 255)

    # Fill holes row by row from the nearest clean pixels on both sides, then
    # smooth vertically a little: keeps the lighting gradients and shadows.
    base = face.copy()
    xs = np.arange(W)
    ok_all = keep[..., 0] > 0.5
    for y in range(H):
        ok = ok_all[y]
        if ok.sum() < 10:
            continue
        for ch in range(3):
            base[y, :, ch] = np.interp(xs, xs[ok], face[y, ok, ch])
    sm = Image.fromarray((base * 255).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(14))
    base = np.asarray(sm, float) / 255
    # Grain borrowed from the clean surface.
    grain = (face - local) * keep
    rng = np.random.default_rng(0)
    gy = rng.integers(0, H, size=(H, W)); gx = rng.integers(0, W, size=(H, W))
    pick = ok_all[gy, gx]
    noise = np.where(pick[..., None], grain[gy, gx], 0)
    base = base + np.clip(noise, -0.02, 0.02) * 0.6

    if ink is None:
        ink_col = np.percentile(face[old_ink], 75, axis=0) if old_ink.sum() > 50 else base.mean((0, 1)) + 0.35
    else:
        ink_col = np.array(ink, float) / 255
    detail = np.clip((face - local) * keep, -0.03, 0.03)

    art = Image.open(artwork).convert("L").resize((W, H), Image.LANCZOS)
    a = np.asarray(art, float)[..., None] / 255 * strength
    # Engraving picks up the face lighting a little.
    lum = base.mean(axis=2, keepdims=True)
    ink_lit = np.clip(ink_col + (lum - lum.mean()) * 0.6, 0, 1)
    base = base * hole + face * keep if False else base
    soft = np.asarray(Image.fromarray((hole[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(10)), float)[..., None] / 255
    new_face = face * (1 - soft) + base * soft
    new_face = new_face * (1 - a) + ink_lit * a

    # Rounded-rectangle face mask.
    m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(m).rounded_rectangle([3, 3, W - 4, H - 4], radius=int(H * 0.06), fill=255)
    m = np.asarray(m.filter(ImageFilter.GaussianBlur(2)), float)[..., None] / 255

    back, inside = warp(np.concatenate([new_face, m], axis=2), H_img_to_face, (img.shape[1], img.shape[0]))
    alpha = back[..., 3:4] * inside[..., None]
    chroma = img.max(axis=2) - img.min(axis=2)
    neutral = (chroma < chroma_max / 255).astype(float)[..., None]
    neutral = np.asarray(Image.fromarray((neutral[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.5)), float)[..., None] / 255
    alpha = alpha * neutral
    if exclude:
        ex = Image.new("L", (img.shape[1], img.shape[0]), 255)
        for poly in exclude:
            ImageDraw.Draw(ex).polygon([(x * S, y * S) for x, y in poly], fill=0)
        alpha = alpha * (np.asarray(ex.filter(ImageFilter.GaussianBlur(2)), float)[..., None] / 255)
    result = img * (1 - alpha) + back[..., :3] * alpha
    out_img = Image.fromarray((result * 255).clip(0, 255).astype(np.uint8)).resize(src.size, Image.LANCZOS)
    out_img.save(out, quality=90) if out.endswith(".jpg") else out_img.save(out, quality=90)
    if debug:
        Image.fromarray((new_face * 255).clip(0, 255).astype(np.uint8)).resize((W // 2, H // 2)).save(debug)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("photo"); ap.add_argument("out"); ap.add_argument("--spec", required=True)
    ap.add_argument("--art", required=True); ap.add_argument("--debug")
    a = ap.parse_args()
    spec = json.loads(a.spec)
    run(a.photo, spec["corners"], a.art, a.out, ink=spec.get("ink"), strength=spec.get("strength", 1.0),
        chroma_max=spec.get("chroma", 28), exclude=spec.get("exclude"), filt=spec.get("filt", 41), debug=a.debug,
        old_art=spec.get("old_art", "render/relabel/old-card-front.png"), grow=spec.get("grow", 3))
