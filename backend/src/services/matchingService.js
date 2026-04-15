const Item = require('../models/Item');

const tokenize = (text) =>
  text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

const scoreMatch = (item, candidate) => {
  let score = 0;
  const itemTokens = new Set([...tokenize(item.title), ...tokenize(item.description)]);
  const candidateTokens = [...tokenize(candidate.title), ...tokenize(candidate.description)];
  candidateTokens.forEach((t) => { if (itemTokens.has(t)) score++; });
  if (item.location && candidate.location &&
    (item.location.toLowerCase().includes(candidate.location.toLowerCase()) ||
     candidate.location.toLowerCase().includes(item.location.toLowerCase()))) {
    score += 3;
  }
  return score;
};

const findMatches = async (item) => {
  const oppositeType = item.type === 'lost' ? 'found' : 'lost';
  const candidates = await Item.find({
    type: oppositeType,
    category: item.category,
    status: 'active',
    _id: { $ne: item._id },
  }).lean();

  const scored = candidates
    .map((c) => ({ id: c._id, score: scoreMatch(item, c) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((c) => c.id);

  return scored;
};

module.exports = { findMatches };
