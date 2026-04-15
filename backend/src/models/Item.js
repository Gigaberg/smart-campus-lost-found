const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ['active', 'recovered', 'claimed'], default: 'active' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
