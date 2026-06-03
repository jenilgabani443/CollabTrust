'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { deleteAccount } from '@/lib/api';

export default function DeleteAccountModal({ isOpen, onClose }) {
  const { logout } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await deleteAccount();
      logout();
    } catch (err) {
      setError(err.message || 'Failed to delete account.');
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="relative w-full max-w-md rounded-2xl border border-[var(--color-danger)]/30 bg-[var(--color-surface)] p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Warning icon */}
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-danger)]/10 border-2 border-[var(--color-danger)]/20">
              <AlertTriangle className="h-8 w-8 text-[var(--color-danger)]" />
            </div>
          </div>

          <h2 className="text-lg font-bold text-[var(--color-text)] text-center mb-2">
            Delete Account
          </h2>

          <p className="text-sm text-[var(--color-danger)] text-center font-medium mb-6 px-4">
            no information will be recover after deletions of this account
          </p>

          <p className="text-xs text-[var(--color-text-muted)] text-center mb-6">
            This action is permanent and cannot be undone. All your data, campaigns, and profile information will be permanently removed.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 px-4 py-3 text-sm text-[var(--color-danger)]"
            >
              {error}
            </motion.div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[var(--color-danger)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-danger)]/25 hover:shadow-[var(--color-danger)]/40 transition-all disabled:opacity-60"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Confirm Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
