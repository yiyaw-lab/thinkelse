"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BELL_COLOR = "#ffe1f3";
const BELL_EDGE = "#e8d8ff";
const BELL_RIM = "#ffbddb";
const GLOW_CORE = "#fff2bc";
const TENTACLE_COLORS = ["#cfc1ff", "#ffc1d8", "#ffe0a6", "#bfefff", "#f5c7ff"];

const TENTACLE_COUNT = 5;
const IDLE_CYCLE = 7.2;
const PRIMARY_TENTACLE_ANGLES = [
  Math.PI * 0.31,
  Math.PI * 0.4,
  Math.PI * 0.5,
  Math.PI * 0.6,
  Math.PI * 0.69,
];
const FRILL_TENTACLE_ANGLES = [Math.PI * 0.42, Math.PI * 0.5, Math.PI * 0.58];

type MotionProps = {
  reducedMotion?: boolean;
};

function gaussian(time: number, center: number, width: number) {
  const distance = time - center;
  return Math.exp(-(distance * distance) / (2 * width * width));
}

function helloPulse(time: number, offset = 0) {
  const cycle = (time + offset) % IDLE_CYCLE;
  return gaussian(cycle, 1.45, 0.5);
}

function tentacleAngle(index: number, short = false) {
  const angles = short ? FRILL_TENTACLE_ANGLES : PRIMARY_TENTACLE_ANGLES;
  return angles[index % angles.length];
}

function useTentacleCurve(index: number, short = false) {
  return useMemo(() => {
    const points: THREE.Vector3[] = [];
    const angle = tentacleAngle(index, short);
    const spread = short ? 0.08 : 0.1 + (index % 2) * 0.018;
    const length = short ? 0.78 : 1.5 + (index % 2) * 0.14;
    const rootRadius = short ? 0.13 : 0.2;

    for (let i = 0; i <= 24; i += 1) {
      const t = i / 24;
      const y = -0.16 - t * length;
      const curl = Math.sin(t * Math.PI * 1.7 + index * 0.45) * spread * t;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * rootRadius * t + curl * 0.28,
          y,
          Math.sin(angle) * rootRadius * t + curl * 0.16,
        ),
      );
    }

    return new THREE.CatmullRomCurve3(points);
  }, [index, short]);
}

function Tentacle({
  index,
  reducedMotion = false,
  short = false,
}: MotionProps & { index: number; short?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const tipRef = useRef<THREE.Mesh>(null);
  const baseCurve = useTentacleCurve(index, short);
  const phase = index * 0.95;
  const length = short ? 0.78 : 1.5 + (index % 2) * 0.14;
  const radius = short ? 0.018 : 0.022 - Math.min(index, 3) * 0.0015;
  const color = TENTACLE_COLORS[index % TENTACLE_COLORS.length];
  const initialTip = useMemo(() => baseCurve.getPoint(1), [baseCurve]);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;

    const t = state.clock.elapsedTime;
    const hello = helloPulse(t, index * 0.08);
    const points: THREE.Vector3[] = [];
    const angle = tentacleAngle(index, short);

    for (let i = 0; i <= 24; i += 1) {
      const p = i / 24;
      const y = -0.16 - p * length;
      const lag = p * p;
      const sway =
        Math.sin(t * 0.95 + phase + p * 4.6) * (0.022 + lag * 0.12) +
        Math.cos(t * 0.58 + phase * 1.4 + p * 3.2) * (0.014 + lag * 0.06) -
        hello * lag * 0.22;
      const base = baseCurve.getPoint(p);

      points.push(
        new THREE.Vector3(
          base.x + Math.cos(angle + sway * 0.34) * sway,
          y + hello * (0.08 - lag * 0.3),
          base.z + Math.sin(angle + sway * 0.34) * sway,
        ),
      );
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 48, radius, 8, false);

    meshRef.current.geometry.dispose();
    meshRef.current.geometry = geometry;

    if (tipRef.current) {
      tipRef.current.position.copy(points[points.length - 1]);
      tipRef.current.scale.setScalar(1 + hello * 0.18);
    }
  });

  const initialGeometry = useMemo(
    () => new THREE.TubeGeometry(baseCurve, 48, radius, 8, false),
    [baseCurve, radius],
  );

  return (
    <group>
      <mesh ref={meshRef} geometry={initialGeometry}>
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={short ? 0.72 : 0.86}
          roughness={0.28}
          metalness={0}
          clearcoat={0.2}
          emissive={color}
          emissiveIntensity={0.04}
        />
      </mesh>
      <mesh ref={tipRef} position={initialTip}>
        <sphereGeometry args={[radius * 2.3, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.04}
        />
      </mesh>
    </group>
  );
}

function BellSpots() {
  return (
    <group>
      {[
        [-0.32, 0.3, 0.6, 0.06],
        [0.28, 0.34, 0.56, 0.052],
        [0.06, 0.52, 0.44, 0.044],
        [-0.5, 0.06, 0.49, 0.036],
        [0.46, 0.04, 0.48, 0.036],
      ].map(([x, y, z, size], index) => (
        <mesh key={index} position={[x, y, z]}>
          <sphereGeometry args={[size, 20, 20]} />
          <meshBasicMaterial color="#fff8d7" transparent opacity={0.32} />
        </mesh>
      ))}
    </group>
  );
}

