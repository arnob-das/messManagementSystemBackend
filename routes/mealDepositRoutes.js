const express = require('express');
const router = express.Router();
const mealDepositController = require('../controllers/mealDepositController');

router.post('/addMealDeposit', mealDepositController.addMealDeposit);
router.put('/updateMealDeposit', mealDepositController.updateMealDeposit);
router.delete('/deleteMealDeposit', mealDepositController.deleteMealDeposit);
router.get('/getMessMealDeposits', mealDepositController.getMessMealDeposits);
router.get('/getUserMealDeposits', mealDepositController.getUserMealDeposits);
router.put('/updateMealDepositStatus', mealDepositController.updateMealDepositStatus);

module.exports = router;