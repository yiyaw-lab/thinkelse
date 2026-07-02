import math
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUTFILE = ROOT / "public" / "models" / "elsy-moon-jelly.glb"
FRAME_END = 216


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def rgba(hex_color, alpha=1.0):
    hex_color = hex_color.lstrip("#")
    return (
        int(hex_color[0:2], 16) / 255,
        int(hex_color[2:4], 16) / 255,
        int(hex_color[4:6], 16) / 255,
        alpha,
    )


def set_input(node, names, value):
    for name in names:
        socket = node.inputs.get(name)
        if socket:
            socket.default_value = value
            return


def make_material(name, base, alpha=1.0, roughness=0.35, metallic=0.0, emission=None, emission_strength=0.0, transmission=0.0):
    material = bpy.data.materials.new(name)
    material.diffuse_color = rgba(base, alpha)
    material.use_nodes = True
    material.blend_method = "BLEND" if alpha < 1 else "OPAQUE"
    material.use_screen_refraction = alpha < 1
    material.show_transparent_back = False

    bsdf = material.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        set_input(bsdf, ["Base Color"], rgba(base, alpha))
        set_input(bsdf, ["Alpha"], alpha)
        set_input(bsdf, ["Roughness"], roughness)
        set_input(bsdf, ["Metallic"], metallic)
        set_input(bsdf, ["Transmission Weight", "Transmission"], transmission)
        set_input(bsdf, ["Coat Weight", "Clearcoat"], 0.58)
        set_input(bsdf, ["Coat Roughness", "Clearcoat Roughness"], 0.16)
        if emission:
            set_input(bsdf, ["Emission Color", "Emission"], rgba(emission, 1))
            set_input(bsdf, ["Emission Strength"], emission_strength)

    return material


def key(obj, frame, location=None, rotation=None, scale=None):
    bpy.context.scene.frame_set(frame)
    if location is not None:
        obj.location = location
        obj.keyframe_insert(data_path="location")
    if rotation is not None:
        obj.rotation_euler = rotation
        obj.keyframe_insert(data_path="rotation_euler")
    if scale is not None:
        obj.scale = scale
        obj.keyframe_insert(data_path="scale")


