const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const messRoutes = require('./routes/messRoutes');
const mealCountRoutes = require('./routes/mealCountRoutes');
const mealDepositRoutes = require('./routes/mealDepositRoutes');
const utilityBillRoutes = require('./routes/utilityBillRoutes');
const groceryCostRoutes = require('./routes/groceryCostRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb://localhost:27017/messManagementSystem';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/user', userRoutes);
app.use('/mess', messRoutes);
app.use('/mealCount', mealCountRoutes);
app.use('/mealDeposit', mealDepositRoutes);
app.use('/utilityBill', utilityBillRoutes);
app.use('/groceryCost', groceryCostRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
