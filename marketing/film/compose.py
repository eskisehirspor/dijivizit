"""Composite caption overlays onto the rendered film frames and encode MP4.

python3 marketing/film/compose.py FRAMES_DIR OUT.mp4
"""
import os
import subprocess
import sys
import tempfile

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
FPS = 30
# caption id -> (first frame, last frame); fades in/out over FADE frames
CUES = {
    "01": (10, 98),
    "02": (112, 188),
    "03": (200, 262),
    "04": (268, 325),
    "05": (338, 428),
    "06": (442, 532),
    "07": (548, 659),
}
FADE = 8
RISE = 26
LAST = 659


def smooth(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def main(src, out):
    caps = {k: Image.open(os.path.join(HERE, "captions", f"{k}.png")).convert("RGBA") for k in CUES}
    with tempfile.TemporaryDirectory() as tmp:
        for f in range(LAST + 1):
            frame = Image.open(os.path.join(src, f"{f:04d}.png")).convert("RGBA")
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
                layer = Image.new("RGBA", frame.size)
                layer.paste(cap, (0, int(RISE * (1 - fin))))
                frame.alpha_composite(layer)
            frame.convert("RGB").save(os.path.join(tmp, f"{f:04d}.png"))
        subprocess.run(
            [
                "ffmpeg", "-y", "-framerate", str(FPS), "-i", os.path.join(tmp, "%04d.png"),
                "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
                "-profile:v", "high", "-movflags", "+faststart", out,
            ],
            check=True,
        )


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
