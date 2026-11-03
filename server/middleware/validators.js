const mongoose = require('mongoose');

// Helper to sanitize strings: strips control characters, HTML tags, and trims
const sanitizeText = (val) => {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove control chars
    .replace(/<[^>]*>?/gm, '') // strip HTML tags
    .trim();
};

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PHONE_REGEX = /^[+0-9\s\-()]{6,30}$/;

// Middleware to validate MongoDB ObjectId in URL params (e.g. :id)
const validateObjectIdParam = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Invalid ${paramName} format` });
    }
    next();
  };
};

// Validate and sanitize POST /api/enquiries
const validateEnquiry = (req, res, next) => {
  const { name, email, phone, message, product } = req.body || {};

  // Validate Name
  if (typeof name !== 'string') {
    return res.status(400).json({ message: 'Name must be a valid text string' });
  }
  const cleanName = sanitizeText(name);
  if (!cleanName || cleanName.length < 1 || cleanName.length > 100) {
    return res.status(400).json({ message: 'Name is required and must be between 1 and 100 characters' });
  }

  // Validate Email
  if (typeof email !== 'string') {
    return res.status(400).json({ message: 'Email must be a valid text string' });
  }
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || cleanEmail.length > 255) {
    return res.status(400).json({ message: 'Email is required and must not exceed 255 characters' });
  }
  if (!EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  // Validate Phone (optional)
  let cleanPhone = '';
  if (phone !== undefined && phone !== null && phone !== '') {
    if (typeof phone !== 'string') {
      return res.status(400).json({ message: 'Phone number must be a valid text string' });
    }
    cleanPhone = sanitizeText(phone);
    if (cleanPhone.length > 30) {
      return res.status(400).json({ message: 'Phone number cannot exceed 30 characters' });
    }
    if (cleanPhone && !PHONE_REGEX.test(cleanPhone)) {
      return res.status(400).json({ message: 'Please provide a valid phone number (digits, spaces, hyphens, and + only)' });
    }
  }

  // Validate Message
  if (typeof message !== 'string') {
    return res.status(400).json({ message: 'Message must be a valid text string' });
  }
  const cleanMessage = sanitizeText(message);
  if (!cleanMessage || cleanMessage.length < 1 || cleanMessage.length > 5000) {
    return res.status(400).json({ message: 'Message is required and must be between 1 and 5000 characters' });
  }

  // Validate Product (optional)
  let cleanProduct = undefined;
  if (product !== undefined && product !== null && String(product).trim() !== '') {
    const prodStr = String(product).trim();
    if (!mongoose.Types.ObjectId.isValid(prodStr)) {
      return res.status(400).json({ message: 'Invalid product ID associated with enquiry' });
    }
    cleanProduct = prodStr;
  }

  // Assign sanitized values
  req.body = {
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    message: cleanMessage,
    ...(cleanProduct ? { product: cleanProduct } : {}),
  };

  next();
};

// Validate and sanitize POST /api/products
const validateCreateProduct = (req, res, next) => {
  const {
    name,
    slug,
    description,
    category,
    brand,
    images,
    specifications,
    pricing_type,
    price,
    stock,
    featured,
  } = req.body || {};

  // Validate Name
  if (typeof name !== 'string') {
    return res.status(400).json({ message: 'Product name must be a text string' });
  }
  const cleanName = sanitizeText(name);
  if (!cleanName || cleanName.length < 1 || cleanName.length > 200) {
    return res.status(400).json({ message: 'Product name is required and must be between 1 and 200 characters' });
  }

  // Validate Slug
  if (typeof slug !== 'string') {
    return res.status(400).json({ message: 'Slug must be a text string' });
  }
  const cleanSlug = sanitizeText(slug).toLowerCase();
  if (!cleanSlug || cleanSlug.length < 1 || cleanSlug.length > 200) {
    return res.status(400).json({ message: 'Slug is required and must be between 1 and 200 characters' });
  }
  if (!SLUG_REGEX.test(cleanSlug)) {
    return res.status(400).json({ message: 'Slug must contain only lowercase letters, numbers, and hyphens (no consecutive or trailing hyphens)' });
  }

  // Validate Category
  if (!category || typeof category !== 'string' || !mongoose.Types.ObjectId.isValid(category.trim())) {
    return res.status(400).json({ message: 'A valid category ID is required' });
  }
  const cleanCategory = category.trim();

  // Validate Description (optional)
  let cleanDesc = '';
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      return res.status(400).json({ message: 'Description must be a text string' });
    }
    cleanDesc = sanitizeText(description);
    if (cleanDesc.length > 10000) {
      return res.status(400).json({ message: 'Description cannot exceed 10000 characters' });
    }
  }

  // Validate Brand (optional)
  let cleanBrand = '';
  if (brand !== undefined && brand !== null) {
    if (typeof brand !== 'string') {
      return res.status(400).json({ message: 'Brand must be a text string' });
    }
    cleanBrand = sanitizeText(brand);
    if (cleanBrand.length > 100) {
      return res.status(400).json({ message: 'Brand cannot exceed 100 characters' });
    }
  }

  // Validate Images (optional)
  let cleanImages = [];
  if (images !== undefined && images !== null) {
    if (!Array.isArray(images)) {
      return res.status(400).json({ message: 'Images must be an array of URL strings' });
    }
    if (images.length > 20) {
      return res.status(400).json({ message: 'Cannot upload more than 20 images' });
    }
    for (const img of images) {
      if (typeof img !== 'string' || img.trim().length === 0 || img.trim().length > 2048) {
        return res.status(400).json({ message: 'Each image must be a valid URL string under 2048 characters' });
      }
      cleanImages.push(img.trim());
    }
  }

  // Validate Specifications (optional)
  let cleanSpecs = undefined;
  if (specifications !== undefined && specifications !== null) {
    if (typeof specifications !== 'object' || Array.isArray(specifications)) {
      return res.status(400).json({ message: 'Specifications must be an object' });
    }
    const keys = Object.keys(specifications);
    if (keys.length > 50) {
      return res.status(400).json({ message: 'Cannot exceed 50 specifications' });
    }
    cleanSpecs = {};
    for (const key of keys) {
      const cleanKey = sanitizeText(key);
      const cleanVal = sanitizeText(String(specifications[key] || ''));
      if (!cleanKey || cleanKey.length > 100) {
        return res.status(400).json({ message: 'Specification keys must be between 1 and 100 characters' });
      }
      if (cleanVal.length > 500) {
        return res.status(400).json({ message: 'Specification values cannot exceed 500 characters' });
      }
      cleanSpecs[cleanKey] = cleanVal;
    }
  }

  // Validate Pricing Type
  let cleanPricingType = 'fixed';
  if (pricing_type !== undefined && pricing_type !== null) {
    if (pricing_type !== 'fixed' && pricing_type !== 'enquiry') {
      return res.status(400).json({ message: "Pricing type must be either 'fixed' or 'enquiry'" });
    }
    cleanPricingType = pricing_type;
  }

  // Validate Price
  let cleanPrice = 0;
  if (price !== undefined && price !== null && price !== '') {
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0 || numPrice > 100000000) {
      return res.status(400).json({ message: 'Price must be a valid non-negative number up to 100,000,000' });
    }
    cleanPrice = numPrice;
  }

  // Validate Stock
  let cleanStock = 0;
  if (stock !== undefined && stock !== null && stock !== '') {
    const numStock = Number(stock);
    if (isNaN(numStock) || !Number.isInteger(numStock) || numStock < 0 || numStock > 1000000) {
      return res.status(400).json({ message: 'Stock must be an integer between 0 and 1,000,000' });
    }
    cleanStock = numStock;
  }

  // Validate Featured
  const cleanFeatured = Boolean(featured);

  req.body = {
    name: cleanName,
    slug: cleanSlug,
    description: cleanDesc,
    category: cleanCategory,
    brand: cleanBrand,
    images: cleanImages,
    ...(cleanSpecs !== undefined ? { specifications: cleanSpecs } : {}),
    pricing_type: cleanPricingType,
    price: cleanPrice,
    stock: cleanStock,
    featured: cleanFeatured,
  };

  next();
};

// Validate and sanitize PUT /api/products/:id
const validateUpdateProduct = (req, res, next) => {
  const {
    name,
    slug,
    description,
    category,
    brand,
    images,
    specifications,
    pricing_type,
    price,
    stock,
    featured,
  } = req.body || {};

  const cleanBody = {};

  if (name !== undefined) {
    if (typeof name !== 'string') {
      return res.status(400).json({ message: 'Product name must be a text string' });
    }
    const cleanName = sanitizeText(name);
    if (!cleanName || cleanName.length < 1 || cleanName.length > 200) {
      return res.status(400).json({ message: 'Product name must be between 1 and 200 characters' });
    }
    cleanBody.name = cleanName;
  }

  if (slug !== undefined) {
    if (typeof slug !== 'string') {
      return res.status(400).json({ message: 'Slug must be a text string' });
    }
    const cleanSlug = sanitizeText(slug).toLowerCase();
    if (!cleanSlug || cleanSlug.length < 1 || cleanSlug.length > 200) {
      return res.status(400).json({ message: 'Slug must be between 1 and 200 characters' });
    }
    if (!SLUG_REGEX.test(cleanSlug)) {
      return res.status(400).json({ message: 'Slug must contain only lowercase letters, numbers, and hyphens' });
    }
    cleanBody.slug = cleanSlug;
  }

  if (category !== undefined) {
    if (!category || typeof category !== 'string' || !mongoose.Types.ObjectId.isValid(category.trim())) {
      return res.status(400).json({ message: 'A valid category ID is required' });
    }
    cleanBody.category = category.trim();
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      return res.status(400).json({ message: 'Description must be a text string' });
    }
    const cleanDesc = sanitizeText(description);
    if (cleanDesc.length > 10000) {
      return res.status(400).json({ message: 'Description cannot exceed 10000 characters' });
    }
    cleanBody.description = cleanDesc;
  }

  if (brand !== undefined) {
    if (typeof brand !== 'string') {
      return res.status(400).json({ message: 'Brand must be a text string' });
    }
    const cleanBrand = sanitizeText(brand);
    if (cleanBrand.length > 100) {
      return res.status(400).json({ message: 'Brand cannot exceed 100 characters' });
    }
    cleanBody.brand = cleanBrand;
  }

  if (images !== undefined) {
    if (!Array.isArray(images)) {
      return res.status(400).json({ message: 'Images must be an array of URL strings' });
    }
    if (images.length > 20) {
      return res.status(400).json({ message: 'Cannot upload more than 20 images' });
    }
    const cleanImages = [];
    for (const img of images) {
      if (typeof img !== 'string' || img.trim().length === 0 || img.trim().length > 2048) {
        return res.status(400).json({ message: 'Each image must be a valid URL string under 2048 characters' });
      }
      cleanImages.push(img.trim());
    }
    cleanBody.images = cleanImages;
  }

  if (specifications !== undefined) {
    if (typeof specifications !== 'object' || Array.isArray(specifications)) {
      return res.status(400).json({ message: 'Specifications must be an object' });
    }
    const keys = Object.keys(specifications);
    if (keys.length > 50) {
      return res.status(400).json({ message: 'Cannot exceed 50 specifications' });
    }
    const cleanSpecs = {};
    for (const key of keys) {
      const cleanKey = sanitizeText(key);
      const cleanVal = sanitizeText(String(specifications[key] || ''));
      if (!cleanKey || cleanKey.length > 100) {
        return res.status(400).json({ message: 'Specification keys must be between 1 and 100 characters' });
      }
      if (cleanVal.length > 500) {
        return res.status(400).json({ message: 'Specification values cannot exceed 500 characters' });
      }
      cleanSpecs[cleanKey] = cleanVal;
    }
    cleanBody.specifications = cleanSpecs;
  }

  if (pricing_type !== undefined) {
    if (pricing_type !== 'fixed' && pricing_type !== 'enquiry') {
      return res.status(400).json({ message: "Pricing type must be either 'fixed' or 'enquiry'" });
    }
    cleanBody.pricing_type = pricing_type;
  }

  if (price !== undefined) {
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0 || numPrice > 100000000) {
      return res.status(400).json({ message: 'Price must be a valid non-negative number up to 100,000,000' });
    }
    cleanBody.price = numPrice;
  }

  if (stock !== undefined) {
    const numStock = Number(stock);
    if (isNaN(numStock) || !Number.isInteger(numStock) || numStock < 0 || numStock > 1000000) {
      return res.status(400).json({ message: 'Stock must be an integer between 0 and 1,000,000' });
    }
    cleanBody.stock = numStock;
  }

  if (featured !== undefined) {
    cleanBody.featured = Boolean(featured);
  }

  req.body = cleanBody;
  next();
};

module.exports = {
  sanitizeText,
  validateObjectIdParam,
  validateEnquiry,
  validateCreateProduct,
  validateUpdateProduct,
};

