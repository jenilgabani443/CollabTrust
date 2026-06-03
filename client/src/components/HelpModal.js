'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'How do I get started as a Creator or Brand?',
    answer:
      'After registering, complete your profile by clicking on your profile picture and selecting "Profile". Fill in your details, add your social links, and select your content niches. Brands can start discovering creators immediately, while Creators will appear in search results once their profile is complete.',
  },
  {
    question: 'How do campaigns work?',
    answer:
      'Brands discover creators through the search engine and initiate campaigns. A campaign goes through stages: DRAFT → FUNDED → SUBMITTED → APPROVED → PAID. Both parties can track progress in real-time from their dashboards. Communication happens through the built-in chat system.',
  },
  {
    question: 'How are payments handled?',
    answer:
      'Payments are processed securely through our platform. Once a Brand funds a campaign, the amount is held in escrow. After the Creator submits their deliverables and the Brand approves them, the payment is released to the Creator (minus a small platform fee of 5%).',
  },
  {
    question: 'How do I contact support?',
    answer:
      'For any issues or questions, you can reach our support team at support@collabtrust.com. We typically respond within 24 hours on business days. For urgent matters, you can also reach us through the in-app chat during business hours (9 AM – 6 PM EST).',
  },
];

export default function HelpModal({ isOpen, onClose }) {
  const [expanded, setExpanded] = useState(null);

  const toggle = (index) => {
    setExpanded(expanded === index ? null : index);
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
          className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">Help & Support</h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm text-[var(--color-text-muted)] mb-5">
            Frequently asked questions about CollabTrust
          </p>

          {/* FAQ Accordion */}
          <div className="space-y-2">
            {FAQ_ITEMS.map((faq, index) => {
              const isExpanded = expanded === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-[var(--color-border)] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] transition-colors text-left"
                  >
                    <span>{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)] shrink-0 ml-2" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
