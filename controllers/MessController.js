// controllers/messController.js
const Mess = require('../models/MessModel');
const User = require('../models/UserModel');

// create a mess
exports.createMess = async (req, res) => {
    try {
        const mess = await Mess.create(req.body);
        res.status(201).json({ mess, message: "Mess Created Successfully !" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get mess by id
exports.getMessById = async (req, res) => {
    try {
        const { id } = req.params;
        const mess = await Mess.findById(id);
        if (!mess) {
            return res.status(404).json({ message: "Mess not found" });
        }
        res.status(200).json({ mess, message: "mess found" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addMemberToMess = async (req, res) => {
    try {
        const { messId, userId } = req.body;

        const mess = await Mess.findById(messId);
        if (!mess) {
            const message = "Mess not found";
            return res.status(404).json({ message });
        }

        // Check if user is already a member of any mess
        const existingMembership = await Mess.findOne({ members: { $elemMatch: { userId: userId } } });
        if (existingMembership) {
            const message = "User is already a member of another mess";
            return res.status(400).json({ message });
        }
        mess.members.push({ userId, joinDate: new Date() });
        await mess.save();

        const message = "Member added to mess successfully!";
        res.status(200).json({ mess, message });
    } catch (error) {
        const message = "Internal server error";
        res.status(500).json({ message });
    }
};

// find user id who are not approved by a mess manager after joining a mess
exports.getUnapprovedMembers = async (req, res) => {
    const messId = req.params.messId; // Assuming messId is passed in the request parameters

    try {
        // Find the mess by messId and populate the 'members' field to get user details
        const mess = await Mess.findById(messId).populate('members.userId');

        if (!mess) {
            return res.status(404).json({ error: 'Mess not found' });
        }

        // Extract member user IDs from the mess document
        const memberIds = mess.members.map(member => member.userId._id);

        // Find users who are members of this mess but not approved
        const unapprovedMembers = await User.find({
            _id: { $in: memberIds }, // Find users whose IDs are in memberIds array
            approved: { $ne: true } // Find users where approved is not true
        });

        // Prepare response with user details
        const unapprovedMembersInfo = unapprovedMembers.map(user => ({
            _id: user._id,
            fullName: user.fullName,
            emailAddress: user.email,
            phoneNumber: user.phoneNumber,
            nationalId: user.nationalId,
            role: user.role,
            currentMessId: user.currentMessId
        }));
        
        res.json(unapprovedMembers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};


