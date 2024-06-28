const mongoose = require('mongoose');
const UtilityBill = require('../models/UtilityBillModel');

// Add a new utility bill
exports.addUtility = async (req, res) => {
    try {
        const { messId, utilityName, utilityCost, month, year } = req.body;

        if (!mongoose.Types.ObjectId.isValid(messId)) {
            return res.status(400).json({ message: 'Invalid messId format' });
        }

        let utilityBill = await UtilityBill.findOne({ messId, month, year });

        if (!utilityBill) {
            utilityBill = new UtilityBill({
                messId,
                month,
                year,
                utilities: []
            });
        }

        utilityBill.utilities.push({ utilityName, utilityCost });

        await utilityBill.save();

        res.status(201).json(utilityBill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Read a utility bill
exports.getUtility = async (req, res) => {
    try {
        const { messId, month, year } = req.params;

        if (!mongoose.Types.ObjectId.isValid(messId)) {
            return res.status(400).json({ message: 'Invalid messId format' });
        }

        const utilityBill = await UtilityBill.findOne({ messId, month, year });

        if (!utilityBill) {
            return res.status(404).json({ message: 'Utility bill not found' });
        }

        res.json(utilityBill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a utility bill
exports.updateUtility = async (req, res) => {
    try {
        const { messId, utilityId, utilityName, utilityCost, month, year } = req.body;

        if (!mongoose.Types.ObjectId.isValid(messId) || !mongoose.Types.ObjectId.isValid(utilityId)) {
            return res.status(400).json({ message: 'Invalid messId or utilityId format' });
        }

        let utilityBill = await UtilityBill.findOne({ messId, month, year });

        if (!utilityBill) {
            return res.status(404).json({ message: 'Utility bill not found' });
        }

        const utility = utilityBill.utilities.id(utilityId);

        if (!utility) {
            return res.status(404).json({ message: 'Utility not found' });
        }

        utility.utilityName = utilityName;
        utility.utilityCost = utilityCost;

        await utilityBill.save();

        res.json(utilityBill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a utility bill
exports.deleteUtility = async (req, res) => {
    try {
        const { messId, utilityId, month, year } = req.body;

        if (!mongoose.Types.ObjectId.isValid(messId) || !mongoose.Types.ObjectId.isValid(utilityId)) {
            return res.status(400).json({ message: 'Invalid messId or utilityId format' });
        }

        let utilityBill = await UtilityBill.findOne({ messId, month, year });

        if (!utilityBill) {
            return res.status(404).json({ message: 'Utility bill not found' });
        }

        const utility = utilityBill.utilities.id(utilityId);

        if (!utility) {
            return res.status(404).json({ message: 'Utility not found' });
        }

        utility.remove();

        await utilityBill.save();

        res.json(utilityBill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalUtilityCost = async (req, res) => {
    try {
        const { messId, month, year } = req.params;

        if (!mongoose.Types.ObjectId.isValid(messId)) {
            return res.status(400).json({ message: 'Invalid messId format' });
        }

        const utilityBill = await UtilityBill.findOne({ messId, month, year });

        if (!utilityBill) {
            return res.status(404).json({ message: 'Utility bill not found' });
        }

        const totalUtilityCost = utilityBill.utilities.reduce((total, utility) => {
            return total + utility.utilityCost;
        }, 0);

        res.json({ messId, month, year, totalUtilityCost });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
