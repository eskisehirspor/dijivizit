"""Vertical promo film (1080x1920, 30 fps, 22 s) for Dijivizit sponsored ads.

"Temas" art direction, same as the Instagram series: products on the paper
ground (#F3F2EE). Frames are rendered on transparent film with the light stage
from lux.py; marketing/film/compose.py puts them on paper with a soft shadow,
draws the signal rings at the tap point and adds the type.

Shots: a gold card turning in the light, a black card, a light wood card
tapping a phone that opens the real profile, the profile up close, a fan of all
five finishes and a wood end card.

python3 render/film.py --out DIR [--frames 0-659] [--samples 48] [--res 1080x1920]
python3 render/film.py --project tap.json   (screen position of the tap point)
"""
import argparse
import math
import os
import sys

import bpy  # noqa: F401
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import scene as S  # noqa: E402
import lux as L  # noqa: E402

FPS = 30
CARD_W, CARD_H, CARD_T = L.CARD_W, L.CARD_H, L.CARD_T

# (name, first frame, length)
SHOTS = [
    ("hook", 0, 105),
    ("spin", 105, 90),
    ("tap", 195, 135),
    ("screen", 330, 105),
    ("fan", 435, 105),
    ("end", 540, 120),
]
TOTAL = 660


def parse():
    p = argparse.ArgumentParser()
    p.add_argument("--out", default="out")
    p.add_argument("--frames", default=f"0-{TOTAL - 1}")
    p.add_argument("--samples", type=int, default=48)
    p.add_argument("--res", default="1080x1920")
    p.add_argument("--project", default="")
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

def studio(bg=1.0, key_e=1.0, warm=0.3):
    """Light stage from lux.py (soft window key, fill, cool rim, bright world in
    metal reflections) on transparent film; bg is kept for call compatibility."""
    L.THEME = "light"
    sc = L.stage(warm=warm, floor=False, key=key_e)
    sc.render.fps = FPS
    sc.render.use_motion_blur = True
    sc.render.motion_blur_shutter = 0.5
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
    return cam, tgt


def card(name, fin, loc=(0, 0, 0), rot=(90, 0, 0)):
    return L.make_card(name, fin, loc, rot)


def phone(screen="idle"):
    """Pro Max sized phone facing -Y with the real app screen; returns
    (phone, [profile_mix, saved_mix])."""
    ph = L.make_phone((0, 0, 0), (0, 0, 0), screen)
    nt = bpy.data.materials["Screen"].node_tree
    ph.scale = (1.09, 1.09, 1.09)
    return ph, [nt.nodes["mix_profile"], nt.nodes["mix_saved"]]


# ------------------------------------------------------------------ shots
# Each builder keys its animation in local frames 0..len-1.

def hook(n):
    """Gold card turning in soft light, close and slow, with a light sweep."""
    studio(bg=0.8, key_e=0.45, warm=0.6)
    c = card("C", "gold", (0, 0, 0), (62, 0, 18))
    key(c, 0, rot=(62, 0, 26))
    key(c, n, rot=(72, 0, 4))
    cam, t = cam_rig((0.5, -0.6, 0.5), (0.1, 0, 0.0), lens=70, fstop=2.2)
    key(cam, 0, loc=(1.3, -1.45, 0.85))
    key(cam, n, loc=(-0.55, -1.75, 0.6))
    key(t, 0, loc=(0.12, 0.02, 0.06))
    key(t, n, loc=(-0.2, 0.02, 0.0))
    sweep = L.area("Sweep", (0.25, 2.4), (-1.6, -1.2, 0.6), (0, 0, 0), 60, (1, 0.95, 0.85))
    key(sweep, 0, loc=(-2.2, -1.2, 0.6))
    key(sweep, n, loc=(2.2, -1.2, 0.6))


def spin(n):
    studio(bg=1.0)
    c = card("C", "black", (0, 0, 0), (90, 0, 0))
    key(c, 0, loc=(0, 0, -0.25), rot=(98, -10, -40))
    key(c, int(n * 0.75), loc=(0, 0, 0.05), rot=(90, 0, 360 + 180))
    key(c, n, loc=(0, 0, 0.08), rot=(92, 2, 360 + 360 - 12))
    cam, t = cam_rig((0, -2.1, 0.1), (0, 0, 0.05), lens=50, fstop=4.0)
    key(cam, 0, loc=(0.15, -2.35, 0.15))
    key(cam, n, loc=(-0.05, -1.95, 0.06))


