'use client';

import { motion } from 'framer-motion';
import PrimitiveCanvas from '@/components/webgl/PrimitiveCanvas';

export default function SpatialEmptyState({
  variant = 'sphere',
  title,
  description,
  children,
  className = '',
  compact = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col items-center justify-center text-center ${compact ? 'py-10' : 'py-16'} ${className}`}
    >
      <PrimitiveCanvas
        variant={variant}
        className={compact ? 'h-28 w-28 mx-auto mb-4' : 'h-44 w-44 mx-auto mb-6'}
      />
      {title && (
        <p className="text-sm font-semibold tracking-tight text-spatial">{title}</p>
      )}
      {description && (
        <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-spatial-muted">{description}</p>
      )}
      {children}
    </motion.div>
  );
}
