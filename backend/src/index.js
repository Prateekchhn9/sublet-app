const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'workwithme-backend', time: new Date().toISOString() });
});

// Placeholder route: later we will add listings, auth, etc.
app.get('/api/info', (req, res) => {
  res.json({
    name: 'WorkWithMe',
    version: '0.0.1',
    message: 'Backend skeleton is running'
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`WorkWithMe backend running on port ${PORT}`);
});

