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
        }).then(res => {
            if (res.status === 200) {
                res.json().then(resJSON => {
                    let longitude = resJSON.location.lng;
                    let latitude = resJSON.location.lat;
                    let state = { longitude: longitude, latitude: latitude, currentCity: "Coordinates Retrieved..." }
                    parentThis.setState(state);
                    fetch(expressServer + "/api/location?longitude=" + longitude + "&latitude=" + latitude, {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        },
                        credentials: "include"
                    }).then(res => {
                        if (res.status === 200) {
                            res.json().then(resJSON => {
                                console.log(resJSON)
                                let state = { currentCity: resJSON.long_name }
                                parentThis.setState(state);
                            });
                        } else {
                            parentThis.setState({ currentCity: "Cannot get location" });
                        }
                    }).catch((e) => {
                        parentThis.setState({ currentCity: "Cannot get location" });
                        console.log(e);
                    });
                });
            } else {
                parentThis.setState({ currentCity: "Cannot get coordinates..." });
            }
        }).catch((e) => {
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