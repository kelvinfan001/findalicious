import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import RadiusButtons from './RadiusButtons';
// import { socket } from '../../App';

let expressServer = process.env.REACT_APP_EXPRESS_SERVER;
let googleKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

class CreateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: 'Retrieving Location...',
            longitude: 0,
            latitude: 0,
            locationRetrieved: false,
            radius: 1
        };
        this.createJoinRoom = this.createJoinRoom.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
    }

    updateRadius(radius) {
        this.setState({ radius: radius });
    }

    componentDidMount() {
        let socket = this.props.socket;
        let parentThis = this;
        socket.on('room info', function (data) {
            console.log(data);
        });

        fetch("https://www.googleapis.com/geolocation/v1/geolocate?key=" + googleKey, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(geolocationResult => {
            if (geolocationResult.status === 200) {
                return geolocationResult.json()
            } else {
                parentThis.setState({ currentCity: "Cannot get coordinates" });
                return Promise.reject("Google geolocation API cannot get coordinates");
            }
        }).then(geolocationResultJSON => {
            let longitude = geolocationResultJSON.location.lng;
            let latitude = geolocationResultJSON.location.lat;
            let state = { longitude: longitude, latitude: latitude, currentCity: "Coordinates Retrieved..." }
            parentThis.setState(state);
            return fetch(expressServer + "/api/location?longitude=" + longitude + "&latitude=" + latitude, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            });
        }).then(geocodeResult => {
            if (geocodeResult.status === 200) {
                geocodeResult.json().then(geocodeResultJSON => {
                    let state = { currentCity: geocodeResultJSON.long_name, locationRetrieved: true }
                    parentThis.setState(state);
                });
            } else {
                parentThis.setState({ currentCity: "Cannot get location" });
                Promise.reject("Google geocoding API cannot get a location");
            }
        }).catch(e => {
            parentThis.setState({ currentCity: "Cannot get location" });
            console.log(e);
        });
    }

    createJoinRoom() {
        let longitude = this.state.longitude;
        let latitude = this.state.latitude;
        let radius = this.state.radius;
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
                radius: radius
            })
        }).then(result => {
            if (result.status === 200) {
                alert("Room Created!");
                result.json().then(resultJSON => {
                    console.log(resultJSON)
                    let roomNumber = resultJSON.roomNumber;
                    this.joinRoom(roomNumber);
                });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    joinRoom(roomNumber) {
        let socket = this.props.socket;
        socket.emit('room', roomNumber);
    }


    render() {
        let updateRadius = this.updateRadius;

        return (
            <div className="main-page">
                <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
                <h2> Restaurants Near </h2>
                <div>
                    <FontAwesomeIcon icon={faLocationArrow} size="xs" />
                    <h4 style={{ display: "inline-block", margin: "6px" }}>{this.state.currentCity}</h4>
                </div>
                <RadiusButtons updateRadius={updateRadius.bind(this)} />
                <button
                    onTouchStart=""
                    disabled={!this.state.locationRetrieved}
                    onClick={this.createJoinRoom}>
                    CREATE
                </button>
            </div>
        )
    }
}

export default CreateRoom;