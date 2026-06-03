'use client';

import dynamic from 'next/dynamic';

const SceneCanvas = dynamic(() => import('./PrimitiveSceneCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-2xl bg-spatial-card-muted" aria-hidden />
  ),
});

export default function PrimitiveCanvas({
  variant = 'sphere',
  className = 'h-40 w-40 mx-auto',
}) {
  return (
    <div className={className} aria-hidden>
      <SceneCanvas variant={variant} />
    </div>
  );
}
