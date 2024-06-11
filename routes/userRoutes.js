const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register user
router.post('/register', userController.registerUser);

// Get all users
router.get('/', userController.getAllUsers);

// Login user
router.post('/login', userController.loginUser);

module.exports = router;
