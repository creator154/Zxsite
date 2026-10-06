const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// Database Connection with error handling so it doesn't crash app
mongoose.connect(MONGO_URI)
  .then(() => console.log('Database Connected Successfully!'))
  .catch((err) => console.error('Database connection error:', err));

// --- SAFE BATCHES API PROXY ROUTE ---
app.get('/api/batches', async (req, res) => {
    try {
        const pwToken = process.env.PW_JWT_TOKEN;
        if (!pwToken) {
            return res.status(400).json({ success: false, message: 'PW_JWT_TOKEN missing in config vars' });
        }

        const response = await fetch('https://api.penpencil.xyz/v1/batches/active', {
            headers: {
                'authorization': `Bearer ${pwToken}`,
                'client-id': '5eb33869ec53d00018512b9d',
                'client-type': 'WEB',
                'user-agent': 'Mozilla/5.0'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch batches safely' });
    }
});

// Test API Route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working fine!' });
});

// Frontend Build Static Path
const frontendPath = path.join(process.cwd(), 'frontend/build');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
