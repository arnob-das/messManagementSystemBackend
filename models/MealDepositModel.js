const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const depositSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    depositDate: { type: Date, required: true },
    depositAmount: { type: Number, default: 0 },
});

const mealDepositSchema = new Schema({
    currentMessId: { type: Schema.Types.ObjectId, ref: 'Mess', required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    deposits: [depositSchema]
});

const MealDeposit = mongoose.model('MealDeposit', mealDepositSchema);

module.exports = MealDeposit;