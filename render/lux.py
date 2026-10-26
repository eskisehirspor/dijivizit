"""Luxury product stills for Instagram (1080x1350): Dijivizit cards on black
stone under strip lights, editorial low-key lighting.

python3 render/lux.py --out DIR [--samples 256] [--res 1080x1350] [--only id,id] [--list]
"""
import argparse
import math
import os
import sys

import bpy  # noqa: F401
from mathutils import Euler, Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import scene as S  # noqa: E402

FINISHES = ["black", "silver", "gold", "wood", "wood-light"]
THEME = "dark"  # "light": high-key, warm white stone and soft daylight
CARD_W, CARD_H, CARD_T = 0.856, 0.54, 0.012


def args():
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True)
    p.add_argument("--samples", type=int, default=256)
    p.add_argument("--res", default="1080x1350")
    p.add_argument("--only", default="")
    p.add_argument("--list", action="store_true")
    p.add_argument("--theme", default="dark", choices=["dark", "light"])
    a = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    return p.parse_args(a)


# ------------------------------------------------------------------ helpers

def emission_plane(name, size, loc, look_at, strength, color=(1, 1, 1), camera_visible=False):
    o = S.flat(name, size[0], size[1], 0.02, seg=2)
    o.location = loc
    o.rotation_euler = (Vector(look_at) - Vector(loc)).to_track_quat("Z", "Y").to_euler()
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Strength"].default_value = strength
    e.inputs["Color"].default_value = (*color, 1)
    nt.links.new(e.outputs["Emission"], nt.nodes["Material Output"].inputs["Surface"])
    o.data.materials.append(m)
    o.visible_camera = camera_visible
    o.visible_diffuse = True
    o.visible_shadow = False
    return o


