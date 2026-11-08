"""Cinematic ad key visuals for Instagram (dark, dramatic, product-hero style).

Reuses the card and phone built by scene.py, moves them into fresh dark scenes
and renders one still per concept (1080x1350 by default):

    python3 render/ads.py --out out/ads --concept all --samples 96
"""

import argparse
import math
import os
import random
import sys
import tempfile

import bpy
from mathutils import Vector

sys.path.insert(0, os.path.dirname(__file__))
import scene as S  # noqa: E402

LIB = tempfile.mkdtemp(prefix="dv-ads-")


def export_assets(finish, with_phone=False):
    """Build scene.py's set for one finish and save the card (+ phone) to a .blend."""
    S.build(False, finish, hide_phone=not with_phone)
    objs = {bpy.data.objects["Card"]}
    if with_phone:
        objs |= {o for o in bpy.data.objects if o.name in ("Phone", "PhoneBody", "Screen", "Island")}
    path = os.path.join(LIB, f"{finish}{'-phone' if with_phone else ''}.blend")
    bpy.data.libraries.write(path, objs, fake_user=True)
    return path


def load(path, rename):
    with bpy.data.libraries.load(path) as (src, dst):
        dst.objects = list(src.objects)
    out = {}
    for o in dst.objects:
        bpy.context.collection.objects.link(o)
        o.animation_data_clear()  # scene.py keys the hero animation on these
        out[o.name.split(".")[0]] = o
    out["Card"].name = rename
    out[rename] = out.pop("Card")
    return out


def fresh(res):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - High Contrast"
    sc.render.resolution_x, sc.render.resolution_y = res
    w = bpy.data.worlds.new("W")
    sc.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.004, 0.004, 0.005, 1)
    bg.inputs["Strength"].default_value = 1.0
    return sc


def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def area(name, loc, target, energy, size, color=(1, 1, 1), spread=None):
    l = bpy.data.lights.new(name, "AREA")
    l.energy, l.size, l.color = energy, size, color
    if spread:
        l.spread = math.radians(spread)
    o = bpy.data.objects.new(name, l)
    bpy.context.collection.objects.link(o)
    o.location = loc
    look_at(o, target)
    return o


def spot(name, loc, target, energy, angle, color=(1, 1, 1), blend=0.4):
    l = bpy.data.lights.new(name, "SPOT")
    l.energy, l.color = energy, color
    l.spot_size, l.spot_blend = math.radians(angle), blend
    l.shadow_soft_size = 0.15
    o = bpy.data.objects.new(name, l)
    bpy.context.collection.objects.link(o)
    o.location = loc
    look_at(o, target)
    return o


def camera(loc, target, lens=70):
    c = bpy.data.cameras.new("Cam")
    c.lens = lens
    o = bpy.data.objects.new("Cam", c)
    bpy.context.collection.objects.link(o)
    o.location = loc
    look_at(o, target)
    bpy.context.scene.camera = o
    return o


def floor(color=(0.01, 0.01, 0.011), rough=0.35, size=40):
    f = S.flat("Floor", size, size, 0.01, seg=1)
    m, b = S.principled("Floor", **{"Base Color": (*color, 1), "Roughness": rough})
    f.data.materials.append(m)
    return f


def haze(density=0.02, size=12):
    bpy.ops.mesh.primitive_cube_add(size=size, location=(0, 0, size / 2 - 0.5))
    box = bpy.context.object
    box.name = "Haze"
    m = bpy.data.materials.new("Haze")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    vol = nt.nodes.new("ShaderNodeVolumePrincipled")
    vol.inputs["Density"].default_value = density
    nt.links.new(vol.outputs["Volume"], nt.nodes["Material Output"].inputs["Volume"])
    box.data.materials.append(m)


def emissive(name, color, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1)
    e.inputs["Strength"].default_value = strength
    nt.links.new(e.outputs["Emission"], nt.nodes["Material Output"].inputs["Surface"])
    return m


def particles(n, center, spread, radius, mat, seed=3):
    rnd = random.Random(seed)
    for i in range(n):
        p = Vector(center) + Vector([rnd.uniform(-1, 1) * s for s in spread])
        bpy.ops.mesh.primitive_uv_sphere_add(radius=radius * rnd.uniform(0.4, 1.2), location=p, segments=8, ring_count=6)
        bpy.context.object.data.materials.append(mat)


