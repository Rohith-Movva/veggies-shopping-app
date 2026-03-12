const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  authorName: { 
    type: String, 
    required: true 
  },
  authorPhoto: { 
    type: String, 
    required: false 
  },
  // 🔴 FIXED: Changed from 'featuredImages' array to a single 'blogImage' string
  blogImage: { 
    type: String, 
    required: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;