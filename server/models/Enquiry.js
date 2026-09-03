const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'responded', 'closed'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
