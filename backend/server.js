const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

// Mongoose Schema
const TestSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  batchName: { type: String },
  type: { type: String, enum: ['test', 'dpp'], required: true },
  title: { type: String, required: true },
  totalQuestions: { type: Number, default: 0 },
  questions: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);

// MongoDB Atlas Connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected'))
    .catch(err => console.error('DB Connection Error:', err));
}

// Routes
app.get('/', (req, res) => {
  res.send('PW Quiz Portal Backend Engine is Live!');
});

app.post('/api/uploader/batches', async (req, res) => {
  const { authToken } = req.body;
  if (!authToken) return res.status(400).json({ success: false, message: 'Token required' });

  try {
    const response = await axios.get('https://api.penpencil.co/v3/batches/my-batches', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    res.json({ success: true, batches: response.data.data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'PW API Error' });
  }
});

app.post('/api/uploader/content', async (req, res) => {
  const { authToken, batchId, type } = req.body;
  try {
    const endpoint = type === 'dpps' 
      ? `https://api.penpencil.co/v2/batches/${batchId}/dpps`
      : `https://api.penpencil.co/v2/batches/${batchId}/tests`;

    const response = await axios.get(endpoint, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    res.json({ success: true, items: response.data.data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Fetch Failed' });
  }
});

app.post('/api/uploader/sync', async (req, res) => {
  const { batchId, batchName, type, title, questions } = req.body;
  try {
    const newEntry = new Test({
      batchId,
      batchName,
      type: type === 'dpps' ? 'dpp' : 'test',
      title,
      totalQuestions: questions ? questions.length : 0,
      questions: questions || []
    });
    await newEntry.save();
    res.json({ success: true, message: 'Synced successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database Save Error' });
  }
});

app.get('/api/uploader/live/:batchId/:type', async (req, res) => {
  const { batchId, type } = req.params;
  try {
    const items = await Test.find({ batchId, type });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database Query Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
