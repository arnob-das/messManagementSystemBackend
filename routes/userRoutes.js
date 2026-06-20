const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Register user
router.post('/register', userController.registerUser);

// Get all users
router.get('/', authMiddleware, userController.getAllUsers);
// get user
router.get('/getUserById/:id', authMiddleware, userController.getUserById);

// Login user
router.post('/login', userController.loginUser);

// Update a user by ID
router.put('/update/:id', authMiddleware, userController.updateUserById);

// chamge password
router.post('/change-password', authMiddleware, userController.changePassword);

module.exports = router;
