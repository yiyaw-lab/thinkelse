"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const BELL_COLOR = "#d4c4ff";
const BELL_EDGE = "#b8a6f5";
const GLOW_CORE = "#f7f2ff";
const INK = "#3d3558";
const BLUSH = "#f0b8d8";

const TENTACLE_COUNT = 7;

function useTentacleCurve(index: number) {
  return useMemo(() => {
    const points: THREE.Vector3[] = [];
    const angle = (index / TENTACLE_COUNT) * Math.PI * 2;
    const spread = 0.22 + (index % 3) * 0.04;

    for (let i = 0; i <= 24; i += 1) {
      const t = i / 24;
      const y = -0.15 - t * 1.35;
      const wave = Math.sin(t * Math.PI * 2.5) * spread * t;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * 0.18 * t + wave * 0.35,
          y,
          Math.sin(angle) * 0.18 * t + wave * 0.2,
        ),
      );
    }

    return new THREE.CatmullRomCurve3(points);
  }, [index]);
}

function Tentacle({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseCurve = useTentacleCurve(index);
  const phase = index * 0.85;

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.elapsedTime;
    const points: THREE.Vector3[] = [];
    const angle = (index / TENTACLE_COUNT) * Math.PI * 2;

    for (let i = 0; i <= 24; i += 1) {
      const p = i / 24;
      const y = -0.15 - p * 1.35;
      const sway =
        Math.sin(t * 1.4 + phase + p * 4.2) * (0.08 + p * 0.22) +
        Math.cos(t * 0.9 + phase * 1.3 + p * 3) * (0.04 + p * 0.12);
      const base = baseCurve.getPoint(p);

      points.push(
        new THREE.Vector3(
          base.x + Math.cos(angle + sway * 0.4) * sway,
          y,
          base.z + Math.sin(angle + sway * 0.4) * sway,
        ),
      );
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 48, 0.018 + index * 0.0015, 6, false);

    meshRef.current.geometry.dispose();
    meshRef.current.geometry = geometry;
  });

  const initialGeometry = useMemo(
    () => new THREE.TubeGeometry(baseCurve, 48, 0.02, 6, false),
    [baseCurve],
  );

  return (
    <mesh ref={meshRef} geometry={initialGeometry}>
      <meshPhysicalMaterial
        color={BELL_EDGE}
        transparent
        opacity={0.55}
        roughness={0.15}
        metalness={0.05}
        transmission={0.35}
        thickness={0.2}
        emissive={BELL_EDGE}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

function JellyfishFace() {
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const blink = Math.sin(state.clock.elapsedTime * 0.35) > 0.96 ? 0.15 : 1;
    const scaleY = 0.85 + Math.sin(state.clock.elapsedTime * 1.1) * 0.03;

    for (const eye of [leftEye, rightEye]) {
      if (eye.current) {
        eye.current.scale.y = blink;
        eye.current.scale.x = 1;
      }
    }

    void scaleY;
  });

  return (
    <group position={[0, 0.08, 0.62]}>
      <mesh ref={leftEye} position={[-0.18, 0.04, 0]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color={INK} roughness={0.4} />
      </mesh>
      <mesh ref={rightEye} position={[0.18, 0.04, 0]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color={INK} roughness={0.4} />
      </mesh>
      <mesh position={[-0.2, 0.1, 0.04]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.16, 0.1, 0.04]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.28, -0.02, 0]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color={BLUSH} transparent opacity={0.45} />
      </mesh>
      <mesh position={[0.28, -0.02, 0]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color={BLUSH} transparent opacity={0.45} />
      </mesh>
      <mesh position={[0, -0.12, 0.02]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.1, 0.018, 12, 24, Math.PI]} />
        <meshStandardMaterial color={INK} transparent opacity={0.45} roughness={0.5} />
      </mesh>
    </group>
  );
}

function JellyfishBell() {
  const bellRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 1.6) * 0.035;
    const breathe = 1 + Math.sin(t * 0.8) * 0.02;

    if (bellRef.current) {
      bellRef.current.scale.set(pulse, breathe, pulse);
    }
    if (innerGlowRef.current) {
      innerGlowRef.current.scale.setScalar(0.92 + Math.sin(t * 2.2) * 0.04);
      const mat = innerGlowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.55 + Math.sin(t * 2.2) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={bellRef} castShadow receiveShadow>
        <sphereGeometry args={[0.95, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          resolution={512}
          transmission={0.92}
          thickness={0.65}
          roughness={0.08}
          chromaticAberration={0.04}
          anisotropy={0.15}
          distortion={0.12}
          distortionScale={0.25}
          temporalDistortion={0.08}
          color={BELL_COLOR}
          attenuationColor={BELL_EDGE}
          attenuationDistance={0.75}
        />
      </mesh>

      <mesh ref={innerGlowRef} position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color={GLOW_CORE}
          emissive={BELL_EDGE}
          emissiveIntensity={0.6}
          transparent
          opacity={0.35}
        />
      </mesh>

      <JellyfishFace />

      <Sparkles
        count={42}
        scale={[2.2, 2.2, 2.2]}
        size={2.5}
        speed={0.35}
        opacity={0.55}
        color="#f8e9b8"
      />
      <Sparkles
        count={28}
        scale={[1.6, 1.6, 1.6]}
        size={1.8}
        speed={0.2}
        opacity={0.4}
        color={BELL_EDGE}
      />
    </group>
  );
}

export function ElsyJellyfishModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.12;
    groupRef.current.rotation.y = Math.sin(t * 0.35) * 0.15;
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.04;
  });

  return (
    <group ref={groupRef} position={[0, 0.35, 0]}>
      <JellyfishBell />
      {Array.from({ length: TENTACLE_COUNT }, (_, index) => (
        <Tentacle key={index} index={index} />
      ))}
    </group>
  );
}
