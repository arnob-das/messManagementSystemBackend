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
    const messId = req.params.messId;

    try {
        const mess = await Mess.findById(messId).populate('members.userId');

        if (!mess) {
            return res.status(404).json({ error: 'Mess not found' });
        }

        const memberIds = mess.members.map(member => member.userId._id);

        const unapprovedMembers = await User.find({
            _id: { $in: memberIds },
            approved: { $ne: true }
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
        const mess = await Mess.findById(messId).populate('members.userId');

        if (!mess) {
            return res.status(404).json({ error: 'Mess not found' });
        }
        const memberIds = mess.members.map(member => member.userId._id);

        const approvedMembers = await User.find({
            _id: { $in: memberIds },
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
        const mess = await Mess.findById(messId).populate('members.userId');

        if (!mess) {
            return res.status(404).json({ error: 'Mess not found' });
        }

        const approvedMembers = mess.members.filter(member => member.userId.approved);

        const approvedMembersSeatRents = approvedMembers.map(member => ({
            fullName: member.userId.fullName,
            seatRent: member.seatRent,
            userId: member.userId._id
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
        res.status(200).json({ mess, message: "Seat rent updated for the member" });
    } catch (error) {
        console.error('Failed to update seat rent for the member:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update user role
exports.updateUserRole = async (req, res) => {
    const { messId, userId, role } = req.body;

    try {
        const mess = await Mess.findById(messId);
        if (!mess) {
            return res.status(404).json({ message: "Mess not found" });
        }

        const member = mess.members.find(member => member.userId.toString() === userId);
        if (!member) {
            return res.status(404).json({ message: "User is not a member of this mess" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.role = role;
        await user.save();

        res.status(200).json({ success: true, message: `Role updated to ${role} for ${user.fullName}` });
    } catch (error) {
        console.error('Failed to update user role:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// exports.leaveMess = async (req, res) => {
//     try {
//         const { messId, userId } = req.body;

//         // Find the mess by ID and remove the user from the members array
//         const mess = await Mess.findById(messId);
//         if (!mess) {
//             return res.status(404).json({ message: "Mess not found" });
//         }

//         // Remove the member from the mess
//         mess.members = mess.members.filter(member => member.userId.toString() !== userId);
//         await mess.save();

//         // Update the user's document
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         user.approved = false;
//         user.role = 'user';
//         user.currentMessId = null;
//         await user.save();

//         res.status(200).json({ message: "User has left the mess successfully" });
//     } catch (error) {
//         console.error('Error while leaving the mess:', error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

exports.leaveMess = async (req, res) => {
    try {
        const { messId, userId } = req.body;

        const mess = await Mess.findById(messId);
        if (!mess) {
            return res.status(404).json({ message: "Mess not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isManager = user.role === 'manager';
        const totalMembers = mess.members.length;
        const managers = mess.members.filter(member => member.role === 'manager');

        if (totalMembers === 1 && isManager) {
            mess.members = mess.members.filter(member => member.userId.toString() !== userId);
            await mess.save();

            user.approved = false;
            user.role = 'user';
            user.currentMessId = null;
            await user.save();

            return res.status(200).json({ message: "User has left the mess successfully" });
        }

        if (totalMembers > 1 && managers.length === 1 && isManager) {
            return res.status(400).json({ message: "Please appoint another manager before leaving." });
        }

        if (isManager && managers.length > 1 || !isManager) {
            mess.members = mess.members.filter(member => member.userId.toString() !== userId);
            await mess.save();

            user.approved = false;
            user.role = 'user';
            user.currentMessId = null;
            await user.save();

            return res.status(200).json({ message: "User has left the mess successfully" });
        }

        res.status(400).json({ message: "Unable to leave the mess due to unknown condition" });
    } catch (error) {
        console.error('Error while leaving the mess:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};


