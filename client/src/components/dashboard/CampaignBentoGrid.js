'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Briefcase,
  ChevronRight,
  Eye,
  TrendingUp,
  Video,
  Award,
  Users,
} from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';
import MagneticButton from '@/components/ui/MagneticButton';
import SpatialEmptyState from '@/components/spatial/SpatialEmptyState';

const ICONS = {
  views: Eye,
  videos: Video,
  earnings: TrendingUp,
  relevance: Award,
  campaigns: Briefcase,
  creators: Users,
};

function formatValue(value) {
  if (typeof value === 'number') {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 10_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  }
  return value;
}

function StatBlock({ label, value, type = 'views', large = false, delay = 0 }) {
  const Icon = ICONS[type] || Eye;

  return (
    <SpotlightCard
      delay={delay}
      className={large ? 'min-h-[200px] sm:min-h-[220px]' : 'min-h-[120px]'}
    >
      <div className={`flex h-full flex-col justify-between p-6 ${large ? 'sm:p-8' : ''}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-spatial-muted">
              {label}
            </p>
            <p
              className={`mt-2 font-mono font-semibold tracking-tight text-spatial ${
                large ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'
              }`}
            >
              {formatValue(value)}
            </p>
          </div>
          <div
            className={`flex shrink-0 items-center justify-center rounded-2xl border border-[var(--spatial-accent-border)] bg-[var(--spatial-accent-bg)] text-spatial-accent ${
              large ? 'h-14 w-14' : 'h-11 w-11'
            }`}
          >
            <Icon className={large ? 'h-7 w-7' : 'h-5 w-5'} />
          </div>
        </div>
        {large && (
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-spatial-muted">
            Live network pulse — click anywhere on the canvas to send a ripple through the mesh.
          </p>
        )}
      </div>
    </SpotlightCard>
  );
}

function CampaignRow({ campaign, index, getTitle, getSubtitle, statusClassName }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 + index * 0.06 }}
    >
      <Link
        href={`/dashboard/campaign/${campaign._id}`}
        className="group flex items-center justify-between gap-4 rounded-2xl border border-spatial bg-spatial-card-muted px-4 py-3.5 transition-colors hover:border-[var(--spatial-accent-border)] hover:bg-spatial-hover"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--spatial-accent-border)] bg-[var(--spatial-accent-bg)] text-spatial-accent">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-spatial">{getTitle(campaign)}</p>
            <p className="text-xs text-spatial-muted">{getSubtitle(campaign)}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusClassName(campaign)}`}
          >
            {campaign.status}
          </span>
          <ChevronRight className="h-4 w-4 text-spatial-muted transition-transform group-hover:translate-x-0.5 group-hover:text-spatial-accent" />
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * Spatial bento grid: hero stat, supporting stats, and active campaigns.
 */
export default function CampaignBentoGrid({
  stats = [],
  campaigns = [],
  campaignsTitle = 'Active Campaigns',
  emptyCampaignsMessage = 'No active campaigns yet.',
  getCampaignTitle,
  getCampaignSubtitle,
  getStatusClassName,
  discoverHref,
  discoverLabel = 'Discover creators',
}) {
  const [hero, ...rest] = stats;

  const defaultStatusClass = (camp) => {
    if (camp.status === 'PAID') {
      return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
    }
    if (camp.status === 'DRAFT') {
      return 'border-spatial text-spatial-muted bg-spatial-card-muted';
    }
    return 'border-[var(--spatial-accent-border)] text-spatial-accent bg-[var(--spatial-accent-bg)]';
  };

  const titleFn =
    getCampaignTitle ||
    ((c) => `Campaign · ${c.creatorId?.email || c.brandId?.email || 'Partner'}`);
  const subtitleFn =
    getCampaignSubtitle ||
    ((c) => new Date(c.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }));
  const statusFn = getStatusClassName || defaultStatusClass;

  return (
    <section className="mb-10" aria-label="Campaign dashboard">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2 auto-rows-min">
        {hero && (
          <div className="md:col-span-3 md:row-span-2">
            <StatBlock
              label={hero.label}
              value={hero.value}
              type={hero.type}
              large
              delay={hero.delay ?? 0}
            />
          </div>
        )}

        {rest.map((stat, i) => (
          <div key={stat.label} className="md:col-span-3">
            <StatBlock
              label={stat.label}
              value={stat.value}
              type={stat.type}
              delay={stat.delay ?? 0.08 * (i + 1)}
            />
          </div>
        ))}

        <SpotlightCard
          delay={0.2}
          className="md:col-span-6 min-h-[280px]"
        >
          <div className="flex h-full flex-col p-6 sm:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-spatial">
                  {campaignsTitle}
                </h2>
                <p className="mt-0.5 text-sm text-spatial-muted">
                  {campaigns.length} {campaigns.length === 1 ? 'contract' : 'contracts'} in flight
                </p>
              </div>
              {discoverHref && (
                <MagneticButton
                  as={Link}
                  href={discoverHref}
                  className="btn-spatial-primary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-95"
                >
                  {discoverLabel}
                  <ChevronRight className="h-4 w-4" />
                </MagneticButton>
              )}
            </div>

            {campaigns.length > 0 ? (
              <div className="flex flex-1 flex-col gap-2 overflow-hidden">
                {campaigns.slice(0, 5).map((camp, i) => (
                  <CampaignRow
                    key={camp._id}
                    campaign={camp}
                    index={i}
                    getTitle={titleFn}
                    getSubtitle={subtitleFn}
                    statusClassName={statusFn}
                  />
                ))}
                {campaigns.length > 5 && (
                  <p className="pt-1 text-center text-xs text-spatial-muted">
                    +{campaigns.length - 5} more
                  </p>
                )}
              </div>
            ) : (
              <SpatialEmptyState
                variant="sphere"
                title="No contracts in flight"
                description={emptyCampaignsMessage}
                compact
                className="flex-1 rounded-2xl border border-dashed border-spatial"
              />
            )}
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
