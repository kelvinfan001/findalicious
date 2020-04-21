const express = require('express');
const routes = require('./routes/api');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;

if (mongoURL == null) {
    mongoURL = 'mongodb://localhost:27017';
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// connect to db
var mongoose = require('mongoose');
mongoose.connect(mongoURL, { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // connection successful
    console.log('Successfully connected to MongoDB at: %s', mongoURL);
});


app.use(bodyParser.json());

/* Routes */
app.use('/api', routes);
// React App
app.use(express.static(path.join(__dirname, '../react/build')));
app.get(['/*'], function (res) {
    res.sendFile(path.join(__dirname, '../react/build', 'index.html'));
});

app.use((err, req, res, next) => {
    console.log(err);
    next();
});

module.exports = app;