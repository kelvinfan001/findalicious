import React from 'react';

let expressServer = process.env.REACT_APP_EXPRESS_SERVER;
let googleKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

class CreateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: 'Retrieving Location...',
            longitude: 0,
            latitude: 0,
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

                {/* <img src={logo} className="logo" /> */}
                <h2> Create Room </h2>
                <p>{this.state.currentCity}</p>
                <button
                    onTouchStart="">
                    READY
                </button>
            </div>
        )
    }
}

export default CreateRoom;