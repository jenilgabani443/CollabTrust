import crypto from 'crypto';
import Campaign from '../models/Campaign.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { verificationQueue } from '../queues/verificationQueue.js';

// Strict state machine transitions definition
const VALID_TRANSITIONS = {
  DRAFT: ['FUNDED'],
  FUNDED: ['SUBMITTED'],
  SUBMITTED: ['APPROVED'],
  APPROVED: ['PAID'],
  PAID: [], // Terminal state
};

/**
 * Controller to handle status transition for a Campaign.
 * Enforces state machine and generates cryptographic hash on DRAFT -> FUNDED.
 */
export const transitionCampaignStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status: nextStatus, payoutTerms } = req.body;

  // 1. Fetch the campaign
  const campaign = await Campaign.findById(id);
  if (!campaign) {
    return next(new AppError('Campaign not found', 404));
  }

  const currentStatus = campaign.status;

  // 2. Validate that status input is provided
  if (!nextStatus) {
    return next(new AppError('Next status must be provided in request body.', 400));
  }

  // 3. Enforce strict state machine transitions
  const allowedNext = VALID_TRANSITIONS[currentStatus];
  if (!allowedNext || !allowedNext.includes(nextStatus)) {
    return next(
      new AppError(
        `Invalid status transition: Cannot transition campaign from ${currentStatus} to ${nextStatus}.`,
        400
      )
    );
  }

  // 4. Implement specific transition logic: DRAFT -> FUNDED
  if (currentStatus === 'DRAFT' && nextStatus === 'FUNDED') {
    if (!payoutTerms) {
      return next(
        new AppError('Payout terms (payoutTerms) must be provided in the request body to transition from DRAFT to FUNDED.', 400)
      );
    }

    // Stringify deliverables and payout terms
    const payloadToHash = JSON.stringify({
      deliverables: campaign.deliverables,
      payoutTerms,
    });

    // Generate SHA-256 hash using Node's native crypto module
    const hash = crypto.createHash('sha256').update(payloadToHash).digest('hex');

    // Save to contractHash field to prevent post-agreement tampering
    campaign.contractHash = hash;
  }

  // 5. Update status and save
  campaign.status = nextStatus;
  
  if (nextStatus === 'PAID') {
    campaign._totalAmount = req.body.totalAmount || 1000;
  }

  await campaign.save();

  res.status(200).json({
    status: 'success',
    data: {
      campaign,
    },
  });
});

/**
 * Controller to handle creator submitting a content URL for a campaign deliverable.
 * Transitions deliverable status to PENDING_VERIFICATION and queues a verification job.
 */
export const submitDeliverableUrl = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { submissionUrl, type } = req.body;

  if (!submissionUrl || !type) {
    return next(new AppError('submissionUrl and deliverable type are required.', 400));
  }

  const campaign = await Campaign.findById(id);
  if (!campaign) {
    return next(new AppError('Campaign not found.', 404));
  }

  // Find the specific deliverable in the deliverables array
  const deliverable = campaign.deliverables.find((d) => d.type === type);
  if (!deliverable) {
    return next(
      new AppError(`Deliverable of type "${type}" not found in this campaign.`, 404)
    );
  }

  // Update status and save URL
  deliverable.status = 'PENDING_VERIFICATION';
  deliverable.submissionUrl = submissionUrl;

  await campaign.save();

  // Push job to verificationQueue
  await verificationQueue.add('verify_url', {
    campaignId: campaign._id.toString(),
    type,
    url: submissionUrl,
  });

  res.status(200).json({
    status: 'success',
    message: 'Deliverable URL submitted successfully. Verification is pending in the background.',
    data: {
      campaign,
    },
  });
});
