const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const {
  validateObjectIdParam,
  validateCreateProduct,
  validateUpdateProduct,
} = require('../middleware/validators');

router.route('/')
  .get(getProducts)
  .post(protect, validateCreateProduct, createProduct);

router.route('/:id')
  .get(validateObjectIdParam('id'), getProductById)
  .put(protect, validateObjectIdParam('id'), validateUpdateProduct, updateProduct)
  .delete(protect, validateObjectIdParam('id'), deleteProduct);

module.exports = router;
