"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ContactShadows, useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as easing from "maath/easing";
import * as THREE from "three";

import { ElsyJellyfish } from "./elsy-jellyfish";
import { ElsyRiveExpression } from "./elsy-rive-expression";

type ElsyJellyfish3DProps = {
  className?: string;
  height?: number;
  interactive?: boolean;
  showControls?: boolean;
};

type ElsyGlb = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

function gaussian(time: number, center: number, width: number) {
  const distance = time - center;
  return Math.exp(-(distance * distance) / (2 * width * width));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function tuneImportedModel(scene: THREE.Group) {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    child.castShadow = false;
    child.receiveShadow = false;
    child.frustumCulled = false;

    const material = child.material;
    if (!(material instanceof THREE.Material)) return;

    material.needsUpdate = true;
    const materialName = material.name.toLowerCase();
    const childName = child.name.toLowerCase();
    const isBellShell = materialName.includes("warm_shell") || childName.includes("bell_sculpted");
    const isSheen = materialName.includes("painted_pearl_shell_sheen") || childName.includes("shell_broad_painted");
    const isCaustic = materialName.includes("caustic") || childName.includes("caustic");
    const isExpressionMesh =
      childName.includes("eye") || childName.includes("smile") || childName.includes("cheek");

    if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
      if (isBellShell) {
        material.color.set("#ffd8ec");
        material.emissive.set("#f1dcff");
        material.emissiveIntensity = 0.1;
        material.roughness = 0.16;
        if (material instanceof THREE.MeshPhysicalMaterial) {
          material.clearcoat = 0.74;
          material.clearcoatRoughness = 0.14;
          material.transmission = 0.28;
          material.thickness = 0.65;
          material.ior = 1.28;
        }
      }

      if (materialName.includes("rim")) {
        material.color.set("#ffc1dc");
        material.emissive.set("#ffd7ec");
        material.emissiveIntensity = materialName.includes("shadow") ? 0.01 : 0.12;
        material.roughness = materialName.includes("shadow") ? 0.52 : 0.2;
      }

      if (isSheen || isCaustic) {
        material.color.set(isCaustic ? "#fff1b7" : "#fffdf4");
        material.emissive.set(isCaustic ? "#fff1b7" : "#fff9e8");
        material.emissiveIntensity = isCaustic ? 0.34 : 0.42;
        material.roughness = 0.12;
        material.depthWrite = false;
      }

      if (materialName.includes("glow") || materialName.includes("cheek")) {
        material.emissiveIntensity = Math.max(material.emissiveIntensity, materialName.includes("glow") ? 0.68 : 0.34);
      }
    }

    if ("transparent" in material && (isBellShell || isSheen || isCaustic)) {
      material.transparent = true;
      if (isBellShell) material.opacity = 0.52;
      if (isSheen) material.opacity = 0.36;
      if (isCaustic) material.opacity = 0.28;
      material.depthWrite = false;
      child.renderOrder = isBellShell ? 1 : 2;
    }

    if (isExpressionMesh) {
      child.visible = false;
      return;
    }

    if (childName.includes("face")) {
      material.transparent = true;
      material.opacity = 1;
      material.depthTest = false;
      material.depthWrite = false;
      child.renderOrder = 6;
    }

    if (childName.includes("cheek") || childName.includes("glow")) {
      if (childName.includes("cheek")) {
        material.transparent = true;
        material.opacity = 0.92;
        material.depthTest = false;
      }
      material.depthWrite = false;
      child.renderOrder = childName.includes("cheek") ? 5 : 3;
    }
  });
}

function ElsyModel({
  reducedMotion,
  onReady,
}: {
  reducedMotion: boolean;
  onReady: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF("/models/elsy-moon-jelly.glb") as unknown as ElsyGlb;
  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    tuneImportedModel(clone);
    return clone;
  }, [gltf.scene]);
  const { actions } = useAnimations(gltf.animations, groupRef);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    const clips = Object.values(actions).filter(Boolean);
    if (reducedMotion) {
      clips.forEach((action) => action?.stop());
      return;
    }

    clips.forEach((action) => {
      action?.reset().setLoop(THREE.LoopRepeat, Number.POSITIVE_INFINITY).fadeIn(0.4).play();
    });

    return () => {
      clips.forEach((action) => action?.fadeOut(0.2));
    };
  }, [actions, reducedMotion]);

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) return;

    const t = state.clock.elapsedTime;
    easing.damp3(groupRef.current.position, [0, -0.1 + Math.sin(t * 0.72) * 0.026, 0], 0.5, delta);
    easing.dampE(
      groupRef.current.rotation,
      [0, Math.sin(t * 0.38) * 0.06, Math.sin(t * 0.5 + 0.8) * 0.035],
      0.65,
      delta,
    );
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]} scale={0.88}>
      <primitive object={scene} />
    </group>
  );
}

