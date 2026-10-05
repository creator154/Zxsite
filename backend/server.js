const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Schema Definition
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

// MongoDB Atlas Connection Handling
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected'))
    .catch(err => console.error('DB Connection Error (App will still run):', err));
} else {
  console.log('Warning: MONGO_URI is not set in Heroku Config Vars');
}

// Student Portal API: Get Synced Live Content
app.get('/api/live/:batchId/:type', async (req, res) => {
  const { batchId, type } = req.params;
  try {
    const items = await Test.find({ batchId, type });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database Error' });
  }
});

// Serve React Built Static Files
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Student Portal Server running on port ${PORT}`));
