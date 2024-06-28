const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register user
router.post('/register', userController.registerUser);

// Get all users
router.get('/', userController.getAllUsers);
// get user
router.get('/getUserById/:id', userController.getUserById);

// Login user
router.post('/login', userController.loginUser);

// Update a user by ID
router.put('/update/:id', userController.updateUserById);

// chamge password
router.post('/change-password',userController.changePassword);

module.exports = router;
