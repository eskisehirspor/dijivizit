"""Vertical promo film (1080x1920, 30 fps, 15 s) for Dijivizit sponsored ads.

Fast-cut 3D product spots on a soft grey studio: macro sweeps across the card,
a spin, a fan of all five finishes, the NFC tap on a phone, the profile and
"saved" screens, a duo and an end card. Captions are composited afterwards
(marketing/film/compose.py), so these frames carry no text.

python3 render/film.py --out DIR [--frames 0-449] [--samples 48] [--res 1080x1920]
"""
import argparse
import math
import os
import sys

import bpy  # noqa: F401
from mathutils import Euler, Matrix, Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import scene as S  # noqa: E402
import lux as L  # noqa: E402

FPS = 30
CARD_W, CARD_H, CARD_T = L.CARD_W, L.CARD_H, L.CARD_T

# (name, first frame, length)
SHOTS = [
    ("macro_black", 0, 45),
    ("macro_gold", 45, 45),
    ("spin", 90, 45),
    ("fan", 135, 60),
    ("tap", 195, 90),
    ("screen", 285, 60),
    ("duo", 345, 60),
    ("end", 405, 45),
]
TOTAL = 450


def parse():
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True)
    p.add_argument("--frames", default=f"0-{TOTAL - 1}")
    p.add_argument("--samples", type=int, default=48)
    p.add_argument("--res", default="1080x1920")
    a = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    return p.parse_args(a)


def rad(v):
    return [math.radians(a) for a in v]


def key(obj, f, loc=None, rot=None, scale=None):
    if loc is not None:
        obj.location = loc
        obj.keyframe_insert("location", frame=f)
    if rot is not None:
        obj.rotation_euler = rad(rot)
        obj.keyframe_insert("rotation_euler", frame=f)
    if scale is not None:
        obj.scale = (scale, scale, scale)
        obj.keyframe_insert("scale", frame=f)


def keyv(socket, f, v):
    socket.default_value = v
    socket.keyframe_insert("default_value", frame=f)


def ease_all(kind="BEZIER"):
    for a in bpy.data.actions:
        for fc in getattr(a, "fcurves", []):
            for k in fc.keyframe_points:
                k.interpolation = kind


# ------------------------------------------------------------------ studio

