const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const UserSchema = require('../models/UserModel')

// create model
const User = new mongoose.model("User", UserSchema);

// register user
router.post('/register', async (req, res) => {
    console.log(req.body);
    const { fullName, email, password, phoneNumber, nationalId } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const user = new User({ fullName, email, password, phoneNumber, nationalId });

        console.log(user);

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}).get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;