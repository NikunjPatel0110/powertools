const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { validateObjectIdParam } = require('../middleware/validators');

router.route('/')
  .get(getCategories)
  .post(protect, createCategory);

router.route('/:id')
  .put(protect, validateObjectIdParam('id'), updateCategory)
  .delete(protect, validateObjectIdParam('id'), deleteCategory);

module.exports = router;
