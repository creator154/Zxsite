const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  batchName: { type: String },
  type: { type: String, enum: ['test', 'dpp'], required: true },
  title: { type: String, required: true },
  totalQuestions: { type: Number, default: 0 },
  questions: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', TestSchema);
￼Enter
