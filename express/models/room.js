const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema for room
const RoomSchema = new Schema({
    roomNumber: { type: Number, required: true },
    latitude: String,
    longitude: String,
    radius: Number,
    city: String,
    restaurants: [
        {
            placeID: String,
            name: String,
            yelpURL: String,
            address: String,
            distance: Number,
            rating: Number,
            photoURL: String,
            price: String,
            likeCount: { type: Number, default: 0 },
            curPhotoIndex: { type: Number, default: 0 },
            category: String
        }
    ],
    participants: [
        {
            socketID: String
        }
    ],
    created: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: false }
})

// create model for room
const Room = mongoose.model('room', RoomSchema);

module.exports = Room;