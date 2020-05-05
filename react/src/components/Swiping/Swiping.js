import React from 'react';
import './Swiping.css';
import TinderCard from 'react-tinder-card';

let expressServer = process.env.REACT_APP_EXPRESS_SERVER;

class Swiping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
        };
        // this.createJoinRoom = this.createJoinRoom.bind(this);
        // this.goToRoom = this.goToRoom.bind(this);
        this.swiped = this.swiped.bind(this);
    }
    // const db = this.state.restaurants;

    swiped(direction, placeID) {
        if (direction === "right") {
            let participantCount = this.state.participants.length;
            let socket = this.props.socket;
            socket.emit("swipe right", placeID, participantCount);
            console.log('removing: ' + placeID + ' after swiping ' + direction);
        }
    }

    outOfFrame(name) {
        console.log(name + ' left the screen!')
    }

    componentDidMount() {
        let socket = this.props.socket;
        let parentThis = this;
        if (!this.props.location.state.roomNumber) {
            this.props.history.push('/');
        }
        let roomNumber = this.props.location.state.roomNumber;
        fetch(expressServer + "/api/rooms/?roomNumber=" + roomNumber, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(result => {
            if (result.status === 200) {
                result.json().then(resultJSON => {
                    console.log(resultJSON);
                    // let restaurants = resultJSON.restaurants;
                    parentThis.setState(resultJSON);
                    console.log(parentThis.state); //todo remove
                });
            } else if (result.status === 404) {
                // Server failed to get the current roomNumber. This really should not happen.
                // We make the client refresh so it can leave the room and join as a new socket connection. 
                alert("Server error. Room could not be found.");
                window.location.assign('/');
            } else {
                // We make the client refresh so it can leave the room and join as a new socket connection.
                alert("Something went wrong.");
                window.location.assign('/');
            }
        }).catch(e => {
            console.log(e);
        });

        // Listen for errors
        socket.on('general error', (errMsg) => {
            alert(errMsg);
            // We make the client refresh so it can leave the room and join as a new socket connection.
            window.location.assign('/');
        });

        // Listen for matches
        socket.on('match found', (placeID) => {
            let restaurantName;
            for (let i = 0; i < this.state.restaurants.length; i++) {
                if (this.state.restaurants[i].placeID === placeID) {
                    restaurantName = this.state.restaurants[i].name;
                    break;
                }
            }
            alert("You all liked " + restaurantName + "!");
        });

        // Listen on user disconnect
        socket.on('user disconnect', () => {
            alert("A user swiping in your room has disconnected!");
        });
    }

    render() {

        return (
            <div>
                <div className='cardContainer'>
                    {this.state.restaurants.map((restaurant) =>
                        <TinderCard
                            className='swipe'
                            key={restaurant.name}
                            onSwipe={(dir) => this.swiped(dir, restaurant.placeID)} // todo change back to restaurantID
                            onCardLeftScreen={() => this.outOfFrame(restaurant.name)}
                            preventSwipe={['up', 'down']}>
                            <div style={{ backgroundImage: 'url(' + restaurant.photoURL + ')' }} className='card'>
                                <h3>{restaurant.name}</h3>
                            </div>
                        </TinderCard>
                    )}
                </div>
            </div >
        );
    }
}

export default Swiping;