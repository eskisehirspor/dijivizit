"""Turn built posts (studio.mjs output, NN-slug.png) into the JPEGs the daily
publisher serves from dijivizit.com/ig: posts 1080x1350 and stories 1080x1920.

python3 marketing/instagram/export.py <built-posts-dir>
"""
import glob
import json
import os
import sys

from PIL import Image, ImageFilter, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
src_dir = sys.argv[1]
sched = json.load(open(os.path.join(HERE, "schedule.json")))
by_slug = {os.path.basename(p)[3:-4]: p for p in glob.glob(os.path.join(src_dir, "*.png"))}

out_posts = os.path.join(ROOT, "public", "ig", "posts")
out_stories = os.path.join(ROOT, "public", "ig", "stories")
os.makedirs(out_posts, exist_ok=True)
os.makedirs(out_stories, exist_ok=True)

for e in sched["posts"]:
    post = Image.open(by_slug[e["source"]]).convert("RGB")
    post.save(os.path.join(out_posts, e["id"] + ".jpg"), "JPEG", quality=90, optimize=True, progressive=False)
    # Story: the post on a blurred, softened copy of itself.
    bg = post.resize((1536, 1920), Image.LANCZOS).crop((228, 0, 1308, 1920))
    bg = ImageEnhance.Brightness(bg.filter(ImageFilter.GaussianBlur(60))).enhance(0.88)
    shadow = Image.new("L", (1080, 1920), 0)
    sh = Image.new("L", (980, 1225), 70)
    shadow.paste(sh, (50, 350))
    shadow = shadow.filter(ImageFilter.GaussianBlur(40))
    bg.paste((0, 0, 0), (0, 0), shadow)
    p = post.resize((980, 1225), Image.LANCZOS)
    bg.paste(p, (50, 330))
    bg.save(os.path.join(out_stories, e["id"] + ".jpg"), "JPEG", quality=88, optimize=True)
print("exported", len(sched["posts"]))
