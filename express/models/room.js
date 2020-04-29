const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema for room
const RoomSchema = new Schema({
    roomNumber: { type: Number, required: true },
    latitude: String,
    radius: Number,
    city: String,
    restaurants: [
        {
            placeID: String,
            name: String,
            address: String,
            distance: Number,
            rating: Number,
            // photoReference is a string identifier that uniquely identifies a photo. Photo references are 
            // returned from either a Place Search or Place Details request by the Google Maps Places API.
            photoReference: String,
            likeCount: { type: Number, default: 0 }
        }
    ],
    // participantCount: { type: Number, default: 0 },
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