const path = require('path');

// --- Yahan apna static folder set karein ---
// Agar aap Vite use kar rahe hain toh 'dist', agar Create React App hai toh 'build' likhein:
const frontendPath = path.join(__dirname, '../frontend/dist'); 
// (Agar dist ki jagah build folder banta hai toh yahan 'build' kar dein)

app.use(express.static(frontendPath));

// Fallback route taaki React Router ya page reload par error na aaye:
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});
