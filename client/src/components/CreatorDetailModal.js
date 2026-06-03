'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Sparkles, Eye, Award, Loader2, ExternalLink,
  User, FileText,
} from 'lucide-react';
import { fetchCreatorById } from '@/lib/api';

const SOCIAL_ICONS = {
  youtube: { label: 'YouTube', color: 'text-red-500 hover:bg-red-500/10' },
  instagram: { label: 'Instagram', color: 'text-pink-500 hover:bg-pink-500/10' },
  twitter: { label: 'X (Twitter)', color: 'text-sky-500 hover:bg-sky-500/10' },
  linkedin: { label: 'LinkedIn', color: 'text-blue-600 hover:bg-blue-600/10' },
  facebook: { label: 'Facebook', color: 'text-blue-500 hover:bg-blue-500/10' },
  website: { label: 'Website', color: 'text-emerald-500 hover:bg-emerald-500/10' },
};

export default function CreatorDetailModal({ isOpen, onClose, creatorId }) {
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && creatorId) {
      loadCreator();
    }
    return () => {
      setCreator(null);
      setError('');
    };
  }, [isOpen, creatorId]);

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

  if (!isOpen) return null;

  const pd = creator?.profileDetails || {};
  const socialLinks = pd.socialLinks || {};
  const niches = pd.niches || [];
  const fullName = [pd.firstName, pd.lastName].filter(Boolean).join(' ');
  const avatarLetter = (pd.firstName || creator?.email || '?').charAt(0).toUpperCase();

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
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] transition-colors z-10"
          >
            <X className="h-4 w-4" />
          </button>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-[var(--color-danger)]">{error}</p>
            </div>
          )}

          {creator && !loading && (
            <>
              {/* Profile Header */}
              <div className="flex items-start gap-5 mb-6">
                {pd.profilePicture ? (
                  <img
                    src={pd.profilePicture}
                    alt={fullName || creator.email}
                    className="h-20 w-20 rounded-2xl object-cover border-2 border-[var(--color-primary)]/30 shadow-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-bold text-2xl shadow-lg shadow-[var(--color-primary)]/20">
                    {avatarLetter}
                  </div>
                )}
                <div className="min-w-0 flex-1 pt-1">
                  <h2 className="text-xl font-bold text-[var(--color-text)]">
                    {fullName || creator.email}
                  </h2>
                  {fullName && (
                    <p className="text-sm text-[var(--color-text-muted)]">{creator.email}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pd.location && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-surface-alt)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]">
                        <MapPin className="h-3 w-3" /> {pd.location}
                      </span>
                    )}
                    {pd.gender && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-surface-alt)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]">
                        <User className="h-3 w-3" /> {pd.gender}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {pd.bio && (
                <div className="mb-6">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                    <FileText className="h-3 w-3" /> Bio
                  </h3>
                  <p className="text-sm text-[var(--color-text)] leading-relaxed bg-[var(--color-surface-alt)] rounded-xl p-4 border border-[var(--color-border)]">
                    {pd.bio}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center rounded-xl bg-[var(--color-surface-alt)] p-4 border border-[var(--color-border)]">
                  <div className="flex items-center justify-center gap-1 text-xs text-[var(--color-text-muted)] mb-1">
                    <Eye className="h-3 w-3" /> Views
                  </div>
                  <p className="text-lg font-bold text-[var(--color-text)]">
                    {(creator.totalViewsTimeframe || 0) >= 1000
                      ? `${((creator.totalViewsTimeframe || 0) / 1000).toFixed(1)}K`
                      : creator.totalViewsTimeframe || 0}
                  </p>
                </div>
                <div className="text-center rounded-xl bg-[var(--color-surface-alt)] p-4 border border-[var(--color-border)]">
                  <div className="flex items-center justify-center gap-1 text-xs text-[var(--color-text-muted)] mb-1">
                    <Award className="h-3 w-3" /> Relevance
                  </div>
                  <p className="text-lg font-bold text-[var(--color-primary)]">
                    {(creator.historicalRelevance || 0) >= 1000
                      ? `${((creator.historicalRelevance || 0) / 1000).toFixed(1)}K`
                      : Math.round(creator.historicalRelevance || 0)}
                  </p>
                </div>
                <div className="text-center rounded-xl bg-[var(--color-surface-alt)] p-4 border border-[var(--color-border)]">
                  <div className="text-xs text-[var(--color-text-muted)] mb-1">Videos</div>
                  <p className="text-lg font-bold text-[var(--color-text)]">
                    {creator.totalVideosTimeframe || 0}
                  </p>
                </div>
              </div>

              {/* Social Links */}
              {Object.entries(socialLinks).some(([, v]) => v) && (
                <div className="mb-6">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                    <ExternalLink className="h-3 w-3" /> Social Links
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(socialLinks).map(([key, url]) => {
                      if (!url) return null;
                      const social = SOCIAL_ICONS[key];
                      return (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 py-2 text-xs font-medium transition-all ${social.color}`}
                        >
                          <ExternalLink className="h-3 w-3" />
                          {social.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Content Niches */}
              {niches.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                    <Sparkles className="h-3 w-3" /> Content Niches & Formats
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {niches.map((niche) => (
                      <span
                        key={niche}
                        className="inline-flex items-center rounded-lg bg-[var(--color-primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]"
                      >
                        {niche}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {pd.languagePreferences?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {pd.languagePreferences.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
