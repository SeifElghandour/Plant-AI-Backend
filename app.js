const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount Routers
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/scans', require('./routes/scanRoutes'));


app.get('/', (req, res) => {
    res.send('API is running successfully!');
});
// ----------------------------------------

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});