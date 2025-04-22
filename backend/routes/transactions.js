const express = require('express');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getSummary
} = require('../controllers/transactions');

const router = express.Router();

router
  .route('/')
  .get(protect, getTransactions)
  .post(
    protect,
    [
      check('amount', 'Amount is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('type', 'Type is required').isIn(['income', 'expense'])
    ],
    addTransaction
  );

router.route('/:id').delete(protect, deleteTransaction);
router.route('/summary').get(protect, getSummary);

module.exports = router;