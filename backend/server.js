const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const axios = require('axios'); // Agar axios installed nahi hai toh root package.json me add kar lena
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

// --- BATCHES API PROXY ROUTE ---
app.get('/api/batches', async (req, res) => {
    try {
        const pwToken = process.env.PW_JWT_TOKEN;
        if (!pwToken) {
            return res.status(500).json({ error: 'PW_JWT_TOKEN is missing in environment variables' });
        }

        // PW / Quizard live batches endpoint
        const response = await axios.get('https://api.penpencil.xyz/v1/batches/active', {
            headers: {
                'authorization': `Bearer ${pwToken}`,
                'client-id': '5eb33869ec53d00018512b9d' // standard penpencil client id
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching batches:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch live batches from PW' });
    }
});

// Test API Route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working fine!' });
});

// Frontend Build Static Path
const frontendPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
