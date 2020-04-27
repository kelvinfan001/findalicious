const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const Room = require('../models/room');
const { Client, Status } = require("@googlemaps/google-maps-services-js");
require('dotenv').config();

let GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

router.delete('/todos/:id', (req, res, next) => {
    Todo.findOneAndDelete({ "_id": req.params.id })
        .then(data => res.json(data))
        .catch(next)
})

router.get('/location', (req, res, next) => {
    let latitude = req.query.latitude;
    let longitude = req.query.longitude;
    let latitudelongitude = latitude + "," + longitude;

    const client = new Client({});

    client.reverseGeocode({
        params: {
            latlng: latitudelongitude,
            key: GOOGLE_MAPS_API_KEY
        },
        body: {
            radioType: "lte"
        },
        timeout: 1000, // milliseconds
    }).then((r) => {
        if (r.data.status === Status.OK) {
            // first result (most precise), second address component to skip street number and street name
            res.send(r.data.results[0].address_components[2]);
        } else {
            console.log(r);
            console.log(r.data.error_message);
        }
    }).catch((e) => {
        console.log(e);
        next;
    });
});

function checkRoomAlreadyExists(roomNumber) {
    Room.find({ roomNumber: roomNumber }).then(result => {
        if (result.length < 1) {
            return false;
        }
        return true;
    });
}

function generateNewUniqueRoomNumber() {
    let roomNumber = Math.floor(Math.random() * (10000 - 1000)) + 1000;
    let roomAlreadyExists = checkRoomAlreadyExists(roomNumber);
    while (roomAlreadyExists) {
        roomNumber = Math.floor(Math.random() * 10000);
        roomAlreadyExists = checkRoomAlreadyExists(roomNumber);
    }
    return roomNumber;
}

//TODO i think this needs to be an async function. review that pls
function getRestaurants(longitude, latitude, radius) {


    return [
        {
            name: "Kailong's Restaurant",
            address: "55 Spadina",
            rating: 5,
            photoReference: "CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU",
            likeCount: 0
        }
    ]
}

router.post('/create-room', (req, res, next) => {
    let longitude = req.body.longitude;
    let latitude = req.body.latitude;
    let radius = req.body.radius;
    let roomNumber = generateNewUniqueRoomNumber();
    let restaurantsArray = getRestaurants(longitude, latitude, radius);
    Room.create({
        roomNumber: roomNumber,
        longitude: longitude,
        latitude: latitude,
        radius: radius,
        restaurants: restaurantsArray
    }).then(data => {
        // req.session.roomNumber = roomNumber;
        res.json(data)
    }).catch(next);
});

router.get('/rooms', (req, res, next) => {
    if (req.query.roomNumber) {
        Room.findOne({ roomNumber: req.query.roomNumber }).then(result => {
            if (result) {
                // req.session.roomNumber = req.query.roomNumber;
                res.json(result);
            } else {
                res.status(404).end();
            }
        }).catch(next);
    } else {
        Room.find({}, ['roomNumber', 'participantCount']).then(
            data => res.json(data)
        ).catch(next);
    }
});

module.exports = router;