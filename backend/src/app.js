const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const messageRoutes = require('./routes/messages');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/messages', messageRoutes);

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuild = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendBuild));
  // All non-API routes go to React
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

module.exports = app;
