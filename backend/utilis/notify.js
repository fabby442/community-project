const Notification = require('../models/Notification');

/**
 * Creates a notification (silently ignores duplicate-key errors).
 */
const createNotification = async ({ recipient, sender, type, post = null, comment = null }) => {
  if (String(recipient) === String(sender)) return; // no self-notifications
  try {
    await Notification.create({ recipient, sender, type, post, comment });
  } catch (err) {
    if (err.code !== 11000) console.error('Notification error:', err.message);
  }
};

module.exports = { createNotification };