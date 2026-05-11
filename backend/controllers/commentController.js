const Comment            = require('../models/Comment');
const Post               = require('../models/Post');
const { asyncHandler, AppError } = require('../middleware/error');
const { createNotification }     = require('../utils/notify');

// ── Add comment (or reply) ────────────────────────
exports.addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw new AppError('Post not found', 404);

  const { text, parentId } = req.body;
  if (!text?.trim()) throw new AppError('Comment text required', 400);

  const comment = await Comment.create({
    post:   post._id,
    author: req.user._id,
    text:   text.trim(),
    parent: parentId || null,
  });

  if (parentId) {
    // Attach reply to parent comment
    await Comment.findByIdAndUpdate(parentId, { $push: { replies: comment._id } });
    const parentComment = await Comment.findById(parentId);
    await createNotification({ recipient: parentComment.author, sender: req.user._id, type: 'reply', post: post._id, comment: comment._id });
  } else {
    post.comments.push(comment._id);
    await post.save();
    await createNotification({ recipient: post.author, sender: req.user._id, type: 'comment', post: post._id, comment: comment._id });
  }

  await comment.populate('author', 'username avatar');
  res.status(201).json({ success: true, comment });
});

// ── Get comments for a post ───────────────────────
exports.getComments = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip  = (page - 1) * limit;

  const comments = await Comment.find({ post: req.params.postId, parent: null })
    .sort({ createdAt: -1 }).skip(skip).limit(limit)
    .populate('author', 'username avatar verified')
    .populate({ path: 'replies', populate: { path: 'author', select: 'username avatar' } });

  res.json({ success: true, comments });
});

// ── Like / unlike comment ─────────────────────────
exports.toggleLike = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new AppError('Comment not found', 404);

  const liked = comment.likes.includes(req.user._id);
  if (liked) comment.likes.pull(req.user._id);
  else        comment.likes.addToSet(req.user._id);
  await comment.save();
  res.json({ success: true, liked: !liked, likesCount: comment.likes.length });
});

// ── Delete comment ────────────────────────────────
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new AppError('Comment not found', 404);

  const post = await Post.findById(comment.post);
  const isAuthor   = String(comment.author) === String(req.user._id);
  const isPostOwner= post && String(post.author) === String(req.user._id);
  if (!isAuthor && !isPostOwner) throw new AppError('Not authorised', 403);

  if (comment.parent) {
    await Comment.findByIdAndUpdate(comment.parent, { $pull: { replies: comment._id } });
  } else {
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
    await Comment.deleteMany({ parent: comment._id }); // remove replies
  }
  await comment.deleteOne();
  res.json({ success: true, message: 'Comment deleted' });
});