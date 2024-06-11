// routes/messRoutes.js
const express = require('express');
const router = express.Router();
const messController = require('../controllers/MessController');

// Create a mess
router.post('/create', messController.createMess);

module.exports = router;
