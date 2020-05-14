import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDirections } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Popup from "reactjs-popup";

class Match extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant: this.props.restaurant,
            // open: this.props.open
        };
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
        boxShadow: "0 0 22px 2px #ffffffc4",
        webkitBoxShadow: "0 0 18px 0px #ffffffc4"
    }

    restaurantPhotoStyle = {
        width: "240px",
        borderRadius: "10px"
    }

    render() {

        let restaurant = this.state.restaurant;

        let googleDirectionParameterArray = restaurant.name.split(" ");
        let googleDirectionsParameter = "";
        for (let word = 0; word < googleDirectionParameterArray.length - 1; word++) {
            googleDirectionsParameter += googleDirectionParameterArray[word] + "+";
        }
        googleDirectionsParameter += googleDirectionParameterArray[googleDirectionParameterArray.length - 1];
        let googleDirectionsURL = "https://www.google.com/maps/dir/?api=1&destination=" + googleDirectionsParameter;

        return (
            <div>
                <h3 className="matchTitle">You all liked</h3>
                <h2 className="matchName"> {restaurant.name}</h2>
                <div>
                    <a href={restaurant.yelpURL}>
                        <img src={restaurant.photoURL} style={this.restaurantPhotoStyle} />
                    </a>
                    <div className="restaurantRatingPrice">
                        <h5> {restaurant.rating} | {restaurant.price} </h5>
                    </div>
                    <div className="restaurantDistance">
                        <h5> {Math.floor(restaurant.distance)} M</h5>
                    </div>
                </div>
                <h4>{restaurant.address}</h4>
                <a href={googleDirectionsURL}>
                    <FontAwesomeIcon style={{ color: "#797986" }} icon={faDirections} size="2x" />
                </a>
            </div>
        );
    }
}

export default { Match };