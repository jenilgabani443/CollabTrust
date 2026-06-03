'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Briefcase, Calendar, DollarSign, ListPlus, Send } from 'lucide-react';
import { createCampaign } from '@/lib/api';
import SpatialEmptyState from '@/components/spatial/SpatialEmptyState';

export default function ProposeCampaignModal({ isOpen, onClose, creatorId }) {
  const router = useRouter();
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
  });
  
  const [deliverables, setDeliverables] = useState([]);
  const [deliverableInput, setDeliverableInput] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addDeliverable = () => {
    const val = deliverableInput.trim();
    if (val) {
      setDeliverables((prev) => [...prev, { type: val }]);
      setDeliverableInput('');
    }
  };

  const removeDeliverable = (index) => {
    setDeliverables((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (deliverables.length === 0) {
      setError('Please add at least one expected deliverable.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
        deadline: form.deadline,
        deliverables,
        creatorId,
      };

      await createCampaign(payload);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        // Redirect to dashboard where the brand can see the newly created draft campaign
        router.push('/dashboard/brand');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to send proposal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all';

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
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Briefcase className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">Propose Campaign</h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {success ? (
            <SpatialEmptyState
              variant="coin"
              title="Proposal sent"
              description="Your campaign draft has been created. Redirecting to your dashboard…"
              compact
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 px-4 py-3 text-sm text-[var(--color-danger)]">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Summer Skincare Promotion"
                  className={inputClass}
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                  Scope of Work / Description
                </label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the campaign goals, tone, and requirements..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Budget & Deadline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                    <DollarSign className="h-3 w-3" /> Proposed Budget ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    placeholder="1000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                    <Calendar className="h-3 w-3" /> Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={form.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                  <ListPlus className="h-3 w-3" /> Expected Deliverables
                </label>
                
                {deliverables.length > 0 && (
                  <div className="flex flex-col gap-2 mb-3">
                    {deliverables.map((item, index) => (
                      <div key={index} className="flex items-center justify-between rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] px-4 py-2">
                        <span className="text-sm font-medium text-[var(--color-text)]">{item.type}</span>
                        <button
                          type="button"
                          onClick={() => removeDeliverable(index)}
                          className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDeliverable())}
                    placeholder="e.g. 1x YouTube Dedicated Video"
                    className={`flex-1 ${inputClass}`}
                  />
                  <button
                    type="button"
                    onClick={addDeliverable}
                    disabled={!deliverableInput.trim()}
                    className="rounded-xl border border-[var(--color-primary)]/30 px-4 py-2.5 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors text-sm font-semibold disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[var(--color-border)] mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-[var(--color-primary)]/40 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send Proposal
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
