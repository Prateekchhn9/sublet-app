const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');  // PostgreSQL client

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: 'dev-us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'workwith',
  user: 'admin',
  password: 'Sum' // CHANGE TO A STRONG PASSWORD,
});

// Test DB connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('✅ Connected to PostgreSQL:', res.rows[0]);
  }
});

// Health check (includes DB)
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({ 
      status: 'ok', 
      service: 'workwithme-backend', 
      db: 'connected',
      time: new Date().toISOString() 
    });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'failed' });
  }
});

// API info
app.get('/api/info', (req, res) => {
  res.json({
    name: 'WorkWithMe',
    version: '0.1.0',
    features: ['PostgreSQL connected', 'Ready for auth/listings']
  });
});

// Initialize database tables
app.post('/api/init-db', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(255),
        city VARCHAR(100),
        price INTEGER,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    res.json({ status: 'success', message: 'Tables created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 WorkWithMe backend running on port ${PORT}`);
  console.log(`📊 Database: dev-workwithme-db.ctowkuk0eokr.us-east-1.rds.amazonaws.com`);
});
