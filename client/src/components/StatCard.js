'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Eye, Video, Award } from 'lucide-react';

const iconMap = {
  views: Eye,
  videos: Video,
  earnings: TrendingUp,
  relevance: Award,
};

export default function StatCard({ label, value, type = 'views', trend, delay = 0 }) {
  const Icon = iconMap[type] || Eye;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/30"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-[var(--color-text)]">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trend > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-[var(--color-primary)]/5 transition-transform duration-500 group-hover:scale-150" />
    </motion.div>
  );
}
