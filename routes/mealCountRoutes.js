const express = require('express');
const router = express.Router();
const mealCountController = require('../controllers/mealCountController')

router.post('/addMeal', mealCountController.addMeal);
router.get('/getMeals',mealCountController.getMeals);   
router.get('/getAllMessMembersMeals/:currentMessId/:month/:year',mealCountController.getAllMessMembersMeals);   
router.put('/editMeal',mealCountController.editMeal);   
router.delete('/deleteMeal',mealCountController.deleteMeal);   

module.exports = router;
