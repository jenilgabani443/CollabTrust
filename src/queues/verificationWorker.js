import { Worker } from 'bullmq';
import mongoose from 'mongoose';
import Campaign from '../models/Campaign.js';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Setup connection details for Redis
const connectionOpts = {
  url: redisUrl,
};

// Initialize the worker to process jobs from the verificationQueue
export const verificationWorker = new Worker(
  'verificationQueue',
  async (job) => {
    const { campaignId, type, url } = job.data;
    console.log(`[Worker] Processing verification job ${job.id} for campaign ${campaignId}, type ${type}, URL: ${url}`);

    // 1. Simulate calling an external API for verification (3-second delay)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 2. Validate URL structure and randomly simulate success (85% success rate for valid URLs)
    const isValidUrl = url.startsWith('http://') || url.startsWith('https://');
    const resultStatus = isValidUrl && Math.random() > 0.15 ? 'VERIFIED' : 'FAILED';

    console.log(`[Worker] Verification result for job ${job.id}: ${resultStatus}`);

    // 3. Update the campaign deliverable status in MongoDB
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      console.warn(`[Worker] Campaign ${campaignId} not found.`);
      return { status: 'CAMPAIGN_NOT_FOUND' };
    }

    const deliverable = campaign.deliverables.find((d) => d.type === type);
    if (!deliverable) {
      console.warn(`[Worker] Deliverable of type ${type} not found in Campaign ${campaignId}.`);
      return { status: 'DELIVERABLE_NOT_FOUND' };
    }

    // Set status to APPROVED on success, or REJECTED on failure
    deliverable.status = resultStatus === 'VERIFIED' ? 'APPROVED' : 'REJECTED';
    await campaign.save();

    console.log(`[Worker] Campaign ${campaignId} deliverable ${type} status updated to ${deliverable.status}.`);
    return { status: resultStatus };
  },
  {
    connection: connectionOpts,
  }
);

verificationWorker.on('completed', (job, result) => {
  console.log(`[Worker] Job ${job.id} completed successfully. Result:`, result);
});

verificationWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job.id} failed:`, err);
});
