'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Link2,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import {
  fetchCampaignById,
  transitionCampaignStatus,
  submitDeliverable,
  fetchInvoiceByCampaign,
} from '@/lib/api';
import StatusPipeline from '@/components/StatusPipeline';
import ChatPanel from '@/components/ChatPanel';
import InvoiceCard from '@/components/InvoiceCard';
import FundContractSuccess from '@/components/campaign/FundContractSuccess';
import MagneticButton from '@/components/ui/MagneticButton';

export default function CampaignRoomPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showFundedSuccess, setShowFundedSuccess] = useState(false);

  const isCreator = user?.role === 'Creator';
  const isBrand = user?.role === 'Brand';

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const loadCampaign = async () => {
    setLoading(true);
    try {
      const res = await fetchCampaignById(id);
      setCampaign(res.data?.campaign || null);

      if (res.data?.campaign?.status === 'PAID') {
        try {
          const invRes = await fetchInvoiceByCampaign(id);
          setInvoice(invRes.data?.invoice || null);
        } catch {
          // Invoice might not be fetched yet
        }
      }
    } catch {
      // Demo fallback
      setCampaign({
        _id: id,
        status: 'FUNDED',
        brandId: { email: 'acme@brand.co' },
        creatorId: { email: 'alex@creator.io' },
        deliverables: [
          { type: 'YouTube Video', description: 'Product review video', status: 'PENDING', submissionUrl: '' },
          { type: 'Instagram Reel', description: 'Short-form content', status: 'PENDING', submissionUrl: '' },
        ],
        contractHash: 'a3f8c9d1e4b7a2c5d8e1f3a6b9c2d5e8f1a4b7c0d3e6f9a2b5c8d1e4f7a0b3',
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransition = async (nextStatus) => {
    setTransitioning(true);
    try {
      await transitionCampaignStatus(id, nextStatus, { totalAmount: 1000 });
      if (nextStatus === 'FUNDED') {
        setShowFundedSuccess(true);
      }
      await loadCampaign();
    } catch (err) {
      console.error('Failed to transition:', err);
    } finally {
      setTransitioning(false);
    }
  };

  const handleSubmitDeliverable = async (type) => {
    if (!submissionUrl.trim()) return;
    setSubmitting(true);
    try {
      await submitDeliverable(id, submissionUrl.trim(), type);
      setSubmissionUrl('');
      await loadCampaign();
    } catch (err) {
      console.error('Failed to submit deliverable:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold text-[var(--color-text)]">Campaign not found</p>
        <Link href={`/dashboard/${isCreator ? 'creator' : 'brand'}`} className="mt-4 text-sm text-[var(--color-primary)] hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <FundContractSuccess open={showFundedSuccess} onClose={() => setShowFundedSuccess(false)} />
      {/* Back link */}
      <Link
        href={`/dashboard/${isCreator ? 'creator' : 'brand'}`}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Campaign Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">Campaign Room</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <Users className="h-4 w-4" />
              <span>{campaign.brandId?.email || 'Brand'}</span>
              <span>↔</span>
              <span>{campaign.creatorId?.email || 'Creator'}</span>
            </div>
          </div>
          <div className="text-xs text-[var(--color-text-muted)]">
            Created {new Date(campaign.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Status Pipeline */}
        <StatusPipeline currentStatus={campaign.status} />

        {/* Action Buttons */}
        <div className="mt-5 w-full">
          {isCreator && (
            <>
              {/* Render buttons based on the EXACT campaign status string from the backend */}
              {campaign.status === 'DRAFT' && (
                <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
                  <button 
                    onClick={() => handleTransition('ACCEPTED')}
                    disabled={transitioning}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {transitioning ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Accept Proposal
                  </button>
                  
                  <button 
                    onClick={() => handleTransition('REJECTED')}
                    disabled={transitioning}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {transitioning ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Reject Proposal
                  </button>
                </div>
              )}

              {campaign.status === 'FUNDED' && (
                <button 
                  onClick={() => handleTransition('SUBMITTED')}
                  disabled={transitioning}
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all mt-6 disabled:opacity-60"
                >
                  {transitioning ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Submit Work / Deliverables
                </button>
              )}

              {campaign.status === 'ACCEPTED' && (
                <div className="text-center text-amber-600 font-medium mt-6 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  Waiting for the Brand to fund and lock the contract.
                </div>
              )}
            </>
          )}

          {isBrand && (
            <div className="flex flex-wrap gap-3 mt-6">
              {campaign.status === 'ACCEPTED' && (
                <MagneticButton
                  type="button"
                  onClick={() => handleTransition('FUNDED')}
                  disabled={transitioning}
                  className="btn-spatial-primary flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {transitioning ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Fund &amp; Lock Contract
                </MagneticButton>
              )}

              {campaign.status === 'SUBMITTED' && (
                <button
                  onClick={() => handleTransition('APPROVED')}
                  disabled={transitioning}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[var(--color-success)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-success)]/25 hover:shadow-[var(--color-success)]/40 transition-all hover:scale-[1.02] disabled:opacity-60"
                >
                  {transitioning ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Approve Campaign
                </button>
              )}

              {campaign.status === 'APPROVED' && (
                <button
                  onClick={() => handleTransition('PAID')}
                  disabled={transitioning}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[var(--color-success)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-success)]/25 hover:shadow-[var(--color-success)]/40 transition-all hover:scale-[1.02] disabled:opacity-60"
                >
                  {transitioning ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                  Generate Invoice &amp; Pay
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Deliverables & Invoice */}
        <div className="space-y-6">
          {/* Deliverables */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">Deliverables</h2>
            <div className="space-y-3">
              {campaign.deliverables?.map((d, i) => (
                <div key={i} className="rounded-xl bg-[var(--color-surface-alt)] p-4 border border-[var(--color-border)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[var(--color-text)]">{d.type}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        d.status === 'APPROVED'
                          ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                          : d.status === 'REJECTED'
                          ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'
                          : d.status === 'PENDING_VERIFICATION'
                          ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">{d.description}</p>
                  {d.submissionUrl && (
                    <a href={d.submissionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-[var(--color-primary)] hover:underline">
                      <Link2 className="h-3 w-3" />
                      View Submission
                    </a>
                  )}

                  {/* Submission input for creators */}
                  {isCreator && d.status === 'PENDING' && campaign.status === 'FUNDED' && (
                    <div className="flex gap-2 mt-3">
                      <input
                        type="url"
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                      />
                      <button
                        onClick={() => handleSubmitDeliverable(d.type)}
                        disabled={submitting}
                        className="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-white hover:shadow-md transition-all disabled:opacity-60"
                      >
                        {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Submit'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contract Hash */}
            {campaign.contractHash && (
              <div className="mt-4 p-3 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)]">
                <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Contract Hash (SHA-256)</p>
                <p className="text-[10px] font-mono text-[var(--color-text-muted)] break-all">{campaign.contractHash}</p>
              </div>
            )}
          </motion.div>

          {/* Invoice (only when PAID) */}
          {campaign.status === 'PAID' && (
            <InvoiceCard
              invoice={
                invoice || {
                  totalAmount: 1000,
                  platformFee: 50,
                  creatorPayout: 950,
                  cryptographicSignature: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                  status: 'PAID',
                }
              }
            />
          )}
        </div>

        {/* Right: Chat */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-[600px]"
        >
          <ChatPanel campaignId={id} />
        </motion.div>
      </div>
    </div>
  );
}
