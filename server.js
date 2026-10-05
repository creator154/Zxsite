const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection (Apna URI dalein)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quizard')
  .then(() => console.log('Database Connected Successfully'))
  .catch(err => console.log('DB Connection Error:', err));

// Schema for Batches & Tests
const testSchema = new mongoose.Schema({
  batchName: String,
  testTitle: String,
  questionsCount: Number,
  date: String,
  startTime: String,
  status: { type: String, default: 'Pending' }
});

const Test = mongoose.model('Test', testSchema);

// API for Students to fetch available tests
app.get('/api/tests/:batchName', async (req, res) => {
  try {
    const tests = await Test.find({ batchName: req.params.batchName });
    res.json({ success: true, tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Student App Server running on port ${PORT}`));
