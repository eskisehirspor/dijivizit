"""Put the rendered film frames on paper and encode the MP4.

Frames from render/film.py are transparent. Each one is laid on the paper
ground (#F3F2EE) with a soft shadow, the signal rings are drawn at the tap
point (render/film.py --project tap.json) and the type overlays are faded in.

python3 marketing/film/compose.py FRAMES_DIR OUT.mp4 [--audio music.wav] [--preview f,f,...]
"""
import json
import os
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
FPS = 30
W, H = 1080, 1920
PAPER = (243, 242, 238, 255)
BRASS = (154, 119, 67)
# caption id -> (first frame, last frame); fades in/out over FADE frames
CUES = {
    "01": (12, 98),
    "02": (114, 186),
    "03": (200, 238),
    "04": (248, 325),
    "05": (340, 428),
    "06": (444, 532),
    "07": (550, 659),
}
FADE = 8
RISE = 22
LAST = 659


def smooth(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def shadowed(frame):
    """Subject on paper with a soft shadow falling down and slightly right."""
    a = frame.getchannel("A")
    sh = a.filter(ImageFilter.GaussianBlur(34)).point(lambda v: int(v * 0.16))
    layer = Image.new("RGBA", frame.size, (52, 46, 38, 0))
    layer.putalpha(sh)
    out = Image.new("RGBA", frame.size, PAPER)
    out.alpha_composite(layer, (14, 46))
    out.alpha_composite(frame)
    return out


def rings(img, x, y, t):
    """Signal rings t frames after contact: a soft glow and three pulses."""
    if t < 0 or t > 54:
        return
    s = 3  # supersample for clean thin lines
    layer = Image.new("RGBA", (W * s, H * s), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    glow = smooth(t / 6) * (1 - smooth((t - 36) / 18))
    for r, a in ((150, 0.10), (95, 0.14), (50, 0.2)):
        rr = r * s
        d.ellipse([x * s - rr, y * s - rr, x * s + rr, y * s + rr], fill=BRASS + (int(255 * a * glow),))
    for i in range(3):
        u = (t - i * 7) / 30
        if 0 <= u <= 1:
            r = (24 + 236 * (1 - (1 - u) ** 2)) * s
            a = (1 - u) ** 1.3
            w = int((3.2 - 1.6 * u) * s)
            d.ellipse([x * s - r, y * s - r, x * s + r, y * s + r], outline=BRASS + (int(255 * a),), width=w)
    dot = 9 * s * glow
    if dot > 0:
        d.ellipse([x * s - dot, y * s - dot, x * s + dot, y * s + dot], fill=BRASS + (int(255 * glow),))
    img.alpha_composite(layer.resize((W, H), Image.LANCZOS))


def compose(f, src, caps, tap):
    frame = Image.open(os.path.join(src, f"{f:04d}.png")).convert("RGBA")
    if frame.size != (W, H):
        frame = frame.resize((W, H), Image.LANCZOS)
    out = shadowed(frame)
    pt = tap["points"].get(str(f))
    if pt:
        rings(out, pt[0], pt[1], f - tap["contact"])
    for k, (a, b) in CUES.items():
        if not a <= f <= b:
            continue
        fin = smooth((f - a) / FADE)
        fout = 1.0 if b == LAST else smooth((b - f) / FADE)
        alpha = min(fin, fout)
        cap = caps[k]
        if alpha < 1:
            cap = cap.copy()
            cap.putalpha(cap.getchannel("A").point(lambda v: int(v * alpha)))
        layer = Image.new("RGBA", out.size)
        layer.paste(cap, (0, int(RISE * (1 - fin))))
        out.alpha_composite(layer)
    return out.convert("RGB")


def main(src, out, preview=None, audio=None):
    caps = {k: Image.open(os.path.join(HERE, "captions", f"{k}.png")).convert("RGBA") for k in CUES}
    tap = json.load(open(os.path.join(HERE, "tap.json")))
    if preview:
        os.makedirs(out, exist_ok=True)
        for f in preview:
            compose(f, src, caps, tap).save(os.path.join(out, f"{f:04d}.jpg"), quality=90)
        return
    with tempfile.TemporaryDirectory() as tmp:
        for f in range(LAST + 1):
            compose(f, src, caps, tap).save(os.path.join(tmp, f"{f:04d}.png"))
        sound = ["-i", audio, "-c:a", "aac", "-b:a", "192k", "-shortest"] if audio else []
        subprocess.run(
            [
                "ffmpeg", "-y", "-framerate", str(FPS), "-i", os.path.join(tmp, "%04d.png"), *sound,
                "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
                "-profile:v", "high", "-movflags", "+faststart", out,
            ],
            check=True,
        )


if __name__ == "__main__":
    if "--preview" in sys.argv:
        i = sys.argv.index("--preview")
        main(sys.argv[1], sys.argv[2], [int(v) for v in sys.argv[i + 1].split(",")])
    else:
        a = sys.argv.index("--audio") + 1 if "--audio" in sys.argv else None
        main(sys.argv[1], sys.argv[2], audio=sys.argv[a] if a else None)
