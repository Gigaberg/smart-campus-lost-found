const express = require('express');
const { body } = require('express-validator');
const { sendMessage, getInbox, markRead } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, [
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('body').notEmpty().withMessage('Message body is required'),
], sendMessage);

router.get('/inbox', protect, getInbox);
router.patch('/:id/read', protect, markRead);

module.exports = router;
