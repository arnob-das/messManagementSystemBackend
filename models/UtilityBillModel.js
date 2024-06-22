const mongoose = require('mongoose');

const UtilitySchema = new mongoose.Schema({
    utilityName: {
        type: String,
        required: true
    },
    utilityCost: {
        type: Number,
        required: true
    }
});

const UtilityBillSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    messId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    utilities: {
        type: [UtilitySchema],
        required: true
    }
});

module.exports = mongoose.model('UtilityBill', UtilityBillSchema);
