import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign reference is required'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0.01, 'Total amount must be greater than zero'],
    },
    platformFee: {
      type: Number,
      default: 0,
      min: [0, 'Platform fee cannot be negative'],
    },
    creatorPayout: {
      type: Number,
      default: 0,
      min: [0, 'Creator payout cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['UNPAID', 'PAID', 'VOID'],
        message: 'Status must be either UNPAID, PAID, or VOID',
      },
      default: 'UNPAID',
    },
    cryptographicSignature: {
      type: String,
      required: [true, 'Cryptographic signature is required for financial auditing integrity'],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Pre-save hook to ensure platform fee (5%) and creator payout (95%) are correctly computed and match totalAmount
invoiceSchema.pre('save', function (next) {
  if (this.isModified('totalAmount')) {
    // Round to 2 decimal places to avoid standard floating-point arithmetic quirks
    this.platformFee = Math.round(this.totalAmount * 0.05 * 100) / 100;
    this.creatorPayout = Math.round(this.totalAmount * 0.95 * 100) / 100;
  }
});

// Indexes for looking up invoices by campaign
invoiceSchema.index({ campaignId: 1 });
invoiceSchema.index({ status: 1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
