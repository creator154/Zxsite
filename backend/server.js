const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files if placed in public folder
app.use(express.static(path.join(__dirname, '../public')));

// Root route to prevent Cannot GET / error
app.get('/', (req, res) => {
    res.send("Zxsite Backend is Running Successfully!");
});

// Helper function for making requests with browser-like headers
async function fetchFromPenpencil(url) {
    const token = process.env.PW_JWT_TOKEN || '';
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${token}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://penpencil.xyz/',
            'Origin': 'https://penpencil.xyz/',
            'Accept': 'application/json, text/plain, */*'
        }
    });

    if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
    }

    return await response.json();
}

// Route for batch tests mirroring the structure found
app.get('/batch/:batchId/:batchName/batch_test', async (req, res) => {
    try {
        const { batchId } = req.params;
        const targetUrl = `https://api.penpencil.xyz/v1/batches/${batchId}/batch-tests`;
        
        const data = await fetchFromPenpencil(targetUrl);
        res.json(data);
    } catch (error) {
        console.error("Error fetching batch tests:", error.message);
        res.status(500).json({ error: "Failed to fetch data due to upstream restrictions." });
    }
});

// Route for specific test data details
app.get('/test_data/:batchId/:batchName/:testId/batch_test', async (req, res) => {
    try {
        const { batchId, testId } = req.params;
        const targetUrl = `https://api.penpencil.xyz/v1/batches/${batchId}/tests/${testId}`;
        
        const data = await fetchFromPenpencil(targetUrl);
        res.json(data);
    } catch (error) {
        console.error("Error fetching test data:", error.message);
        res.status(500).json({ error: "Failed to fetch test details." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
