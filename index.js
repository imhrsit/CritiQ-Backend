const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

const DB = process.env.MongoDB_URL;
mongoose.connect(DB).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error('Failed to connect MongoDB:', err);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Failed to start server:', err);
});