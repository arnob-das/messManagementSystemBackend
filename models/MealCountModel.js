const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mealDate: { type: Date, required: true },
    breakfast: { type: Number, default: 0 },
    lunch: { type: Number, default: 0 },
    dinner: { type: Number, default: 0 }
});

const mealCountSchema = new Schema({
    currentMessId: { type: Schema.Types.ObjectId, ref: 'Mess', required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    meals: [mealSchema]
});

const MealCount = mongoose.model('MealCount', mealCountSchema);

module.exports = MealCount;