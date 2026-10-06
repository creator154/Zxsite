const express = require('express');
const mongoose =кновен = require('mongoose'); // mongoose
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('Database Connected Successfully!'))
  .catch((err) => console.error('Database connection error:', err));

// API test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working fine!' });
});

// Static files path from backend folder
const frontendPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