# --- concepts ---------------------------------------------------------------


def kartvizit_bitti(res, finish="black", v=0):
    """Black metal card floating over a heap of discarded paper business cards."""
    card_lib = export_assets(finish)
    fresh(res)
    floor(rough=0.55)
    card = load(card_lib, "Hero")["Hero"]
    card.location = (0, -1.2, 1.05)
    card.rotation_euler = (math.radians(72), math.radians(-10), math.radians(-16))
    card.scale = (1.6, 1.6, 1.6)

    paper, _ = S.principled("Paper", **{"Base Color": (0.86, 0.85, 0.82, 1), "Roughness": 0.85})
    ink, _ = S.principled("Ink", **{"Base Color": (0.05, 0.05, 0.06, 1), "Roughness": 0.6})
    rnd = random.Random(7 + v)
    for i in range(170):
        bpy.ops.mesh.primitive_cube_add(size=1)
        o = bpy.context.object
        o.scale = (0.85 / 2, 0.55 / 2, 0.004)
        r = abs(rnd.gauss(0, 1.15))
        a = rnd.uniform(0, math.tau)
        z = 0.004 + rnd.uniform(0, 0.25) * max(0, 1.2 - r) + (rnd.random() < 0.12) * rnd.uniform(0.3, 1.6)
        o.location = (r * math.cos(a), r * math.sin(a) * 0.8, z)
        if (Vector(o.location) - Vector((0, -1.2, 1.05))).length < 0.9:
            o.location.z = 0.004
        o.rotation_euler = (rnd.uniform(-0.5, 0.5) if z > 0.2 else rnd.uniform(-0.12, 0.12),
                            rnd.uniform(-0.5, 0.5) if z > 0.2 else rnd.uniform(-0.12, 0.12), rnd.uniform(0, math.tau))
        o.data.materials.append(paper)
        bev = o.modifiers.new("b", "BEVEL")
        bev.width = 0.002
        # A few "printed" lines so they read as business cards.
        if rnd.random() < 0.6:
            bpy.ops.mesh.primitive_plane_add(size=1)
            t = bpy.context.object
            t.scale = (0.32 / 2, 0.03 / 2, 1)
            t.parent = o
            t.matrix_parent_inverse = o.matrix_world.inverted()
            t.location = o.matrix_world @ Vector((-0.4, 0.3, 1.2))
            t.rotation_euler = o.rotation_euler
            t.data.materials.append(ink)
    spot("Key", (0.6, -2.2, 5.5), (0, -1.2, 1.0), 1500, 30, (1.0, 0.96, 0.9), 0.5)
    area("CardRim", (1.6, 0.4, 2.4), (0, -1.2, 1.05), 500, 0.8, (1.0, 0.85, 0.6))
    area("Rim", (-2.5, 2.6, 2.2), (0, 0, 1.0), 900, 1.6, (1.0, 0.78, 0.5))
    area("Fill", (2.8, -3.5, 1.2), (0, 0, 0.9), 60, 3, (0.7, 0.8, 1.0))
    haze(0.012)
    camera((0.0, -6.0, 1.4), (0, -0.6, 1.05), lens=58)


def tek_dokunus(res, finish="gold", v=0):
    """Gold card meeting a phone; rings of light spread from the tap."""
    lib = export_assets(finish, with_phone=True)
    fresh(res)
    floor(color=(0.008, 0.007, 0.006), rough=0.25)
    parts = load(lib, "Gold")
    card, phone = parts["Gold"], parts["Phone"]
    phone.location = (0.25, 0.0, 1.35)
    phone.rotation_euler = (math.radians(78), math.radians(0), math.radians(18))
    phone.scale = (1.0, 1.0, 1.0)
    card.location = (-0.55, -0.45, 1.05)
    card.rotation_euler = (math.radians(72), math.radians(-14), math.radians(-24))
    gold = emissive("Ring", (1.0, 0.68, 0.25), 6.0)
    tap = Vector((-0.12, -0.2, 1.15))
    for i, r in enumerate((0.14, 0.26, 0.4, 0.56)):
        bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=0.0025 + 0.0008 * (4 - i), location=tap,
                                         major_segments=96, minor_segments=8)
        t = bpy.context.object
        t.rotation_euler = (math.radians(78), 0, math.radians(-4))
        m = gold.copy()
        m.node_tree.nodes["Emission"].inputs["Strength"].default_value = 4.0 * (1 - i / 5)
        t.data.materials.append(m)
    particles(45, (0, -0.2, 1.3), (1.4, 0.8, 0.9), 0.005, emissive("Spark", (1.0, 0.75, 0.35), 12.0))
    spot("Key", (-1.5, -2.5, 4.5), (0, 0, 1.1), 450, 30, (1.0, 0.9, 0.75), 0.6)
    area("Rim", (2.4, 2.2, 2.0), (0, 0, 1.1), 700, 1.2, (1.0, 0.7, 0.4))
    area("Soft", (-2.5, -1.5, 1.8), (0, 0, 1.1), 120, 4, (1.0, 0.92, 0.85))
    haze(0.018)
    camera((0.15, -5.6, 1.6), (-0.08, 0, 1.42), lens=58)


