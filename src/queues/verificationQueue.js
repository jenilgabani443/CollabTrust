import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Setup connection details for Redis
const connectionOpts = {
  url: redisUrl,
};

// Create the verificationQueue
export const verificationQueue = new Queue('verificationQueue', {
  connection: connectionOpts,
});
