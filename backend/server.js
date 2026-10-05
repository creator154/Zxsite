// PW Batches Live Fetch Route
app.get('/api/pw-batches', async (req, res) => {
  try {
    const response = await axios.get('https://api.penpencil.co/v3/batches?mode=1&page=1', {
      headers: {
        'Authorization': `Bearer ${process.env.PW_JWT_TOKEN}`,
        'client-id': '5eb393ee95edd40d3239d659'
      }
    });
    res.json({ success: true, batches: response.data.data });
  } catch (error) {
    console.error('PW API Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'PW API Fetch Failed' });
  }
});
