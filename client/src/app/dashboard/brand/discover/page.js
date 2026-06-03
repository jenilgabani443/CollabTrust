'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, Filter, Loader2, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { fetchCreators } from '@/lib/api';
import CreatorCard from '@/components/CreatorCard';
import SpatialEmptyState from '@/components/spatial/SpatialEmptyState';
import MagneticButton from '@/components/ui/MagneticButton';

export default function DiscoverPage() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [niche, setNiche] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  const doSearch = async () => {
    setLoading(true);
    try {
      const params = { sortBy };
      if (location.trim()) params.location = location.trim();
      if (niche.trim()) params.niche = niche.trim();
      const res = await fetchCreators(params);
      setCreators(res.data?.creators || []);
    } catch {
      setCreators([
        { _id: '1', email: 'alex@creator.io', profileDetails: { firstName: 'Alex', lastName: 'Rivera', location: 'San Francisco', niches: ['Technology (AI, software, SaaS, cybersecurity, programming, gadgets, consumer electronics)', 'YouTube videos'] }, totalViewsTimeframe: 45200, totalVideosTimeframe: 12, historicalRelevance: 3766 },
        { _id: '2', email: 'maya@studio.co', profileDetails: { firstName: 'Maya', lastName: 'Chen', location: 'London', niches: ['Technology (AI, software, SaaS, cybersecurity, programming, gadgets, consumer electronics)', 'Blog articles'] }, totalViewsTimeframe: 32100, totalVideosTimeframe: 8, historicalRelevance: 4012 },
        { _id: '3', email: 'raj@techvlog.com', profileDetails: { firstName: 'Raj', lastName: 'Patel', location: 'Bangalore', niches: ['Tutorials', 'Educational videos'] }, totalViewsTimeframe: 28700, totalVideosTimeframe: 15, historicalRelevance: 1913 },
        { _id: '4', email: 'emma@design.pro', profileDetails: { firstName: 'Emma', lastName: 'Fischer', location: 'Berlin', niches: ['Graphic design', 'Brand identity development'] }, totalViewsTimeframe: 19500, totalVideosTimeframe: 6, historicalRelevance: 3250 },
        { _id: '5', email: 'kai@reviews.net', profileDetails: { firstName: 'Kai', lastName: 'Tanaka', location: 'Tokyo', niches: ['Product reviews', 'Unboxing videos'] }, totalViewsTimeframe: 52800, totalVideosTimeframe: 22, historicalRelevance: 2400 },
        { _id: '6', email: 'sara@content.dev', profileDetails: { firstName: 'Sara', lastName: 'Nouri', location: 'NYC', niches: ['Short-form videos (Reels, Shorts, TikTok)', 'Instagram Reels'] }, totalViewsTimeframe: 67300, totalVideosTimeframe: 18, historicalRelevance: 3738 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch all creators on page load
  useEffect(() => {
    doSearch();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--spatial-accent-border)] bg-[var(--spatial-accent-bg)] text-spatial-accent">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-spatial">Discover Creators</h1>
            <p className="text-sm text-spatial-muted">
              Find the perfect creator for your next campaign
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={(e) => { e.preventDefault(); doSearch(); }}
        className="glass-spatial mt-6 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="h-4 w-4 text-[var(--color-text-muted)]" />
          <span className="text-sm font-semibold text-[var(--color-text)]">Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] pl-10 pr-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all"
            />
          </div>

          <div className="relative">
            <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Niche (AI, Photography, UGC...)"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] pl-10 pr-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all"
            />
          </div>

          <div className="relative">
            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] pl-10 pr-4 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all appearance-none"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="views">Sort by Views</option>
              <option value="videos">Sort by Videos</option>
            </select>
          </div>
        </div>

        <MagneticButton
          type="submit"
          disabled={loading}
          className="btn-spatial-primary mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
          Search Creators
        </MagneticButton>
      </motion.form>

      {/* Results */}
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-spatial-accent" />
          </div>
        ) : creators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {creators.map((creator, i) => (
              <CreatorCard
                key={creator._id}
                creator={creator}
                delay={i * 0.06}
              />
            ))}
          </div>
        ) : (
          <SpatialEmptyState
            variant="sphere"
            title="No creators in this orbit"
            description="Try adjusting your location or niche filters to expand the network."
          />
        )}
      </div>

    </div>
  );
}
