const express = require('express');
const { body } = require('express-validator');
const { getItems, createItem, getItemById, updateItem, deleteItem, updateStatus } = require('../controllers/itemController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const itemValidation = [
  body('type').isIn(['lost', 'found']).withMessage('Type must be lost or found'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('date').isISO8601().withMessage('Valid date required'),
];

router.get('/', getItems);
router.post('/', protect, upload.single('image'), itemValidation, createItem);
router.get('/:id', getItemById);
router.put('/:id', protect, upload.single('image'), updateItem);
router.delete('/:id', protect, deleteItem);
router.patch('/:id/status', protect, updateStatus);

module.exports = router;
