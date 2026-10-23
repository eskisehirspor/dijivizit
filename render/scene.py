"""
Dijivizit landing hero: a metal NFC business card taps a phone, the phone opens
the Dijivizit profile, then confirms the contact was saved.

Run:  python3 scene.py --out DIR [--res 1600x900] [--samples 64]
                       [--frames 0-191 | --frames 0,40,90] [--portrait]
Units: 1 = 10 cm (card is 0.856 x 0.54).
"""

import argparse
import math
import os
import sys

import bpy  # must come first: it provides bmesh and mathutils
import bmesh
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
TEX = os.path.join(HERE, "tex")
FRAMES = 192  # 0..191


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True)
    p.add_argument("--res", default="1600x900")
    p.add_argument("--samples", type=int, default=64)
    p.add_argument("--frames", default="0-191")
    p.add_argument("--portrait", action="store_true")
    p.add_argument("--save-blend", default="")
    return p.parse_args(argv)


def frame_list(spec):
    out = []
    for part in spec.split(","):
        if "-" in part:
            a, b = part.split("-")
            out.extend(range(int(a), int(b) + 1))
        else:
            out.append(int(part))
    return out


# ---------------------------------------------------------------- geometry

def rounded_rect(w, h, r, seg=12):
    pts = []
    corners = [(w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180), (w / 2 - r, -h / 2 + r, 270)]
    for cx, cy, start in corners:
        for i in range(seg + 1):
            a = math.radians(start + 90 * i / seg)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def slab(name, w, h, r, thick, seg=12):
    """Rounded-rectangle slab centred on the origin, faces at +-thick/2 (Z).
    Material slots: 0 = edge, 1 = top (+Z), 2 = bottom (-Z). UVs map the
    top face to 0..1 and the bottom face mirrored so text reads correctly."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    pts = rounded_rect(w, h, r, seg)
    top = [bm.verts.new((x, y, thick / 2)) for x, y in pts]
    bot = [bm.verts.new((x, y, -thick / 2)) for x, y in pts]
    ftop = bm.faces.new(top)
    fbot = bm.faces.new(list(reversed(bot)))
    n = len(pts)
    for i in range(n):
        j = (i + 1) % n
        f = bm.faces.new((bot[i], bot[j], top[j], top[i]))
        f.material_index = 0
        f.smooth = True
    ftop.material_index = 1
    fbot.material_index = 2
    uv = bm.loops.layers.uv.new()
    for f in (ftop, fbot):
        for loop in f.loops:
            x, y = loop.vert.co.x, loop.vert.co.y
            u = (x + w / 2) / w
            v = (y + h / 2) / h
            loop[uv].uv = (u if f is ftop else 1 - u, v)
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj


def flat(name, w, h, r, seg=12):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    pts = rounded_rect(w, h, r, seg)
    vs = [bm.verts.new((x, y, 0)) for x, y in pts]
    f = bm.faces.new(vs)
    uv = bm.loops.layers.uv.new()
    for loop in f.loops:
        loop[uv].uv = ((loop.vert.co.x + w / 2) / w, (loop.vert.co.y + h / 2) / h)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj


def bevel(obj, width, segments=4):
    m = obj.modifiers.new("bevel", "BEVEL")
    m.width = width
    m.segments = segments
    m.limit_method = "ANGLE"
    m.angle_limit = math.radians(50)
    m.harden_normals = True
    obj.data.shade_smooth() if hasattr(obj.data, "shade_smooth") else None


# ---------------------------------------------------------------- materials

def node(nt, kind, loc=(0, 0), **inputs):
    n = nt.nodes.new(kind)
    n.location = loc
    for k, v in inputs.items():
        n.inputs[k].default_value = v
    return n


def image(nt, path, non_color=False, loc=(-600, 0)):
    n = nt.nodes.new("ShaderNodeTexImage")
    n.location = loc
    n.image = bpy.data.images.load(path, check_existing=True)
    if non_color:
        n.image.colorspace_settings.name = "Non-Color"
    n.interpolation = "Cubic"
    return n


def principled(name, **inputs):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    for k, v in inputs.items():
        bsdf.inputs[k].default_value = v
    return mat, bsdf


def card_face_material(name, mask_path):
    """Graphite brushed metal with laser-etched (lighter, rougher) artwork."""
    mat, bsdf = principled(name, **{"Metallic": 1.0})
    nt = mat.node_tree
    mask = image(nt, os.path.join(TEX, mask_path), non_color=True, loc=(-900, 0))
    base = node(nt, "ShaderNodeMix", (-400, 200))
    base.data_type = "RGBA"
    base.inputs["A"].default_value = (0.09, 0.09, 0.1, 1)
    base.inputs["B"].default_value = (0.62, 0.62, 0.63, 1)
    nt.links.new(mask.outputs["Color"], base.inputs["Factor"])
    nt.links.new(base.outputs["Result"], bsdf.inputs["Base Color"])
    rough = node(nt, "ShaderNodeMapRange", (-400, -100))
    rough.inputs["To Min"].default_value = 0.28
    rough.inputs["To Max"].default_value = 0.6
    nt.links.new(mask.outputs["Color"], rough.inputs["Value"])
    # Fine brushed streaks: stretched noise into roughness.
    tc = node(nt, "ShaderNodeTexCoord", (-1300, -300))
    mp = node(nt, "ShaderNodeMapping", (-1100, -300))
    mp.inputs["Scale"].default_value = (2.0, 400.0, 1.0)
    nt.links.new(tc.outputs["UV"], mp.inputs["Vector"])
    noise = node(nt, "ShaderNodeTexNoise", (-900, -300))
    noise.inputs["Scale"].default_value = 6.0
    noise.inputs["Detail"].default_value = 4.0
    nt.links.new(mp.outputs["Vector"], noise.inputs["Vector"])
    streak = node(nt, "ShaderNodeMapRange", (-650, -300))
    streak.inputs["To Min"].default_value = -0.05
    streak.inputs["To Max"].default_value = 0.05
    nt.links.new(noise.outputs["Fac"], streak.inputs["Value"])
    add = node(nt, "ShaderNodeMath", (-200, -150))
    add.operation = "ADD"
    nt.links.new(rough.outputs["Result"], add.inputs[0])
    nt.links.new(streak.outputs["Result"], add.inputs[1])
    nt.links.new(add.outputs["Value"], bsdf.inputs["Roughness"])
    bsdf.inputs["Anisotropic"].default_value = 0.6
    tangent = node(nt, "ShaderNodeTangent", (-400, -400))
    tangent.direction_type = "UV_MAP"
    nt.links.new(tangent.outputs["Tangent"], bsdf.inputs["Tangent"])
    return mat


def screen_material():
    """Phone glass whose emission crossfades idle -> profile -> saved."""
    mat, bsdf = principled(
        "Screen",
        **{"Base Color": (0.0, 0.0, 0.0, 1), "Roughness": 0.08, "Specular IOR Level": 0.25, "Coat Weight": 0.35, "Coat Roughness": 0.03},
    )
    nt = mat.node_tree
    idle = image(nt, os.path.join(TEX, "screen-idle.png"), loc=(-1100, 300))
    prof = image(nt, os.path.join(TEX, "screen-profile.png"), loc=(-1100, 0))
    saved = image(nt, os.path.join(TEX, "screen-saved.png"), loc=(-1100, -300))
    m1 = node(nt, "ShaderNodeMix", (-700, 150))
    m1.data_type = "RGBA"
    m1.name = "mix_profile"
    nt.links.new(idle.outputs["Color"], m1.inputs["A"])
    nt.links.new(prof.outputs["Color"], m1.inputs["B"])
    m2 = node(nt, "ShaderNodeMix", (-450, 0))
    m2.data_type = "RGBA"
    m2.name = "mix_saved"
    nt.links.new(m1.outputs["Result"], m2.inputs["A"])
    nt.links.new(saved.outputs["Color"], m2.inputs["B"])
    nt.links.new(m2.outputs["Result"], bsdf.inputs["Emission Color"])
    bsdf.inputs["Emission Strength"].default_value = 2.4
    return mat, m1, m2


# ---------------------------------------------------------------- scene

def build(portrait):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.use_denoising = True
    scene.cycles.denoiser = "OPENIMAGEDENOISE"
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Base Contrast"
    scene.frame_start, scene.frame_end = 0, FRAMES - 1
    scene.render.fps = 30

    world = bpy.data.worlds.new("World")
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.8, 0.8, 0.82, 1)
    bg.inputs["Strength"].default_value = 0.55

    # Wall
    wall = flat("Wall", 40, 24, 0.01, seg=1)
    wall.location = (0, 3.2, 0)
    wall.rotation_euler = (math.radians(90), 0, 0)
    wmat, wb = principled("Wall", **{"Base Color": (0.82, 0.8, 0.77, 1), "Roughness": 0.9})
    wall.data.materials.append(wmat)

    # Window gobo: an opaque sheet with four panes cut out, between sun and wall.
    gobo_mesh = bpy.data.meshes.new("Gobo")
    bm = bmesh.new()
    gsize, gx_n, gy_n = 2.6, 13, 11
    bmesh.ops.create_grid(bm, x_segments=gx_n, y_segments=gy_n, size=gsize)
    cw, ch = 2 * gsize / gx_n, 2 * gsize / gy_n
    holes = []
    for f in bm.faces:
        c = f.calc_center_median()
        gx = int((c.x + gsize) / cw)
        gy = int((c.y + gsize) / ch)
        # Two tall casement windows, each split into four panes.
        if gx in (2, 3, 5, 6, 8, 9, 11) and gy in (2, 3, 4, 6, 7, 8) and gx not in (4, 7, 10) and gy != 5:
            holes.append(f)
    bmesh.ops.delete(bm, geom=holes, context="FACES")
    bm.to_mesh(gobo_mesh)
    bm.free()
    gobo = bpy.data.objects.new("Gobo", gobo_mesh)
    bpy.context.collection.objects.link(gobo)
    sun_dir = (Vector((0.6, 3.2, 0.4)) - Vector((-7.0, -5.0, 6.0))).normalized()
    gobo.location = Vector((0.6, 3.2, 0.4)) - sun_dir * 4.5
    gobo.rotation_euler = sun_dir.to_track_quat("Z", "Y").to_euler()
    gobo.visible_camera = False
    gobo.visible_glossy = False
    gobo.visible_diffuse = False

    sun = bpy.data.lights.new("Sun", "SUN")
    sun.energy = 6.0
    sun.angle = math.radians(4.0)
    sun.color = (1.0, 0.94, 0.86)
    sun_obj = bpy.data.objects.new("Sun", sun)
    bpy.context.collection.objects.link(sun_obj)
    sun_obj.rotation_euler = sun_dir.to_track_quat("-Z", "Y").to_euler()

    fill = bpy.data.lights.new("Fill", "AREA")
    fill.energy = 260
    fill.size = 5
    fill.color = (0.92, 0.95, 1.0)
    fill_obj = bpy.data.objects.new("Fill", fill)
    bpy.context.collection.objects.link(fill_obj)
    fill_obj.location = (-3.5, -4.5, 1.5)
    fill_obj.rotation_euler = (Vector((0, 0, 0)) - fill_obj.location).to_track_quat("-Z", "Y").to_euler()

    rim = bpy.data.lights.new("Rim", "AREA")
    rim.energy = 180
    rim.size = 2.5
    rim_obj = bpy.data.objects.new("Rim", rim)
    bpy.context.collection.objects.link(rim_obj)
    rim_obj.location = (3.5, 1.5, 3.0)
    rim_obj.rotation_euler = (Vector((0, 0, 0)) - rim_obj.location).to_track_quat("-Z", "Y").to_euler()

    # Card
    card = slab("Card", 0.856, 0.54, 0.032, 0.012)
    bevel(card, 0.0025, 3)
    edge, _ = principled("CardEdge", **{"Base Color": (0.5, 0.5, 0.52, 1), "Metallic": 1.0, "Roughness": 0.22})
    card.data.materials.append(edge)
    card.data.materials.append(card_face_material("CardFront", "card-front.png"))
    card.data.materials.append(card_face_material("CardBack", "card-back.png"))

    # Phone: titanium body, black front, inset screen and island.
    phone = bpy.data.objects.new("Phone", None)
    bpy.context.collection.objects.link(phone)
    body = slab("PhoneBody", 0.715, 1.47, 0.11, 0.078, seg=16)
    bevel(body, 0.018, 6)
    body.parent = phone
    ti, _ = principled("Titanium", **{"Base Color": (0.42, 0.41, 0.4, 1), "Metallic": 1.0, "Roughness": 0.28})
    glass, _ = principled("BlackGlass", **{"Base Color": (0.005, 0.005, 0.006, 1), "Roughness": 0.05, "Coat Weight": 1.0})
    body.data.materials.append(ti)
    body.data.materials.append(glass)
    body.data.materials.append(ti)
    screen = flat("Screen", 0.672, 1.427, 0.092, seg=16)
    screen.parent = phone
    screen.location = (0, 0, 0.0392)
    smat, mix_profile, mix_saved = screen_material()
    screen.data.materials.append(smat)
    island = flat("Island", 0.125, 0.036, 0.018, seg=8)
    island.parent = phone
    island.location = (0, 0.645, 0.0396)
    island.data.materials.append(glass)

    # Camera rig
    target = bpy.data.objects.new("Target", None)
    bpy.context.collection.objects.link(target)
    cam_data = bpy.data.cameras.new("Camera")
    cam_data.lens = 85 if not portrait else 60
    cam_data.sensor_width = 36
    cam_data.dof.use_dof = True
    cam_data.dof.focus_object = target
    cam_data.dof.aperture_fstop = 1.6
    cam = bpy.data.objects.new("Camera", cam_data)
    bpy.context.collection.objects.link(cam)
    scene.camera = cam
    track = cam.constraints.new("TRACK_TO")
    track.target = target
    track.track_axis = "TRACK_NEGATIVE_Z"
    track.up_axis = "UP_Y"

    animate(card, phone, cam, target, mix_profile, mix_saved, portrait)
    return scene


# ---------------------------------------------------------------- animation

def key(obj, frame, loc=None, rot=None):
    if loc is not None:
        obj.location = loc
        obj.keyframe_insert("location", frame=frame)
    if rot is not None:
        obj.rotation_euler = [math.radians(a) for a in rot]
        obj.keyframe_insert("rotation_euler", frame=frame)


def key_value(socket, frame, value):
    socket.default_value = value
    socket.keyframe_insert("default_value", frame=frame)


def animate(card, phone, cam, target, mix_profile, mix_saved, portrait):
    # Card: hero float -> flip to show the back -> back to front -> taps the
    # back of the phone's top edge -> drifts away.
    key(card, 0, (0.0, 0.0, 0.08), (104, -6, -28))
    key(card, 36, (0.0, 0.0, 0.02), (96, -3, 14))
    key(card, 72, (-0.15, 0.0, 0.06), (96, 0, 172))
    key(card, 96, (-0.55, 0.1, 0.25), (100, 4, 352))
    key(card, 116, (-0.18, 0.42, 0.62), (100, 10, 372))  # contact behind top
    key(card, 124, (-0.17, 0.43, 0.6), (100, 10, 372))
    key(card, 150, (-1.5, 0.2, 0.9), (110, 25, 395))
    key(card, 191, (-2.6, 0.2, 1.3), (120, 35, 410))

    # Phone rises in from lower right and settles facing the camera.
    key(phone, 0, (1.6, 0.6, -3.2), (80, 0, -30))
    key(phone, 64, (1.6, 0.6, -3.2), (80, 0, -30))
    key(phone, 100, (0.28, 0.35, -0.05), (90, 0, -12))
    key(phone, 150, (0.25, 0.35, -0.05), (90, 0, -8))
    key(phone, 191, (0.25, 0.35, -0.05), (90, 0, -6))

    # Screen states
    key_value(mix_profile.inputs["Factor"], 0, 0.0)
    key_value(mix_profile.inputs["Factor"], 118, 0.0)
    key_value(mix_profile.inputs["Factor"], 126, 1.0)
    key_value(mix_saved.inputs["Factor"], 0, 0.0)
    key_value(mix_saved.inputs["Factor"], 164, 0.0)
    key_value(mix_saved.inputs["Factor"], 172, 1.0)

    d = 1.35 if portrait else 1.0
    key(cam, 0, (0.0, -6.0 * d, 0.15))
    key(cam, 50, (-0.1, -5.6 * d, 0.1))
    key(cam, 100, (0.1, -7.0 * d, 0.2))
    key(cam, 150, (0.4, -4.9 * d, 0.2))
    key(cam, 191, (0.35, -4.6 * d, 0.05))

    # Landscape frames keep the phone in the right third so copy fits on the
    # left; portrait frames centre it (copy sits below on phones).
    s = 0.0 if portrait else 1.0
    key(target, 0, (0.0, 0.0, 0.08))
    key(target, 50, (0.0, 0.0, 0.03))
    key(target, 100, (-0.05 - 0.35 * s, 0.25, 0.1))
    key(target, 120, (0.0 - 0.35 * s, 0.38, 0.3))
    key(target, 150, (0.25 - 0.55 * s, 0.4, 0.22))
    key(target, 172, (0.25 - 0.55 * s, 0.4, 0.05))
    key(target, 191, (0.25 - 0.55 * s, 0.4, 0.02))

    for obj in (card, phone, cam, target):
        if obj.animation_data and obj.animation_data.action:
            for layer in getattr(obj.animation_data.action, "layers", []):
                pass


def main():
    args = parse_args()
    portrait = args.portrait
    scene = build(portrait)
    w, h = (int(v) for v in args.res.split("x"))
    scene.render.resolution_x, scene.render.resolution_y = w, h
    scene.render.resolution_percentage = 100
    scene.cycles.samples = args.samples
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.02
    scene.cycles.max_bounces = 6
    scene.cycles.glossy_bounces = 4
    scene.cycles.transmission_bounces = 2
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_depth = "8"
    scene.render.threads_mode = "AUTO"
    os.makedirs(args.out, exist_ok=True)
    if args.save_blend:
        bpy.ops.wm.save_as_mainfile(filepath=args.save_blend)
    for f in frame_list(args.frames):
        scene.frame_set(f)
        scene.render.filepath = os.path.join(args.out, f"{f:04d}.png")
        bpy.ops.render.render(write_still=True)
        print(f"rendered {f}", flush=True)


if __name__ == "__main__":
    main()
