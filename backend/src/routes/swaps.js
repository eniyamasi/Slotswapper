const express = require('express');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all swappable slots from other users
router.get('/swappable-slots', auth, async (req, res) => {
  try {
    const slots = await Event.find({
      status: 'SWAPPABLE',
      userId: { $ne: req.user._id }
    })
    .populate('userId', 'name email')
    .sort({ startTime: 1 });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a swap request
router.post('/swap-request', auth, async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;

    if (!mySlotId || !theirSlotId) {
      return res.status(400).json({ error: 'Both slot IDs are required' });
    }

    // Get both slots
    const mySlot = await Event.findOne({ _id: mySlotId, userId: req.user._id });
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot) {
      return res.status(404).json({ error: 'One or both slots not found' });
    }

    if (mySlot.userId.toString() === theirSlot.userId.toString()) {
      return res.status(400).json({ error: 'Cannot swap with yourself' });
    }

    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ error: 'Both slots must be SWAPPABLE' });
    }

    // Check for existing pending swap requests involving these slots
    const existingRequest = await SwapRequest.findOne({
      $or: [
        { requesterSlotId: mySlotId, status: 'PENDING' },
        { responderSlotId: mySlotId, status: 'PENDING' },
        { requesterSlotId: theirSlotId, status: 'PENDING' },
        { responderSlotId: theirSlotId, status: 'PENDING' }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'One or both slots are already involved in a pending swap' });
    }

    // Update both slots to SWAP_PENDING
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save();
    await theirSlot.save();

    // Create swap request
    const swapRequest = new SwapRequest({
      requesterId: req.user._id,
      responderId: theirSlot.userId,
      requesterSlotId: mySlotId,
      responderSlotId: theirSlotId,
      status: 'PENDING'
    });

    await swapRequest.save();

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Respond to a swap request
router.post('/swap-response/:requestId', auth, async (req, res) => {
  try {
    const { accepted } = req.body;
    const swapRequest = await SwapRequest.findById(req.params.requestId)
      .populate('requesterSlotId')
      .populate('responderSlotId');

    if (!swapRequest) {
      return res.status(404).json({ error: 'Swap request not found' });
    }

    if (swapRequest.responderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to respond to this request' });
    }

    if (swapRequest.status !== 'PENDING') {
      return res.status(400).json({ error: 'Swap request is not pending' });
    }

    if (accepted) {
      // ACCEPTED: Swap the owners
      const requesterSlot = swapRequest.requesterSlotId;
      const responderSlot = swapRequest.responderSlotId;

      // Swap the userIds
      const tempUserId = requesterSlot.userId;
      requesterSlot.userId = responderSlot.userId;
      responderSlot.userId = tempUserId;

      // Set both slots back to BUSY
      requesterSlot.status = 'BUSY';
      responderSlot.status = 'BUSY';

      await requesterSlot.save();
      await responderSlot.save();

      swapRequest.status = 'ACCEPTED';
      await swapRequest.save();

      res.json({ message: 'Swap accepted', swapRequest });
    } else {
      // REJECTED: Set slots back to SWAPPABLE
      swapRequest.requesterSlotId.status = 'SWAPPABLE';
      swapRequest.responderSlotId.status = 'SWAPPABLE';

      await swapRequest.requesterSlotId.save();
      await swapRequest.responderSlotId.save();

      swapRequest.status = 'REJECTED';
      await swapRequest.save();

      res.json({ message: 'Swap rejected', swapRequest });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get incoming swap requests
router.get('/incoming-requests', auth, async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      responderId: req.user._id,
      status: 'PENDING'
    })
    .populate('requesterId', 'name email')
    .populate('requesterSlotId')
    .populate('responderSlotId')
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get outgoing swap requests
router.get('/outgoing-requests', auth, async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      requesterId: req.user._id
    })
    .populate('responderId', 'name email')
    .populate('requesterSlotId')
    .populate('responderSlotId')
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

