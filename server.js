const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Heroku dynamically port allot karta hai, isliye process.env.PORT zaroori hai
const PORT = process.env.PORT || 5000;

// Aapki MongoDB Atlas ki connection string (Yahan apni string paste kar sakte hain)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zx_master_db";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Zx Student Portal connected to Master Database ✅"))
    .catch(err => console.error("Database Connection Error:", err));

// Database Schema Setup
const ZxTestSchema = new mongoose.Schema({
    targetBatch: String,
    testTitle: String,
    totalQuestions: Number,
    testDuration: Number,
    examDate: String,
    questions: Array
});
const ZxTest = mongoose.model('ZxTest', ZxTestSchema, 'zxtests');

// API: Batches search karne ke liye
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

// API: Selected batch ke saare tests load karne ke liye
app.get('/api/student/get-tests', async (req, res) => {
    try {
        const batchName = req.query.batch;
        if (!batchName) return res.status(400).json({ error: "Batch name is required" });
        const testList = await ZxTest.find({ targetBatch: batchName }).select('-questions');
        res.json({ success: true, testSeriesList: testList });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tests" });
    }
});

// 🔥 SUPER FIX: Agar public/index.html nahi bhi mila, toh server khud handle karega
app.get('*', (req, res) => {
    // Pehle normal path try karega
    let indexPath = path.join(__dirname, 'public', 'index.html');
    
    // Agar capital 'Public' folder hua toh use check karega
    if (!require('fs').existsSync(indexPath)) {
        indexPath = path.join(__dirname, 'Public', 'index.html');
    }

    // Agar phir bhi nahi mila, toh crash hone ke bajay error page dikhayega
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`
            <div style="text-align:center; padding-top:50px; font-family:Arial;">
                <h2>Zx Site Frontend Missing!</h2>
                <p>Bhai, aapka server toh chal gaya par root directory me 'public' naam ka folder banakar usme 'index.html' rakhna bhool gaye ho. Ek baar folder structure check karo!</p>
            </div>
        `);
    }
});

app.listen(PORT, () => console.log(`Student Portal live on port ${PORT}`));
