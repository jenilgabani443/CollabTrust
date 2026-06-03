'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

const SceneCanvas = dynamic(() => import('./SceneCanvas'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-spatial" aria-hidden />,
});

export default function InteractiveBackground() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const ripplesRef = useRef([]);

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    const onClick = (e) => {
      ripplesRef.current.push({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
        t: performance.now(),
      });
      if (ripplesRef.current.length > 8) {
        ripplesRef.current.shift();
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 transition-colors duration-500" aria-hidden>
      <div className="absolute inset-0 bg-spatial">
        <SceneCanvas mouseRef={mouseRef} ripplesRef={ripplesRef} />
      </div>
      <div className="absolute inset-0 spatial-overlay-gradient transition-opacity duration-500" />
      <div className="absolute inset-0 spatial-overlay-gradient-2 transition-opacity duration-500" />
      <div className="absolute inset-0 spatial-overlay-gradient-3 transition-opacity duration-500" />
    </div>
  );
}
