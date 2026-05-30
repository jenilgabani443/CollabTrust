import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign reference is required'],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender reference is required'],
    },
    text: {
      type: String,
      required: [true, 'Message text content cannot be empty'],
      trim: true,
    },
    isRedacted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Captures sent and received times
  }
);

// Indexes for fast ordering and campaign chat lookup
messageSchema.index({ campaignId: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
