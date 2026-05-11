const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/userController');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');

router.get('/search',              optionalAuth, ctrl.searchUsers);
router.get('/suggested',           protect,      ctrl.suggested);
router.get('/:username',           optionalAuth, ctrl.getProfile);
router.get('/:username/posts',     optionalAuth, ctrl.getUserPosts);
router.get('/:username/followers', optionalAuth, ctrl.getFollowers);
router.get('/:username/following', optionalAuth, ctrl.getFollowing);
router.get('/me/saved',            protect,      ctrl.getSaved);
router.put('/me',                  protect, uploadAvatar.single('avatar'), ctrl.updateProfile);
router.post('/:id/follow',         protect, ctrl.toggleFollow);

module.exports = router;