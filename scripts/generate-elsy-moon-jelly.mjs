import { writeFile } from "node:fs/promises";
import {
  CatmullRomCurve3,
  Color,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

const OUTFILE = "public/models/elsy-moon-jelly.glb";

if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    result = null;
    onloadend = null;

    async readAsArrayBuffer(blob) {
      this.result = await blob.arrayBuffer();
      this.onloadend?.();
    }
  };
}

function material(name, color, options = {}) {
  const mat = new MeshPhysicalMaterial({
    color: new Color(color),
    roughness: 0.24,
    metalness: 0,
    clearcoat: 0.55,
    clearcoatRoughness: 0.18,
    transparent: false,
    ...options,
  });
  mat.name = name;
  return mat;
}

function standardMaterial(name, color, options = {}) {
  const mat = new MeshStandardMaterial({
    color: new Color(color),
    roughness: 0.4,
    metalness: 0,
    ...options,
  });
  mat.name = name;
  return mat;
}

function makeBellGeometry() {
  const geometry = new SphereGeometry(1, 96, 56, 0, Math.PI * 2, 0, Math.PI * 0.64);
  const position = geometry.attributes.position;

  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const angle = Math.atan2(z, x);
    const rim = Math.max(0, Math.min(1, (-0.05 - y) / 0.34));
    const scallop = Math.sin(angle * 14) * 0.025 * rim;
    const asymmetry = Math.sin(angle * 3 + 0.8) * 0.018 + Math.cos(angle * 5) * 0.012;

    position.setXYZ(
      i,
      x * (1.14 + rim * 0.08 + asymmetry + scallop),
      y * 0.72 - 0.08 + scallop * 0.25,
      z * (1.02 + rim * 0.06 + asymmetry * 0.5),
    );
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  geometry.name = "Elsy sculpted moon-jelly bell geometry";
  return geometry;
}

function makeTentacle(name, points, radius, mat) {
  const curve = new CatmullRomCurve3(points.map((point) => new Vector3(...point)));
  const mesh = new Mesh(new TubeGeometry(curve, 56, radius, 10, false), mat);
  mesh.name = name;
  return mesh;
}

function addSphere(group, name, position, radius, mat, scale = [1, 1, 1]) {
  const mesh = new Mesh(new SphereGeometry(radius, 32, 24), mat);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  group.add(mesh);
  return mesh;
}

const scene = new Scene();
scene.name = "Elsy moon jelly character asset";

const root = new Group();
root.name = "ElsyMoonJelly_Rig";
root.userData = {
  characterBrief:
    "Elsy is a gentle curiosity companion: a moon jelly meets soft vinyl toy. Signature behavior: notice, inhale, bell squish, cheek glow, smile, tendrils curl.",
  productionNotes:
    "Generated source asset for web integration. Replace with Blender/Nomad sculpt for final production.",
  animationBeats: ["idleFloat", "shyHello", "bellSquish", "cheekGlow", "tendrilFollowThrough"],
};
scene.add(root);

const bellMat = material("pearl_warm_translucent_bell", "#ffe1f3", {
  emissive: new Color("#ead8ff"),
  emissiveIntensity: 0.045,
  clearcoat: 0.82,
  roughness: 0.18,
});
const rimMat = standardMaterial("soft_scalloped_rim", "#ffbddb", {
  emissive: new Color("#ffd9eb"),
  emissiveIntensity: 0.08,
});
const glowMat = standardMaterial("warm_inner_glow", "#fff0b8", {
  transparent: true,
  opacity: 0.34,
  emissive: new Color("#fff0b8"),
  emissiveIntensity: 0.36,
  depthWrite: false,
});
const eyeMat = standardMaterial("glossy_ink_eyes", "#1f1833", {
  roughness: 0.18,
  emissive: new Color("#090612"),
  emissiveIntensity: 0.05,
});
const highlightMat = standardMaterial("eye_and_shell_highlights", "#ffffff", {
  emissive: new Color("#ffffff"),
  emissiveIntensity: 0.18,
});
const cheekMat = standardMaterial("warm_cheek_glow", "#ff8fbd", {
  transparent: true,
  opacity: 0.78,
  emissive: new Color("#ff8fbd"),
  emissiveIntensity: 0.16,
  depthWrite: false,
});
const mouthMat = standardMaterial("soft_smile_ink", "#342b4f");

const bell = new Mesh(makeBellGeometry(), bellMat);
bell.name = "Bell_sculpted_warm_buoyant_shell";
bell.castShadow = true;
bell.receiveShadow = true;
root.add(bell);

