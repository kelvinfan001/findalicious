import React from 'react';
import './Swiping.css';
import EndCard from './EndCard';
import { Card, CardWrapper } from '../../react-swipeable-cards';
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections } from '@fortawesome/free-solid-svg-icons';

let expressServer = process.env.REACT_APP_EXPRESS_SERVER;

class Swiping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurants: [],
            matchedRestaurant: {
                "likeCount": 0,
                "curPhotoIndex": 0,
                "_id": "",
                "placeID": "",
                "name": "",
                "yelpURL": "",
                "address": "",
                "distance": 0,
                "photoURL": "",
                "price": "",
                "rating": 0
            },
            matchOpen: false
        };
        this.onSwipeRight = this.onSwipeRight.bind(this);
        this.onSwipeLeft = this.onSwipeLeft.bind(this);
        this.onDoubleTap = this.onDoubleTap.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.setState({ matchOpen: false });
    }

    getEndCard() {
        return (
            <EndCard />
        );
    }

    onSwipeRight(restaurant) {
        let socket = this.props.socket;
        socket.emit("swipe", restaurant.placeID);
        console.log('removing: ' + restaurant.placeID + ' after swiping right');
    }

    onSwipeLeft(restaurant) {
        let socket = this.props.socket;
        socket.emit("swipe");
        console.log('removing: ' + restaurant.placeID + ' after swiping left');
    }

    onDoubleTap(restaurant) {
        let restaurantsArray = this.state.restaurants;
        let restaurantIndex = restaurantsArray.indexOf(restaurant);
        let url = expressServer + "/api/additionalPhotos/?id=" + restaurant.placeID;
        if (!restaurantsArray[restaurantIndex].additionalPhotos) {
            // haven't fetched additional photos yet
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
                        this.setState({ restaurants: restaurantsArray });
                    });
                } else {
                    // Yelp API server did not find business details.
                    console.error("Yelp API server did not find business details.");
                }
            }).catch(e => {
                console.log(e);
            });
        } else {
            // additional photos have already been fetched
            // cycle through additional photos
            if (restaurantsArray[restaurantIndex].curPhotoIndex === 2) {
                restaurantsArray[restaurantIndex].curPhotoIndex = 0;
            } else {
                restaurantsArray[restaurantIndex].curPhotoIndex += 1;
            }
            let curPhotoIndex = restaurantsArray[restaurantIndex].curPhotoIndex;
            let additionalPhotos = restaurantsArray[restaurantIndex].additionalPhotos
            restaurantsArray[restaurantIndex].photoURL = additionalPhotos[curPhotoIndex];
            this.setState({ restaurants: restaurantsArray });
        }
        console.log("Finding next photo");
    }


    redirectHome() {
        window.location.assign('/');
    }


    componentDidMount() {
        let socket = this.props.socket;
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
                    this.setState(resultJSON);
                });
            } else if (result.status === 404) {
                // Server failed to get the current roomNumber. This really should not happen.
                // We make the client refresh so it can leave the room and join as a new socket connection. 
                window.location.assign("/rooms");
            } else {
                // We make the client refresh so it can leave the room and join as a new socket connection.
                alert("Something went wrong.");
                window.setTimeout(this.redirectHome, 100);
            }
        }).catch(e => {
            console.log(e);
        });

        // Listen for errors
        socket.on('general error', (errMsg) => {
            alert(errMsg);
            // We make the client refresh so it can leave the room and join as a new socket connection.
            window.setTimeout(this.redirectHome, 100);
        });

        // Listen for matches
        socket.on('match found', (placeID) => {
            for (let i = 0; i < this.state.restaurants.length; i++) {
                if (this.state.restaurants[i].placeID === placeID) {
                    this.setState({ matchedRestaurant: this.state.restaurants[i], matchOpen: true });
                    break;
                }
            }
        });

        // Listen on user disconnect
        socket.on('user disconnect', () => {
            // Make everyone disconnect for now, since it may be impossible to get matches
            window.location.assign('/disconnect');
        });

        // Listen on user attempting to swipe when not in a room
        socket.on("not in room swipe", () => {
            alert("You've disconnected or refreshed the page.");
            window.setTimeout(this.redirectHome, 100);
        });
    }

    popupStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "240px",
        animation: "popup 600ms",
        padding: "15px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 0 10px 2px #ffffffc4",
        webkitBoxShadow: "0 0 10px 2px #ffffffc4"
    }

    restaurantPhotoStyle = {
        width: "auto",
        maxWidth: "240px",
        height: "auto",
        maxHeight: "240px",
        borderRadius: "10px"
    }

    render() {

        const wrapperStyle = {
            width: "100vw",
            height: "100vh",
            position: "absolute",
            left: "0%",
            top: "0%",
        }

        let restaurant = this.state.matchedRestaurant

        let googleDirectionParameterArray = restaurant.name.split(" ");
        let googleDirectionsParameter = "";
        for (let word = 0; word < googleDirectionParameterArray.length - 1; word++) {
            googleDirectionsParameter += googleDirectionParameterArray[word] + "+";
        }
        googleDirectionsParameter += googleDirectionParameterArray[googleDirectionParameterArray.length - 1];
        let googleDirectionsURL = "https://www.google.com/maps/dir/?api=1&destination=" + googleDirectionsParameter;

        return (
            <div>
                <CardWrapper style={wrapperStyle} addEndCard={this.getEndCard.bind(this)}>
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
                <Popup
                    open={this.state.matchOpen}
                    closeOnDocumentClick
                    onClose={this.closeModal}
                    contentStyle={this.popupStyle}
                >
                    <div>
                        <h3 className="matchTitle">You all liked</h3>
                        <h2 className="matchName"> {restaurant.name}</h2>
                        <h4> ({restaurant.category}) </h4>
                        <div>
                            <a href={restaurant.yelpURL} target="_blank" rel="noopener noreferrer">
                                <img src={restaurant.photoURL} style={this.restaurantPhotoStyle} alt="Restaurant" />
                            </a>
                            <div className="restaurantRatingPrice">
                                <h5> {restaurant.rating} | {restaurant.price} </h5>
                            </div>
                            <div className="restaurantDistance">
                                <h5> {Math.floor(restaurant.distance)} M</h5>
                            </div>
                        </div>
                        <h4>{restaurant.address}</h4>
                        <a href={googleDirectionsURL} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon style={{ color: "#797986" }} icon={faDirections} size="2x" />
                        </a>
                    </div>
                </Popup>
            </div >
        );
    }
}

export default Swiping;