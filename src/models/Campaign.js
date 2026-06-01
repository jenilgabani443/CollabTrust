import mongoose from 'mongoose';

const deliverableSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Deliverable type is required (e.g. YouTube Video, Instagram Reel)'],
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'PENDING_VERIFICATION', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    submissionUrl: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const campaignSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: {
        values: ['DRAFT', 'ACCEPTED', 'REJECTED', 'FUNDED', 'SUBMITTED', 'APPROVED', 'PAID'],
        message: 'Status must be one of DRAFT, ACCEPTED, REJECTED, FUNDED, SUBMITTED, APPROVED, or PAID',
      },
      default: 'DRAFT',
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Brand reference is required'],
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator reference is required'],
    },
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
    },
    budget: {
      type: Number,
      required: [true, 'Proposed budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    contractHash: {
      type: String,
      default: '',
      trim: true,
    },
    deliverables: {
      type: [deliverableSchema],
      validate: [
        {
          validator: (arr) => arr.length > 0,
          message: 'A campaign must have at least one deliverable.',
        },
      ],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Indexes for fast querying of brand-specific and creator-specific campaigns
campaignSchema.index({ brandId: 1, status: 1 });
campaignSchema.index({ creatorId: 1, status: 1 });

// Post-save hook to automatically generate invoice when campaign status becomes PAID
campaignSchema.post('save', async function (doc) {
  if (doc.status === 'PAID') {
    try {
      const { generateInvoiceForCampaign } = await import('../services/invoiceService.js');
      const totalAmount = doc._totalAmount || 1000;
      await generateInvoiceForCampaign(doc._id, totalAmount);
    } catch (error) {
      console.error('Error automatically generating invoice on campaign PAID status:', error);
    }
  }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
