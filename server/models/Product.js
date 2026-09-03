const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String },
  images: [{ type: String }],
  specifications: { type: Map, of: String },
  pricing_type: { type: String, enum: ['fixed', 'enquiry'], default: 'fixed' },
  price: { type: Number },
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
