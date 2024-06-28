const GroceryCost = require('../models/GroceryCostModel');

exports.addGroceryCost = async (req, res) => {
    const { messId, month, year, groceries } = req.body;

    try {
        let groceryCost = await GroceryCost.findOne({ messId, month, year });

        if (!groceryCost) {
            groceryCost = new GroceryCost({ messId, month, year, groceries });
        } else {
            groceryCost.groceries.push(...groceries);
        }

        await groceryCost.save();

        res.status(201).json({ groceryCost, message: 'Grocery cost added successfully' });
    } catch (error) {
        console.error('Error adding grocery cost:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateGroceryCost = async (req, res) => {
    const { messId, month, year, groceryId, groceryDetails, price } = req.body;

    try {
        const groceryCost = await GroceryCost.findOne({ messId, month, year });

        if (!groceryCost) {
            return res.status(404).json({ message: 'No grocery cost data found for the specified mess, month, and year' });
        }

        const groceryIndex = groceryCost.groceries.findIndex(g => g._id.toString() === groceryId);

        if (groceryIndex !== -1) {
            groceryCost.groceries[groceryIndex].groceryDetails = groceryDetails;
            groceryCost.groceries[groceryIndex].price = price;
            await groceryCost.save();
            res.status(200).json({ groceryCost, message: 'Grocery cost updated successfully' });
        } else {
            res.status(404).json({ message: 'No grocery data found for the specified grocery ID' });
        }
    } catch (error) {
        console.error('Error updating grocery cost:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteGroceryCost = async (req, res) => {
    const { messId, month, year, groceryId } = req.body;

    try {
        const groceryCost = await GroceryCost.findOne({ messId, month, year });

        if (!groceryCost) {
            return res.status(404).json({ message: 'No grocery cost data found for the specified mess, month, and year' });
        }

        const groceryIndex = groceryCost.groceries.findIndex(g => g._id.toString() === groceryId);

        if (groceryIndex !== -1) {
            groceryCost.groceries.splice(groceryIndex, 1);
            await groceryCost.save();
            res.status(200).json({ groceryCost, message: 'Grocery cost deleted successfully' });
        } else {
            res.status(404).json({ message: 'No grocery data found for the specified grocery ID' });
        }
    } catch (error) {
        console.error('Error deleting grocery cost:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getGroceryCost = async (req, res) => {
    const { messId, month, year } = req.params;

    try {
        const groceryCost = await GroceryCost.findOne({ messId, month, year });

        if (!groceryCost) {
            return res.status(404).json({ message: 'No grocery cost data found for the specified mess, month, and year' });
        }

        res.status(200).json(groceryCost);
    } catch (error) {
        console.error('Error fetching grocery cost:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getTotalGroceryCost = async (req, res) => {
    const { messId, month, year } = req.params;

    try {
        const groceryCost = await GroceryCost.findOne({ messId, month, year });

        if (!groceryCost) {
            return res.status(404).json({ message: 'No grocery cost data found for the specified mess, month, and year' });
        }

        const totalCost = groceryCost.groceries.reduce((sum, grocery) => sum + grocery.price, 0);

        res.status(200).json({ totalCost, message: 'Total grocery cost calculated successfully' });
    } catch (error) {
        console.error('Error calculating total grocery cost:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getTotalGroceryCostByUser = async (req, res) => {
    const { messId, month, year, userId } = req.params;

    try {
        const groceryCost = await GroceryCost.findOne({ messId, month, year });

        if (!groceryCost) {
            return res.status(404).json({ message: 'No grocery cost data found for the specified mess, month, and year' });
        }

        const totalCost = groceryCost.groceries
            .filter(grocery => grocery.userId.toString() === userId)
            .reduce((sum, grocery) => sum + grocery.price, 0);

        res.status(200).json({ totalCost, message: 'Total grocery cost for user calculated successfully' });
    } catch (error) {
        console.error('Error calculating total grocery cost for user:', error);
        res.status(500).json({ message: error.message });
    }
};

