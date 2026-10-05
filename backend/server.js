const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());

// PW Live Batches Endpoint
app.get('/api/pw-batches', async (req, res) => {
  try {
    const response = await axios.get('https://api.penpencil.co/v3/batches?mode=1&page=1', {
      headers: {
        'Authorization': `Bearer ${process.env.PW_JWT_TOKEN || ''}`,
        'client-id': '5eb393ee95edd40d3239d659'
      }
    });
    res.json({ success: true, batches: response.data.data });
  } catch (error) {
    console.error('PW API Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'PW API Fetch Failed' });
  }
});

// Serve React Frontend Build
const buildPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send("Build not found. Run 'npm run build' inside frontend.");
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
