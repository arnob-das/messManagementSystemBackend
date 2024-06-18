const MealDeposit = require('../models/MealDepositModel');

exports.addMealDeposit = async (req, res) => {
    const { currentMessId, date, depositAmount, userId, userFullName } = req.body;

    const depositDate = new Date(date);
    const month = depositDate.getMonth() + 1; // Extract month (0-indexed)
    const year = depositDate.getFullYear(); // Extract year

    try {
        let mealDeposit = await MealDeposit.findOne({ currentMessId, month, year });

        if (!mealDeposit) {
            mealDeposit = new MealDeposit({ currentMessId, month, year, deposits: [] });
        }
        mealDeposit.deposits.push({ userId, depositDate, depositAmount, userFullName, status: "pending" });

        await mealDeposit.save();

        res.status(201).json(mealDeposit);
    } catch (error) {
        console.error('Error adding meal deposits', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateMealDeposit = async (req, res) => {
    const { depositId, depositAmount } = req.body;

    try {
        const mealDeposit = await MealDeposit.findOne({ 'deposits._id': depositId });

        if (!mealDeposit) {
            return res.status(404).json({ message: 'Deposit not found' });
        }

        const deposit = mealDeposit.deposits.id(depositId);
        deposit.depositAmount = depositAmount;

        await mealDeposit.save();

        res.status(200).json(mealDeposit);
    } catch (error) {
        console.error('Error updating meal deposit', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateMealDepositStatus = async (req, res) => {
    const { depositId, status } = req.body;

    try {
        const mealDeposit = await MealDeposit.findOne({ 'deposits._id': depositId });

        if (!mealDeposit) {
            return res.status(404).json({ message: 'Deposit not found' });
        }
        const deposit = mealDeposit.deposits.id(depositId);

        deposit.status = status;

        await mealDeposit.save();

        res.status(200).json({ mealDeposit, message: 'Deposit status updated successfully' });
    } catch (error) {
        console.error('Error updating meal deposit status', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteMealDeposit = async (req, res) => {
    const { depositId } = req.body;

    try {
        const mealDeposit = await MealDeposit.findOne({ 'deposits._id': depositId });

        if (!mealDeposit) {
            return res.status(404).json({ message: 'Deposit not found' });
        }

        mealDeposit.deposits.id(depositId).remove();

        await mealDeposit.save();

        res.status(200).json({ mealDeposit, message: 'Deposit deleted successfully' });
    } catch (error) {
        console.error('Error deleting meal deposit', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getMessMealDeposits = async (req, res) => {
    const { currentMessId, date } = req.query;


    const depositDate = new Date(date);
    const month = depositDate.getMonth() + 1;
    const year = depositDate.getFullYear();

    try {
        const mealDeposits = await MealDeposit.findOne({
            currentMessId, month, year
        })

        if (!mealDeposits) {
            return res.status(404).json({ message: 'No deposits found for the specified criteria' });
        }
        res.status(200).json(mealDeposits);
    } catch (error) {
        console.error('Error fetching meal deposits', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getUserMealDeposits = async (req, res) => {
    const { currentMessId, date, userId } = req.query;
    
    const depositDate = new Date(date);
    const month = depositDate.getMonth() + 1;
    const year = depositDate.getFullYear();

    try {
        const mealDeposits = await MealDeposit.findOne({
            currentMessId,
            month,
            year,
            'deposits.userId': userId
        }).populate('deposits.userId', 'fullName email');

        if (!mealDeposits) {
            return res.status(404).json({ message: 'No deposits found for the specified criteria' });
        }

        const userDeposits = mealDeposits.deposits.filter(deposit => deposit.userId._id.toString() === userId);
        res.status(200).json(userDeposits);
    } catch (error) {
        console.error('Error fetching user meal deposits', error);
        res.status(500).json({ message: error.message });
    }
};
