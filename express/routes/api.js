const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const Todo = require('../models/todo');
const Room = require('../models/room');
const { Client, Status } = require("@googlemaps/google-maps-services-js");
require('dotenv').config();

let GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
let YELP_API_KEY = process.env.YELP_API_KEY;

router.delete('/todos/:id', (req, res, next) => {
    Todo.findOneAndDelete({ "_id": req.params.id })
        .then(data => res.json(data))
        .catch(next)
});

router.post('/create-room', async (req, res, next) => {
    let longitude = req.body.longitude;
    let latitude = req.body.latitude;
    let radius = req.body.radius;
    let city = req.body.city;
    let restaurantsArray;
    try {
        let roomNumber = await generateNewUniqueRoomNumber();
        console.log("new unique room number is", roomNumber); //todo remove this line
        restaurantsArray = await getRestaurants(longitude, latitude, radius);
        // await addRestaurantsURL(restaurantsArray);
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
            }).catch(next);
        }
    } catch (e) {
        res.status(500).send(e).end();
        console.error(e);
    }
});

router.get('/rooms', (req, res, next) => {
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
            // first result (most precise), second address component to skip street number and street name
            res.send(r.data.results[0].address_components[2]);
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

// This function is no longer in use after switching to Yelp API.
function addRestaurantsURL(restaurantsArray) {
    return new Promise(async function (resolve, reject) {
        for (let i = 0; i < restaurantsArray.length; i++) {
            let photoReference = restaurantsArray[i].photoReference;
            let photoURL = await getPhotoURL(photoReference);
            restaurantsArray[i].photoURL = photoURL;
        }
        resolve(restaurantsArray);
    });
}

// This function is no longer in use after switch to Yelp API.
function getPhotoURL(photoReference) {
    const client = new Client({});

    return new Promise(function (resolve, reject) {
        client.placePhoto({
            params: {
                photoreference: photoReference,
                key: GOOGLE_MAPS_API_KEY,
                maxwidth: 480
            }
        }).then(result => {
            if (result.status === 200) {
                let url = result.request.res.responseUrl;
                resolve(url);
            } else {
                reject(new Error("Google API error."));
            }
        }).catch(e => {
            console.log(e);
            reject(new Error("An unknown error occurred"));
        });
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

// This function is no longer needed after switch to Yelp API.
router.get('/imagesURL', (req, res, next) => {
    let photoReference = req.query.photoReference;
    const client = new Client();

    client.placePhoto({
        params: {
            photoreference: photoReference,
            key: GOOGLE_MAPS_API_KEY,
            maxwidth: 480
        }
    }).then(result => {
        if (result.status === 200) {
            let url = result.request.res.responseUrl;
            res.send(url);
        } else {
            res.status(500).send("Google API error.").end();
        }
    }).catch(e => {
        console.error(e);
        res.status(500).send("An unknown error occurred").end();
        next;
    });
});

async function getRestaurantsGoogle(longitude, latitude, radius) {
    let latlng = latitude + "," + longitude;
    let radiusMetres = radius * 1000;
    let restaurantAPIResults = [];
    let restaurantResults = [];

    const client = new Client({});

    return new Promise(function (resolve, reject) {
        client.placesNearby({
            params: {
                key: GOOGLE_MAPS_API_KEY,
                location: latlng,
                radius: radiusMetres,
                type: "restaurant"
            },
        }).then(results => {
            if (results.data.status === Status.OK) {
                restaurantAPIResults = results.data.results;
                for (let i = 0; i < restaurantAPIResults.length; i++) {
                    let curRestaurantLat = restaurantAPIResults[i].geometry.location.lat;
                    let curRestaurantLng = restaurantAPIResults[i].geometry.location.lng;
                    let curRestaurant = {
                        name: restaurantAPIResults[i].name,
                        address: restaurantAPIResults[i].vicinity,
                        photoReference: restaurantAPIResults[i].photos[0].photo_reference,
                        placeID: restaurantAPIResults[i].place_id,
                        distance: distance(latitude, longitude, curRestaurantLat, curRestaurantLng, "K")
                    };
                    restaurantResults.push(curRestaurant);
                }
            } else if (results.data.status === "ZERO_RESULTS") {
                console.log("Found zero results in a nearby places API call.");
            } else {
                reject("Google API error");
            }
            resolve(restaurantResults);
        }).catch(e => {
            reject(e);
            console.log(e);
            next;
        });
    });
}

/*
This function's code was licensed under LGPLv3, retrieved from https://www.geodatasource.com/developers/javascript
*/
function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}


module.exports = router;