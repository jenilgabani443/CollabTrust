'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { fetchCampaigns } from '@/lib/api';
import CampaignBentoGrid from '@/components/dashboard/CampaignBentoGrid';

export default function CreatorDashboardPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);

  const pd = user?.profileDetails || {};
  const firstName = pd.firstName || user?.email?.split('@')[0] || 'Creator';

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const res = await fetchCampaigns();
      setCampaigns(res.data?.campaigns || []);
    } catch {
      // Demo fallback
      setCampaigns([
        { _id: 'c1', brandId: { email: 'acme@brand.co' }, status: 'FUNDED', createdAt: new Date().toISOString() },
        { _id: 'c2', brandId: { email: 'nova@inc.com' }, status: 'DRAFT', createdAt: new Date().toISOString() },
        { _id: 'c3', brandId: { email: 'apex@studio.io' }, status: 'PAID', createdAt: new Date().toISOString() },
      ]);
    }
  };

  const totalEarnings = campaigns
    .filter((c) => c.status === 'PAID')
    .reduce((sum, c) => sum + (c.totalAmount || 1000) * 0.95, 0);

  const activeCampaigns = campaigns.filter((c) => c.status !== 'PAID' && c.status !== 'DRAFT');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight text-spatial">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-spatial-muted">
          Track your earnings, campaigns, and profile
        </p>
      </motion.div>

      <CampaignBentoGrid
        stats={[
          { label: 'Total Earnings', value: `$${totalEarnings.toFixed(0)}`, type: 'earnings', delay: 0 },
          { label: 'Active Campaigns', value: activeCampaigns.length, type: 'campaigns', delay: 0.08 },
          { label: 'All Campaigns', value: campaigns.length, type: 'videos', delay: 0.12 },
        ]}
        campaigns={campaigns}
        campaignsTitle="Incoming Campaigns"
        emptyCampaignsMessage="No campaign requests yet."
        getCampaignTitle={(c) => c.brandId?.email || 'Brand Campaign'}
      />
    </div>
  );
}
