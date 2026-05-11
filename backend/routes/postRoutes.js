const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// CREATE POST WITH IMAGE
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.create({
      user: req.user._id,
      text: req.body.text,
      image: req.file ? req.file.path : null,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET FEED
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;