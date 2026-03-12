const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer'); // 1. Import Multer directly here

// --- 2. CONFIGURE IMAGE STORAGE (Exactly like your Product routes) ---
const storage = multer.diskStorage({
    destination: "uploads", // Images will be saved in 'uploads' folder
    filename: (req, file, cb) => {
        // Create unique filename: timestamp + originalname
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });


// ==========================================
// PUBLIC ROUTES (Visible to everyone)
// ==========================================

// 1. GET ALL BLOGS
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET SINGLE BLOG BY ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) res.json(blog);
    else res.status(404).json({ message: 'Blog not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ==========================================
// ADMIN ONLY ROUTES (Locked down)
// ==========================================

// 3. CREATE A NEW BLOG (Handles File Uploads)
router.post(
  '/', 
  protect, 
  admin, 
  upload.fields([{ name: 'authorPhoto', maxCount: 1 }, { name: 'blogImage', maxCount: 1 }]), 
  async (req, res) => {
    try {
      const { title, content, authorName } = req.body;

      if (!title || !content || !authorName) {
        return res.status(400).json({ message: 'Title, content, and author name are required.' });
      }

      // Extract filenames if files were successfully uploaded by multer
      const authorPhotoName = req.files && req.files['authorPhoto'] ? req.files['authorPhoto'][0].filename : '';
      const blogImageName = req.files && req.files['blogImage'] ? req.files['blogImage'][0].filename : '';

      const newBlog = new Blog({
        title,
        content,
        authorName,
        authorPhoto: authorPhotoName,
        blogImage: blogImageName
      });

      const savedBlog = await newBlog.save();
      res.status(201).json({ message: 'Blog created successfully!', data: savedBlog });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);


// 4. UPDATE AN EXISTING BLOG (Handles File Uploads)
router.put(
  '/:id', 
  protect, 
  admin, 
  upload.fields([{ name: 'authorPhoto', maxCount: 1 }, { name: 'blogImage', maxCount: 1 }]), 
  async (req, res) => {
    try {
      const { title, content, authorName } = req.body;
      const blog = await Blog.findById(req.params.id);

      if (blog) {
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.authorName = authorName || blog.authorName;

        // If a new author photo was uploaded, replace the old one
        if (req.files && req.files['authorPhoto']) {
          blog.authorPhoto = req.files['authorPhoto'][0].filename;
        }

        // If a new blog image was uploaded, replace the old one
        if (req.files && req.files['blogImage']) {
          blog.blogImage = req.files['blogImage'][0].filename;
        }

        const updatedBlog = await blog.save();
        res.json({ message: 'Blog updated successfully!', data: updatedBlog });
      } else {
        res.status(404).json({ message: 'Blog not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


// 5. DELETE A BLOG
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      await blog.deleteOne(); 
      res.json({ message: 'Blog deleted successfully' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;