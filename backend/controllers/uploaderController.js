const axios = require('axios');
const Test = require('../models/Test');

exports.getBatches = async (req, res) => {
  const { authToken } = req.body;
  if (!authToken) return res.status(400).json({ success: false, message: 'Token required' });

  try {
    const response = await axios.get('https://api.penpencil.co/v3/batches/my-batches', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    res.json({ success: true, batches: response.data.data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch batches from PW API' });
  }
};

exports.getBatchContent = async (req, res) => {
  const { authToken, batchId, type } = req.body; // type = 'tests' or 'dpps'

  try {
    const endpoint = type === 'dpps' 
      ? `https://api.penpencil.co/v2/batches/${batchId}/dpps`
      : `https://api.penpencil.co/v2/batches/${batchId}/tests`;

    const response = await axios.get(endpoint, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    res.json({ success: true, items: response.data.data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch items' });
  }
};

exports.syncToDatabase = async (req, res) => {
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
    res.json({ success: true, message: 'Item live sync successful!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database save error' });
  }
};

exports.getLiveContent = async (req, res) => {
  const { batchId, type } = req.params;
  try {
    const items = await Test.find({ batchId, type });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving live items' });
  }
};
