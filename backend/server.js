const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploaderRoutes = require('./routes/uploaderRoutes');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'YOUR_MONGODB_ATLAS_URI';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('DB Error:', err));

app.use('/api/uploader', uploaderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
