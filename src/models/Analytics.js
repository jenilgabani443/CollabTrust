import mongoose from 'mongoose';

const dailyMetricSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: [1, 'Day must be at least 1'],
      max: [31, 'Day cannot exceed 31'],
    },
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative'],
    },
    videosPublished: {
      type: Number,
      default: 0,
      min: [0, 'Video count cannot be negative'],
    },
  },
  { _id: false }
);

const analyticsSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator reference is required'],
    },
    month: {
      type: Date,
      required: [true, 'Month date is required'],
    },
    totalViews: {
      type: Number,
      default: 0,
      min: [0, 'Total views cannot be negative'],
    },
    videoCount: {
      type: Number,
      default: 0,
      min: [0, 'Video count cannot be negative'],
    },
    dailyMetrics: [dailyMetricSchema],
  },
  {
    timestamps: true,
  }
);

// Create compound index for fast lookups on creator & month combinations, ensuring uniqueness per bucket
analyticsSchema.index({ creatorId: 1, month: 1 }, { unique: true });

// Pre-save hook to calculate aggregates (totalViews, videoCount) from the dailyMetrics array
analyticsSchema.pre('save', function (next) {
  if (this.dailyMetrics && this.dailyMetrics.length > 0) {
    this.totalViews = this.dailyMetrics.reduce((sum, metric) => sum + (metric.views || 0), 0);
    this.videoCount = this.dailyMetrics.reduce((sum, metric) => sum + (metric.videosPublished || 0), 0);
  }
  next();
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
