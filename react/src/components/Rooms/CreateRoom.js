import React from 'react';
// import JoinRoomForm from '../Rooms/JoinRoom';

let expressServer = process.env.REACT_APP_EXPRESS_SERVER;
console.log(expressServer);

class CreateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCity: '',
            longitude: 0,
            latitude: 0,
        };
    }

    componentDidMount() {
        let parentThis = this;
        navigator.geolocation.getCurrentPosition(function (position) {
            let longitude = position.coords.longitude;
            let latitude = position.coords.latitude;
            parentThis.setState({ longitude: position.coords.longitude });
            parentThis.setState({ latitude: position.coords.latitude });
            fetch(expressServer + "/api/location?longitude=" + longitude + "&latitude=" + latitude, {
                method: "get",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }).then(res => {
                if (res.status === 200) {
                    res.json().then(resJSON => {
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
    }

    render() {
        return (
            <div className="main-page">
                <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />

                {/* <img src={logo} className="logo" /> */}
                <h2> Create Room </h2>
                <p>Location: {this.state.currentCity}</p>
                <button
                    onTouchStart="">
                    READY
                </button>
            </div>
        )
    }
}

export default CreateRoom;