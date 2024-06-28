const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Register user
exports.registerUser = async (req, res) => {
    const { fullName, email, password, phoneNumber, nationalId } = req.body;
    try {
        // Check if the user already exists by email
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Check if the user already exists by phoneNumber
        existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'Phone number already in use' });
        }

        // Check if the user already exists by nationalId
        existingUser = await User.findOne({ nationalId });
        if (existingUser) {
            return res.status(400).json({ message: 'National ID already in use' });
        }

        // Create new user
        const user = new User({ fullName, email, password, phoneNumber, nationalId });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id, { _id: 0, fullName: 1 });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // If authentication is successful, send the full user object in the response
        res.status(200).json({ user, message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error from server' });
    }
};

// update user by id after creating a mess
// user become a manager
exports.updateUserById = async (req, res) => {
    const { id } = req.params;
    const { approved, currentMessId, role } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { approved, currentMessId, role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ updatedUser, message: "User updated successfully !" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate oldPassword and user.password before bcrypt.compare
        if (!oldPassword || !user.password) {
            return res.status(400).json({ message: 'Invalid request parameters' });
        }

        // Compare oldPassword with hashed password in database
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        // Update user password (no need to hash again here)
        user.password = newPassword;
        await user.save();

        // Send success response
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