def area(name, size, loc, look_at, energy, color=(1, 1, 1)):
    L = bpy.data.lights.new(name, "AREA")
    L.shape = "RECTANGLE"
    L.size, L.size_y = size
    L.energy = energy
    L.color = color
    o = bpy.data.objects.new(name, L)
    bpy.context.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (Vector(look_at) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return o


def stone_material(tint=(0.006, 0.006, 0.007), rough=(0.22, 0.45)):
    mat, bsdf = S.principled("Stone", **{"Base Color": (*tint, 1)})
    nt = mat.node_tree
    tc = S.node(nt, "ShaderNodeTexCoord", (-1200, 0))
    n = S.node(nt, "ShaderNodeTexNoise", (-900, 0))
    n.inputs["Scale"].default_value = 3.0
    n.inputs["Detail"].default_value = 10.0
    n.inputs["Roughness"].default_value = 0.6
    nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
    r = S.node(nt, "ShaderNodeMapRange", (-600, 0))
    r.inputs["To Min"].default_value = rough[0]
    r.inputs["To Max"].default_value = rough[1]
    nt.links.new(n.outputs["Fac"], r.inputs["Value"])
    nt.links.new(r.outputs["Result"], bsdf.inputs["Roughness"])
    b = S.node(nt, "ShaderNodeBump", (-300, -250))
    b.inputs["Strength"].default_value = 0.03
    nt.links.new(n.outputs["Fac"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def make_card(name, finish, loc, rot):
    c = S.slab(name, CARD_W, CARD_H, 0.032, CARD_T)
    S.bevel(c, 0.0025, 3)
    c.data.materials.append(S.card_edge_material(finish))
    c.data.materials.append(S.card_face_material(f"{name}F", "card-front.png", finish))
    c.data.materials.append(S.card_face_material(f"{name}B", "card-back.png", finish))
    c.location = loc
    c.rotation_euler = Euler([math.radians(a) for a in rot])
    return c


def lying(name, finish, xy, yaw, lift=0.0, tilt=(0, 0), back=False):
    """A card lying on the floor (z=0), front face up unless back=True."""
    rx = 180 if back else 0
    return make_card(name, finish, (xy[0], xy[1], CARD_T / 2 + lift), (rx + tilt[0], tilt[1], yaw))


def make_phone(loc, rot, screen="profile"):
    ph = bpy.data.objects.new("Phone", None)
    bpy.context.collection.objects.link(ph)
    body = S.slab("PhoneBody", 0.715, 1.47, 0.11, 0.078, seg=16)
    S.bevel(body, 0.018, 6)
    body.parent = ph
    ti, _ = S.principled("Titanium", **{"Base Color": (0.2, 0.2, 0.21, 1), "Metallic": 1.0, "Roughness": 0.3})
    glass, _ = S.principled("BlackGlass", **{"Base Color": (0.003, 0.003, 0.004, 1), "Roughness": 0.04, "Coat Weight": 1.0})
    for m in (ti, glass, ti):
        body.data.materials.append(m)
    sc = S.flat("Screen", 0.672, 1.427, 0.092, seg=16)
    sc.parent = ph
    sc.location = (0, 0, 0.0392)
    smat, m1, m2 = S.screen_material()
    m1.inputs["Factor"].default_value = 1.0 if screen in ("profile", "saved") else 0.0
    m2.inputs["Factor"].default_value = 1.0 if screen == "saved" else 0.0
    smat.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 0.85 if THEME == "light" else 1.6
    sc.data.materials.append(smat)
    isl = S.flat("Island", 0.125, 0.036, 0.018, seg=8)
    isl.parent = ph
    isl.location = (0, 0.645, 0.0396)
    isl.data.materials.append(glass)
    ph.location = loc
    ph.rotation_euler = Euler([math.radians(a) for a in rot])
    return ph


def stage(warm=0.0, floor=True, key=1.0, rim=1.0, strip=1.0, haze=0.0):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - Medium High Contrast"
    w = bpy.data.worlds.new("W")
    sc.world = w
    w.use_nodes = True
    if THEME == "light":
        sc.view_settings.look = "AgX - Base Contrast"
        w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.93, 0.92, 0.9, 1)
        w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.3
        if floor:
            f = S.flat("Floor", 60, 60, 0.01, seg=1)
            f.data.materials.append(stone_material(tint=(0.78, 0.74, 0.67), rough=(0.4, 0.65)))
        warmc = (1.0, 0.95 - 0.05 * warm, 0.88 - 0.1 * warm)
        # Big soft window light from the left and a broad fill from above.
        area("Window", (1.6, 1.2), (-2.6, -1.6, 2.4), (0, 0, 0), 700 * key, warmc)
        area("Fill", (5.0, 5.0), (0.5, -0.5, 5.0), (0, 0, 0), 120, (1.0, 0.98, 0.95))
        area("Rim", (0.4, 3.0), (2.6, 1.2, 0.8), (0, 0, 0.05), 120 * rim, (0.95, 0.97, 1.0))
        emission_plane("Top", (3, 1.2), (0, -0.4, 4.2), (0, 0, 0), 0.6, warmc)
        return sc
    w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.0, 0.0, 0.0, 1)
    w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.0
    if floor:
        f = S.flat("Floor", 60, 60, 0.01, seg=1)
        f.data.materials.append(stone_material())
    warmc = (1.0, 0.86 - 0.1 * warm, 0.7 - 0.2 * warm)
    # Long strip softbox behind the subject: rim on edges, bright line in the stone.
    emission_plane("Strip", (5.0, 0.22), (0, 3.2, 1.6), (0, 0, 0), 22 * strip, warmc)
    # Soft key from the upper left.
    area("Key", (2.2, 1.2), (-2.4, -1.4, 2.6), (0, 0, 0), 260 * key, warmc)
    # Thin cool rim from the right.
    area("Rim", (0.25, 3.0), (2.6, 1.2, 0.6), (0, 0, 0.05), 180 * rim, (0.85, 0.9, 1.0))
    # Large faint card above for broad reflections on metal faces.
    emission_plane("Top", (3, 1.2), (0, -0.4, 4.2), (0, 0, 0), 0.35 * key, warmc)
    return sc


def camera(loc, target, lens=85, fstop=4.0, focus=None):
    cd = bpy.data.cameras.new("Cam")
    cd.lens = lens
    cd.sensor_width = 36
    cd.dof.use_dof = fstop < 20
    cd.dof.aperture_fstop = fstop
    cam = bpy.data.objects.new("Cam", cd)
    bpy.context.collection.objects.link(cam)
    cam.location = loc
    cam.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    cd.dof.focus_distance = (Vector(focus or target) - Vector(loc)).length
    bpy.context.scene.camera = cam
    return cam


# ------------------------------------------------------------------ shots

def hero(fin):
    """Card lying on stone, low three-quarter view, copy space above."""
    def f():
        stage(warm=0.4 if fin in ("gold", "wood", "wood-light") else 0.0, key=0.8, strip=0.12, rim=1.6)
        bpy.data.objects["Top"].hide_render = True
        lying("C", fin, (0, 0), 14)
        camera((0.05, -2.45, 0.95), (0.0, 0.12, 0.0), lens=70, fstop=4.0, focus=(0, 0, 0))
    return f


def lean(fin):
    """Card standing, leaning back, rim-lit, reflected in the stone."""
    def f():
        stage(warm=0.3, key=0.8, rim=1.4)
        make_card("C", fin, (0, 0, CARD_H / 2 * math.cos(math.radians(12)) + 0.003), (78, 0, -14))
        camera((0.15, -2.9, 0.42), (0, 0.05, 0.25), lens=85, fstop=2.2)
    return f


def macro(fin, local=(-0.3, 0.17, 0.006), back=False):
    def f():
        stage(warm=0.4, key=1.1)
        c = lying("C", fin, (0, 0), 10, back=back)
        bpy.context.view_layer.update()
        t = c.matrix_world @ Vector(local)
        camera((t.x + 0.08, t.y - 0.75, t.z + 0.42), tuple(t), lens=100, fstop=3.5)
    return f


def edge(fin):
    """Extreme close-up on the card edge and corner."""
    def f():
        stage(warm=0.5, key=0.6, rim=2.0, strip=1.3)
        c = lying("C", fin, (0, 0), -24, lift=0.0)
        bpy.context.view_layer.update()
        t = c.matrix_world @ Vector((CARD_W / 2 - 0.12, -CARD_H / 2 + 0.1, 0))
        camera((t.x + 0.35, t.y - 0.75, 0.32), tuple(t), lens=100, fstop=2.8)
    return f


def stack():
    def f():
        stage(warm=0.35)
        for i, fin in enumerate(FINISHES):
            lying(f"S{i}", fin, (-0.18 + i * 0.09, -0.12 + i * 0.07), 8 + i * 9, lift=i * (CARD_T + 0.001))
        camera((0.15, -2.0, 1.05), (0.05, 0.1, 0.0), lens=70, fstop=4.0)
    return f


def row():
    """Five finishes lying side by side, top-down editorial."""
    def f():
        stage(warm=0.3, key=1.2, strip=0.6)
        for i, fin in enumerate(FINISHES):
            lying(f"R{i}", fin, (0, 1.24 - i * 0.62), 0)
        camera((0, 0, 4.4), (0, 0, 0), lens=50, fstop=16)
        bpy.context.scene.camera.rotation_euler = (0, 0, 0)
    return f


def duo(a, b):
    def f():
        stage(warm=0.35)
        lying("A", a, (-0.22, 0.12), -14)
        lying("B", b, (0.24, -0.2), 22, lift=CARD_T + 0.002, back=True)
        camera((0.12, -2.0, 0.95), (0.02, 0.0, 0.0), lens=70, fstop=3.5)
    return f


def float_(fin):
    """Card suspended in darkness, a single beam of light, no floor."""
    def f():
        stage(warm=0.5, floor=False, key=0.7, rim=1.6, strip=1.4)
        make_card("C", fin, (0, 0, 0), (72, -18, -24))
        camera((0, -3.2, 0.1), (0, 0, 0), lens=85, fstop=2.8)
    return f


def phone(fin, screen="profile"):
    def f():
        stage(warm=0.3, key=0.9)
        make_phone((0.15, 0.1, 0.039), (0, 0, -8), screen)
        lying("C", fin, (-0.45, -0.38), 24)
        camera((0.05, -2.9, 2.0), (-0.05, -0.05, 0.0), lens=60, fstop=4.0)
    return f


def nfc_rings(center, normal, n=3, base=0.09, gap=0.07, strength=6.0, color=(0.75, 0.85, 1.0)):
    """Glowing concentric rings at the tap point (NFC field visualisation)."""
    for i in range(n):
        r = base + i * gap
        bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=0.0035 - i * 0.0006, major_segments=96, minor_segments=8)
        t = bpy.context.active_object
        t.name = f"Ring{i}"
        t.location = center
        t.rotation_euler = Vector(normal).to_track_quat("Z", "Y").to_euler()
        m = bpy.data.materials.new(f"Ring{i}")
        m.use_nodes = True
        nt = m.node_tree
        nt.nodes.remove(nt.nodes["Principled BSDF"])
        e = nt.nodes.new("ShaderNodeEmission")
        e.inputs["Strength"].default_value = strength * (1 - i * 0.28)
        e.inputs["Color"].default_value = (*color, 1)
        nt.links.new(e.outputs["Emission"], nt.nodes["Material Output"].inputs["Surface"])
        t.data.materials.append(m)
        t.visible_shadow = False


