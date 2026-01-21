const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require("multer"); // 1. Import Multer

// --- 2. CONFIGURE IMAGE STORAGE ---
const storage = multer.diskStorage({
    destination: "uploads", // Images will be saved in 'uploads' folder
    filename: (req, file, cb) => {
        // Create unique filename: timestamp + originalname
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// GET all products (No changes)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET products by category (No changes)
router.get('/category/:categoryName', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryName });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE STOCK ROUTE (No changes)
router.put('/:id/stock', protect, admin, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.stock = product.stock + Number(stock); 
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- UPDATE PRODUCT DETAILS (Handles URL OR File) ---
// --- UPDATE PRODUCT DETAILS (Handles URL OR File) ---
router.put('/:id', protect, admin, upload.single("image"), async (req, res) => {
  try {
    // 1. ADD 'stock' HERE
    const { name, description, category, price, stock, image: imageURL,about, keyBenefits, usageInfo, recommendeddosage, manufacturingInfo, highlights } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.price = price || product.price;
      product.about = about || product.about;
      product.keyBenefits = keyBenefits || product.keyBenefits;
      product.usageInfo = usageInfo || product.usageInfo;
      product.manufacturingInfo = manufacturingInfo || product.manufacturingInfo;
      product.recommendeddosage = recommendeddosage || product.recommendeddosage;
      product.highlights = highlights || product.highlights;

      
      // 2. ADD THIS LINE (Update the stock)
      // We use Number() to ensure it's saved as a number, not a string
      if (stock !== undefined) {
        product.stock = Number(stock);
      }

      // LOGIC: If a file is uploaded, use it. If not, use the URL provided.
      if (req.file) {
          product.image = `${req.file.filename}`;
      } else if (imageURL) {
          product.image = imageURL;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- CREATE PRODUCT (Handles URL OR File) ---
// Added 'upload.single("image")' middleware
router.post('/', protect, admin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, price, stock, image: imageURL, about, keyBenefits, usageInfo, recommendeddosage, manufacturingInfo, highlights } = req.body;

    // LOGIC: Determine the image source
    // 1. Check if file exists (req.file)
    // 2. Check if URL string exists (req.body.image)
    let image_filename = ""; 
    
    if (req.file) {
        image_filename = `${req.file.filename}`;
    } else if (imageURL) {
        image_filename = imageURL;
    } else {
        return res.status(400).json({ message: 'Image (File or URL) is required' });
    }

    // Validation (rest of fields)
    if (!name || !description || !category || !price) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const product = new Product({
      name,
      image: image_filename, // Save the result of our logic above
      description,
      category,
      price: Number(price),
      stock: Number(stock) || 0,
      about,
      keyBenefits,
      usageInfo,
      recommendeddosage,
      manufacturingInfo,
      highlights
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});


// --- DELETE PRODUCT ---
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Use deleteOne() to remove it
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;