def fan(n):
    studio(bg=1.0, warm=0.4)
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
    cam, t = cam_rig((0.6, -2.9, 0.2), (0.05, 0, 0.0), lens=42, fstop=4.0)
    key(cam, 0, loc=(0.8, -2.3, -0.1))
    key(cam, n, loc=(0.08, -2.7, 0.3))
    key(t, 0, loc=(0.0, 0, -0.1))
    key(t, n, loc=(0.05, 0, 0.05))


def tap(n):
    studio(bg=1.0)
    ph, mixes = phone("idle")
    key(ph, 0, loc=(0.1, 0, -0.2), rot=(90, 0, -14))
    key(ph, n, loc=(0.1, 0, -0.18), rot=(90, 0, -20))
    c = card("C", "wood-light")
    contact = int(n * 0.36)
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
    # The tap point; compose.py draws the signal rings there in 2D.
    tp = bpy.data.objects.new("TapPoint", None)
    bpy.context.collection.objects.link(tp)
    tp.parent = ph
    tp.location = (-0.1 / 1.09, 0.62 / 1.09, 0.06 / 1.09)
    bpy.context.scene["contact"] = contact
    bpy.context.scene.frame_set(0)
    cam, t = cam_rig((0, -2.8, 0.35), (0.0, 0, 0.2), lens=40, fstop=5.6)
    key(cam, 0, loc=(0.3, -3.5, 0.45))
    key(cam, n, loc=(-0.1, -3.0, 0.3))
    key(t, 0, loc=(-0.05, 0, 0.3))
    key(t, n, loc=(0.05, 0, 0.2))


def screen(n):
    studio(bg=1.0)
    ph, mixes = phone("profile")
    key(ph, 0, loc=(0, 0, 0), rot=(90, 0, -6))
    key(ph, n, loc=(0, 0, 0), rot=(90, 0, 4))
    if mixes:
        keyv(mixes[0].inputs["Factor"], 0, 1.0)
    if len(mixes) > 1:
        keyv(mixes[1].inputs["Factor"], 0, 0.0)
    cam, t = cam_rig((0, -3.2, 0.2), (0, 0, 0.1), lens=50, fstop=4.0)
    key(cam, 0, loc=(0.35, -3.0, 0.5))
    key(cam, n, loc=(0.05, -1.95, 0.22))
    key(t, 0, loc=(0, 0, 0.15))
    key(t, n, loc=(0, 0, 0.2))


def end(n):
    studio(bg=1.1, warm=0.5)
    c = card("C", "wood", (0, 0, 0.5), (90, 0, 0))
    key(c, 0, loc=(0, 0, 0.42), rot=(96, -4, -22))
    key(c, n, loc=(0, 0, 0.5), rot=(92, 0, 8))
    cam, t = cam_rig((0, -3.05, 0.1), (0, 0, 0.1), lens=50, fstop=5.6)


BUILDERS = {name: globals()[name] for name, _, _ in SHOTS}

# Raise the camera and its aim so the subject sits lower in frame, leaving the
# upper third (inside the Reels safe zone) clear for captions.
LIFT = {"hook": 0.12, "spin": 0.12, "fan": 0.0, "tap": 0.5, "screen": 0.3, "end": 0.58}


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


def project(path):
    """Write the tap point's position in the frame (pixels at 1080x1920) for
    every frame of the tap shot, plus the contact frame, for compose.py."""
    import json
    from bpy_extras.object_utils import world_to_camera_view

    name, start, length = next(s for s in SHOTS if s[0] == "tap")
    BUILDERS[name](length - 1)
    ease_all()
    lift_view(LIFT.get(name, 0.0))
    sc = bpy.context.scene
    sc.render.resolution_x, sc.render.resolution_y = 1080, 1920
    pts = {}
    for f in range(length):
        sc.frame_set(f)
        bpy.context.view_layer.update()
        v = world_to_camera_view(sc, sc.camera, bpy.data.objects["TapPoint"].matrix_world.translation)
        pts[start + f] = [round(v.x * 1080, 1), round((1 - v.y) * 1920, 1)]
    with open(path, "w") as fh:
        json.dump({"contact": start + sc["contact"], "points": pts}, fh)
    print("projected", len(pts))


def main():
    a = parse()
    if a.project:
        project(a.project)
        return
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