const rim = new Mesh(new TorusGeometry(0.77, 0.055, 18, 112), rimMat);
rim.name = "Rim_soft_scalloped_lip";
rim.position.set(0, -0.32, 0);
rim.rotation.x = Math.PI / 2;
rim.scale.set(1.08, 0.92, 1);
root.add(rim);

addSphere(root, "Inner_glow_subsurface_core", [0.04, 0.02, 0.08], 0.48, glowMat, [1.3, 0.85, 1.05]);

const face = new Group();
face.name = "Face_readable_front_expression_layer";
face.position.set(0, -0.02, 0.82);
root.add(face);

addSphere(face, "Left_eye_large_glossy", [-0.22, 0.08, 0], 0.105, eyeMat, [0.88, 1.12, 0.72]);
addSphere(face, "Right_eye_large_glossy", [0.22, 0.08, 0], 0.105, eyeMat, [0.88, 1.12, 0.72]);
addSphere(face, "Left_eye_highlight", [-0.255, 0.14, 0.055], 0.03, highlightMat);
addSphere(face, "Right_eye_highlight", [0.185, 0.14, 0.055], 0.03, highlightMat);
addSphere(face, "Left_cheek_glow", [-0.38, -0.035, 0.02], 0.07, cheekMat, [1.35, 0.86, 0.42]);
addSphere(face, "Right_cheek_glow", [0.38, -0.035, 0.02], 0.07, cheekMat, [1.35, 0.86, 0.42]);

const smile = new Mesh(new TorusGeometry(0.13, 0.014, 12, 36, Math.PI), mouthMat);
smile.name = "Smile_soft_curve";
smile.position.set(0, -0.15, 0.04);
smile.rotation.z = Math.PI;
face.add(smile);

const tentacleMaterials = [
  standardMaterial("ribbon_tendril_pearl_blue", "#bfefff", { emissive: new Color("#bfefff"), emissiveIntensity: 0.06 }),
  standardMaterial("ribbon_tendril_warm_yellow", "#ffe0a6", { emissive: new Color("#ffe0a6"), emissiveIntensity: 0.06 }),
  standardMaterial("ribbon_tendril_lavender", "#cfc1ff", { emissive: new Color("#cfc1ff"), emissiveIntensity: 0.06 }),
  standardMaterial("ribbon_tendril_pink", "#ffc1d8", { emissive: new Color("#ffc1d8"), emissiveIntensity: 0.06 }),
  standardMaterial("ribbon_tendril_mist", "#d8f6ff", { emissive: new Color("#d8f6ff"), emissiveIntensity: 0.05 }),
];

const tentacles = new Group();
tentacles.name = "Tendrils_five_readable_ribbons_with_follow_through";
root.add(tentacles);

[
  ["Tendril_left_outer", [[-0.32, -0.3, 0], [-0.42, -0.72, 0.04], [-0.55, -1.1, -0.02], [-0.62, -1.48, 0.04]], 0.022],
  ["Tendril_left_inner", [[-0.12, -0.32, 0.02], [-0.2, -0.74, -0.02], [-0.12, -1.12, 0.04], [-0.28, -1.56, 0]], 0.026],
  ["Tendril_center", [[0.02, -0.32, 0.02], [0.05, -0.78, 0.02], [-0.05, -1.18, 0], [0.0, -1.62, 0.03]], 0.028],
  ["Tendril_right_inner", [[0.16, -0.32, 0.02], [0.26, -0.72, 0], [0.18, -1.14, 0.04], [0.34, -1.54, -0.02]], 0.024],
  ["Tendril_right_outer", [[0.34, -0.3, 0], [0.48, -0.7, 0.04], [0.58, -1.1, 0], [0.68, -1.46, 0.04]], 0.02],
].forEach(([name, points, radius], index) => {
  const mesh = makeTentacle(name, points, radius, tentacleMaterials[index]);
  tentacles.add(mesh);
  const end = points.at(-1);
  addSphere(tentacles, `${name}_rounded_tip`, end, radius * 2.4, tentacleMaterials[index]);
});

[
  [-0.58, 0.12, 0.58, 0.035],
  [-0.22, 0.34, 0.68, 0.045],
  [0.36, 0.22, 0.62, 0.038],
  [0.58, -0.08, 0.52, 0.03],
].forEach(([x, y, z, radius], index) => {
  addSphere(root, `Bell_soft_bioluminescent_spot_${index + 1}`, [x, y, z], radius, highlightMat);
});

const exporter = new GLTFExporter();
const arrayBuffer = await exporter.parseAsync(scene, {
  binary: true,
  animations: [],
  onlyVisible: true,
  includeCustomExtensions: false,
});

await writeFile(OUTFILE, Buffer.from(arrayBuffer));
console.log(`Generated ${OUTFILE}`);
