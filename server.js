const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
// Note: Isme aap apni MongoDB Atlas ki live database string connect karenge
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zx_master_db";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Zx Student Portal connected to Master Database ✅"))
    .catch(err => console.error("Database Connection Error:", err));

// Test Database Structure
const ZxTestSchema = new mongoose.Schema({
    targetBatch: String,
    testTitle: String,
    totalQuestions: Number,
    testDuration: Number,
    examDate: String,
    questions: Array
});
const ZxTest = mongoose.model('ZxTest', ZxTestSchema, 'zxtests');

// API: Batches search karne ke liye (PW Style dropdown filter)
app.get('/api/student/search-batches', async (req, res) => {
    try {
        const query = req.query.q || "";
        const tests = await ZxTest.find({ targetBatch: { regex: query, options: 'i' } });
        const uniqueBatches = [...new Set(tests.map(t => t.targetBatch))];
        res.json({ success: true, batches: uniqueBatches });
    } catch (error) {
        res.status(500).json({ error: "Failed to search batches" });
    }
});

// API: Kisi selected batch ke saare available tests load karna
app.get('/api/student/get-tests', async (req, res) => {
    try {
        const batchName = req.query.batch;
        if (!batchName) return res.status(400).json({ error: "Batch name is required" });
        
        // Security: Test start hone se pehle questions hide rakhenge (-questions)
        const testList = await ZxTest.find({ targetBatch: batchName }).select('-questions');
        res.json({ success: true, testSeriesList: testList });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tests" });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Student Portal live on port ${PORT}`));
