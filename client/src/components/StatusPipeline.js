'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

const STAGES = ['DRAFT', 'FUNDED', 'SUBMITTED', 'APPROVED', 'PAID'];

const stageColors = {
  DRAFT: 'var(--color-text-muted)',
  FUNDED: 'var(--color-warning)',
  SUBMITTED: 'var(--color-primary)',
  APPROVED: 'var(--color-success)',
  PAID: 'var(--color-success)',
};

export default function StatusPipeline({ currentStatus }) {
  const currentIndex = STAGES.indexOf(currentStatus);

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-0">
      {STAGES.map((stage, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        const color = isComplete || isCurrent ? stageColors[stage] : 'var(--color-border)';

        return (
          <div key={stage} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all duration-300 ${
                isCurrent
                  ? 'shadow-md'
                  : ''
              }`}
              style={{
                borderColor: color,
                backgroundColor: (isComplete || isCurrent) ? `color-mix(in oklch, ${color} 15%, transparent)` : 'transparent',
                color: isComplete || isCurrent ? color : 'var(--color-text-muted)',
              }}
            >
              {isComplete ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Circle className={`h-3.5 w-3.5 ${isCurrent ? 'animate-pulse' : ''}`} />
              )}
              {stage}
            </motion.div>

            {i < STAGES.length - 1 && (
              <ArrowRight
                className="mx-1 h-3.5 w-3.5 hidden sm:block"
                style={{
                  color: i < currentIndex ? stageColors[STAGES[i]] : 'var(--color-border)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
