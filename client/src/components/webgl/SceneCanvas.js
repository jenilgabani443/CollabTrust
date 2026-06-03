'use client';

import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

export default function SceneCanvas({ mouseRef, ripplesRef }) {
  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0, 18], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      performance={{ min: 0.5 }}
    >
      <Scene mouseRef={mouseRef} ripplesRef={ripplesRef} />
    </Canvas>
  );
}
