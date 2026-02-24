const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  mobile: { 
    type: String, 
    required: true 
  },
  comments: { 
    type: String, 
    required: true 
  },
  status:{
    type: String,
    default: 'In Progress',
    enum: ['In Progress', 'Done']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;