'use client';

import { useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const MAGNETIC_RADIUS = 140;
const PULL_STRENGTH = 0.38;

function resolveMotionComponent(Tag) {
  if (Tag === 'button') return motion.button;
  if (Tag === Link) return motion.create(Link);
  if (typeof Tag === 'string' && motion[Tag]) return motion[Tag];
  return motion.create(Tag);
}

export default function MagneticButton({
  children,
  className = '',
  strength = PULL_STRENGTH,
  radius = MAGNETIC_RADIUS,
  as: Tag = 'button',
  ...props
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const MotionTag = useMemo(() => resolveMotionComponent(Tag), [Tag]);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const distance = Math.hypot(dx, dy);

    if (distance < radius) {
      const pull = 1 - distance / radius;
      x.set(dx * strength * pull);
      y.set(dy * strength * pull);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionTag
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
