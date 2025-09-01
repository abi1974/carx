const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const reviewsRoute = require('./routes/reviews');
const bookingsRoute = require('./routes/bookings');
const carsRoute = require('./routes/cars');
const authRoute = require('./routes/auth');

// Routes
app.use('/reviews', reviewsRoute);
app.use('/bookings', bookingsRoute);
app.use('/cars', carsRoute);
app.use('/auth', authRoute);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/carx', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
