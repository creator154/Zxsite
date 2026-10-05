const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Multi-fallback PW Batches Proxy Endpoint
app.get('/api/pw-batches', async (req, res) => {
  const rawToken = process.env.PW_JWT_TOKEN || '';
  const cleanToken = rawToken.replace(/^Bearer\s+/i, '').trim();

  if (!cleanToken) {
    return res.status(400).json({ success: false, message: 'PW_JWT_TOKEN missing' });
  }

  const headers = {
    'Authorization': `Bearer ${cleanToken}`,
    'client-id': '5eb393ee95edd40d3239d659',
    'randomId': '3b890a59-3df2-47d9-9523-2868efcb9287',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json, text/plain, */*'
  };

  // Try fetching from primary & secondary PW endpoints
  const endpoints = [
    'https://api.penpencil.co/v2/batches/my-batches?mode=1&page=1',
    'https://api.penpencil.co/v3/batches?mode=1&page=1',
    'https://api.penpencil.co/v2/batches/search?mode=1&page=1'
  ];

  for (const url of endpoints) {
    try {
      const response = await axios.get(url, { headers, timeout: 8000 });
      const rawData = response.data?.data || response.data;
      if (Array.isArray(rawData) && rawData.length > 0) {
        return res.json({ success: true, batches: rawData });
      }
    } catch (err) {
      console.log(`Endpoint ${url} failed with status:`, err.response?.status || err.message);
    }
  }

  // Fallback response if PW API returns empty array or token expired
  res.json({ success: false, message: 'Could not fetch live batches. Token might be expired.' });
});

// Dynamic Batch Content (Mock Tests / DPPs) Proxy
app.get('/api/live/:batchId/:type', async (req, res) => {
  const { batchId, type } = req.params;
  const rawToken = process.env.PW_JWT_TOKEN || '';
  const cleanToken = rawToken.replace(/^Bearer\s+/i, '').trim();

  const headers = {
    'Authorization': `Bearer ${cleanToken}`,
    'client-id': '5eb393ee95edd40d3239d659',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  };

  const endpoint = type === 'dpp'
    ? `https://api.penpencil.co/v3/batches/${batchId}/dpps`
    : `https://api.penpencil.co/v3/batches/${batchId}/subject/tests`;

  try {
    const response = await axios.get(endpoint, { headers });
    res.json({ success: true, items: response.data?.data || [] });
  } catch (error) {
    res.json({ success: true, items: [] });
  }
});

// Serve Frontend Build
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
