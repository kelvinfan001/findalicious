import React from 'react';
import './Swiping.css';
import { Card, CardWrapper } from '../../react-swipeable-cards';

let expressServer = process.env.REACT_APP_EXPRESS_SERVER;

class Swiping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
        };
        this.onSwipeRight = this.onSwipeRight.bind(this);
        this.onSwipeLeft = this.onSwipeLeft.bind(this);
        this.onDoubleTap = this.onDoubleTap.bind(this);
    }

    onSwipeRight(restaurant) {
        let socket = this.props.socket;
        socket.emit("swipe right", restaurant.placeID);
        console.log('removing: ' + restaurant.placeID + ' after swiping right');
    }

    onSwipeLeft(restaurant) {
        console.log('removing: ' + restaurant.placeID + ' after swiping left');
    }

    onDoubleTap(restaurant) {
        let parentThis = this;
        let restaurantsArray = this.state.restaurants;
        let restaurantIndex = restaurantsArray.indexOf(restaurant);
        let url = expressServer + "/api/additionalPhotos/?id=" + restaurant.placeID;
        if (!restaurantsArray[restaurantIndex].additionalPhotos) { // haven't fetched additional photos yet
            fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(result => {
                if (result.status === 200) {
                    result.json().then(resultJSON => {
                        let additionalPhotos = resultJSON.photos;
                        restaurantsArray[restaurantIndex].additionalPhotos = additionalPhotos;
                        restaurantsArray[restaurantIndex].photoURL = additionalPhotos[1];
                        restaurantsArray[restaurantIndex].curPhotoIndex = 1;
                        parentThis.setState({ restaurants: restaurantsArray });
                    });
                } else {
                    // Yelp API server did not find business details.
                    console.error("Yelp API server did not find business details.");
                }
            }).catch(e => {
                console.log(e);
            });
        } else {
            if (restaurantsArray[restaurantIndex].curPhotoIndex === 2) {
                restaurantsArray[restaurantIndex].curPhotoIndex = 0;
            } else {
                restaurantsArray[restaurantIndex].curPhotoIndex += 1;
            }
            let curPhotoIndex = restaurantsArray[restaurantIndex].curPhotoIndex;
            let additionalPhotos = restaurantsArray[restaurantIndex].additionalPhotos
            restaurantsArray[restaurantIndex].photoURL = additionalPhotos[curPhotoIndex];
            parentThis.setState({ restaurants: restaurantsArray });
        }
        console.log("Finding next photo");
    }


    redirectHome() {
        window.location.assign('/');
    }


    componentDidMount() {
        // Disable double tap to zoom
        // document.body.addEventListener("click", event => { });

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
                    parentThis.setState(resultJSON);
                });
            } else if (result.status === 404) {
                // Server failed to get the current roomNumber. This really should not happen.
                // We make the client refresh so it can leave the room and join as a new socket connection. 
                alert("Server error. Room could not be found.");
                window.setTimeout(this.redirectHome, 1000);
            } else {
                // We make the client refresh so it can leave the room and join as a new socket connection.
                alert("Something went wrong.");
                window.setTimeout(this.redirectHome, 1000);
            }
        }).catch(e => {
            console.log(e);
        });

        // Listen for errors
        socket.on('general error', (errMsg) => {
            alert(errMsg);
            // We make the client refresh so it can leave the room and join as a new socket connection.
            window.setTimeout(this.redirectHome, 1000);
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
            // Make everyone disconnect for now, since it may be impossible to get matches
            window.setTimeout(this.redirectHome, 1000);
        });
    }

    render() {

        const wrapperStyle = {
            width: "100vw",
            height: "100vh",
            position: "absolute",
            left: "0%",
            top: "0%",
        }

        return (
            <div>
                <CardWrapper style={wrapperStyle}>
                    {this.state.restaurants.map((restaurant) =>
                        <Card
                            key={restaurant.placeID}
                            data={restaurant}
                            style={{ backgroundImage: 'url(' + restaurant.photoURL + ')' }}
                            onSwipeRight={this.onSwipeRight.bind(this)}
                            onSwipeLeft={this.onSwipeLeft.bind(this)}
                            onDoubleTap={this.onDoubleTap.bind(this)}
                        >
                            <div className="restaurantName">
                                <h3>{restaurant.name}</h3>
                            </div>
                            <div className="restaurantRatingPrice">
                                <h5> {restaurant.rating} | {restaurant.price} </h5>
                            </div>
                            <div className="restaurantDistance">
                                <h5> {Math.floor(restaurant.distance)}M </h5>
                            </div>
                        </Card>
                    )}
                </CardWrapper>
            </div >
        );
    }
}

export default Swiping;