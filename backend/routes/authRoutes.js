// routes/auth.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', ctrl.register);
router.post('/login',    ctrl.login);
router.post('/refresh',  ctrl.refresh);
router.post('/logout',   protect, ctrl.logout);
router.get('/me',        protect, ctrl.me);

module.exports = router;