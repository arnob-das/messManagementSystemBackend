const mongoose = require('mongoose');

const messSchema = new mongoose.Schema({
    messName: String,
    messLocation: String,
    messOwnerName: String,
    messOwnerPhoneNumber: String,
    managerId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        joinDate: Date,
        seatRent: { type: Number, default: 0 },
    }]
});

const Mess = mongoose.model('Mess', messSchema);

module.exports = Mess;