def tap(fin, screen="profile", rings=True):
    """Phone standing on the stone, screen to camera; the card touches the
    back of its top edge. Rings mark the NFC tap."""
    def f():
        stage(warm=0.25, key=0.8, rim=1.4, strip=0.5)
        ph = make_phone((0, 0.1, 0.0), (0, 0, 0), screen)
        # stand upright, leaning back 12 degrees, bottom edge on the floor
        lean = math.radians(12)
        ph.rotation_euler = Euler((math.radians(90) - lean, 0, math.radians(-24)))
        ph.location = (0.05, 0.15, 0.735 * math.cos(lean) + 0.04 * math.sin(lean))
        bpy.context.view_layer.update()
        mw = ph.matrix_world
        # card behind the phone, its edge resting on the back near the top
        back_top = mw @ Vector((-0.06, 0.6, -0.045))
        c = make_card("C", fin, (0, 0, 0), (0, 0, 0))
        c.rotation_euler = (mw.to_3x3() @ Euler((math.radians(-28), math.radians(10), math.radians(18))).to_matrix()).to_euler()
        bpy.context.view_layer.update()
        off = c.matrix_world.to_3x3() @ Vector((0.0, -CARD_H / 2 + 0.02, -CARD_T))
        c.location = back_top - off + mw.to_3x3() @ Vector((0, 0, -0.012))
        if rings:
            nfc_rings(back_top + mw.to_3x3() @ Vector((0, 0.06, -0.01)), mw.to_3x3() @ Vector((0, 0, -1)), base=0.07, gap=0.055, strength=4.0)
        camera((0.95, -2.9, 1.05), (0.0, 0.2, 0.92), lens=55, fstop=4.0, focus=tuple(back_top))
    return f


