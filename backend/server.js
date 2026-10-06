
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend static files serve karne ke liye
app.use(express.static(path.join(__dirname, '../public'))); 

// Database Connection
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Database Connected Successfully!'))
        .catch(err => console.error('DB Connection Error:', err));
} else {
    console.log('MONGO_URI environment variable is missing.');
}

// API Routes with fallback safety check
try {
    app.use('/api/auth', require('./routes/authRoutes'));
} catch (e) {
    console.error('Failed to load authRoutes:', e.message);
}

try {
    app.use('/api/batches', require('./routes/batchRoutes'));
} catch (e) {
    console.error('Failed to load batchRoutes:', e.message);
}

// Fallback for frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
