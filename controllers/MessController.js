// controllers/messController.js
const Mess = require('../models/MessModel');

// create a mess
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

// get mess by id
exports.getMessById = async (req, res) => {
    try {
        const { id } = req.params;
        const mess = await Mess.findById(id);
        if (!mess) {
            return res.status(404).json({ message: "Mess not found" });
        }
        res.status(200).json(mess);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};