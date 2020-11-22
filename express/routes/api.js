const express = require('express')
const fetch = require('node-fetch')

const router = express.Router()
const { Client, Status } = require('@googlemaps/google-maps-services-js')
const Room = require('../models/room')
require('dotenv').config()

const { GOOGLE_MAPS_API_KEY } = process.env
const { YELP_API_KEY } = process.env

router.post('/create-room', async (req, res) => {
  const { longitude } = req.body
  const { latitude } = req.body
  const { radius } = req.body
  const { city } = req.body
  let restaurantsArray
  try {
    const roomNumber = await generateNewUniqueRoomNumber()
    restaurantsArray = await getRestaurants(longitude, latitude, radius)
    if (restaurantsArray.length === 0) {
      res.status(404).send('No restaurants found.').end()
    } else {
      try {
        const data = await Room.create({
          roomNumber,
          longitude,
          latitude,
          radius,
          restaurants: restaurantsArray,
          city
        })
        res.json(data)
      } catch (err) {
        console.error(err)
        res.status(500).end()
      }
    }
  } catch (e) {
    res.status(500).send(e).end()
    console.error(e)
  }
})

router.get('/rooms', async (req, res) => {
  try {
    if (req.query.roomNumber) {
      const result = await Room.findOne({ roomNumber: req.query.roomNumber })
      if (result) {
        res.json(result)
      } else {
        res.status(404).end()
      }
    } else {
      const data = await Room.find({}, ['roomNumber', 'participantCount'])
      res.json(data)
    }
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
})

router.get('/additionalPhotos', (req, res) => {
  if (req.query.id) {
    const url = `https://api.yelp.com/v3/businesses/${req.query.id}`
    const headers = {
      Authorization: `Bearer ${YELP_API_KEY}`
    }
    try {
      const results = fetch(url, { method: 'GET', headers })
      if (results.status !== 200) {
        throw new Error('Could not get a response from API.')
      }
      return res.json(results.json())
    } catch (err) {
      console.error(err)
      res.status(500).send(err).end()
    }
  }
})

router.get('/location', async (req, res) => {
  const { latitude } = req.query
  const { longitude } = req.query
  const latlng = `${latitude},${longitude}`

  const client = new Client({})

  try {
    const { data: geoData } = await client.reverseGeocode({
      params: {
        latlng,
        key: GOOGLE_MAPS_API_KEY
      },
      body: {
        radioType: 'lte'
      },
      timeout: 1000 // milliseconds
    })
    if (geoData.status === Status.OK) {
      // first result (most precise)
      const fullAddress = geoData.results[0].formatted_address
      const shortAddress = fullAddress.split(',')[0]
      res.send(shortAddress)
    } else {
      console.log(geoData)
      console.log(geoData.error_message)
    }
  } catch (err) {
    res.status(500).send('An unknown error occurred').end()
    console.log(err)
  }
})

function checkRoomAlreadyExists(roomNumber) {
  return new Promise((resolve, reject) => {
    Room.findOne({ roomNumber })
      /* eslint-disable-next-line promise/prefer-await-to-then */
      .then(result => {
        if (result) {
          return resolve(true)
        }
        return resolve(false)
      })
      .catch(e => {
        console.error(e)
        return reject(e)
      })
  })
}

function generateNewUniqueRoomNumber() {
  let roomNumber = Math.floor(Math.random() * (10000 - 1000)) + 1000

  /* eslint-disable-next-line */
  return new Promise(async (resolve, reject) => {
    try {
      let roomAlreadyExists = await checkRoomAlreadyExists(roomNumber)
      while (roomAlreadyExists) {
        roomNumber = Math.floor(Math.random() * 10000)
        /* eslint-disable-next-line */
        roomAlreadyExists = await checkRoomAlreadyExists(roomNumber)
      }
      resolve(roomNumber)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

async function getRestaurants(longitude, latitude, radius) {
  const radiusMetres = radius * 1000

  const url = 'https://api.yelp.com/v3/businesses/search?open_now=true&categories=restaurants'
  const headers = {
    Authorization: `Bearer ${YELP_API_KEY}`
  }

  const results = await fetch(`${url}&latitude=${latitude}&longitude=${longitude}&radius=${radiusMetres}`, {
    method: 'GET',
    headers
  })

  if (results.status !== 200) {
    throw new Error('Could not get a response from API.')
  }

  const resultsJson = results.json()

  const restaurantResults = resultsJson.businesses.map(business => ({
    placeID: business.id,
    name: business.name,
    yelpURL: business.url,
    address: business.location.address1,
    distance: business.distance,
    photoURL: business.image_url,
    price: business.price,
    rating: business.rating,
    category: business.categories[0].title
  }))

  return restaurantResults
}

module.exports = router
