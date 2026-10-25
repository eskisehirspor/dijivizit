"""Lifestyle stills for the dijivizit.com sections (4:5, light studio).

Leather wallet with a card sliding out, a slim card holder, a desk still life.

python3 render/site.py --out DIR [--samples 256] [--res 1600x2000] [--only id,id] [--list]
"""
import argparse
import math
import os
import sys

import bpy  # noqa: F401
from mathutils import Euler, Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import scene as S  # noqa: E402
import lux as L  # noqa: E402

CW, CH, CT = L.CARD_W, L.CARD_H, L.CARD_T


def args():
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True)
    p.add_argument("--samples", type=int, default=256)
    p.add_argument("--res", default="1600x2000")
    p.add_argument("--only", default="")
    p.add_argument("--list", action="store_true")
    a = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    return p.parse_args(a)


def rad(v):
    return Euler([math.radians(a) for a in v])


# ------------------------------------------------------------------ materials

def leather(color=(0.035, 0.022, 0.016), rough=0.48, scale=55.0):
    mat, bsdf = S.principled("Leather", **{"Base Color": (*color, 1), "Roughness": rough})
    nt = mat.node_tree
    tc = S.node(nt, "ShaderNodeTexCoord", (-1400, 0))
    vor = S.node(nt, "ShaderNodeTexVoronoi", (-1100, 0))
    vor.inputs["Scale"].default_value = scale
    vor.inputs["Randomness"].default_value = 1.0
    nt.links.new(tc.outputs["Object"], vor.inputs["Vector"])
    noi = S.node(nt, "ShaderNodeTexNoise", (-1100, -300))
    noi.inputs["Scale"].default_value = 6.0
    noi.inputs["Detail"].default_value = 6.0
    nt.links.new(tc.outputs["Object"], noi.inputs["Vector"])
    bump = S.node(nt, "ShaderNodeBump", (-500, -200))
    bump.inputs["Strength"].default_value = 0.22
    bump.inputs["Distance"].default_value = 0.002
    nt.links.new(vor.outputs["Distance"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    # subtle tonal variation
    mix = S.node(nt, "ShaderNodeMix", (-500, 200))
    mix.data_type = "RGBA"
    mix.inputs[6].default_value = (*[c * 0.75 for c in color], 1)
    mix.inputs[7].default_value = (*[c * 1.25 for c in color], 1)
    nt.links.new(noi.outputs["Fac"], mix.inputs["Factor"])
    nt.links.new(mix.outputs[2], bsdf.inputs["Base Color"])
    rr = S.node(nt, "ShaderNodeMapRange", (-500, 500))
    rr.inputs["To Min"].default_value = rough - 0.08
    rr.inputs["To Max"].default_value = rough + 0.1
    nt.links.new(noi.outputs["Fac"], rr.inputs["Value"])
    nt.links.new(rr.outputs["Result"], bsdf.inputs["Roughness"])
    return mat


def thread(color=(0.55, 0.45, 0.32)):
    m, _ = S.principled("Thread", **{"Base Color": (*color, 1), "Roughness": 0.6, "Sheen Weight": 0.5})
    return m


def surface_material(kind="linen"):
    if kind == "linen":
        mat, bsdf = S.principled("Linen", **{"Base Color": (0.78, 0.75, 0.7, 1), "Roughness": 0.9, "Sheen Weight": 0.4})
        nt = mat.node_tree
        tc = S.node(nt, "ShaderNodeTexCoord", (-1200, 0))
        w = S.node(nt, "ShaderNodeTexWave", (-900, 0))
        w.inputs["Scale"].default_value = 260.0
        w.inputs["Distortion"].default_value = 2.0
        w.inputs["Detail"].default_value = 4.0
        nt.links.new(tc.outputs["Object"], w.inputs["Vector"])
        w2 = S.node(nt, "ShaderNodeTexWave", (-900, -300))
        w2.wave_type = "BANDS"
        w2.bands_direction = "Y"
        w2.inputs["Scale"].default_value = 260.0
        w2.inputs["Distortion"].default_value = 2.0
        nt.links.new(tc.outputs["Object"], w2.inputs["Vector"])
        add = S.node(nt, "ShaderNodeMath", (-600, -100))
        nt.links.new(w.outputs["Fac"], add.inputs[0])
        nt.links.new(w2.outputs["Fac"], add.inputs[1])
        b = S.node(nt, "ShaderNodeBump", (-300, -200))
        b.inputs["Strength"].default_value = 0.08
        nt.links.new(add.outputs[0], b.inputs["Height"])
        nt.links.new(b.outputs["Normal"], bsdf.inputs["Normal"])
        return mat
    # warm light stone
    return L.stone_material(tint=(0.62, 0.6, 0.57), rough=(0.35, 0.6))


# ------------------------------------------------------------------ studio

def studio(surface="linen", warm=0.3):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - Base Contrast"
    w = bpy.data.worlds.new("W")
    sc.world = w
    w.use_nodes = True
    w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.9, 0.88, 0.85, 1)
    w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.25
    f = S.flat("Floor", 40, 40, 0.01, seg=1)
    f.data.materials.append(surface_material(surface))
    wc = (1.0, 0.93 - 0.06 * warm, 0.84 - 0.12 * warm)
    # big window light from the left with soft shadows; a bounce from the right
    L.area("Window", (4.0, 3.0), (-4.5, 1.0, 4.0), (0, 0, 0), 1300, wc)
    L.area("Bounce", (4.0, 4.0), (4.0, -2.0, 2.0), (0, 0, 0), 300, (0.95, 0.96, 1.0))
    L.area("Top", (3.0, 3.0), (0.0, 0.0, 5.0), (0, 0, 0), 250, wc)
    return sc


def camera(loc, target, lens=70, fstop=4.0, focus=None):
    return L.camera(loc, target, lens=lens, fstop=fstop, focus=focus)


# ------------------------------------------------------------------ props

def slab(name, w, h, t, r, mat, loc, rot=(0, 0, 0), bevel=0.004):
    o = S.slab(name, w, h, r, t)
    S.bevel(o, bevel, 3)
    for _ in range(3):
        o.data.materials.append(mat)
    o.location = loc
    o.rotation_euler = rad(rot)
    return o


def stitches(name, points, mat, step=0.03, size=0.012):
    """Short raised thread dashes along a polyline (in the parent's local space)."""
    objs = []
    for (a, b) in zip(points[:-1], points[1:]):
        a, b = Vector(a), Vector(b)
        n = max(1, int((b - a).length / step))
        d = (b - a).normalized()
        for i in range(n):
            p = a + d * (i + 0.5) * ((b - a).length / n)
            bpy.ops.mesh.primitive_cylinder_add(radius=0.0016, depth=size, vertices=6, location=p)
            s = bpy.context.active_object
            s.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
            s.data.materials.append(mat)
            objs.append(s)
    # join for speed
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    j = bpy.context.active_object
    j.name = name
    return j


def card(name, fin, loc, rot):
    return L.make_card(name, fin, loc, rot)


def bifold(origin=(0, 0, 0), yaw=0.0, color=(0.035, 0.022, 0.016)):
    """Open bifold wallet lying flat: two leather halves, card pockets on the
    right half. Returns (root, pocket_top_z, pocket_y_positions)."""
    root = bpy.data.objects.new("Wallet", None)
    bpy.context.collection.objects.link(root)
    lea = leather(color)
    lin = leather(tuple(c * 1.6 for c in color), rough=0.55, scale=80)
    thr = thread()
    W, H, T = 1.12, 0.95, 0.03  # each half 11.2 x 9.5 cm
    parts = []
    parts.append(slab("HalfL", W, H, T, 0.05, lea, (-W / 2 - 0.01, 0, T / 2)))
    parts.append(slab("HalfR", W, H, T, 0.05, lea, (W / 2 + 0.01, 0, T / 2)))
    # fold/spine
    bpy.ops.mesh.primitive_cylinder_add(radius=T * 0.8, depth=H - 0.02, vertices=24, location=(0, 0, T * 0.7))
    sp = bpy.context.active_object
    sp.rotation_euler = rad((90, 0, 0))
    sp.data.materials.append(lea)
    parts.append(sp)
    # stepped pockets on the right half (front faces lighter leather)
    pockets = []
    z = T
    for i, y in enumerate([0.22, 0.04, -0.14]):
        z += 0.012
        p = slab(f"Pocket{i}", W - 0.1, 0.42, 0.01, 0.02, lin, (W / 2 + 0.01, y - 0.24, z))
        parts.append(p)
        pockets.append((y, z))
    # stitching around both halves
    for sx in (-1, 1):
        cx = sx * (W / 2 + 0.01)
        e = 0.035
        pts = [(cx - W / 2 + e, -H / 2 + e, T + 0.002), (cx + W / 2 - e, -H / 2 + e, T + 0.002),
               (cx + W / 2 - e, H / 2 - e, T + 0.002), (cx - W / 2 + e, H / 2 - e, T + 0.002),
               (cx - W / 2 + e, -H / 2 + e, T + 0.002)]
        parts.append(stitches(f"Stitch{sx}", pts, thr))
    for o in parts:
        o.parent = root
    root.location = origin
    root.rotation_euler = rad((0, 0, yaw))
    return root, pockets, W, T


def card_holder(color=(0.055, 0.021, 0.008)):
    """Slim leather card holder lying flat: back panel and two stepped slot
    panels. Black card half pulled out of the rear slot, gold card in the front
    slot. Everything is parented to the returned root."""
    root = bpy.data.objects.new("Holder", None)
    bpy.context.collection.objects.link(root)
    lea = leather(color, rough=0.45, scale=70)
    lea2 = leather(tuple(c * 1.15 for c in color), rough=0.5, scale=90)
    thr = thread((0.6, 0.48, 0.32))
    parts = [
        slab("HBack", 1.02, 0.78, 0.022, 0.06, lea, (0, 0, 0.011)),
        slab("HPanel1", 1.02, 0.51, 0.01, 0.05, lea2, (0, -0.135, 0.04)),
        slab("HPanel2", 1.02, 0.31, 0.01, 0.05, lea, (0, -0.235, 0.063)),
    ]
    e = 0.03
    parts.append(stitches("SBack", [(-0.51 + e, 0.39 - e, 0.023), (0.51 - e, 0.39 - e, 0.023)], thr))
    parts.append(stitches("SP1", [(-0.51 + e, 0.12 - e, 0.046), (-0.51 + e, -0.39 + e, 0.046), (0.51 - e, -0.39 + e, 0.046), (0.51 - e, 0.12 - e, 0.046)], thr))
    parts.append(stitches("SP2", [(-0.51 + e, -0.08 - e, 0.069), (-0.51 + e, -0.39 + e, 0.069), (0.51 - e, -0.39 + e, 0.069), (0.51 - e, -0.08 - e, 0.069)], thr))
    a = card("CA", "black", (0, 0, 0), (0, 0, 0))
    a.location = (0.02, 0.42, 0.028)
    a.rotation_euler = rad((0, 0, 4))
    b = card("CB", "gold", (0, 0, 0), (0, 0, 0))
    b.location = (0.0, -0.05, 0.051)
    parts += [a, b]
    for o in parts:
        o.parent = root
    return root


def pen(loc, yaw):
    """Fountain pen: black lacquer body with gold cap band and clip."""
    root = bpy.data.objects.new("Pen", None)
    bpy.context.collection.objects.link(root)
    lac, _ = S.principled("Lacquer", **{"Base Color": (0.01, 0.01, 0.012, 1), "Roughness": 0.08, "Coat Weight": 1.0})
    gold, _ = S.principled("PenGold", **{"Base Color": (0.8, 0.6, 0.3, 1), "Metallic": 1.0, "Roughness": 0.2})
    segs = [(0.0, 0.62, 0.055, lac), (0.62, 0.035, 0.057, gold), (0.655, 0.5, 0.058, lac)]
    for z0, ln, r, m in segs:
        bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=ln, vertices=48, location=(0, 0, z0 + ln / 2))
        o = bpy.context.active_object
        bpy.ops.object.shade_smooth()
        o.data.materials.append(m)
        o.parent = root
    for z, m in ((0.0, lac), (1.155, lac)):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.056, location=(0, 0, z))
        o = bpy.context.active_object
        o.scale = (1, 1, 0.7)
        bpy.ops.object.shade_smooth()
        o.data.materials.append(m)
        o.parent = root
    clip = slab("Clip", 0.022, 0.38, 0.01, 0.008, gold, (0, 0.062, 0.92), (90, 0, 0), bevel=0.003)
    clip.rotation_euler = rad((0, 90, 90))
    clip.parent = root
    root.rotation_euler = rad((0, 90, yaw))
    root.location = loc
    return root


