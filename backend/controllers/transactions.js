const Transaction = require('../models/Transaction');

// @desc    Get all transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort('-date');
    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Add transaction
exports.addTransaction = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const transaction = await Transaction.create(req.body);
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete transaction
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await transaction.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get summary
exports.getSummary = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = income - expense;
    
    const categoryExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        if (!acc[t.category]) acc[t.category] = 0;
        acc[t.category] += t.amount;
        return acc;
      }, {});
    
    res.status(200).json({ 
      success: true, 
      data: { income, expense, balance, categoryExpenses } 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};