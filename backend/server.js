const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // 🔴 NEW: Import File System for debugging
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize the App
const app = express();

// Middleware
app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: '*', 
    credentials: true
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// 🔴 DEBUGGING BLOCK: START
// This will print to your Render Logs so we can see if the folder exists
const uploadsPath = path.join(__dirname, 'uploads'); 
console.log("📂 Server is trying to serve images from:", uploadsPath);

if (fs.existsSync(uploadsPath)) {
    console.log("✅ Uploads folder exists!");
    // List the files inside to verify they are there
    try {
        const files = fs.readdirSync(uploadsPath);
        console.log("📄 Files found in uploads folder:", files);
    } catch (err) {
        console.log("❌ Error reading uploads folder:", err);
    }
} else {
    console.log("❌ ERROR: Uploads folder NOT found at:", uploadsPath);
    console.log("   (Did you forget to git add -f backend/uploads?)");
}
// 🔴 DEBUGGING BLOCK: END

// Serve Images
app.use('/images', express.static(uploadsPath));


// Simple Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});