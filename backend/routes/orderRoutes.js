const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// 1. CREATE ORDER (Now includes User ID)
router.post('/', async (req, res) => {
  try {
    const { user, customerName, customerAddress, items, totalAmount } = req.body; // <--- Extract 'user'

    const newOrder = new Order({
      user, // <--- Save it
      customerName,
      customerAddress,
      items,
      totalAmount
    });


    const savedOrder = await newOrder.save();

    // --- NEW: REDUCE STOCK LOGIC ---
    // Loop through every item in the order and update the database
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock = product.stock - item.quantity; // Subtract quantity
        await product.save();
      }
    }
    // -------------------------------

    res.status(201).json(savedOrder);



  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. GET ORDERS FOR A SPECIFIC USER (For Profile Page)
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. GET ALL ORDERS (LOCKED: Only for Admins)
// We add 'protect' (must be logged in) and 'admin' (must be admin) arguments
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'id name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 4. UPDATE ORDER STATUS (Admin Only)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;