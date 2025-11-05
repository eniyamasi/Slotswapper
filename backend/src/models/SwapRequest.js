const mongoose = require('mongoose');

const swapStatusEnum = ['PENDING', 'ACCEPTED', 'REJECTED'];

const swapRequestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requesterSlotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  responderSlotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: swapStatusEnum,
    default: 'PENDING',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SwapRequest', swapRequestSchema);

