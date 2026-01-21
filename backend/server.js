const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // 🔴 1. IMPORT PATH MODULE
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize the App
const app = express();

// Middleware
app.use(express.json());

// CORS Configuration (Updated for Production)
app.use(cors({
    origin: '*', // Allow all origins (Easiest for testing)
    // If you face issues later, change '*' to your Vercel URL: 'https://agro-tech-frontend.vercel.app'
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

// 🔴 2. CORRECTED IMAGE SERVING
// This tells the server: "When someone asks for /images, look inside backend/public/images"
// NOTE: Make sure your actual folder in VS Code is named 'public' with an 'images' folder inside it!
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Simple Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});