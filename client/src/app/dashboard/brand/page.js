'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Sparkles,
  Filter,
  ChevronRight,
  Briefcase,
  Users,
  Eye,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { fetchCreators, fetchCampaigns } from '@/lib/api';
import CreatorCard from '@/components/CreatorCard';
import CampaignBentoGrid from '@/components/dashboard/CampaignBentoGrid';
import MagneticButton from '@/components/ui/MagneticButton';
import SpatialEmptyState from '@/components/spatial/SpatialEmptyState';

export default function BrandDashboardPage() {
  const { user } = useAuth();
  const [creators, setCreators] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [niche, setNiche] = useState('');
  const [activeTab, setActiveTab] = useState('discover');

  const doSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (location.trim()) params.location = location.trim();
      if (niche.trim()) params.niche = niche.trim();
      const res = await fetchCreators(params);
      setCreators(res.data?.creators || []);
    } catch (err) {
      console.error('Failed to fetch creators:', err);
      // Demo data fallback
      setCreators([
        { _id: '1', email: 'alex@creator.io', profileDetails: { location: 'San Francisco', niche: 'AI' }, totalViewsTimeframe: 45200, totalVideosTimeframe: 12, historicalRelevance: 3766 },
        { _id: '2', email: 'maya@studio.co', profileDetails: { location: 'London', niche: 'Cybersecurity' }, totalViewsTimeframe: 32100, totalVideosTimeframe: 8, historicalRelevance: 4012 },
        { _id: '3', email: 'raj@techvlog.com', profileDetails: { location: 'Bangalore', niche: 'Cloud' }, totalViewsTimeframe: 28700, totalVideosTimeframe: 15, historicalRelevance: 1913 },
        { _id: '4', email: 'emma@design.pro', profileDetails: { location: 'Berlin', niche: 'UI/UX' }, totalViewsTimeframe: 19500, totalVideosTimeframe: 6, historicalRelevance: 3250 },
        { _id: '5', email: 'kai@reviews.net', profileDetails: { location: 'Tokyo', niche: 'DevOps' }, totalViewsTimeframe: 52800, totalVideosTimeframe: 22, historicalRelevance: 2400 },
        { _id: '6', email: 'sara@content.dev', profileDetails: { location: 'NYC', niche: 'AI' }, totalViewsTimeframe: 67300, totalVideosTimeframe: 18, historicalRelevance: 3738 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    try {
      const res = await fetchCampaigns();
      setCampaigns(res.data?.campaigns || []);
    } catch {
      // Demo fallback
      setCampaigns([
        { _id: 'c1', creatorId: { email: 'alex@creator.io' }, status: 'FUNDED', createdAt: new Date().toISOString() },
        { _id: 'c2', creatorId: { email: 'maya@studio.co' }, status: 'SUBMITTED', createdAt: new Date().toISOString() },
      ]);
    }
  };

  useEffect(() => {
    doSearch();
    loadCampaigns();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    doSearch();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight text-spatial">
          Welcome back, {user?.profileDetails?.firstName || user?.email?.split('@')[0] || 'there'}
        </h1>
        <p className="mt-1 text-sm text-spatial-muted">
          Discover top creators and manage your campaigns
        </p>
      </motion.div>

      <CampaignBentoGrid
        stats={[
          { label: 'Active Campaigns', value: campaigns.length, type: 'campaigns', delay: 0 },
          { label: 'Creators Discovered', value: creators.length, type: 'creators', delay: 0.08 },
          {
            label: 'Total Reach',
            value: creators.reduce((s, c) => s + (c.totalViewsTimeframe || 0), 0),
            type: 'views',
            delay: 0.12,
          },
        ]}
        campaigns={campaigns}
        campaignsTitle="My Active Campaigns"
        getCampaignTitle={(c) => `Campaign with ${c.creatorId?.email || 'Creator'}`}
        discoverHref="/dashboard/brand/discover"
        discoverLabel="Open discovery"
      />

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] w-fit">
        {[
          { key: 'discover', label: 'Discover Creators', icon: Search },
          { key: 'campaigns', label: 'My Active Campaigns', icon: Briefcase },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === key
                ? 'text-white'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {activeTab === key && (
              <motion.div
                layoutId="brand-tab"
                className="absolute inset-0 rounded-lg bg-[var(--color-primary)] shadow-md"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Discover Tab */}
      {activeTab === 'discover' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Filter Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 mb-6 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (e.g. San Francisco)"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] pl-10 pr-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all"
              />
            </div>
            <div className="relative flex-1">
              <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Niche (e.g. AI, Cybersecurity)"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] pl-10 pr-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all"
              />
            </div>
            <MagneticButton
              type="submit"
              disabled={loading}
              className="btn-spatial-primary flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
              Search
            </MagneticButton>
          </form>

          {/* Results Grid */}
          {creators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {creators.map((creator, i) => (
                <CreatorCard key={creator._id} creator={creator} delay={i * 0.06} />
              ))}
            </div>
          ) : (
            <SpatialEmptyState
              variant="sphere"
              title="No creators found"
              description="Try adjusting your filters to scan a wider slice of the network."
              compact
            />
          )}
        </motion.div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {campaigns.length > 0 ? (
            campaigns.map((camp, i) => (
              <motion.div
                key={camp._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/dashboard/campaign/${camp._id}`}
                  className="group flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">
                        Campaign with {camp.creatorId?.email || 'Creator'}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Created {new Date(camp.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]">
                      {camp.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Briefcase className="h-12 w-12 text-[var(--color-text-muted)] mb-3" />
              <p className="text-sm text-[var(--color-text-muted)]">No active campaigns yet.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
