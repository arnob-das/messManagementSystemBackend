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

// find users who are not approved by a mess manager after joining a mess
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

        res.json(unapprovedMembers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// find users who are approved by a mess manager after joining a mess
exports.getApprovedMembers = async (req, res) => {
    const messId = req.params.messId;
    try {
        // Find the mess by messId and populate the 'members' field to get user details
        const mess = await Mess.findById(messId).populate('members.userId');

        if (!mess) {
            return res.status(404).json({ error: 'Mess not found' });
        }

        // Extract member user IDs from the mess document
        const memberIds = mess.members.map(member => member.userId._id);

        // Find users who are members of this mess but not approved
        const approvedMembers = await User.find({
            _id: { $in: memberIds }, // Find users whose IDs are in memberIds array
            approved: true
        });

        res.json(approvedMembers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getApprovedMembersSeatRents = async (req, res) => {
    const messId = req.params.messId;

    try {
        // Find the mess by messId and populate the 'members.userId' field
        const mess = await Mess.findById(messId).populate('members.userId');

        if (!mess) {
            return res.status(404).json({ error: 'Mess not found' });
        }

        // Filter members who are approved
        const approvedMembers = mess.members.filter(member => member.userId.approved);

        // Map to get full name and seat rent
        const approvedMembersSeatRents = approvedMembers.map(member => ({
            fullName: member.userId.fullName,
            seatRent: member.seatRent,
            userId:member.userId._id
        }));

        res.status(200).json(approvedMembersSeatRents);
    } catch (err) {
        console.error('Failed to fetch approved members seat rents:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Set seat rent for a member
exports.setSeatRentForMember = async (req, res) => {
    const { messId, userId, seatRent } = req.body;

    try {
        const mess = await Mess.findById(messId).populate('members.userId');
        if (!mess) {
            return res.status(404).json({ message: "Mess not found" });
        }
        const member = mess.members.find(member => member.userId._id.toString() === userId);
        if (!member) {
            return res.status(404).json({ message: "Member not found in the mess" });
        }
        member.seatRent = seatRent;
        await mess.save();
        res.status(200).json({ mess, message: "Seat rent updated for the member" });
    } catch (error) {
        console.error('Failed to set seat rent for the member:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Get seat rent for single member
exports.getSeatRentForSingleMember = async (req, res) => {
    const { messId, userId } = req.params;

    try {
        const mess = await Mess.findById(messId).populate('members.userId');
        if (!mess) {
            return res.status(404).json({ message: "Mess not found" });
        }
        const member = mess.members.find(member => member.userId._id.toString() === userId);
        if (!member) {
            return res.status(404).json({ message: "Member not found in the mess" });
        }
        res.status(200).json({ seatRent: member.seatRent });
    } catch (error) {
        console.error('Failed to get seat rent for the member:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getTotalSeatRentForApprovedUsers = async (req, res) => {
    const { messId } = req.params;

    try {
        const mess = await Mess.findById(messId).populate('members.userId');

        if (!mess) {
            return res.status(404).json({ message: 'Mess not found' });
        }

        const approvedMembers = mess.members.filter(member => member.userId.approved);

        const totalSeatRent = approvedMembers.reduce((total, member) => {
            return total + (member.seatRent || 0);
        }, 0);

        res.status(200).json({ messId, totalSeatRent });
    } catch (error) {
        console.error('Failed to fetch total seat rent for approved users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update seat rent for an approved member
exports.updateSeatRentForMember = async (req, res) => {
    const { messId, userId, seatRent } = req.body;

    try {
        const mess = await Mess.findById(messId).populate('members.userId');
        if (!mess) {
            return res.status(404).json({ message: "Mess not found" });
        }
        const member = mess.members.find(member => member.userId._id.toString() === userId);
        if (!member) {
            return res.status(404).json({ message: "Member not found in the mess" });
        }
        member.seatRent = seatRent;
        await mess.save();
        res.status(200).json({mess, message: "Seat rent updated for the member" });
    } catch (error) {
        console.error('Failed to update seat rent for the member:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};


