import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Antique Bidding API Server is running!' });
});

// Auth routes placeholder
app.get('/api/auth/me', (req, res) => {
  res.status(401).json({ message: 'Unauthorized' });
});

app.post('/api/auth/login', (req, res) => {
  res.status(400).json({ message: 'Login endpoint not implemented yet' });
});

app.post('/api/auth/register', (req, res) => {
  res.status(400).json({ message: 'Registration endpoint not implemented yet' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5173`);
  console.log(`🔧 API URL: http://localhost:${PORT}`);
});