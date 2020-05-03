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
    }
    // const db = this.state.restaurants;

    swiped(direction, placeID) {
        if (direction === "right") {
            let socket = this.props.socket;
            socket.emit("swipe right", placeID);
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
                    let restaurants = resultJSON.restaurants;
                    parentThis.setState({ restaurants: restaurants });
                });
            } else if (result.status === 404) {
                alert("Server error. This room could not be found.");
                parentThis.props.history.push('/');
            } else {
                alert("Unknown error. Server may be down.");
                parentThis.props.history.push('/');
            }
        }).catch(e => {
            console.log(e);
        });

        // Listen for errors
        socket.on('general error', (errMsg) => {
            alert(errMsg);
            parentThis.props.history.push("/rooms");
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
                            onSwipe={(dir) => this.swiped(dir, restaurant.placeID)}
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