# ------------------------------------------------------------------ shots

def wallet_pull():
    """Card holder on linen, top-down three-quarter: the black card being
    pulled out of its slot."""
    studio("linen", warm=0.35)
    h = card_holder()
    h.rotation_euler = rad((0, 0, -14))
    camera((0.55, -1.75, 2.9), (0.05, 0.12, 0.0), lens=60, fstop=5.6, focus=(0.0, 0.3, 0.04))


def holder_slide():
    """Same holder, low and close: shallow depth of field on the pulled card."""
    studio("stone", warm=0.25)
    h = card_holder()
    h.rotation_euler = rad((0, 0, 24))
    camera((1.35, -2.5, 1.35), (0.0, 0.15, 0.05), lens=85, fstop=3.2, focus=(0.0, 0.35, 0.05))


def desk():
    """Desk still life: leather notebook, fountain pen and the card on top."""
    studio("stone", warm=0.4)
    nb = slab("Notebook", 1.45, 2.1, 0.12, 0.04, leather((0.03, 0.017, 0.01), rough=0.5, scale=60), (-0.25, 0.25, 0.06), (0, 0, -8))
    pg, _ = S.principled("Paper", **{"Base Color": (0.92, 0.9, 0.85, 1), "Roughness": 0.9})
    pages = slab("Pages", 1.4, 2.05, 0.1, 0.03, pg, (-0.23, 0.25, 0.055), (0, 0, -8), bevel=0.002)
    pages.scale = (1.0, 1.0, 1.0)
    card("C", "black", (-0.12, -0.05, 0.12 + CT / 2), (0, 0, 14))
    card("G", "gold", (0.45, 0.85, CT / 2), (0, 0, -22))
    camera((0.3, -2.2, 2.6), (0.0, 0.1, 0.0), lens=60, fstop=5.6, focus=(-0.12, -0.05, 0.13))


SHOTS = {
    "site-wallet": wallet_pull,
    "site-holder": holder_slide,
    "site-desk": desk,
}


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
        sc.cycles.adaptive_threshold = 0.01
        sc.cycles.max_bounces = 8
        sc.render.image_settings.file_format = "PNG"
        sc.render.filepath = os.path.join(a.out, f"{sid}.png")
        bpy.ops.render.render(write_still=True)
        print("rendered", sid, flush=True)


if __name__ == "__main__":
    main()
