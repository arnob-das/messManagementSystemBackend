const MealCountModel = require('../models/MealCountModel');

exports.addMeal = async (req, res) => {
    // const { messId, month, year, meal } = req.body;

    // try {
    //     // Check if the meal count document for the specified mess, month, and year already exists
    //     let mealCount = await MealCountModel.findOne({ messId, month, year });

    //     if (!mealCount) {
    //         // Create a new document if it doesn't exist
    //         mealCount = new MealCountModel({ messId, month, year, meals: [meal] });
    //     } else {
    //         // Check if the meal for the specified user and date already exists
    //         const existingMealIndex = mealCount.meals.findIndex(
    //             m => m.userId.equals(meal.userId) && m.mealDate.toDateString() === new Date(meal.mealDate).toDateString()
    //         );

    //         if (existingMealIndex !== -1) {
    //             // Replace the existing meal entry
    //             mealCount.meals[existingMealIndex] = meal;
    //         } else {
    //             // Add the new meal entry
    //             mealCount.meals.push(meal);
    //         }
    //     }

    //     // Save the document
    //     await mealCount.save();

    //     res.status(201).json({ message: 'Meal added successfully', mealCount });
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }

    const { currentMessId, month, year, meal } = req.body;

    try {
        // Create or update MealCount document
        let mealCount = await MealCountModel.findOneAndUpdate(
            { currentMessId, month, year },
            { $addToSet: { meals: meal } }, // Using $addToSet to avoid duplicates
            { upsert: true, new: true }
        );

        res.status(201).json({ message: 'Meal added successfully', mealCount });
    } catch (error) {
        console.error('Error adding meal:', error);
        res.status(500).json({ message: error.message });
    }
};
