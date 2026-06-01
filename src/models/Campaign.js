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
        values: ['DRAFT', 'FUNDED', 'SUBMITTED', 'APPROVED', 'PAID'],
        message: 'Status must be one of DRAFT, FUNDED, SUBMITTED, APPROVED, or PAID',
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
    contractHash: {
      type: String,
      required: [true, 'Cryptographic contract hash signature is required'],
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
