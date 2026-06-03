'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function SpotlightCard({
  children,
  className = '',
  delay = 0,
  as: Component = motion.div,
  ...props
}) {
  const containerRef = useRef(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, opacity: 0 });

  const onMouseMove = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpot({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    setSpot((s) => ({ ...s, opacity: 0 }));
  }, []);

  return (
    <Component
      ref={containerRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`group relative overflow-hidden rounded-3xl spatial-card backdrop-blur-2xl ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: spot.opacity,
          background: `radial-gradient(650px circle at ${spot.x}px ${spot.y}px, var(--spatial-spotlight-1), transparent 42%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-500"
        style={{
          opacity: spot.opacity * 0.9,
          background: `radial-gradient(400px circle at ${spot.x}px ${spot.y}px, var(--spatial-spotlight-2), transparent 38%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(900px circle at ${spot.x}px ${spot.y}px, var(--spatial-spotlight-3), transparent 50%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </Component>
  );
}
