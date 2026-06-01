import Stripe from 'stripe';
import crypto from 'crypto';
import Campaign from '../models/Campaign.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// Initialize stripe. Default to a dummy key if not set in process.env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

/**
 * Handle incoming Stripe Webhooks.
 * Expects express.raw() body parser middleware to have parsed the request into a raw Buffer.
 */
export const handleStripeWebhook = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  // Verify using STRIPE_SECRET_KEY (or STRIPE_WEBHOOK_SECRET if defined)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_SECRET_KEY;

  if (!sig) {
    return next(new AppError('Stripe signature header is missing.', 400));
  }

  if (!webhookSecret) {
    return next(new AppError('Stripe webhook verification key not configured.', 500));
  }

  let event;
  try {
    // req.body must be a raw Buffer (e.g., via express.raw({ type: 'application/json' }))
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return next(new AppError(`Stripe Webhook Signature Verification Failed: ${err.message}`, 400));
  }

  // Handle payment_intent.succeeded
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const campaignId = paymentIntent.metadata?.campaignId;

    if (!campaignId) {
      return next(new AppError('No campaignId found in payment intent metadata.', 400));
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return next(new AppError(`Campaign with ID ${campaignId} not found.`, 404));
    }

    // Since we're moving from DRAFT to FUNDED, check and populate contractHash if missing
    if (campaign.status === 'DRAFT') {
      const payoutTerms = paymentIntent.metadata?.payoutTerms || 'Standard Payout';
      const payloadToHash = JSON.stringify({
        deliverables: campaign.deliverables,
        payoutTerms,
      });

      // Generate SHA-256 hash
      const hash = crypto.createHash('sha256').update(payloadToHash).digest('hex');
      campaign.contractHash = hash;
    }

    // Update status to FUNDED
    campaign.status = 'FUNDED';
    await campaign.save();
  }

  res.status(200).json({ received: true });
});
