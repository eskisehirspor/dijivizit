"""Instagram product stills (1080x1350) from the landing scene.

python3 render/posts.py --out DIR [--samples 128] [--res 1080x1350] [--only id1,id2]
"""
import argparse
import math
import os
import sys

import bpy  # noqa: F401  (must import before mathutils users)
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import scene as S  # noqa: E402

FINISHES = ["black", "silver", "gold", "wood", "wood-light"]


def args():
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True)
    p.add_argument("--samples", type=int, default=128)
    p.add_argument("--res", default="1080x1350")
    p.add_argument("--only", default="")
    p.add_argument("--list", action="store_true")
    return p.parse_args(sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:])


def obj(name):
    return bpy.data.objects[name]


def still(o):
    if o.animation_data:
        o.animation_data_clear()


def place(o, loc, rot=None):
    still(o)
    o.location = loc
    if rot is not None:
        o.rotation_euler = [math.radians(a) for a in rot]


def screen(profile, saved):
    mat = bpy.data.materials["Screen"]
    if mat.node_tree.animation_data:
        mat.node_tree.animation_data_clear()
    mat.node_tree.nodes["mix_profile"].inputs["Factor"].default_value = profile
    mat.node_tree.nodes["mix_saved"].inputs["Factor"].default_value = saved


def camera(loc, target, lens=85, fstop=2.8):
    cam, tgt = obj("Camera"), obj("Target")
    place(cam, loc)
    place(tgt, target)
    cam.data.lens = lens
    cam.data.dof.aperture_fstop = fstop


def darken():
    """Night studio: charcoal wall, window light shafts, strong rim."""
    bpy.data.materials["Wall"].node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (
        0.012, 0.012, 0.014, 1)
    bpy.context.scene.world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.03
    bpy.data.lights["Sun"].energy = 9.0
    bpy.data.lights["Fill"].energy = 30
    bpy.data.lights["Rim"].energy = 420


def card_copy(name, finish, loc, rot):
    src = obj("Card")
    o = src.copy()
    o.data = src.data.copy()
    o.name = name
    o.data.materials.clear()
    o.data.materials.append(S.card_edge_material(finish))
    o.data.materials.append(S.card_face_material(f"{name}F", "card-front.png", finish))
    o.data.materials.append(S.card_face_material(f"{name}B", "card-back.png", finish))
    bpy.context.collection.objects.link(o)
    place(o, loc, rot)
    return o


def base(finish="black", phone=False, dark=False):
    S.build(False, finish, hide_phone=not phone)
    if dark:
        darken()
    for n in ("Card", "Phone", "Camera", "Target"):
        still(obj(n))
    screen(0, 0)
    if not phone:
        obj("Phone").location = (5, 5, -5)


def world_point(o, local):
    bpy.context.view_layer.update()
    return tuple(o.matrix_world @ Vector(local))


# ------------------------------------------------------------------ shots

def hero(finish):
    def f():
        base(finish)
        place(obj("Card"), (0, 0, 0), (100, -8, -22))
        camera((0.05, -4.2, 0.3), (0, 0, 0), lens=85, fstop=2.8)
    return f


def dark(finish):
    def f():
        base(finish, dark=True)
        place(obj("Card"), (0, 0, 0), (97, 7, 20))
        camera((-0.05, -4.0, 0.2), (0, 0, 0), lens=85, fstop=2.8)
    return f


def macro(finish, local=(-0.3, 0.17, 0.006)):
    def f():
        base(finish)
        c = obj("Card")
        place(c, (0, 0, 0), (102, -4, -16))
        t = world_point(c, local)
        camera((t[0] + 0.12, t[1] - 0.95, t[2] + 0.18), t, lens=100, fstop=1.8)
    return f


def back_side():
    base("black")
    place(obj("Card"), (0, 0, 0), (96, 4, 195))
    camera((0, -4.0, 0.15), (0, 0, 0), lens=85, fstop=2.8)


def fan():
    base("black")
    place(obj("Card"), (-0.3, -0.24, -0.25), (95, 0, -30))
    for i, fin in enumerate(FINISHES[1:], start=1):
        card_copy(f"Fan{i}", fin, (-0.3 + i * 0.15, -0.24 + i * 0.12, -0.25 + i * 0.12), (95, 0, -30 + i * 14))
    camera((0.05, -4.6, 0.35), (0.0, 0.0, 0.0), lens=70, fstop=4.0)


def duo():
    base("black")
    place(obj("Card"), (-0.12, 0, 0.12), (100, -6, -20))
    card_copy("Duo", "gold", (0.2, 0.22, -0.2), (98, 5, 16))
    camera((0.05, -4.3, 0.3), (0.0, 0.08, 0.0), lens=80, fstop=3.2)


def flatlay():
    base("black")
    wall_y = 3.2 - 0.0075
    rows = [(0.18, 0.62, -7), (-0.12, 0.3, 6), (0.15, -0.02, -4), (-0.14, -0.34, 8), (0.12, -0.66, -5)]
    for i, ((x, z, th), fin) in enumerate(zip(rows, FINISHES)):
        loc = (0.45 + x, wall_y - 0.014 * i, 0.3 + z)
        if i == 0:
            place(obj("Card"), loc, (90, 0, th))
        else:
            card_copy(f"Flat{i}", fin, loc, (90, 0, th))
    camera((0.45, 3.2 - 3.1, 0.3), (0.45, 3.2, 0.3), lens=50, fstop=8)


def anim_frame(frame, cam_loc, target, lens=70):
    def f():
        S.build(False, "black")
        sc = bpy.context.scene
        sc.frame_set(frame)
        still(obj("Camera"))
        camera(cam_loc, target, lens=lens, fstop=2.8)
    return f


SHOTS = {}
for fin in FINISHES:
    SHOTS[f"hero-{fin}"] = hero(fin)
    SHOTS[f"dark-{fin}"] = dark(fin)
SHOTS["macro-black"] = macro("black")
SHOTS["macro-gold"] = macro("gold")
SHOTS["macro-wood"] = macro("wood")
SHOTS["macro-wood-light"] = macro("wood-light")
SHOTS["macro-nfc"] = macro("silver", local=(0.33, -0.12, 0.006))
SHOTS["back"] = back_side
SHOTS["fan"] = fan
SHOTS["duo"] = duo
SHOTS["flatlay"] = flatlay
SHOTS["tap"] = anim_frame(118, (-0.05, -3.9, 0.4), (0.1, 0.38, 0.18), lens=58)
SHOTS["profile"] = anim_frame(150, (0.15, -3.6, 0.25), (0.22, 0.38, 0.12), lens=75)
SHOTS["saved"] = anim_frame(185, (0.2, -3.5, 0.1), (0.25, 0.38, -0.02), lens=75)


def main():
    a = args()
    if a.list:
        print(" ".join(SHOTS))
        return
    ids = a.only.split(",") if a.only else list(SHOTS)
    w, h = (int(v) for v in a.res.split("x"))
    os.makedirs(a.out, exist_ok=True)
    for sid in ids:
        SHOTS[sid]()
        sc = bpy.context.scene
        sc.render.resolution_x, sc.render.resolution_y = w, h
        sc.render.resolution_percentage = 100
        sc.cycles.samples = a.samples
        sc.cycles.use_adaptive_sampling = True
        sc.cycles.adaptive_threshold = 0.015
        sc.cycles.max_bounces = 6
        sc.render.image_settings.file_format = "PNG"
        sc.render.filepath = os.path.join(a.out, f"{sid}.png")
        bpy.ops.render.render(write_still=True)
        print("rendered", sid, flush=True)


if __name__ == "__main__":
    main()
