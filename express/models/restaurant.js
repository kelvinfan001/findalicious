const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema for room
const RestaurantSchema = new Schema({
    restaurantID: String,
    name: String,
    yelpURL: String,
    address: String,
    distance: Number,
    rating: Number,
    photoURL: String,
    price: String,
    likeCount: { type: Number, default: 0 }
})

// create model for room
const Restaurant = mongoose.model('restaurant', RestaurantSchema);

module.exports = Restaurant;