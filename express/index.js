const express = require('express');
const routes = require('./routes/api');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");
require('dotenv').config();

const app = express();

const mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;

if (mongoURL == null) {
    mongoURL = 'mongodb://localhost:27017';
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// connect to db
const mongoose = require('mongoose');
mongoose.connect(mongoURL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // connection successful
    console.log('Successfully connected to MongoDB at: %s', mongoURL);
});

// cors settings
console.log(process.env.REACT_SERVER);
const corsOptions = {
    origin: process.env.REACT_SERVER, // address of React server
    methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS", // type of actions allowed
    credentials: true, // required to pass
    allowedHeaders: "Content-Type, Authorization, X-Requested-With"
};
// intercept pre-flight check for all routes. Pre-flight checks happen when dealing with special http headers.
app.options("*", cors(corsOptions));

// middleware
app.use(cors(corsOptions)); // use cors to allow cross-origin resource sharing since React is making calls to Express


app.use(bodyParser.json());

/* Routes */
app.use('/api', routes);
// React App
app.use(express.static(path.join(__dirname, '../react/build')));
app.get(['/*'], function (req, res) {
    res.sendFile(path.join(__dirname, '../react/build', 'index.html'));
});

app.use((err, req, res, next) => {
    console.log(err);
    next();
});

module.exports = app;