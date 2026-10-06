const path = require('path');

// --- Yahan apna static folder set karein ---
const frontendPath = path.join(__dirname, '../frontend/dist'); 

app.use(express.static(frontendPath));

// Fallback route taaki React Router ya page reload par error na aaye:
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});
