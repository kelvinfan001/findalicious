const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const { Client, Status } = require("@googlemaps/google-maps-services-js");
require('dotenv').config();

let GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

router.get('/todos', (req, res, next) => {

    //this will return all the data, exposing only the id and action field to the client
    Todo.find({}, 'action')
        .then(data => res.json(data))
        .catch(next)
});

router.get('/test', (req, res) => {
    res.send('test works!')
});

router.post('/todos', (req, res, next) => {
    if (req.body.action) {
        Todo.create(req.body)
            .then(data => res.json(data))
            .catch(next)
    } else {
        res.json({
            error: "The input field is empty"
        })
    }
});

router.delete('/todos/:id', (req, res, next) => {
    Todo.findOneAndDelete({ "_id": req.params.id })
        .then(data => res.json(data))
        .catch(next)
})

router.get('/location', (req, res) => {
    let latitude = req.query.latitude;
    let longitude = req.query.longitude;
    let latitudelongitude = latitude + "," + longitude;

    const client = new Client({});

    client.reverseGeocode({
        params: {
            latlng: latitudelongitude,
            key: GOOGLE_MAPS_API_KEY,
        },
        timeout: 1000, // milliseconds
    }).then((r) => {
        if (r.data.status === Status.OK) {
            res.send(r.data.results[0].address_components[2]);
        } else {
            console.log(r.data.error_message);
        }
    }).catch((e) => {
        console.log(e);
    });
});

module.exports = router;