const express = require('express');
const router = express.Router();
const groceryCostController = require('../controllers/groceryCostController');

router.post('/add', groceryCostController.addGroceryCost);
router.put('/update', groceryCostController.updateGroceryCost);
router.delete('/delete', groceryCostController.deleteGroceryCost);
router.get('/get/:messId/:month/:year', groceryCostController.getGroceryCost);
router.get('/get/:messId/:month/:year', groceryCostController.getGroceryCost);
router.get('/getTotalGroceryCostForMess/:messId/:month/:year', groceryCostController.getTotalGroceryCost);
router.get('/getTotalGroceryCostByUser/:messId/:month/:year/:userId', groceryCostController.getTotalGroceryCostByUser);

module.exports = router;
