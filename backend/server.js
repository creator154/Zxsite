const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend static files serve karne ke liye
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection (MongoDB example)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Database Connected Successfully!'))
.catch(err => console.error('DB Connection Error:', err));

// Example API Route
app.use('/api/auth', require('./routes/authRoutes')); // Login/Admin routes
app.use('/api/batches', require('./routes/batchRoutes')); // Test series & DPP routes

// Fallback to index.html for frontend routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
