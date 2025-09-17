const express = require('express');
const receiptController = require('../controllers/receipt.controller');
const { authenticateToken, optionalAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Health check
router.get('/health', receiptController.healthCheck);

// Analytics endpoint (should come before /:id routes)
router.get('/analytics', receiptController.getAnalytics);

// Upload and process receipt (authentication required)
router.post('/upload', authenticateToken, (req, res, next) => {
  // Get upload middleware from app locals
  const upload = req.app.locals.upload;
  upload.single('receipt')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: 'File upload failed',
        message: err.message
      });
    }
    next();
  });
}, receiptController.uploadReceipt);

// Get all receipts (optional auth - shows user's receipts if authenticated, all if not)
router.get('/', optionalAuth, receiptController.getReceipts);

// Get specific receipt (authentication required for user's receipts)
router.get('/:id', authenticateToken, receiptController.getReceiptById);

// Get receipt image (authentication required)
router.get('/:id/image', authenticateToken, receiptController.getReceiptImage);

// Delete receipt (authentication required)
router.delete('/:id', authenticateToken, receiptController.deleteReceipt);

module.exports = router;