import Analytics from '../models/Analytics.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

/**
 * Simulates fetching real metrics from the YouTube Data API and upserts
 * the data into the Analytics collection for the current month.
 * 
 * @param {string} creatorId - The ID of the creator
 * @returns {Promise<Object>} The updated analytics document
 */
export const fetchAndSyncYoutubeMetrics = async (creatorId) => {
  // 1. Verify creator exists
  const creator = await User.findById(creatorId);
  if (!creator) {
    throw new AppError('Creator not found', 404);
  }

  // 2. Generate a simulated view count (between 1000 and 15000 views)
  // and videos published (20% chance of publishing 1 video)
  const simulatedViews = Math.floor(Math.random() * 14000) + 1000;
  const simulatedVideos = Math.random() > 0.8 ? 1 : 0;

  // 3. Determine the start of the current month and the current day
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const dayOfMonth = now.getDate();

  // 4. Find the analytics document for the current month or initialize a new one
  let analytics = await Analytics.findOne({ creatorId, month: startOfMonth });

  if (!analytics) {
    analytics = new Analytics({
      creatorId,
      month: startOfMonth,
      dailyMetrics: [],
    });
  }

  // 5. Find or create the daily metrics entry for the current day
  const existingDayIndex = analytics.dailyMetrics.findIndex(
    (metric) => metric.day === dayOfMonth
  );

  if (existingDayIndex !== -1) {
    // Accumulate views and videos published for the day
    analytics.dailyMetrics[existingDayIndex].views += simulatedViews;
    analytics.dailyMetrics[existingDayIndex].videosPublished += simulatedVideos;
  } else {
    // Add a new daily metrics entry
    analytics.dailyMetrics.push({
      day: dayOfMonth,
      views: simulatedViews,
      videosPublished: simulatedVideos,
    });
  }

  // 6. Save the document (pre-save hook will automatically recalculate totalViews and videoCount)
  await analytics.save();

  return analytics;
};
