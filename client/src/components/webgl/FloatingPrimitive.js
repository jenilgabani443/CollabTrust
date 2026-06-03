'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, MeshDistortMaterial } from '@react-three/drei';

function GlassSphere() {
  const ref = useRef(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.25;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.1, 48, 48]} />
      <MeshDistortMaterial
        color="#8b5cf6"
        distort={0.28}
        speed={1.8}
        roughness={0.1}
        metalness={0.85}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

function MetallicCoin() {
  const ref = useRef(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.55;
      ref.current.rotation.x = Math.sin(performance.now() * 0.0008) * 0.15;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <cylinderGeometry args={[1.05, 1.05, 0.22, 64]} />
        <meshPhysicalMaterial
          color="#e9d5ff"
          metalness={1}
          roughness={0.18}
          envMapIntensity={1.4}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function FloatingPrimitive({ variant = 'sphere' }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#c4b5fd" />
      <directionalLight position={[-5, -2, -4]} intensity={0.4} color="#6366f1" />
      <Environment preset="city" />
      <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.55}>
        {variant === 'coin' ? <MetallicCoin /> : <GlassSphere />}
      </Float>
    </>
  );
}
