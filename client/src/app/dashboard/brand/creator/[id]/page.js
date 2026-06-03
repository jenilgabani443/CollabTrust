'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Eye, Award, ExternalLink, FileText, User, Loader2, ArrowLeft, Send } from 'lucide-react';
import { fetchCreatorById } from '@/lib/api';
import ProposeCampaignModal from '@/components/ProposeCampaignModal';
import CreatorAvatar from '@/components/creator/CreatorAvatar';
import MagneticButton from '@/components/ui/MagneticButton';
import { getCreatorDisplay } from '@/lib/creatorUtils';

const SOCIAL_ICONS = {
  youtube: { label: 'YouTube', color: 'text-red-500 hover:bg-red-500/10 border-red-500/20' },
  instagram: { label: 'Instagram', color: 'text-pink-500 hover:bg-pink-500/10 border-pink-500/20' },
  twitter: { label: 'X (Twitter)', color: 'text-sky-500 hover:bg-sky-500/10 border-sky-500/20' },
  linkedin: { label: 'LinkedIn', color: 'text-blue-600 hover:bg-blue-600/10 border-blue-600/20' },
  facebook: { label: 'Facebook', color: 'text-blue-500 hover:bg-blue-500/10 border-blue-500/20' },
  website: { label: 'Website', color: 'text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/20' },
};

export default function CreatorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const creatorId = params?.id;

  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (creatorId) {
      loadCreator();
    }
  }, [creatorId]);

  const loadCreator = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchCreatorById(creatorId);
      setCreator(res.data.creator);
    } catch (err) {
      setError(err.message || 'Failed to load creator profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-spatial-accent" />
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <p className="text-sm text-[var(--color-danger)] mb-4">{error || 'Creator not found'}</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-surface-alt)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-border)]"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </div>
    );
  }

  const pd = creator.profileDetails || {};
  const socialLinks = pd.socialLinks || {};
  const niches = pd.niches || [];
  const { fullName, avatarLetter, profilePicture } = getCreatorDisplay(creator);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="group mb-6 flex items-center gap-2 text-sm font-medium text-spatial-muted transition-colors hover:text-spatial"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Discovery
      </button>

      <div className="overflow-hidden rounded-3xl border border-spatial bg-spatial-card shadow-2xl backdrop-blur-2xl">
        <div className="relative h-32 bg-gradient-to-r from-violet-600/25 via-indigo-600/15 to-transparent sm:h-48">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.2),transparent_60%)]" />
        </div>

        <div className="relative px-6 pb-8 sm:px-10">
          <div className="mb-8 flex flex-col gap-6 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end">
              <CreatorAvatar
                creatorId={creatorId}
                profilePicture={profilePicture}
                avatarLetter={avatarLetter}
                variant="profile"
              />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.35 }}
                className="mb-2 text-center sm:text-left"
              >
                <h1 className="text-2xl font-bold tracking-tight text-spatial sm:text-3xl">{fullName}</h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {pd.location && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-spatial bg-spatial-card-muted px-3 py-1 text-sm font-medium text-spatial-muted">
                      <MapPin className="h-4 w-4" /> {pd.location}
                    </span>
                  )}
                  {pd.gender && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-spatial bg-spatial-card-muted px-3 py-1 text-sm font-medium text-spatial-muted">
                      <User className="h-4 w-4" /> {pd.gender}
                    </span>
                  )}
                </div>
              </motion.div>
            </div>

            <MagneticButton
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-spatial-primary flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white sm:w-auto"
            >
              <Send className="h-4 w-4" /> Propose Campaign
            </MagneticButton>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          >
            <div className="space-y-8 lg:col-span-2">
              {pd.bio && (
                <section>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-spatial-muted">
                    <FileText className="h-4 w-4" /> About
                  </h2>
                  <p className="text-sm leading-relaxed text-spatial">{pd.bio}</p>
                </section>
              )}

              {niches.length > 0 && (
                <section>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-spatial-muted">
                    <Sparkles className="h-4 w-4" /> Content Niches
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {niches.map((niche) => (
                      <span
                        key={niche}
                        className="inline-flex items-center rounded-xl border border-[var(--spatial-accent-border)] bg-[var(--spatial-accent-bg)] px-3 py-1.5 text-sm font-medium text-spatial-accent"
                      >
                        {niche}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-spatial-muted">
                  Performance (Last Year)
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-spatial bg-spatial-card p-4 text-center backdrop-blur-xl">
                    <Eye className="mx-auto mb-2 h-5 w-5 text-spatial-muted" />
                    <p className="font-mono text-xl font-bold text-spatial">
                      {(creator.totalViewsTimeframe || 0) >= 1000
                        ? `${((creator.totalViewsTimeframe || 0) / 1000).toFixed(1)}K`
                        : creator.totalViewsTimeframe || 0}
                    </p>
                    <p className="mt-1 text-xs text-spatial-muted">Total Views</p>
                  </div>
                  <div className="rounded-2xl border border-spatial bg-spatial-card p-4 text-center backdrop-blur-xl">
                    <Award className="mx-auto mb-2 h-5 w-5 text-spatial-accent" />
                    <p className="font-mono text-xl font-bold text-spatial-accent">
                      {(creator.historicalRelevance || 0) >= 1000
                        ? `${((creator.historicalRelevance || 0) / 1000).toFixed(1)}K`
                        : Math.round(creator.historicalRelevance || 0)}
                    </p>
                    <p className="mt-1 text-xs text-spatial-muted">Avg Relevance</p>
                  </div>
                  <div className="rounded-2xl border border-spatial bg-spatial-card p-4 text-center backdrop-blur-xl">
                    <div className="mx-auto mb-2 flex h-5 w-5 items-center justify-center text-spatial-muted">
                      <span className="font-bold">▶</span>
                    </div>
                    <p className="font-mono text-xl font-bold text-spatial">
                      {creator.totalVideosTimeframe || 0}
                    </p>
                    <p className="mt-1 text-xs text-spatial-muted">Videos</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              {Object.entries(socialLinks).some(([, v]) => v) && (
                <div className="rounded-2xl border border-spatial bg-spatial-card p-5 backdrop-blur-xl">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-spatial-muted">
                    Content Links
                  </h2>
                  <div className="flex flex-col gap-3">
                    {Object.entries(socialLinks).map(([key, url]) => {
                      if (!url) return null;
                      const social = SOCIAL_ICONS[key];
                      return (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all ${social.color}`}
                        >
                          <span className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            {social.label}
                          </span>
                          <span className="text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Languages */}
              {pd.languagePreferences?.length > 0 && (
                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-spatial-muted">
                    Languages
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {pd.languagePreferences.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center rounded-lg border border-spatial bg-spatial-card px-3 py-1.5 text-xs font-medium text-spatial-muted"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <ProposeCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        creatorId={creatorId}
      />
    </div>
  );
}
