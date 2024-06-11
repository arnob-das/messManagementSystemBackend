// controllers/messController.js
const Mess = require('../models/MessModel');

// Controller function to create a mess
exports.createMess = async (req, res) => {
    try {
        console.log(req.body);
        const mess = await Mess.create(req.body);
        res.status(201).json({ mess, message: "Mess Created Successfully !" });
        //console.log(mess);
    } catch (error) {
        res.status(500).json({  message: error.message });
    }
};
