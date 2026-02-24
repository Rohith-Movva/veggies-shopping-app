const express = require('express');
const router = express.Router();
const Contact = require('../models/ContactUs'); // Import the new model
const { protect, admin } = require('../middleware/authMiddleware'); // Reusing your admin protection

// 1. CREATE CONTACT MESSAGE (Public Route)
router.post('/', async (req, res) => {
  try {
    const { name, email, mobile, comments } = req.body;

    // Validate that all fields are provided (optional but good practice)
    if (!name || !email || !mobile || !comments) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    const newContactMessage = new Contact({
      name,
      email,
      mobile,
      comments
    });

    const savedMessage = await newContactMessage.save();
    
    // Respond with 201 Created
    res.status(201).json({ message: 'Message sent successfully!', data: savedMessage });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. GET ALL CONTACT MESSAGES (LOCKED: Only for Admins)
router.get('/', protect, admin, async (req, res) => {
  try {
    // Fetch all messages, sorting by newest first
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 3. UPDATE MESSAGE STATUS (Admin Only)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Contact.findById(req.params.id);

    if (message) {
      message.status = status;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;