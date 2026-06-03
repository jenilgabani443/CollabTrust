'use client';

import { Suspense } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import NetworkParticles from './NetworkParticles';

function SceneFallback() {
  return null;
}

function ThemedBackground() {
  const { isDark } = useTheme();
  return <color attach="background" args={[isDark ? '#050505' : '#ebe6f5']} />;
}

function ThemedFog() {
  const { isDark } = useTheme();
  return <fog attach="fog" args={[isDark ? '#050505' : '#ebe6f5', 18, 42]} />;
}

export default function Scene({ mouseRef, ripplesRef }) {
  return (
    <Suspense fallback={<SceneFallback />}>
      <ThemedBackground />
      <ThemedFog />
      <ambientLight intensity={0.15} />
      <NetworkParticles mouseRef={mouseRef} ripplesRef={ripplesRef} />
    </Suspense>
  );
}
