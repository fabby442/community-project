const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/authMiddleware");

// send message
router.post("/", protect, async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.user._id,
      receiver: req.body.receiverId,
      text: req.body.text,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get conversation between 2 users
router.get("/:userId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;