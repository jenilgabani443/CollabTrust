'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import PrimitiveCanvas from '@/components/webgl/PrimitiveCanvas';
import MagneticButton from '@/components/ui/MagneticButton';

export default function FundContractSuccess({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md dark:bg-black/70"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-spatial relative w-full max-w-md overflow-hidden rounded-3xl p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-spatial-muted transition-colors hover:bg-spatial-hover hover:text-spatial"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <PrimitiveCanvas variant="coin" className="mx-auto h-48 w-48" />

            <div className="mt-2 flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-spatial">Contract Funded</h2>
              <p className="mt-2 text-sm leading-relaxed text-spatial-muted">
                Escrow is locked on-chain. Your creator can now submit deliverables in the campaign room.
              </p>
              <MagneticButton
                type="button"
                onClick={onClose}
                className="btn-spatial-primary mt-6 rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
              >
                Continue in Campaign Room
              </MagneticButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
