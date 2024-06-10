const User = require('../models/UserModel');

const registerUser = async (req, res) => {
    const { fullName, emailAddress, password, phoneNo, nidNo } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ emailAddress });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({ fullName, emailAddress, password, phoneNo, nidNo });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser
};
