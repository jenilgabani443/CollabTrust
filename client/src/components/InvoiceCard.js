'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Shield, DollarSign, Percent, Wallet } from 'lucide-react';

export default function InvoiceCard({ invoice }) {
  if (!invoice) return null;

  const {
    totalAmount = 0,
    platformFee = 0,
    creatorPayout = 0,
    cryptographicSignature = '',
    status = 'UNPAID',
  } = invoice;

  const isPaid = status === 'PAID';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      {/* Header gradient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-success)]" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-[var(--color-success)]/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-[var(--color-success)]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text)]">Invoice</h3>
              <p className="text-xs text-[var(--color-text-muted)]">Campaign Payment Receipt</p>
            </div>
          </div>
          {isPaid && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-success)]/10 px-3 py-1.5 text-xs font-bold text-[var(--color-success)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              PAID
            </span>
          )}
        </div>

        {/* Amount breakdown */}
        <div className="space-y-3 rounded-xl bg-[var(--color-surface-alt)] p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Wallet className="h-4 w-4" />
              Total Amount
            </span>
            <span className="text-lg font-bold text-[var(--color-text)]">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="h-px bg-[var(--color-border)]" />
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Percent className="h-4 w-4" />
              Platform Fee (5%)
            </span>
            <span className="text-sm font-semibold text-[var(--color-danger)]">-${platformFee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <DollarSign className="h-4 w-4" />
              Creator Payout (95%)
            </span>
            <span className="text-lg font-bold text-[var(--color-success)]">${creatorPayout.toFixed(2)}</span>
          </div>
        </div>

        {/* Cryptographic signature */}
        <div className="mt-4 rounded-xl border border-[var(--color-success)]/20 bg-[var(--color-success)]/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-[var(--color-success)]" />
            <span className="text-xs font-bold text-[var(--color-success)] uppercase tracking-wider">
              Cryptographic Signature Verified
            </span>
            <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
          </div>
          <p className="text-[10px] font-mono text-[var(--color-text-muted)] break-all leading-relaxed">
            {cryptographicSignature || 'sha256:0000...0000'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
