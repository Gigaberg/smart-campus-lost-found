const { validationResult } = require('express-validator');
const Item = require('../models/Item');
const { findMatches } = require('../services/matchingService');

const getItems = async (req, res, next) => {
  try {
    const { type, category, keyword, location, dateFrom, dateTo } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (keyword) filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }
    const items = await Item.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, items });
  } catch (err) { next(err); }
};

const createItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { type, title, description, category, location, date } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const item = await Item.create({
      type, title, description, category, location, date, imageUrl,
      postedBy: req.user._id,
    });
    item.matches = await findMatches(item);
    await item.save();
    await item.populate('postedBy', 'name email');
    res.status(201).json({ success: true, item });
  } catch (err) { next(err); }
};

const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('postedBy', 'name email')
      .populate({ path: 'matches', populate: { path: 'postedBy', select: 'name' } });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (err) { next(err); }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const fields = ['title', 'description', 'category', 'location', 'date'];
    fields.forEach((f) => { if (req.body[f] !== undefined) item[f] = req.body[f]; });
    if (req.file) item.imageUrl = `/uploads/${req.file.filename}`;
    item.matches = await findMatches(item);
    await item.save();
    await item.populate('postedBy', 'name email');
    res.json({ success: true, item });
  } catch (err) { next(err); }
};

const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await item.deleteOne();
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.postedBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    const allowed = item.type === 'lost' ? ['active', 'recovered'] : ['active', 'claimed'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status for this item type' });
    item.status = status;
    await item.save();
    res.json({ success: true, item });
  } catch (err) { next(err); }
};

module.exports = { getItems, createItem, getItemById, updateItem, deleteItem, updateStatus };
