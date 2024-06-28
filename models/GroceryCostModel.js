const mongoose = require('mongoose');
const { Schema } = mongoose;

const grocerySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    groceryDetails: { type: String, required: true },
    price: { type: Number, required: true },
    date:{type:Date,required:true}
});

const groceryCostSchema = new Schema({
    messId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Mess' },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    groceries: [grocerySchema]
});

const GroceryCost = mongoose.model('GroceryCost', groceryCostSchema);
module.exports = GroceryCost;