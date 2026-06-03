'use client';

import { Canvas } from '@react-three/fiber';
import FloatingPrimitive from './FloatingPrimitive';

export default function PrimitiveSceneCanvas({ variant }) {
  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <FloatingPrimitive variant={variant} />
    </Canvas>
  );
}
