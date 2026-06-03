'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Save, Loader2, Link2, ChevronDown, ChevronRight, Check,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { updateUserProfile } from '@/lib/api';

/**
 * Complete content niche/format catalogue.
 * Every single item the user specified — do NOT remove any.
 */
const NICHE_CATEGORIES = [
  {
    label: 'Formats',
    items: [
      'Short-form videos (Reels, Shorts, TikTok)', 'Long-form videos', 'YouTube videos',
      'Product reviews', 'Unboxing videos', 'Tutorials', 'Explainer videos',
      'Educational videos', 'Vlogs', 'Interview videos', 'Event coverage',
      'Live streaming', 'Webinar hosting', 'Video podcasts',
      'Documentary-style videos', 'Behind-the-scenes content',
    ],
  },
  {
    label: 'Photography',
    items: [
      'Product photography', 'Lifestyle photography', 'Fashion photography',
      'Food photography', 'Travel photography', 'Event photography',
      'Portrait photography', 'Real estate photography', 'Drone photography',
      'Commercial photography',
    ],
  },
  {
    label: 'Social Media',
    items: [
      'Instagram posts', 'Instagram Reels', 'Instagram Stories', 'TikTok content',
      'YouTube Shorts', 'Facebook content', 'LinkedIn content', 'Pinterest content',
      'X (Twitter) content', 'Snapchat content', 'Threads content',
    ],
  },
  {
    label: 'Writing',
    items: [
      'Blog articles', 'SEO articles', 'Website copy', 'Sales copy',
      'Email marketing campaigns', 'Newsletters', 'Technical writing',
      'Ghostwriting', 'Product descriptions', 'Case studies',
      'Whitepapers', 'Press releases',
    ],
  },
  {
    label: 'Audio & Design',
    items: [
      'Podcasts', 'Podcast editing', 'Voice-overs', 'Audiobooks', 'Radio content',
      'Graphic design', 'Social media creatives', 'Infographics',
      'Presentation design', 'Brand identity development', 'Logo design',
      'Banner design', 'Advertising creatives',
    ],
  },
  {
    label: 'UGC',
    items: [
      'Product demonstrations', 'Testimonial videos', 'Customer experience videos',
      'Product reviews', 'App reviews', 'Lifestyle UGC', 'Voiceover UGC',
    ],
  },
  {
    label: 'Industries',
    items: [
      'Technology (AI, software, SaaS, cybersecurity, programming, gadgets, consumer electronics)',
      'Business (entrepreneurship, startups, finance, investing, marketing, sales, productivity)',
      'Lifestyle (fashion, beauty, skincare, luxury, home decor, relationships, parenting)',
      'Health (fitness, gym, yoga, nutrition, mental wellness, sports)',
      'Education (online learning, career advice, skill development, exam preparation, language learning)',
      'Entertainment (comedy, memes, movies, TV shows, music, gaming)',
      'Travel (travel vlogs, hotels, airlines, tourism, adventure travel)',
      'Food (cooking, recipes, restaurant reviews, food blogging, baking)',
      'Automotive (cars, motorcycles, EVs, car reviews)',
      'Real Estate (property tours, home buying, interior design)',
      'Finance (personal finance, banking, cryptocurrency)',
      'Pets (dogs, cats, pet care)',
      'Gaming (mobile gaming, PC gaming, console gaming, esports)',
    ],
  },
];

export default function ContentLinksModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuth();
  const pd = user?.profileDetails || {};
  const isBrand = user?.role === 'Brand';

  const [socialLinks, setSocialLinks] = useState({
    youtube: '', instagram: '', twitter: '', linkedin: '', facebook: '', website: '',
  });
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setSocialLinks({
        youtube: pd.socialLinks?.youtube || '',
        instagram: pd.socialLinks?.instagram || '',
        twitter: pd.socialLinks?.twitter || '',
        linkedin: pd.socialLinks?.linkedin || '',
        facebook: pd.socialLinks?.facebook || '',
        website: pd.socialLinks?.website || '',
      });
      setSelectedNiches(pd.niches || []);
      setExpandedCategories({});
      setSuccess(false);
    }
  }, [isOpen, user]);

  const toggleCategory = (label) => {
    setExpandedCategories((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const toggleNiche = (niche) => {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { socialLinks };
      if (!isBrand) {
        payload.niches = selectedNiches;
      }
      const res = await updateUserProfile(payload);
      updateUser(res.data.user);
      setSuccess(true);
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      console.error('Failed to save content links:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all';

  const linkFields = [
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel', color: 'text-red-500' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourprofile', color: 'text-pink-500' },
    { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/yourhandle', color: 'text-sky-500' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourprofile', color: 'text-blue-600' },
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage', color: 'text-blue-500' },
  ];

  if (isBrand) {
    linkFields.push({ key: 'website', label: 'Website', placeholder: 'https://yourbrand.com', color: 'text-emerald-500' });
  }

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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Link2 className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">
                {isBrand ? 'Brand Page Links' : 'Your Content Links'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 px-4 py-3 text-sm text-[var(--color-success)]"
            >
              Saved successfully!
            </motion.div>
          )}

          {/* Social Links */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Social Links</h3>
            {linkFields.map(({ key, label, placeholder, color }) => (
              <div key={key}>
                <label className={`text-xs font-medium ${color} mb-1 block`}>{label}</label>
                <input
                  type="url"
                  value={socialLinks[key]}
                  onChange={(e) => setSocialLinks((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          {/* Content Selection — Creator only */}
          {!isBrand && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">Content Niche / Formats</h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Select all that apply to your content style
              </p>

              {/* Selected tags */}
              {selectedNiches.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4 p-3 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)]">
                  {selectedNiches.map((niche) => (
                    <span
                      key={niche}
                      className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-primary)]/10 px-2 py-1 text-xs font-medium text-[var(--color-primary)]"
                    >
                      {niche.length > 40 ? `${niche.substring(0, 40)}…` : niche}
                      <button
                        onClick={() => toggleNiche(niche)}
                        className="hover:text-[var(--color-danger)] transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Category accordions */}
              <div className="space-y-1 rounded-xl border border-[var(--color-border)] overflow-hidden">
                {NICHE_CATEGORIES.map(({ label, items }) => {
                  const isExpanded = expandedCategories[label];
                  const selectedCount = items.filter((i) => selectedNiches.includes(i)).length;

                  return (
                    <div key={label}>
                      <button
                        type="button"
                        onClick={() => toggleCategory(label)}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          {label}
                          {selectedCount > 0 && (
                            <span className="rounded-full bg-[var(--color-primary)] text-white text-xs px-2 py-0.5 font-bold">
                              {selectedCount}
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)]">{items.length} items</span>
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
                            <div className="px-4 pb-3 space-y-1">
                              {items.map((item) => {
                                const isSelected = selectedNiches.includes(item);
                                return (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() => toggleNiche(item)}
                                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-left transition-all ${
                                      isSelected
                                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                                        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]'
                                    }`}
                                  >
                                    <div
                                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                                        isSelected
                                          ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                                          : 'border-[var(--color-border)]'
                                      }`}
                                    >
                                      {isSelected && <Check className="h-3 w-3 text-white" />}
                                    </div>
                                    {item}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-[var(--color-primary)]/40 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
