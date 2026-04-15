const { validationResult } = require('express-validator');
const Message = require('../models/Message');
const Item = require('../models/Item');

const sendMessage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { itemId, body } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.postedBy.toString() === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'Cannot message yourself' });

    const message = await Message.create({
      itemId, body, sender: req.user._id, recipient: item.postedBy,
    });
    await message.populate('sender', 'name email');
    res.status(201).json({ success: true, message });
  } catch (err) { next(err); }
};

const getInbox = async (req, res, next) => {
  try {
    const messages = await Message.find({ recipient: req.user._id })
      .populate('sender', 'name email')
      .populate('itemId', 'title type')
      .sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) { next(err); }
};

const markRead = async (req, res, next) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    if (msg.recipient.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    msg.read = true;
    await msg.save();
    res.json({ success: true, message: msg });
  } catch (err) { next(err); }
};

module.exports = { sendMessage, getInbox, markRead };
