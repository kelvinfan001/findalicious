import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import RadiusButtons from './RadiusButtons';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';

let expressServer = process.env.REACT_APP_EXPRESS_SERVER;

class CreateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: 'Retrieving Location...',
            longitude: 0,
            latitude: 0,
            locationRetrieved: false,
            radius: 1,
            loading: false
        };
        this.createJoinRoom = this.createJoinRoom.bind(this);
        this.goToRoom = this.goToRoom.bind(this);
        this.updateRadius = this.updateRadius.bind(this);
    }

    updateRadius(radius) {
        this.setState({ radius: radius });
    }

    redirectHome() {
        window.location.assign('/');
    }


    componentDidMount() {
        let parentThis = this;

        // Check if already joined a room (e.g. if user clicked browser prev page to this page after joining a room)
        let socket = this.props.socket;
        socket.emit("check joined room");

        // Listen on already joined room response
        socket.on('has joined room response', (hasJoinedRoom) => {
            if (hasJoinedRoom) {
                // We make the client refresh so it can leave the room and join as a new socket connection.
                this.redirectHome();
            }
        });

        // Geolocation and reverse geocoding
        let options = {
            enableHighAccuracy: true
        };

        async function success(pos) {
            let coords = pos.coords;
            let latitude = coords.latitude;
            let longitude = coords.longitude;
            let state = { latitude: latitude, longitude: longitude, currentCity: "Coordinates Retrieved..." }
            console.log(pos.coords.accuracy);
            parentThis.setState(state);
            try {
                let geocodeResult = await fetch(expressServer + "/api/location?longitude=" + longitude + "&latitude=" + latitude, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                });
                if (geocodeResult.status === 200) {
                    geocodeResult.json().then(geocodeResultJSON => {
                        let state = { currentCity: geocodeResultJSON.long_name, locationRetrieved: true }
                        parentThis.setState(state);
                    });
                } else {
                    parentThis.setState({ currentCity: "Cannot get location" });
                    throw new Error("Google geocoding API cannot get a location");
                }
            } catch (e) {
                parentThis.setState({ currentCity: "Cannot get location" });
                console.error(e);
            }
        }

        function error(err) {
            alert(err.message);
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        if (!navigator.geolocation) {
            alert("Browser geolocation must be enabled.");
            console.warn("Geolocation not enabled on this browser.");
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    //     fetch("https://www.googleapis.com/geolocation/v1/geolocate?key=" + googleKey, {
    //         method: "POST",
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         }
    //     }).then(geolocationResult => {
    //         if (geolocationResult.status === 200) {
    //             return geolocationResult.json()
    //         } else {
    //             parentThis.setState({ currentCity: "Cannot get coordinates" });
    //             return Promise.reject("Google geolocation API cannot get coordinates");
    //         }
    //     }).then(geolocationResultJSON => {
    //         let longitude = geolocationResultJSON.location.lng;
    //         let latitude = geolocationResultJSON.location.lat;
    //         let state = { longitude: longitude, latitude: latitude, currentCity: "Coordinates Retrieved..." }
    //         parentThis.setState(state);
    //         return fetch(expressServer + "/api/location?longitude=" + longitude + "&latitude=" + latitude, {
    //             method: "GET",
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json"
    //             }
    //         });
    //     }).then(geocodeResult => {
    //         if (geocodeResult.status === 200) {
    //             geocodeResult.json().then(geocodeResultJSON => {
    //                 let state = { currentCity: geocodeResultJSON.long_name, locationRetrieved: true }
    //                 parentThis.setState(state);
    //             });
    //         } else {
    //             parentThis.setState({ currentCity: "Cannot get location" });
    //             Promise.reject("Google geocoding API cannot get a location");
    //         }
    //     }).catch(e => {
    //         parentThis.setState({ currentCity: "Cannot get location" });
    //         console.log(e);
    //     });
    // }

    createJoinRoom() {
        let longitude = this.state.longitude;
        let latitude = this.state.latitude;
        let radius = this.state.radius;
        let currentCity = this.state.currentCity;
        this.setState({ loading: true });
        fetch(expressServer + "/api/create-room", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            // credentials: "include",
            body: JSON.stringify({
                longitude: longitude,
                latitude: latitude,
                radius: radius,
                city: currentCity
            })
        }).then(result => {
            if (result.status === 200) {
                result.json().then(resultJSON => {
                    let roomNumber = resultJSON.roomNumber;
                    let roomURL = "/rooms/" + roomNumber;
                    this.goToRoom(roomURL);
                });
            } else if (result.status === 404) {
                alert("No restaurants found in your area. Try a larger radius.");
            } else {
                alert("Unknown error. Server may be down.");
                this.props.history.push('/');
            }
        }).catch(e => {
            console.log(e);
        });
    }

    goToRoom(roomURL) {
        this.props.history.push(roomURL);
    }

    render() {
        // let updateRadius = this.updateRadius;

        return (
            <LoadingOverlay
                active={this.state.loading}
                spinner={<BeatLoader />}
                text='Creating Room...'
            >
                <div className="main-page">
                    <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
                    <h2> Restaurants Near </h2>
                    <div>
                        <FontAwesomeIcon icon={faLocationArrow} size="xs" />
                        <h4 style={{ display: "inline-block", margin: "6px" }}>{this.state.currentCity}</h4>
                    </div>
                    <RadiusButtons updateRadius={this.updateRadius.bind(this)} />
                    <button
                        onTouchStart=""
                        disabled={!this.state.locationRetrieved}
                        onClick={this.createJoinRoom}>
                        CREATE
                </button>
                </div>
            </LoadingOverlay>

        )
    }
}

export default CreateRoom;