def alti_kaplama(res, finish=None, v=0):
    """All six finishes fanned out on a black mirror floor."""
    order = ["wood-light", "wood", "pvc-black", "silver", "gold", "black"]
    libs = [export_assets(f) for f in order]
    fresh(res)
    floor(color=(0.02, 0.019, 0.018), rough=0.32)
    back = S.flat("Back", 30, 14, 0.01, seg=1)
    back.location = (0, 4.0, 0)
    back.rotation_euler = (math.radians(90), 0, 0)
    bm, _ = S.principled("Back", **{"Base Color": (0.05, 0.045, 0.04, 1), "Roughness": 0.9})
    back.data.materials.append(bm)
    for i, (f, lib) in enumerate(zip(order, libs)):
        c = load(lib, f"C{i}")[f"C{i}"]
        t = (i - 2.5) / 2.5
        c.location = (t * 0.95, -0.12 * (1 - abs(t)), 0.3 + (1 - abs(t)) * 0.1)
        c.rotation_euler = (math.radians(82), math.radians(t * 14), math.radians(t * 38))
    spot("Top", (0, -2.6, 3.4), (0, 0, 0.4), 700, 16, (1.0, 0.97, 0.92), 0.8)
    spot("Glow", (0, 3.0, 0.2), (0, 4.0, 2.0), 900, 70, (1.0, 0.75, 0.45), 1.0)
    area("Rim", (0, 1.6, 2.4), (0, 0, 0.4), 260, 1.2, (0.95, 0.9, 1.0))
    area("Left", (-2.6, -1.6, 1.4), (0, 0, 0.45), 60, 0.8, (1.0, 0.8, 0.6))
    area("Right", (2.6, -1.6, 1.4), (0, 0, 0.45), 50, 0.8, (0.7, 0.8, 1.0))
    camera((0.0, -4.6, 0.9), (0, 0, 0.62), lens=44)


WARM = [(1.0, 0.78, 0.5), (0.55, 0.7, 1.0), (1.0, 0.55, 0.35), (0.85, 0.85, 1.0)]


def hero(res, finish="black", v=0, back=False):
    """One card floating in a beam of light, haze and dust; angle varies with v."""
    lib = export_assets(finish)
    fresh(res)
    floor(color=(0.012, 0.011, 0.01), rough=0.4)
    card = load(lib, "Hero")["Hero"]
    rnd = random.Random(v)
    card.location = (0, 0, 1.15)
    tilt = rnd.uniform(-22, 22)
    card.rotation_euler = (math.radians(rnd.uniform(62, 80)), math.radians(rnd.uniform(-12, 12)),
                           math.radians(tilt + (180 if back else 0)))
    card.scale = (1.5, 1.5, 1.5)
    rim = WARM[v % len(WARM)]
    spot("Beam", (0.4, 0.6, 6.0), (0, 0, 1.0), 2200, 14, (1.0, 0.95, 0.88), 0.35)
    area("Rim", (-1.8 if v % 2 else 1.8, 1.6, 3.0), (0, 0, 1.15), 380, 0.8, rim)
    area("Fill", (0, -3.5, 1.4), (0, 0, 1.1), 90, 3, (0.9, 0.92, 1.0))
    particles(60, (0, 0, 1.5), (1.2, 1.0, 1.4), 0.004, emissive("Dust", (1.0, 0.92, 0.8), 3.0), seed=v)
    haze(0.01)
    camera((0.0, -5.4, 1.75), (0, 0, 1.4), lens=62)


