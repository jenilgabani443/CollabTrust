import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

/**
 * Endpoint to discover creators using a MongoDB Aggregation Pipeline.
 * Filters by location, niche, role, and aggregates total/all-time views and videos.
 */
export const discoverCreators = catchAsync(async (req, res, next) => {
  const { location, niche, sortBy, timeframe = 'year', limit = 10, page = 1 } = req.query;

  // 1) Build the initial match stage dynamically to filter creators
  const matchStage = { role: 'Creator' };

  if (location) {
    matchStage['profileDetails.location'] = { $regex: location.trim(), $options: 'i' };
  }

  if (niche) {
    matchStage['profileDetails.niche'] = { $regex: niche.trim(), $options: 'i' };
  }

  // Calculate start/end dates for the requested timeframe
  const now = new Date();
  let startDate;
  let endDate;

  if (timeframe === 'month') {
    // Last month: Start of previous month to the end of previous month
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  } else {
    // Default to last year: Start of 12 months ago to the end of the previous month
    startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  }

  // 2) Parse pagination parameters
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const parsedPage = Math.max(1, parseInt(page, 10));
  const skipStage = (parsedPage - 1) * parsedLimit;

  // 3) Determine sorting strategy
  let sortStage = { createdAt: -1 };
  if (sortBy === 'relevance') {
    sortStage = { historicalRelevance: -1 };
  } else if (sortBy === 'views') {
    sortStage = { totalViewsTimeframe: -1 };
  } else if (sortBy === 'videos') {
    sortStage = { totalVideosTimeframe: -1 };
  }

  // 4) Execute aggregation pipeline
  const pipeline = [
    // Step 1: Match users based on criteria (role, location, niche)
    { $match: matchStage },

    // Step 2: Join with Analytics collection for the specified timeframe
    {
      $lookup: {
        from: 'analytics',
        let: { creatorId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$creatorId', '$$creatorId'] },
                  { $gte: ['$month', startDate] },
                  { $lte: ['$month', endDate] }
                ]
              }
            }
          }
        ],
        as: 'analyticsData',
      },
    },

    // Step 3: Add fields calculating timeframe aggregates
    {
      $addFields: {
        totalViewsTimeframe: { $sum: '$analyticsData.totalViews' },
        totalVideosTimeframe: { $sum: '$analyticsData.videoCount' },
      },
    },

    // Step 4: Calculate historical relevance (average views: totalViews divided by videoCount)
    {
      $addFields: {
        historicalRelevance: {
          $cond: {
            if: { $gt: ['$totalVideosTimeframe', 0] },
            then: { $divide: ['$totalViewsTimeframe', '$totalVideosTimeframe'] },
            else: 0
          }
        }
      }
    },

    // Step 5: Sort
    { $sort: sortStage },

    // Step 6: Pagination
    { $skip: skipStage },
    { $limit: parsedLimit },

    // Step 7: Project/format the returned fields
    {
      $project: {
        passwordHash: 0,
        __v: 0,
        analyticsData: 0, // Exclude the raw joined array
      },
    },
  ];

  const creators = await User.aggregate(pipeline);

  // Retrieve total count for metadata
  const totalCount = await User.countDocuments(matchStage);

  res.status(200).json({
    status: 'success',
    results: creators.length,
    pagination: {
      total: totalCount,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(totalCount / parsedLimit),
    },
    data: {
      creators,
    },
  });
});
