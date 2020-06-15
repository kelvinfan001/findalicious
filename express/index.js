const express = require('express');
const routes = require('./routes/api');
const bodyParser = require('body-parser');
const path = require('path');
const sslRedirect = require('heroku-ssl-redirect');
const cors = require("cors");
require('dotenv').config();

const app = express();
const server = require('http').Server(app);

// Regarding pingTimeout and pingInterval:
// https://github.com/socketio/socket.io/issues/3259#issuecomment-474523271, 
// https://github.com/socketio/socket.io/issues/2769
const io = require('socket.io')(server,
    {
        'pingTimeout': 50000,
        'pingInterval': 8000
    });
// const io = require('socket.io')(server);


/* Misc */
app.use((err, req, res, next) => {
    console.log(chalk.red.bold("ERROR"));
    console.log(err);
    if (!res.headersSent) {
        res.status(500).send("Sorry - something went wrong.");
    }
    next();
});
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// enable ssl redirect
app.use(sslRedirect());

/* Database */
let mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
if (mongoURL === null) {
    mongoURL = 'mongodb://localhost:27017';
}
const mongoose = require('mongoose');
mongoose.connect(mongoURL, { useNewUrlParser: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // connection successful
    console.log('Successfully connected to MongoDB at: %s', mongoURL);
});

/* CORS */
const corsOptions = {
    origin: process.env.REACT_SERVER, // address of React server
    methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS", // type of actions allowed
    credentials: true, // required to pass
    allowedHeaders: "Content-Type, Authorization, X-Requested-With"
};
// intercept pre-flight check for all routes. Pre-flight checks happen when dealing with special http headers.
app.options("*", cors(corsOptions));
app.use(cors(corsOptions)); // use cors to allow cross-origin resource sharing since React is making calls to Express

/* Routes */
app.use('/api', routes);

/* Socket */
require('./socket')(io);

/* React App */
app.use(express.static(path.join(__dirname, '../react/build')));
app.get(['/*'], function (req, res) {
    res.sendFile(path.join(__dirname, '../react/build', 'index.html'));
});

module.exports = server;