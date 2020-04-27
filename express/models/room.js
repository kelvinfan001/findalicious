const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema for room
const RoomSchema = new Schema({
    roomNumber: { type: Number, required: true },
    latitude: String,
    radius: String,
    restaurants: [
        {
            name: String,
            address: String,
            rating: Number,
            // photoReference is a string identifier that uniquely identifies a photo. Photo references are 
            // returned from either a Place Search or Place Details request by the Google Maps Places API.
            photoReference: String,
            likeCount: Number
        }
    ],
    // participantCount: { type: Number, default: 0 },
    participants: [
        {
            socketID: String
        }
    ],
    created: { type: Date, default: Date.now }
})

// create model for room
const Room = mongoose.model('room', RoomSchema);

module.exports = Room;