def ui_flat(fin, screen="profile"):
    """Phone face up on the stone, screen readable, card beside it."""
    def f():
        stage(warm=0.3, key=0.7, strip=0.15)
        make_phone((0.12, 0.05, 0.039), (0, 0, -6), screen)
        lying("C", fin, (-0.5, -0.32), 28)
        camera((0.0, -1.7, 2.6), (-0.08, -0.08, 0.0), lens=50, fstop=5.6, focus=(0.12, 0.05, 0.05))
    return f


def ui_macro(screen="profile"):
    def f():
        stage(warm=0.3, key=0.6, strip=0.15)
        ph = make_phone((0.0, 0.0, 0.039), (0, 0, -4), screen)
        lying("C", "gold", (-0.42, -0.62), 32, lift=0.0)
        bpy.context.view_layer.update()
        t = ph.matrix_world @ Vector((0, 0.18, 0.04))
        camera((t.x + 0.05, t.y - 0.95, 1.05), tuple(t), lens=70, fstop=2.8)
    return f


SHOTS = {}
for fin in FINISHES:
    SHOTS[f"lux-hero-{fin}"] = hero(fin)
    SHOTS[f"lux-lean-{fin}"] = lean(fin)
SHOTS["lux-macro-gold"] = macro("gold")
SHOTS["lux-macro-black"] = macro("black")
SHOTS["lux-macro-wood"] = macro("wood")
SHOTS["lux-macro-silver"] = macro("silver")
SHOTS["lux-edge-gold"] = edge("gold")
SHOTS["lux-edge-black"] = edge("black")
SHOTS["lux-stack"] = stack()
SHOTS["lux-row"] = row()
SHOTS["lux-duo-black-gold"] = duo("black", "gold")
SHOTS["lux-duo-wood"] = duo("wood", "wood-light")
SHOTS["lux-float-black"] = float_("black")
SHOTS["lux-float-gold"] = float_("gold")
SHOTS["lux-phone-black"] = phone("black")
SHOTS["lux-phone-gold-saved"] = phone("gold", "saved")
SHOTS["lux-tap-black"] = tap("black", "profile")
SHOTS["lux-tap-gold-idle"] = tap("gold", "idle")
SHOTS["lux-tap-wood"] = tap("wood", "profile")
SHOTS["lux-ui-profile"] = ui_flat("black", "profile")
SHOTS["lux-ui-saved"] = ui_flat("silver", "saved")
SHOTS["lux-ui-idle"] = ui_flat("wood-light", "idle")
SHOTS["lux-ui-macro"] = ui_macro("profile")


def main():
    global THEME
    a = args()
    THEME = a.theme
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
