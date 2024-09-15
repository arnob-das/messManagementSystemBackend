const MealCountModel = require('../models/MealCountModel');
const UserModel = require('../models/UserModel');

exports.addMeal = async (req, res) => {
    const { currentMessId, month, year, meal } = req.body;

    try {
        let mealCount = await MealCountModel.findOne({ currentMessId, month, year });

        if (!mealCount) {
            mealCount = new MealCountModel({ currentMessId, month, year, meals: [meal] });
        } else {
            const existingMealIndex = mealCount.meals.findIndex(
                m => m.userId.toString() === meal.userId && new Date(m.mealDate).toDateString() === new Date(meal.mealDate).toDateString()
            );

            if (existingMealIndex !== -1) {
                mealCount.meals[existingMealIndex] = meal;
            } else {
                mealCount.meals.push(meal);
            }
        }

        await mealCount.save();

        res.status(201).json({ mealCount, message: 'Meal added successfully' });
    } catch (error) {
        console.error('Error adding meal:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getMeals = async (req, res) => {
    const { currentMessId, userId, month, year } = req.query;

    try {
        const mealCounts = await MealCountModel.findOne({
            currentMessId,
            month,
            year,
        });

        const userMeals = mealCounts.meals.filter(meal => meal.userId.equals(userId));


        if (!mealCounts) {
            return res.status(404).json({ message: 'No meal data found for the specified mess, user, month, and year' });
        }

        const response = {
            currentMessId: mealCounts.currentMessId,
            month: mealCounts.month,
            year: mealCounts.year,
            meals: userMeals
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAllMessMembersMeals = async (req, res) => {
    const { currentMessId, month, year } = req.params;

    try {
        const mealCounts = await MealCountModel.findOne({
            currentMessId,
            month,
            year,
        });

        if (!mealCounts) {
            return res.status(404).json({ message: 'No meal data found for the specified mess, month, and year' });
        }

        const mealsByUser = mealCounts.meals.reduce((acc, meal) => {
            if (!acc[meal.userId]) {
                acc[meal.userId] = [];
            }
            acc[meal.userId].push(meal);
            return acc;
        }, {});

        const groupedMeals = await Promise.all(Object.keys(mealsByUser).map(async userId => {
            const user = await UserModel.findById(userId);
            return {
                userId,
                userFullName: user ? user.fullName : 'Unknown',
                meals: mealsByUser[userId]
            };
        }));

        res.status(200).json(groupedMeals);
    } catch (error) {
        console.error('Error fetching meals:', error);
        res.status(500).json({ message: error.message });
    }
};



exports.editMeal = async (req, res) => {
    const { mealId, meal } = req.body;

    try {
        let mealCount = await MealCountModel.findOne({ 'meals._id': mealId });

        if (!mealCount) {
            return res.status(404).json({ message: 'No meal data found for the specified meal ID' });
        }

        const existingMealIndex = mealCount.meals.findIndex(m => m._id.toString() === mealId);

        if (existingMealIndex !== -1) {
            mealCount.meals[existingMealIndex] = { ...mealCount.meals[existingMealIndex], ...meal };
            await mealCount.save();
            res.status(200).json({ mealCount, message: 'Meal updated successfully' });
        } else {
            res.status(404).json({ message: 'No meal data found for the specified meal ID' });
        }
    } catch (error) {
        console.error('Error editing meal:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMeal = async (req, res) => {
    const { mealId } = req.body;

    try {
        let mealCount = await MealCountModel.findOne({ 'meals._id': mealId });

        if (!mealCount) {
            return res.status(404).json({ message: 'No meal data found for the specified meal ID' });
        }

        const existingMealIndex = mealCount.meals.findIndex(m => m._id.toString() === mealId);

        if (existingMealIndex !== -1) {
            mealCount.meals.splice(existingMealIndex, 1);
            await mealCount.save();
            res.status(200).json({ mealCount, message: 'Meal deleted successfully' });
        } else {
            res.status(404).json({ message: 'No meal data found for the specified meal ID' });
        }
    } catch (error) {
        console.error('Error deleting meal:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getTotalMealCountForMess = async (req, res) => {
    const { messId, month, year } = req.params;

    try {
        const mealCount = await MealCountModel.findOne({ currentMessId: messId, month, year });

        if (!mealCount) {
            return res.status(404).json({ message: 'No meal data found for the specified mess, month, and year' });
        }

        const totalMeals = mealCount.meals.reduce((total, meal) => {
            return total + meal.breakfast + meal.lunch + meal.dinner;
        }, 0);

        res.status(200).json({ messId, month, year, totalMeals });
    } catch (error) {
        console.error('Error fetching total meal count:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getTotalMealCountForUser = async (req, res) => {
    const { messId, month, year, userId } = req.params;

    try {
        const mealCount = await MealCountModel.findOne({ currentMessId: messId, month, year });

        if (!mealCount) {
            return res.status(404).json({ message: 'No meal data found for the specified mess, month, and year' });
        }

        const userMeals = mealCount.meals.filter(meal => meal.userId.equals(userId));

        if (userMeals.length === 0) {
            return res.status(404).json({ message: 'No meal data found for the specified user in the given mess, month, and year' });
        }

        const totalMeals = userMeals.reduce((total, meal) => {
            return total + meal.breakfast + meal.lunch + meal.dinner;
        }, 0);

        res.status(200).json({ messId, month, year, userId, totalMeals });
    } catch (error) {
        console.error('Error fetching total meal count for user:', error);
        res.status(500).json({ message: error.message });
    }
};