const express = require('express');
const router = express.Router();
const utilityBillController = require('../controllers/utilityBillController');

// Add a utility
router.post('/add', utilityBillController.addUtility);

// Get a specific utility bill
router.get('/getUtility/:messId/:month/:year', utilityBillController.getUtility);

// Update a utility bill
router.put('/update', utilityBillController.updateUtility);

// Delete a utility bill
router.delete('/delete', utilityBillController.deleteUtility);

module.exports = router;
