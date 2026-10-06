// --- BATCHES API PROXY ROUTE WITH FULL HEADERS ---
app.get('/api/batches', async (req, res) => {
    try {
        const pwToken = process.env.PW_JWT_TOKEN;
        if (!pwToken) {
            return res.status(500).json({ error: 'PW_JWT_TOKEN is missing in environment variables' });
        }

        const response = await fetch('https://api.penpencil.xyz/v1/batches/active', {
            headers: {
                'authorization': `Bearer ${pwToken}`,
                'client-id': '5eb33869ec53d00018512b9d',
                'client-type': 'WEB',
                'accept': 'application/json, text/plain, */*',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching batches:', error.message);
        res.status(500).json({ error: 'Failed to fetch live batches from PW' });
    }
});
