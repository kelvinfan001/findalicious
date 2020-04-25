import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import RadiusButtons from './RadiusButtons';

let expressServer = process.env.REACT_APP_EXPRESS_SERVER;
let googleKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

class CreateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: 'Retrieving Location...',
            longitude: 0,
            latitude: 0,
            radius: 0,
        };
    }

    componentDidMount() {
        let parentThis = this;

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
                    let state = { currentCity: geocodeResultJSON.long_name }
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

    render() {
        return (
            <div className="main-page">
                <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
                <h2> Restaurants Near </h2>
                <div>
                    <FontAwesomeIcon icon={faLocationArrow} size="xs" />
                    <h4 style={{ display: "inline-block", margin: "6px" }}>{this.state.currentCity}</h4>
                </div>
                <RadiusButtons />
                <button
                    onTouchStart="">
                    CREATE
                </button>
            </div>
        )
    }
}

export default CreateRoom;