function RimPearls({ reducedMotion = false }: MotionProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    const hello = helloPulse(t);
    groupRef.current.scale.set(1 + hello * 0.04, 1 - hello * 0.025, 1 + hello * 0.04);
  });

  return (
    <group ref={groupRef} position={[0, -0.31, 0]}>
      {Array.from({ length: 14 }, (_, index) => {
        const angle = (index / 14) * Math.PI * 2;
        const scallop = 1 + Math.sin(angle * 3 + 0.6) * 0.04;
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * 0.78 * scallop,
              Math.sin(index * 1.7) * 0.012,
              Math.sin(angle) * 0.7 * scallop,
            ]}
            scale={[1.35, 0.7, 1]}
          >
            <sphereGeometry args={[0.062, 20, 16]} />
            <meshStandardMaterial
              color={BELL_RIM}
              transparent
              opacity={0.36}
              emissive={BELL_RIM}
              emissiveIntensity={0.045}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function InnerFrills({ reducedMotion = false }: MotionProps) {
  return (
    <group position={[0, -0.28, 0]}>
      {Array.from({ length: 3 }, (_, index) => (
        <Tentacle
          key={`frill-${index}`}
          index={index}
          reducedMotion={reducedMotion}
          short
        />
      ))}
    </group>
  );
}

function GlowDots({ reducedMotion = false }: MotionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dots = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const angle = index * 2.399;
        const radius = 0.55 + (index % 5) * 0.16;
        return {
          position: new THREE.Vector3(
            Math.cos(angle) * radius,
            -0.48 + (index % 7) * 0.2,
            Math.sin(angle) * radius * 0.45 + 0.12,
          ),
          size: 0.025 + (index % 4) * 0.012,
          phase: index * 0.5,
        };
      }),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, index) => {
      const dot = dots[index];
      child.position.y = dot.position.y + Math.sin(t * 0.45 + dot.phase) * 0.035;
      child.scale.setScalar(1 + Math.sin(t * 0.8 + dot.phase) * 0.18);
    });
  });

  return (
    <group ref={groupRef}>
      {dots.map((dot, index) => (
        <mesh key={index} position={dot.position}>
          <sphereGeometry args={[dot.size, 12, 12]} />
          <meshBasicMaterial color={index % 3 === 0 ? "#fff8d7" : "#ffffff"} transparent opacity={0.52} />
        </mesh>
      ))}
    </group>
  );
}

function JellyfishBell({ reducedMotion = false }: MotionProps) {
  const bellRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const rimRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    const hello = helloPulse(t);
    const pulse = 1 + Math.sin(t * 1.35) * 0.018 + hello * 0.075;
    const breathe = 1 + Math.sin(t * 0.75) * 0.018;

    if (bellRef.current) {
      bellRef.current.scale.set(pulse, breathe - hello * 0.055, pulse);
    }
    if (innerGlowRef.current) {
      innerGlowRef.current.scale.setScalar(0.92 + Math.sin(t * 1.8) * 0.028 + hello * 0.13);
      const mat = innerGlowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.2 + Math.sin(t * 1.8) * 0.06 + hello * 0.28;
    }
    if (rimRef.current) {
      rimRef.current.scale.x = 1 + Math.sin(t * 1.35) * 0.014 + hello * 0.06;
      rimRef.current.scale.z = 1 + Math.sin(t * 1.35) * 0.014 + hello * 0.06;
      rimRef.current.scale.y = 1 - hello * 0.08;
    }
  });

  return (
    <group>
      <mesh ref={bellRef} castShadow receiveShadow scale={[1.08, 0.78, 1]}>
        <sphereGeometry args={[0.95, 96, 56, 0, Math.PI * 2, 0, Math.PI * 0.64]} />
        <meshPhysicalMaterial
          color={BELL_COLOR}
          transparent
          opacity={0.92}
          roughness={0.16}
          metalness={0}
          clearcoat={0.78}
          clearcoatRoughness={0.16}
          emissive={BELL_EDGE}
          emissiveIntensity={0.035}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={rimRef} position={[0, -0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.73, 0.055, 18, 96]} />
        <meshStandardMaterial
          color={BELL_RIM}
          transparent
          opacity={0.74}
          emissive={BELL_RIM}
          emissiveIntensity={0.05}
        />
      </mesh>

      <RimPearls reducedMotion={reducedMotion} />

      <mesh ref={innerGlowRef} position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshStandardMaterial
          color={GLOW_CORE}
          emissive={GLOW_CORE}
          emissiveIntensity={0.12}
          transparent
          opacity={0.34}
          depthWrite={false}
        />
      </mesh>

      <BellSpots />
      <InnerFrills reducedMotion={reducedMotion} />

      <GlowDots reducedMotion={reducedMotion} />
    </group>
  );
}

export function ElsyJellyfishModel({ reducedMotion = false }: MotionProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    const hello = helloPulse(t);
    groupRef.current.position.y = Math.sin(t * 0.58) * 0.075 + hello * 0.13;
    groupRef.current.rotation.y = Math.sin(t * 0.28) * 0.07 + hello * 0.16;
    groupRef.current.rotation.z = Math.sin(t * 0.42) * 0.02 - hello * 0.055;
    groupRef.current.scale.set(
      0.78 * (1 + hello * 0.04),
      0.78 * (1 - hello * 0.035),
      0.78 * (1 + hello * 0.04),
    );
  });

  return (
    <group ref={groupRef} position={[0, 0.18, 0]}>
      <JellyfishBell reducedMotion={reducedMotion} />
      {Array.from({ length: TENTACLE_COUNT }, (_, index) => (
        <Tentacle key={index} index={index} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}
