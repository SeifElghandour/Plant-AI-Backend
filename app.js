require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
    origin: ['https://plant-care-gold.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'ngrok-skip-browser-warning'],
    credentials: true
};

app.use(cors(corsOptions));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('System: "uploads" directory created successfully.');
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(uploadDir));

app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/scans', require('./routes/scanRoutes'));

app.get('/', (_req, res) => {
  res.send('PlantCare - Backend API is running...');
});

app.use((err, req, res, next) => {
  if (err.message && err.message.startsWith('CORS blocked')) {
    return res.status(403).json({ message: err.message });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
