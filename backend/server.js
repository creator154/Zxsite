const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// PW Official Batches Live Sync Endpoint
app.get('/api/pw-batches', async (req, res) => {
  const rawToken = process.env.PW_JWT_TOKEN || '';
  const cleanToken = rawToken.replace(/^Bearer\s+/i, '').trim();

  if (!cleanToken) {
    return res.status(400).json({ success: false, message: 'PW_JWT_TOKEN Missing in Heroku' });
  }

  const headers = {
    'Authorization': `Bearer ${cleanToken}`,
    'client-id': '5eb393ee95edd40d3239d659',
    'randomId': '3b890a59-3df2-47d9-9523-2868efcb9287',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json, text/plain, */*'
  };

  // Try fetching directly from PW live endpoints
  try {
    let response = await axios.get('https://api.penpencil.co/v3/batches/search?page=1&mode=1', { headers });
    let batchList = response.data?.data || [];

    if (!Array.isArray(batchList) || batchList.length === 0) {
      response = await axios.get('https://api.penpencil.co/v2/batches/my-batches?page=1', { headers });
      batchList = response.data?.data || [];
    }

    return res.json({ success: true, batches: batchList });
  } catch (error) {
    console.error('PW API Error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, error: 'PW API Auth/Fetch Failed' });
  }
});

// Dynamic Tests/DPPs Live Sync Endpoint
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

// Serve React Frontend
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