def macro(res, finish="gold", v=0):
    """Low, close, shallow-focus view along the card's face to show the material."""
    lib = export_assets(finish)
    fresh(res)
    floor(color=(0.01, 0.01, 0.01), rough=0.18)
    card = load(lib, "Macro")["Macro"]
    card.location = (0, 0, 0.012)
    card.rotation_euler = (0, 0, math.radians(18 + v * 9))
    area("Key", (-0.9, -0.6, 1.4), (0, 0, 0), 260, 0.9, (1.0, 0.94, 0.86))
    area("Top", (0.2, 0.6, 1.6), (0, 0, 0), 160, 1.6, (1.0, 1.0, 1.0))
    area("Rim", (0.8, 1.2, 0.5), (0, 0, 0), 120, 0.6, WARM[v % len(WARM)])
    # A big soft panel behind the card: polished metals mirror it, so the
    # material's own colour shows instead of a black reflection.
    area("Mirror", (-0.7, 1.6, 0.5), (0, 0, 0.05), 140, 2.6, (1.0, 0.96, 0.9))
    cam = camera((0.62, -0.9, 0.42), (-0.05, 0.05, 0.0), lens=75)
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = (Vector((0.62, -0.9, 0.42)) - Vector((0.05, -0.05, 0.0))).length
    cam.data.dof.aperture_fstop = 2.0


def stack(res, finish="black", v=0):
    """A neat stack of cards (a team's worth) with one lifted off the top."""
    lib = export_assets(finish)
    fresh(res)
    floor(color=(0.014, 0.013, 0.012), rough=0.3)
    rnd = random.Random(v)
    for i in range(14):
        c = load(lib, f"S{i}")[f"S{i}"]
        c.location = (rnd.uniform(-0.006, 0.006), rnd.uniform(-0.006, 0.006), 0.012 + i * 0.0125)
        c.rotation_euler = (0, 0, math.radians(rnd.uniform(-2.5, 2.5)))
    top = load(lib, "Top")["Top"]
    top.location = (0.05, -0.08, 0.42)
    top.rotation_euler = (math.radians(28), math.radians(-6), math.radians(14))
    spot("Key", (0.8, -1.8, 3.2), (0, 0, 0.2), 900, 20, (1.0, 0.95, 0.88), 0.5)
    area("Rim", (-1.4, 1.6, 1.2), (0, 0, 0.2), 450, 0.9, WARM[v % len(WARM)])
    haze(0.015, size=6)
    camera((0.0, -2.6, 1.15), (0, 0, 0.24), lens=70)


def back_side(res, finish="black", v=0):
    hero(res, finish, v, back=True)


CONCEPTS = {
    "kartvizit-bitti": kartvizit_bitti,
    "tek-dokunus": tek_dokunus,
    "alti-kaplama": alti_kaplama,
    "hero": hero,
    "macro": macro,
    "stack": stack,
    "back": back_side,
}


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]
    p = argparse.ArgumentParser()
    p.add_argument("--out", default="out/ads")
    p.add_argument("--concept", default="all")
    p.add_argument("--samples", type=int, default=96)
    p.add_argument("--res", default="1080x1350")
    # Posts spec (JSON list of {id, scene, finish, v}); renders only --ids.
    p.add_argument("--spec")
    p.add_argument("--ids", default="")
    a = p.parse_args(argv)
    res = tuple(int(v) for v in a.res.split("x"))
    os.makedirs(a.out, exist_ok=True)
    if a.spec:
        import json

        posts = [x for x in json.load(open(a.spec)) if x.get("scene") in CONCEPTS]
        want = set(a.ids.split(",")) if a.ids else None
        jobs = [(x["id"], x["scene"], x.get("finish"), x.get("v", 0)) for x in posts if not want or x["id"] in want]
    else:
        names = list(CONCEPTS) if a.concept == "all" else a.concept.split(",")
        jobs = [(n, n, None, 0) for n in names]
    for n, scene_name, finish, v in jobs:
        fn = CONCEPTS[scene_name]
        if finish:
            fn(res, finish, v)
        else:
            fn(res)
        sc = bpy.context.scene
        sc.cycles.samples = a.samples
        sc.render.filepath = os.path.join(a.out, f"{n}.png")
        bpy.ops.render.render(write_still=True)
        print("wrote", sc.render.filepath)


if __name__ == "__main__":
    main()
