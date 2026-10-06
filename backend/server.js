// Server.js mein is line ko change karein:
const frontendPath = path.join(__dirname, '../frontend/build'); 

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});
