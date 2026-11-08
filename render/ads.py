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


def kartvizit_bitti(res):
    """Black metal card floating over a heap of discarded paper business cards."""
    card_lib = export_assets("black")
    fresh(res)
    floor(rough=0.55)
    card = load(card_lib, "Hero")["Hero"]
    card.location = (0, -1.2, 1.05)
    card.rotation_euler = (math.radians(72), math.radians(-10), math.radians(-16))
    card.scale = (1.6, 1.6, 1.6)

    paper, _ = S.principled("Paper", **{"Base Color": (0.86, 0.85, 0.82, 1), "Roughness": 0.85})
    ink, _ = S.principled("Ink", **{"Base Color": (0.05, 0.05, 0.06, 1), "Roughness": 0.6})
    rnd = random.Random(7)
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


def tek_dokunus(res):
    """Gold card meeting a phone; rings of light spread from the tap."""
    lib = export_assets("gold", with_phone=True)
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


def alti_kaplama(res):
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


CONCEPTS = {"kartvizit-bitti": kartvizit_bitti, "tek-dokunus": tek_dokunus, "alti-kaplama": alti_kaplama}


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]
    p = argparse.ArgumentParser()
    p.add_argument("--out", default="out/ads")
    p.add_argument("--concept", default="all")
    p.add_argument("--samples", type=int, default=96)
    p.add_argument("--res", default="1080x1350")
    a = p.parse_args(argv)
    res = tuple(int(v) for v in a.res.split("x"))
    os.makedirs(a.out, exist_ok=True)
    names = list(CONCEPTS) if a.concept == "all" else a.concept.split(",")
    for n in names:
        CONCEPTS[n](res)
        sc = bpy.context.scene
        sc.cycles.samples = a.samples
        sc.render.filepath = os.path.join(a.out, f"{n}.png")
        bpy.ops.render.render(write_still=True)
        print("wrote", sc.render.filepath)


if __name__ == "__main__":
    main()