def make_bell_mesh(material):
    segments = 128
    rings = 24
    vertices = []
    faces = []

    for ring in range(rings + 1):
        v = ring / rings
        theta = v * math.pi * 0.58
        z = math.cos(theta) * 0.82 + 0.08
        base_radius = (math.sin(theta) ** 0.68) * 1.02
        soft_squash = 1 + math.sin(v * math.pi) * 0.12

        for segment in range(segments):
            angle = segment / segments * math.tau
            scallop = math.sin(angle * 14) * 0.035 * (v**2.3)
            asymmetry_fade = min(1, max(0, v * 2.2))
            asym = (math.sin(angle * 3 + 0.7) * 0.025 + math.cos(angle * 5.2) * 0.012) * asymmetry_fade
            radius = max(0, base_radius * soft_squash + scallop + asym)
            x = math.cos(angle) * radius * 1.16
            y = math.sin(angle) * radius * 0.78
            vertices.append((x, y, z - v * 0.34))

    for ring in range(rings):
        for segment in range(segments):
            a = ring * segments + segment
            b = ring * segments + (segment + 1) % segments
            c = (ring + 1) * segments + (segment + 1) % segments
            d = (ring + 1) * segments + segment
            faces.append((a, b, c, d))

    mesh = bpy.data.meshes.new("Elsy_bell_sculpted_mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()

    bell = bpy.data.objects.new("Bell_sculpted_single_buoyant_shell", mesh)
    bell.data.materials.append(material)
    bpy.context.collection.objects.link(bell)
    bpy.context.view_layer.objects.active = bell
    bell.select_set(True)
    bpy.ops.object.shade_smooth()
    bell.select_set(False)

    shape = bell.shape_key_add(name="Basis")
    inhale = bell.shape_key_add(name="Bell_inhale_tall")
    squash = bell.shape_key_add(name="Bell_squash_rebound")

    for idx, vertex in enumerate(mesh.vertices):
        base = shape.data[idx].co
        inhale.data[idx].co = Vector((base.x * 0.96, base.y * 0.96, base.z * 1.045 + 0.015))
        squash.data[idx].co = Vector((base.x * 1.085, base.y * 1.07, base.z * 0.93 - 0.02))

    return bell


def make_uv_sphere(name, material, location, scale, segments=48, rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, radius=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    return obj


def make_curve(name, material, points, bevel_depth, resolution=5):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = resolution
    curve.bevel_depth = bevel_depth
    curve.bevel_resolution = 7
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)

    for point, co in zip(spline.bezier_points, points):
        point.co = Vector(co)
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"

    obj = bpy.data.objects.new(name, curve)
    obj.data.materials.append(material)
    bpy.context.collection.objects.link(obj)
    return obj


def make_flat_curve(name, material, points, bevel_depth):
    curve = make_curve(name, material, points, bevel_depth, resolution=7)
    curve.data.bevel_resolution = 4
    return curve


def parent_to(child, parent):
    child.parent = parent
    child.matrix_parent_inverse = parent.matrix_world.inverted()


def animate_shape_key(block, values):
    for frame, value in values:
        bpy.context.scene.frame_set(frame)
        block.value = value
        block.keyframe_insert("value")


def animate_loop_interpolation():
    for action in bpy.data.actions:
        for curve in getattr(action, "fcurves", []):
            for point in curve.keyframe_points:
                point.interpolation = "BEZIER"


def build_character():
    clear_scene()
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = FRAME_END
    bpy.context.scene.render.fps = 30

    shell_mat = make_material(
        "M_pearl_subsurface_warm_shell",
        "#ffe1f3",
        alpha=0.68,
        roughness=0.16,
        emission="#f1dcff",
        emission_strength=0.12,
        transmission=0.26,
    )
    shell_sheen_mat = make_material("M_painted_pearl_shell_sheen", "#ffffff", alpha=0.34, roughness=0.12, emission="#fff8df", emission_strength=0.34)
    caustic_mat = make_material("M_restrained_warm_caustic_lines", "#fff2bd", alpha=0.42, roughness=0.24, emission="#fff1b7", emission_strength=0.28)
    rim_mat = make_material("M_tactile_rosy_scalloped_rim", "#ffc1dc", roughness=0.22, emission="#ffd7ec", emission_strength=0.12)
    rim_shadow_mat = make_material("M_soft_rim_ambient_occlusion", "#b58aac", alpha=0.38, roughness=0.5, emission="#7d668b", emission_strength=0.02)
    glow_mat = make_material("M_state_warm_inner_glow", "#fff1af", alpha=0.56, roughness=0.34, emission="#fff1af", emission_strength=0.82)
    eye_mat = make_material("M_glossy_readable_ink_eyes", "#1f1833", roughness=0.12, emission="#080510", emission_strength=0.04)
    highlight_mat = make_material("M_clean_eye_shell_highlights", "#ffffff", roughness=0.2, emission="#ffffff", emission_strength=0.18)
    cheek_mat = make_material("M_shy_cheek_glow", "#ff8fbd", alpha=0.7, roughness=0.5, emission="#ff8fbd", emission_strength=0.32)
    mouth_mat = make_material("M_soft_smile_ink", "#342b4f", roughness=0.32)
    tendril_mats = [
        make_material("M_tendril_lavender_tip", "#cfc1ff", alpha=0.9, roughness=0.32, emission="#cfc1ff", emission_strength=0.08),
        make_material("M_tendril_warm_blush", "#ffc1d8", alpha=0.9, roughness=0.32, emission="#ffc1d8", emission_strength=0.08),
        make_material("M_tendril_honey_glow", "#ffe0a6", alpha=0.94, roughness=0.34, emission="#ffe0a6", emission_strength=0.08),
        make_material("M_tendril_pool_blue", "#bfefff", alpha=0.9, roughness=0.34, emission="#bfefff", emission_strength=0.07),
        make_material("M_tendril_mist_pink", "#f5c7ff", alpha=0.86, roughness=0.36, emission="#f5c7ff", emission_strength=0.07),
    ]

    root = bpy.data.objects.new("ElsyMoonJelly_Rig_notice_inhale_rebound_settle", None)
    bpy.context.collection.objects.link(root)
    root["characterBrief"] = "Elsy is a gentle curiosity companion: moon jelly meets soft vinyl toy."
    root["signatureBehavior"] = "notice, inhale, bell squish, cheek glow, smile, right tendril waves hi, tendrils settle"
    root["avoid"] = "hidden eyes, gray glass, rope-cluster tendrils, constant nervous motion"

    bell = make_bell_mesh(shell_mat)
    parent_to(bell, root)
    shell_sheen = make_flat_curve(
        "Shell_broad_painted_pearl_sheen",
        shell_sheen_mat,
        [(-0.48, -0.86, 0.62), (-0.16, -0.91, 0.76), (0.34, -0.86, 0.68), (0.72, -0.72, 0.46)],
        0.018,
    )
    parent_to(shell_sheen, root)
    shell_sheen["materialPurpose"] = "broad non-metal pearlescent highlight that sells soft vinyl translucency"
    for idx, points in enumerate(
        [
            [(-0.62, -0.86, 0.38), (-0.28, -0.95, 0.5), (0.18, -0.9, 0.47), (0.54, -0.78, 0.34)],
            [(-0.44, -0.9, 0.22), (-0.1, -0.96, 0.3), (0.36, -0.88, 0.27)],
        ]
    ):
        caustic = make_flat_curve(f"Shell_warm_caustic_brush_line_{idx + 1}", caustic_mat, points, 0.007)
        parent_to(caustic, root)

    rim = make_uv_sphere("Rim_soft_scalloped_tactile_lip", rim_mat, (0, 0, 0.0), (1.23, 0.78, 0.07), 96, 16)
    parent_to(rim, root)
    rim_shadow = make_uv_sphere("Rim_soft_under_shadow_for_tactility", rim_shadow_mat, (0, 0.01, -0.035), (1.18, 0.74, 0.038), 96, 12)
    parent_to(rim_shadow, root)

    glow = make_uv_sphere("Inner_warm_bioluminescent_state_glow", glow_mat, (0.08, -0.03, 0.42), (0.72, 0.42, 0.34), 64, 32)
    parent_to(glow, root)

    face = bpy.data.objects.new("Face_safe_front_expression_layer", None)
    face.location = (0, -0.82, 0.34)
    bpy.context.collection.objects.link(face)
    parent_to(face, root)

    eyes = []
    cheeks = []
    for side, x in [("Left", -0.28), ("Right", 0.28)]:
        eye = make_uv_sphere(f"{side}_eye_large_glossy_above_shell", eye_mat, (x, -0.9, 0.45), (0.105, 0.04, 0.14), 48, 24)
        parent_to(eye, face)
        eyes.append(eye)
        sparkle = make_uv_sphere(f"{side}_eye_apple_highlight", highlight_mat, (x - 0.035, -0.94, 0.51), (0.034, 0.012, 0.034), 24, 12)
        parent_to(sparkle, face)
        cheek = make_uv_sphere(f"{side}_cheek_shy_state_glow", cheek_mat, (x * 1.75, -0.88, 0.28), (0.105, 0.025, 0.055), 32, 16)
        parent_to(cheek, face)
        cheeks.append(cheek)

    smile = make_curve(
        "Smile_tiny_safe_readable_curve",
        mouth_mat,
        [(-0.14, -0.93, 0.25), (-0.06, -0.96, 0.2), (0.06, -0.96, 0.2), (0.14, -0.93, 0.25)],
        0.012,
    )
    parent_to(smile, face)

    tendril_groups = []
    for idx, (x, mat) in enumerate([(-0.48, tendril_mats[0]), (-0.23, tendril_mats[1]), (0, tendril_mats[2]), (0.23, tendril_mats[3]), (0.48, tendril_mats[4])]):
        tendril_group = bpy.data.objects.new(f"Tendril_{idx + 1}_animation_lag_group", None)
        bpy.context.collection.objects.link(tendril_group)
        parent_to(tendril_group, root)
        tendril_groups.append(tendril_group)
        sway = -0.12 + idx * 0.06
        points = [
            (x * 0.86, -0.02, -0.04),
            (x * 0.92 + sway, -0.04, -0.44),
            (x * 0.76 - sway * 0.5, -0.02, -0.88),
            (x * 0.9 + sway * 0.8, -0.02, -1.34 - (idx % 2) * 0.14),
        ]
        tendril = make_curve(f"Tendril_{idx + 1}_delayed_follow_through_ribbon", mat, points, 0.024 - idx * 0.0018)
        parent_to(tendril, tendril_group)
        tip = make_uv_sphere(f"Tendril_{idx + 1}_rounded_soft_tip", mat, points[-1], (0.052, 0.052, 0.052), 24, 12)
        parent_to(tip, tendril_group)

        delay = idx * 5
        key(tendril_group, 1, rotation=(0, 0, 0), scale=(1, 1, 1))
        key(tendril_group, 40 + delay, rotation=(math.radians(1.0 - idx * 0.4), math.radians(-0.6), math.radians(-3.6 + idx)), scale=(0.99, 0.99, 1.02))
        key(tendril_group, 72 + delay, rotation=(math.radians(-2.0 + idx * 0.24), math.radians(0.55), math.radians(4.6 - idx * 0.72)), scale=(1.015, 1.0, 0.98))
        key(tendril_group, 112 + delay, rotation=(math.radians(0.8), 0, math.radians(-1.4)), scale=(1, 1, 1.01))
        key(tendril_group, FRAME_END, rotation=(0, 0, 0), scale=(1, 1, 1))

        key(tip, 1, location=points[-1], scale=(0.052, 0.052, 0.052))
        key(tip, 78 + delay, location=(points[-1][0] + sway * 0.55, points[-1][1], points[-1][2] + 0.08), scale=(0.061, 0.061, 0.061))
        key(tip, 122 + delay, location=(points[-1][0] - sway * 0.25, points[-1][1], points[-1][2] - 0.025), scale=(0.052, 0.052, 0.052))
        key(tip, FRAME_END, location=points[-1], scale=(0.052, 0.052, 0.052))

        if idx == 3:
            # Neighboring tendril echoes the hello as a soft drift, not a separate wave.
            key(tendril_group, 60, rotation=(math.radians(-0.6), math.radians(0.2), math.radians(1.2)), scale=(1.002, 1, 1.004))
            key(tendril_group, 104, rotation=(math.radians(0.4), math.radians(-0.15), math.radians(-0.7)), scale=(1, 1, 1.006))
            key(tendril_group, 148, rotation=(0, 0, 0), scale=(1, 1, 1))

        if idx == 4:
            # Signature "hi": one slow curl that travels to the tip, then an elastic settle.
            key(tendril_group, 42, rotation=(math.radians(-1.2), math.radians(0.45), math.radians(1.8)), scale=(0.995, 1, 1.018))
            key(tendril_group, 70, rotation=(math.radians(-3.4), math.radians(1.35), math.radians(4.2)), scale=(1.008, 1, 0.992))
            key(tendril_group, 104, rotation=(math.radians(-2.0), math.radians(-0.5), math.radians(-1.4)), scale=(1, 1, 1.01))
            key(tendril_group, 148, rotation=(math.radians(0.3), 0, math.radians(0.4)), scale=(1, 1, 1))
            key(tendril_group, 184, rotation=(0, 0, 0), scale=(1, 1, 1))

            key(tip, 42, location=(points[-1][0] + 0.02, points[-1][1], points[-1][2] + 0.02), scale=(0.053, 0.053, 0.053))
            key(tip, 70, location=(points[-1][0] + 0.12, points[-1][1] - 0.01, points[-1][2] + 0.16), scale=(0.061, 0.061, 0.061))
            key(tip, 104, location=(points[-1][0] + 0.03, points[-1][1], points[-1][2] + 0.1), scale=(0.057, 0.057, 0.057))
            key(tip, 148, location=(points[-1][0] - 0.01, points[-1][1], points[-1][2] + 0.02), scale=(0.053, 0.053, 0.053))
            key(tip, 184, location=points[-1], scale=(0.052, 0.052, 0.052))

    for idx, (x, y, z, scale) in enumerate(
        [(-0.56, -0.62, 0.42, 0.04), (-0.23, -0.72, 0.65, 0.05), (0.34, -0.7, 0.58, 0.04), (0.58, -0.62, 0.25, 0.032)]
    ):
        spot = make_uv_sphere(f"Pearl_shell_caustic_spot_{idx + 1}", highlight_mat, (x, y, z), (scale, scale * 0.42, scale), 24, 12)
        parent_to(spot, root)

    key(root, 1, location=(0, 0, 0), rotation=(0, 0, 0), scale=(1, 1, 1))
    key(root, 28, location=(0, 0, -0.02), rotation=(0, 0, math.radians(-0.8)), scale=(0.995, 0.995, 1.014))
    key(root, 44, location=(0, 0, -0.034), rotation=(0, 0, math.radians(-1.4)), scale=(0.978, 0.985, 1.035))
    key(root, 62, location=(0, 0, 0.105), rotation=(0, 0, math.radians(2.2)), scale=(1.055, 1.035, 0.952))
    key(root, 82, location=(0, 0, -0.018), rotation=(0, 0, math.radians(-1.0)), scale=(0.992, 1.0, 1.018))
    key(root, 122, location=(0, 0, 0.04), rotation=(0, 0, math.radians(0.25)), scale=(1, 1, 1))
    key(root, FRAME_END, location=(0, 0, 0), rotation=(0, 0, 0), scale=(1, 1, 1))

    key(face, 1, location=(0, -0.82, 0.34), rotation=(0, 0, 0), scale=(1, 1, 1))
    key(face, 36, location=(0, -0.835, 0.328), rotation=(math.radians(-2.2), 0, math.radians(-1.1)), scale=(0.985, 0.985, 0.985))
    key(face, 62, location=(0, -0.89, 0.43), rotation=(math.radians(2.4), 0, math.radians(1.35)), scale=(1.085, 1.085, 1.085))
    key(face, 90, location=(0, -0.83, 0.34), rotation=(math.radians(-1.1), 0, math.radians(-0.45)), scale=(0.998, 0.998, 0.998))
    key(face, FRAME_END, location=(0, -0.82, 0.34), rotation=(0, 0, 0), scale=(1, 1, 1))

    inhale = bell.data.shape_keys.key_blocks["Bell_inhale_tall"]
    squash = bell.data.shape_keys.key_blocks["Bell_squash_rebound"]
    animate_shape_key(inhale, [(1, 0), (34, 0), (48, 1), (64, 0.12), (94, 0), (FRAME_END, 0)])
    animate_shape_key(squash, [(1, 0), (48, 0), (64, 1), (82, 0.24), (112, 0), (FRAME_END, 0)])

    key(glow, 1, scale=(0.72, 0.42, 0.34))
    key(glow, 48, scale=(0.76, 0.44, 0.36))
    key(glow, 64, scale=(0.96, 0.54, 0.46))
    key(glow, 94, scale=(0.76, 0.43, 0.35))
    key(glow, FRAME_END, scale=(0.72, 0.42, 0.34))

    key(shell_sheen, 1, scale=(1, 1, 1), rotation=(0, 0, 0))
    key(shell_sheen, 64, scale=(1.035, 1.035, 1.035), rotation=(math.radians(1.5), 0, math.radians(1)))
    key(shell_sheen, 108, scale=(0.99, 0.99, 0.99), rotation=(0, 0, math.radians(-0.4)))
    key(shell_sheen, FRAME_END, scale=(1, 1, 1), rotation=(0, 0, 0))

    for eye in eyes:
        base_scale = tuple(eye.scale)
        key(eye, 1, scale=base_scale)
        key(eye, 128, scale=base_scale)
        key(eye, 131, scale=(base_scale[0] * 1.04, base_scale[1], base_scale[2] * 0.16))
        key(eye, 135, scale=base_scale)
        key(eye, FRAME_END, scale=base_scale)

    for cheek in cheeks:
        base_scale = tuple(cheek.scale)
        key(cheek, 1, scale=base_scale)
        key(cheek, 64, scale=(base_scale[0] * 1.28, base_scale[1] * 1.15, base_scale[2] * 1.28))
        key(cheek, 98, scale=(base_scale[0] * 1.06, base_scale[1], base_scale[2] * 1.06))
        key(cheek, FRAME_END, scale=base_scale)

    animate_loop_interpolation()

    bpy.ops.object.light_add(type="AREA", location=(0, -4, 3))
    key_light = bpy.context.object
    key_light.name = "Preview_key_softbox_not_required_at_runtime"
    key_light.data.energy = 450
    key_light.data.size = 4

    bpy.ops.object.camera_add(location=(0, -4.2, 0.7), rotation=(math.radians(82), 0, 0))
    bpy.context.scene.camera = bpy.context.object

    OUTFILE.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(OUTFILE),
        export_format="GLB",
        export_animations=True,
        export_frame_range=True,
        export_frame_step=1,
        export_apply=True,
        export_yup=True,
        export_materials="EXPORT",
    )


build_character()
print(f"Generated {OUTFILE}")