def studio(bg=0.42, key_e=1.0, warm=0.0):
    """Soft grey seamless studio like a product film: no floor, a large diffuse
    backdrop that follows the camera, big soft key, fill and two rims."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.view_settings.view_transform = "AgX"
    sc.view_settings.look = "AgX - Medium High Contrast"
    sc.render.fps = FPS
    sc.render.use_motion_blur = True
    sc.render.motion_blur_shutter = 0.5
    w = bpy.data.worlds.new("W")
    sc.world = w
    w.use_nodes = True
    bgn = w.node_tree.nodes["Background"]
    bgn.inputs["Color"].default_value = (0.8, 0.8, 0.82, 1)
    bgn.inputs["Strength"].default_value = 0.35
    wc = (1.0, 0.95 - 0.08 * warm, 0.9 - 0.18 * warm)
    L.area("Key", (3.0, 2.0), (-2.6, -2.4, 2.4), (0, 0, 0), 520 * key_e, wc)
    L.area("Fill", (3.0, 3.0), (3.0, -2.6, 0.2), (0, 0, 0), 160 * key_e, (0.92, 0.95, 1.0))
    L.area("RimL", (0.4, 3.5), (-2.2, 2.0, 0.6), (0, 0, 0), 300 * key_e, wc)
    L.area("RimR", (0.4, 3.5), (2.2, 2.0, 1.0), (0, 0, 0), 260 * key_e, (0.9, 0.94, 1.0))
    sc["bg"] = bg
    return sc


def cam_rig(loc, target, lens=50, fstop=4.0):
    cd = bpy.data.cameras.new("Cam")
    cd.lens = lens
    cd.sensor_fit = "VERTICAL"
    cd.sensor_height = 36
    cd.dof.use_dof = True
    cd.dof.aperture_fstop = fstop
    cam = bpy.data.objects.new("Cam", cd)
    bpy.context.collection.objects.link(cam)
    tgt = bpy.data.objects.new("Target", None)
    bpy.context.collection.objects.link(tgt)
    cam.location, tgt.location = loc, target
    c = cam.constraints.new("TRACK_TO")
    c.target = tgt
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"
    cd.dof.focus_object = tgt
    bpy.context.scene.camera = cam
    # Backdrop: a big grey card far behind the subject, locked to the camera.
    bd = S.flat("Backdrop", 60, 60, 0.01, seg=1)
    m, b = S.principled("Backdrop", **{"Base Color": (bpy.context.scene["bg"],) * 3 + (1,), "Roughness": 1.0})
    bd.data.materials.append(m)
    bd.parent = cam
    bd.location = (0, 0, -14)
    bd.visible_shadow = False
    return cam, tgt


def card(name, fin, loc=(0, 0, 0), rot=(90, 0, 0)):
    return L.make_card(name, fin, loc, rot)


def phone(screen="idle"):
    """Pro Max sized phone facing -Y; returns (phone, [profile_mix, saved_mix])."""
    ph = bpy.data.objects.new("Phone", None)
    bpy.context.collection.objects.link(ph)
    body = S.slab("PhoneBody", 0.715, 1.47, 0.11, 0.078, seg=16)
    S.bevel(body, 0.018, 6)
    body.parent = ph
    ti, _ = S.principled("Titanium", **{"Base Color": (0.42, 0.41, 0.4, 1), "Metallic": 1.0, "Roughness": 0.28})
    glass, _ = S.principled("BlackGlass", **{"Base Color": (0.003, 0.003, 0.004, 1), "Roughness": 0.04, "Coat Weight": 1.0})
    for m in (ti, glass, ti):
        body.data.materials.append(m)
    sc = S.flat("Screen", 0.672, 1.427, 0.092, seg=16)
    sc.parent = ph
    sc.location = (0, 0, 0.0392)
    smat, m1, m2 = S.screen_material()
    m1.inputs["Factor"].default_value = 1.0 if screen in ("profile", "saved") else 0.0
    m2.inputs["Factor"].default_value = 1.0 if screen == "saved" else 0.0
    sc.data.materials.append(smat)
    isl = S.flat("Island", 0.125, 0.036, 0.018, seg=8)
    isl.parent = ph
    isl.location = (0, 0.645, 0.0396)
    isl.data.materials.append(glass)
    ph.scale = (1.09, 1.09, 1.09)
    return ph, [m1, m2]


def ring_set(center, normal, n=3):
    rings = []
    for i in range(n):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.12, minor_radius=0.004, major_segments=96, minor_segments=8)
        t = bpy.context.active_object
        t.location = center
        t.rotation_euler = Vector(normal).to_track_quat("Z", "Y").to_euler()
        m = bpy.data.materials.new(f"Ring{i}")
        m.use_nodes = True
        nt = m.node_tree
        nt.nodes.remove(nt.nodes["Principled BSDF"])
        e = nt.nodes.new("ShaderNodeEmission")
        e.inputs["Color"].default_value = (0.55, 0.75, 1.0, 1)
        nt.links.new(e.outputs["Emission"], nt.nodes["Material Output"].inputs["Surface"])
        t.data.materials.append(m)
        t.visible_shadow = False
        rings.append((t, e.inputs["Strength"]))
    return rings


# ------------------------------------------------------------------ shots
# Each builder keys its animation in local frames 0..len-1.

def macro_black(n):
    studio(bg=0.3, key_e=0.9)
    c = card("C", "black", (0, 0, 0), (90, 0, 0))
    key(c, 0, rot=(90, 0, -8))
    key(c, n, rot=(90, 0, 6))
    cam, t = cam_rig((-0.55, -0.42, 0.22), (-0.3, 0, 0.12), lens=60, fstop=2.0)
    key(cam, 0, loc=(-0.6, -0.42, 0.26))
    key(cam, n, loc=(0.35, -0.5, 0.05))
    key(t, 0, loc=(-0.32, 0, 0.12))
    key(t, n, loc=(0.25, 0, -0.08))
    # light sweep across the face
    sweep = L.area("Sweep", (0.15, 2.0), (-1.6, -1.2, 0.3), (0, 0, 0), 900, (1, 0.98, 0.95))
    key(sweep, 0, loc=(-1.8, -1.0, 0.3))
    key(sweep, n, loc=(1.8, -1.0, 0.3))


def macro_gold(n):
    studio(bg=0.36, key_e=1.0, warm=0.5)
    c = card("C", "gold", (0, 0, 0), (62, 0, 18))
    key(c, 0, rot=(62, 0, 24))
    key(c, n, rot=(70, 0, 6))
    cam, t = cam_rig((0.5, -0.6, 0.5), (0.1, 0, 0.0), lens=70, fstop=2.2)
    key(cam, 0, loc=(0.75, -0.65, 0.45))
    key(cam, n, loc=(-0.35, -0.72, 0.3))
    key(t, 0, loc=(0.25, 0.02, 0.05))
    key(t, n, loc=(-0.2, 0.02, -0.05))


def spin(n):
    studio(bg=0.42)
    c = card("C", "black", (0, 0, 0), (90, 0, 0))
    key(c, 0, loc=(0, 0, -0.25), rot=(98, -10, -40))
    key(c, int(n * 0.75), loc=(0, 0, 0.05), rot=(90, 0, 360 + 180))
    key(c, n, loc=(0, 0, 0.08), rot=(92, 2, 360 + 360 - 12))
    cam, t = cam_rig((0, -2.1, 0.1), (0, 0, 0.05), lens=50, fstop=4.0)
    key(cam, 0, loc=(0.15, -2.35, 0.15))
    key(cam, n, loc=(-0.05, -1.95, 0.06))


def fan(n):
    studio(bg=0.4, warm=0.2)
    fins = ["wood-light", "wood", "silver", "gold", "black"]
    pivot_world = Vector((-0.3, 0, -0.5))
    for i, fin in enumerate(fins):
        p = bpy.data.objects.new(f"Pivot{i}", None)
        bpy.context.collection.objects.link(p)
        p.location = pivot_world + Vector((0, -0.02 * i, 0))
        c = card(f"C{i}", fin, (0, 0, 0), (90, 0, 0))
        c.parent = p
        # bottom-left corner of the card sits on the pivot
        c.location = (CARD_W / 2 - 0.06, 0, CARD_H / 2 - 0.06)
        spread = (i - 2) * 16
        key(p, 0, rot=(0, -2, 0))
        key(p, int(n * 0.55), rot=(0, spread * 0.92 - 2, 0))
        key(p, n, rot=(0, spread - 2, 0))
    cam, t = cam_rig((0.6, -2.9, 0.2), (0.05, 0, 0.0), lens=50, fstop=4.0)
    key(cam, 0, loc=(0.8, -2.3, -0.1))
    key(cam, n, loc=(0.08, -2.7, 0.3))
    key(t, 0, loc=(0.0, 0, -0.1))
    key(t, n, loc=(0.05, 0, 0.05))


def tap(n):
    studio(bg=0.45)
    ph, mixes = phone("idle")
    key(ph, 0, loc=(0.1, 0, -0.2), rot=(90, 0, -14))
    key(ph, n, loc=(0.1, 0, -0.18), rot=(90, 0, -20))
    c = card("C", "black")
    contact = int(n * 0.42)
    bpy.context.scene.frame_set(0)

    def behind(f, local, tilt=(0, 0, 0)):
        bpy.context.scene.frame_set(f)
        mw = ph.matrix_world.copy()
        pz = math.degrees(ph.rotation_euler.z)
        key(c, f, loc=tuple(mw @ Vector(local)), rot=(90 + tilt[0], tilt[1], pz + tilt[2]))

    behind(0, (-1.35, 1.25, -0.5), (10, 30, 10))
    behind(contact - 8, (-0.62, 0.92, -0.16), (2, 20, 2))
    behind(contact, (-0.46, 0.8, -0.0447), (0, 18, 0))
    behind(contact + 14, (-0.46, 0.8, -0.0447), (0, 18, 0))
    behind(n, (-0.95, 1.0, -0.35), (6, 22, 10))
    # screen idle -> profile right after contact
    for m in mixes[:1]:
        keyv(m.inputs["Factor"], 0, 0.0)
        keyv(m.inputs["Factor"], contact + 2, 0.0)
        keyv(m.inputs["Factor"], contact + 8, 1.0)
    for m in mixes[1:2]:
        keyv(m.inputs["Factor"], 0, 0.0)
    # NFC rings pulse out from the tap point
    bpy.context.scene.frame_set(contact)
    mw = ph.matrix_world.copy()
    centre = mw @ Vector((-0.1, 0.62, 0.06))
    normal = mw.to_3x3() @ Vector((0, 0, 1))
    for i, (r, s) in enumerate(ring_set(tuple(centre), tuple(normal))):
        f0 = contact + i * 5
        key(r, 0, scale=0.0)
        key(r, f0 - 2, scale=0.0)
        key(r, f0 - 1, scale=0.2)
        keyv(s, f0 - 1, 0.0)
        keyv(s, f0, 9.0)
        key(r, f0 + 16, scale=3.2)
        keyv(s, f0 + 16, 0.0)
        key(r, f0 + 17, scale=0.0)
    bpy.context.scene.frame_set(0)
    cam, t = cam_rig((0, -2.8, 0.35), (0.0, 0, 0.2), lens=50, fstop=5.6)
    key(cam, 0, loc=(0.3, -3.5, 0.45))
    key(cam, n, loc=(-0.1, -3.0, 0.3))
    key(t, 0, loc=(-0.05, 0, 0.3))
    key(t, n, loc=(0.05, 0, 0.2))


def screen(n):
    studio(bg=0.45)
    ph, mixes = phone("profile")
    key(ph, 0, loc=(0, 0, 0), rot=(90, 0, -6))
    key(ph, n, loc=(0, 0, 0), rot=(90, 0, 4))
    if mixes:
        keyv(mixes[0].inputs["Factor"], 0, 1.0)
    if len(mixes) > 1:
        keyv(mixes[1].inputs["Factor"], 0, 0.0)
        keyv(mixes[1].inputs["Factor"], int(n * 0.5), 0.0)
        keyv(mixes[1].inputs["Factor"], int(n * 0.5) + 5, 1.0)
    cam, t = cam_rig((0, -3.2, 0.2), (0, 0, 0.1), lens=50, fstop=4.0)
    key(cam, 0, loc=(0.35, -3.0, 0.5))
    key(cam, n, loc=(0.05, -1.95, 0.22))
    key(t, 0, loc=(0, 0, 0.15))
    key(t, n, loc=(0, 0, 0.2))


def duo(n):
    studio(bg=0.42, warm=0.3)
    p = bpy.data.objects.new("Duo", None)
    bpy.context.collection.objects.link(p)
    g = card("G", "gold", (0.16, 0.06, 0.1), (90, 0, 10))
    b = card("B", "black", (-0.12, -0.04, -0.06), (90, 0, -6))
    for c in (g, b):
        c.parent = p
    key(p, 0, rot=(-14, 18, -28))
    key(p, n, rot=(-6, -8, 22))
    cam, t = cam_rig((0, -1.6, 0.1), (0, 0, 0), lens=50, fstop=5.6)
    key(cam, 0, loc=(0, -2.5, 0.05))
    key(cam, n, loc=(0, -2.15, 0.12))


def end(n):
    studio(bg=0.38)
    c = card("C", "black", (0, 0, 0.5), (90, 0, 0))
    key(c, 0, loc=(0, 0, 0.42), rot=(96, -4, -22))
    key(c, n, loc=(0, 0, 0.5), rot=(92, 0, 8))
    cam, t = cam_rig((0, -2.6, 0.1), (0, 0, 0.1), lens=50, fstop=5.6)


BUILDERS = {name: globals()[name] for name, _, _ in SHOTS}

# Raise the camera and its aim so the subject sits lower in frame, leaving the
# upper third (inside the Reels safe zone) clear for captions.
LIFT = {"spin": 0.3, "fan": 0.3, "tap": 0.4, "screen": 0.3, "duo": 0.3, "end": 0.45}


def lift_view(dz):
    for name in ("Cam", "Target"):
        o = bpy.data.objects[name]
        ad = o.animation_data
        curves = []
        if ad and ad.action:
            curves = [fc for fc in getattr(ad.action, "fcurves", []) if fc.data_path == "location" and fc.array_index == 2]
            if not curves:
                for layer in getattr(ad.action, "layers", []):
                    for strip in layer.strips:
                        for bag in strip.channelbags:
                            curves += [fc for fc in bag.fcurves if fc.data_path == "location" and fc.array_index == 2]
        if curves:
            for fc in curves:
                for k in fc.keyframe_points:
                    k.co.y += dz
                    k.handle_left.y += dz
                    k.handle_right.y += dz
        else:
            o.location.z += dz


def shot_for(frame):
    for name, start, length in SHOTS:
        if start <= frame < start + length:
            return name, start, length
    raise ValueError(frame)


def main():
    a = parse()
    w, h = (int(v) for v in a.res.split("x"))
    frames = S.frame_list(a.frames)
    os.makedirs(a.out, exist_ok=True)
    built = None
    for f in frames:
        name, start, length = shot_for(f)
        if built != name:
            BUILDERS[name](length - 1)
            ease_all()
            lift_view(LIFT.get(name, 0.0))
            sc = bpy.context.scene
            sc.render.resolution_x, sc.render.resolution_y = w, h
            sc.render.resolution_percentage = 100
            sc.cycles.samples = a.samples
            sc.cycles.use_adaptive_sampling = True
            sc.cycles.adaptive_threshold = 0.02
            sc.cycles.max_bounces = 6
            sc.render.image_settings.file_format = "PNG"
            built = name
        sc = bpy.context.scene
        sc.frame_set(f - start)
        sc.render.filepath = os.path.join(a.out, f"{f:04d}.png")
        bpy.ops.render.render(write_still=True)
        print("rendered", f, flush=True)


if __name__ == "__main__":
    main()
