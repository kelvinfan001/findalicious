const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const Room = require('../models/room');
const { Client, Status } = require("@googlemaps/google-maps-services-js");
require('dotenv').config();

let GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
let YELP_API_KEY = process.env.YELP_API_KEY;

router.post('/create-room', async (req, res, next) => {
    let longitude = req.body.longitude;
    let latitude = req.body.latitude;
    let radius = req.body.radius;
    let city = req.body.city;
    let restaurantsArray;
    try {
        let roomNumber = await generateNewUniqueRoomNumber();
        restaurantsArray = await getRestaurants(longitude, latitude, radius);
        if (restaurantsArray.length === 0) {
            res.status(404).send("No restaurants found.").end();
        } else {
            Room.create({
                roomNumber: roomNumber,
                longitude: longitude,
                latitude: latitude,
                radius: radius,
                restaurants: restaurantsArray,
                city: city
            }).then(data => {
                res.json(data)
            }).catch(e => {
                console.error(e);
                res.status(500).end();
            });
        }
    } catch (e) {
        res.status(500).send(e).end();
        console.error(e);
    }
});

router.get('/rooms', (req, res) => {
    if (req.query.roomNumber) {
        Room.findOne({ roomNumber: req.query.roomNumber }).then(result => {
            if (result) {
                res.json(result);
            } else {
                res.status(404).end();
            }
        }).catch(e => {
            res.status(500).end();
        });
    } else {
        Room.find({}, ['roomNumber', 'participantCount']).then(
            data => res.json(data)
        ).catch(e => {
            res.status(500).end();
        });
    }
});

router.get('/additionalPhotos', (req, res) => {
    if (req.query.id) {
        let url = "https://api.yelp.com/v3/businesses/" + req.query.id;
        let headers = {
            "Authorization": "Bearer " + YELP_API_KEY
        };
        fetch(url,
            { method: "GET", headers: headers })
            .then(results => {
                if (results.status !== 200) {
                    throw new Error("Could not get a response from API.");
                }
                return results.json();
            })
            .then(resultsJSON => {
                res.json(resultsJSON);
            })
            .catch(e => {
                console.error(e);
                res.status(500).send(e).end();
            })
    }
});


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
            // first result (most precise)
            let fullAddress = r.data.results[0].formatted_address;
            let shortAddress = fullAddress.split(",")[0];
            res.send(shortAddress);
        } else {
            console.log(r);
            console.log(r.data.error_message);
        }
    }).catch((e) => {
        res.status(500).send("An unknown error occurred").end();
        console.log(e);
    });
});

function checkRoomAlreadyExists(roomNumber) {
    return new Promise((resolve, reject) => {
        Room.findOne({ roomNumber: roomNumber }).then(result => {
            if (result) {
                resolve(true);
            }
            resolve(false);
        }).catch(e => {
            console.error(e);
            reject(e);
        });
    });
}

function generateNewUniqueRoomNumber() {
    let roomNumber = Math.floor(Math.random() * (10000 - 1000)) + 1000;

    return new Promise(async (resolve, reject) => {
        try {
            let roomAlreadyExists = await checkRoomAlreadyExists(roomNumber);
            while (roomAlreadyExists) {
                roomNumber = Math.floor(Math.random() * 10000);
                roomAlreadyExists = await checkRoomAlreadyExists(roomNumber);
            }
            resolve(roomNumber);
        } catch (e) {
            console.error(e);
            reject(e);
        }
    });
}

function getRestaurants(longitude, latitude, radius) {
    let radiusMetres = radius * 1000;
    let restaurantApiResults = [];
    let restaurantResults = [];

    let url = "https://api.yelp.com/v3/businesses/search?open_now=true&categories=restaurants"
    let headers = {
        "Authorization": "Bearer " + YELP_API_KEY
    };

    return new Promise(function (resolve, reject) {
        fetch(url +
            "&latitude=" + latitude +
            "&longitude=" + longitude +
            "&radius=" + radiusMetres,
            { method: "GET", headers: headers })
            .then(results => {
                if (results.status !== 200) {
                    throw new Error("Could not get a response from API.");
                }
                return results.json();
            })
            .then(resultsJSON => {
                restaurantApiResults = resultsJSON.businesses;
                for (let i = 0; i < restaurantApiResults.length; i++) {
                    let curRestaurant = {
                        placeID: (restaurantApiResults[i].id),
                        name: restaurantApiResults[i].name,
                        yelpURL: restaurantApiResults[i].url,
                        address: restaurantApiResults[i].location.address1,
                        distance: restaurantApiResults[i].distance,
                        photoURL: restaurantApiResults[i].image_url,
                        price: restaurantApiResults[i].price,
                        rating: restaurantApiResults[i].rating
                    };
                    restaurantResults.push(curRestaurant);
                }
                resolve(restaurantResults);
            })
            .catch(e => {
                reject(e);
                console.error(e);
            });
    });
}

module.exports = router;