function WavingHelloTendril({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const tipRef = useRef<THREE.Mesh>(null);
  const currentPoints = useMemo(
    () => [
      new THREE.Vector3(0.44, -0.14, 0.46),
      new THREE.Vector3(0.53, -0.52, 0.48),
      new THREE.Vector3(0.64, -0.84, 0.52),
      new THREE.Vector3(0.58, -1.17, 0.56),
    ],
    [],
  );

  useFrame((state, delta) => {
    if (!meshRef.current || !tipRef.current) return;

    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const cycle = t % 7.2;
    const rise = smoothstep(1.15, 2.15, cycle);
    const release = smoothstep(4.15, 5.2, cycle);
    const envelope = rise * (1 - release);
    const settle = gaussian(cycle, 4.65, 0.62);
    const travelingWave = Math.sin((cycle - 1.55) * Math.PI * 0.82) * envelope;
    const tipCurl = gaussian(cycle, 2.75, 0.78) - settle * 0.34;

    const targetPoints = [
      new THREE.Vector3(0.44, -0.14, 0.46),
      new THREE.Vector3(0.53 + travelingWave * 0.035, -0.52 + envelope * 0.04, 0.48),
      new THREE.Vector3(0.64 + travelingWave * 0.13, -0.84 + envelope * 0.18, 0.52),
      new THREE.Vector3(0.58 + travelingWave * 0.1 - tipCurl * 0.08, -1.17 + envelope * 0.3, 0.56),
    ];

    currentPoints.forEach((point, index) => {
      easing.damp3(point, targetPoints[index], 0.16 + index * 0.11, delta);
    });

    const curve = new THREE.CatmullRomCurve3(currentPoints);
    const geometry = new THREE.TubeGeometry(curve, 36, 0.018, 10, false);

    meshRef.current.geometry.dispose();
    meshRef.current.geometry = geometry;
    easing.damp3(tipRef.current.position, currentPoints[currentPoints.length - 1], 0.22, delta);
    const targetScale = 1 + envelope * 0.14 + Math.abs(travelingWave) * 0.08;
    easing.damp(tipRef.current.scale, "x", targetScale, 0.2, delta);
    easing.damp(tipRef.current.scale, "y", targetScale, 0.2, delta);
    easing.damp(tipRef.current.scale, "z", targetScale, 0.2, delta);
  });

  return (
    <group renderOrder={5}>
      <mesh ref={meshRef}>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(0.44, -0.14, 0.46),
              new THREE.Vector3(0.56, -0.54, 0.48),
              new THREE.Vector3(0.72, -0.9, 0.5),
              new THREE.Vector3(0.6, -1.2, 0.52),
            ]),
            36,
            0.018,
            10,
            false,
          ]}
        />
        <meshPhysicalMaterial
          color="#f5c7ff"
          emissive="#f5c7ff"
          emissiveIntensity={0.1}
          roughness={0.26}
          clearcoat={0.36}
          transparent
          opacity={0.92}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={tipRef} position={[0.6, -1.2, 0.52]}>
        <sphereGeometry args={[0.048, 24, 16]} />
        <meshStandardMaterial
          color="#f5c7ff"
          emissive="#f5c7ff"
          emissiveIntensity={0.12}
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Scene({
  reducedMotion,
  onReady,
}: {
  reducedMotion: boolean;
  onReady: () => void;
}) {
  return (
    <>
      <color attach="background" args={["#f8f0ff"]} />
      <ambientLight intensity={1.45} color="#fff8ff" />
      <directionalLight position={[3.2, 5.5, 4]} intensity={2.25} color="#fff4e8" />
      <pointLight position={[-2.8, 1.9, 2.7]} intensity={1.65} color="#cbbcff" />
      <pointLight position={[2.4, -1.1, 2]} intensity={1.12} color="#ffd7e9" />
      <pointLight position={[0.2, 0.4, 2.4]} intensity={0.62} color="#fff4bf" />
      <Suspense fallback={null}>
        <ElsyModel reducedMotion={reducedMotion} onReady={onReady} />
        <WavingHelloTendril reducedMotion={reducedMotion} />
      </Suspense>
      <ContactShadows
        position={[0, -1.78, 0]}
        opacity={0.2}
        scale={7}
        blur={3.2}
        far={5}
        color="#6a5b94"
      />
    </>
  );
}

export function ElsyJellyfish3D({
  className = "",
  height = 640,
  interactive = true,
  showControls = false,
}: ElsyJellyfish3DProps) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const handleReady = useMemo(() => () => setReady(true), []);

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-pool-line bg-gradient-to-b from-[#fffaff] via-[#f7f0ff] to-[#ede5ff] ${className}`}
      style={{ height }}
      role="img"
      aria-label="Elsy as a Blender-authored moon jelly mascot with a shy hello animation"
    >
      <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}>
        <ElsyJellyfish height={height} showControls={false} />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(circle at 48% 30%, rgba(255,244,214,0.38), transparent 36%), radial-gradient(circle at 50% 70%, rgba(201,185,255,0.3), transparent 54%), radial-gradient(circle at 70% 48%, rgba(255,210,232,0.18), transparent 36%)",
        }}
      />

      <Canvas
        className={`relative z-20 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.1, 4.4], fov: 36 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene reducedMotion={reducedMotion || !interactive} onReady={handleReady} />
      </Canvas>

      {ready ? <ElsyRiveExpression reducedMotion={reducedMotion || !interactive} /> : null}

      {showControls ? (
        <p className="absolute right-5 top-5 z-40 rounded-full bg-white/65 px-3 py-1 text-xs text-pool-muted shadow-sm backdrop-blur">
          Blender GLB + expression-safe rig
        </p>
      ) : null}
    </div>
  );
}

useGLTF.preload("/models/elsy-moon-jelly.glb");
