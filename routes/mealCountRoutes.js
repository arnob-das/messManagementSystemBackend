const express = require('express');
const router = express.Router();
const mealCountController = require('../controllers/mealCountController')

router.post('/addMeal', mealCountController.addMeal);

module.exports = router;
