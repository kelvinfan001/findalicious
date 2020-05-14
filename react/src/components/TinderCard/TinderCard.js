import React from 'react';
import './TinderCard.css';
import { Card, CardWrapper } from '../../react-swipeable-cards';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faDirections } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Match from '../Swiping/Match';
import Popup from "reactjs-popup";

const db = [
    {
        name: 'Richard Hendricks',
        url: './img/richard.jpg'
    },
    {
        name: 'Erlich Bachman',
        url: './img/erlich.jpg'
    },
    {
        name: 'Monica Hall',
        url: './img/monica.jpg'
    },
    {
        name: 'Jared Dunn',
        url: './img/jared.jpg'
    },
    {
        name: 'Dinesh Chugtai',
        url: './img/dinesh.jpg'
    }
]

const restaurant = {
    "likeCount": 0,
    "curPhotoIndex": 0,
    "_id": "5eb8a684fef73341ddbe70aa",
    "placeID": "JG9UpsFR6hrqQqsKh_RyaQ",
    "name": "Planta Yorkville",
    "yelpURL": "https://www.yelp.com/biz/planta-yorkville-toronto?adjust_creative=H2a2zKRulYyVB3G_8hMC0w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=H2a2zKRulYyVB3G_8hMC0w",
    "address": "1221 Bay Street",
    "distance": 219.3041184346589,
    "photoURL": "https://s3-media4.fl.yelpcdn.com/bphoto/RRck-ty3S6iSzrvv2WlWGw/o.jpg",
    "price": "$$",
    "rating": 4
}

class MyEndCard extends React.Component {
    render() {
        const textStyle = {
            margin: "20px",
            marginTop: "5px",
            marginBottom: "35px",
        }
        return (
            <div>
                <img
                    src={process.env.PUBLIC_URL + 'logo.png'}
                    className="logo"
                    alt="Findalicious Icon"
                />

                <h3> THAT'S ALL WE FOUND </h3>
                <p style={textStyle}> Your friends might still be swiping...</p>

                <Link to="/">
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" />
                </Link>
            </div>
        );
    }
}

class TinderCardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: true };
        // this.openModal = this.openModal.bind(this);
        // this.closeModal = this.closeModal.bind(this);
    }

    characters = db;

    wrapperStyle = {
        width: "100vw",
        height: "100vh",
        position: "absolute",
        left: "0%",
        top: "0%",
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

    getEndCard() {
        return (
            <MyEndCard />
        );
    }

    render() {

        let googleDirectionParameterArray = restaurant.name.split(" ");
        let googleDirectionsParameter = "";
        for (let word = 0; word < googleDirectionParameterArray.length - 1; word++) {
            googleDirectionsParameter += googleDirectionParameterArray[word] + "+";
        }
        googleDirectionsParameter += googleDirectionParameterArray[googleDirectionParameterArray.length - 1];
        let googleDirectionsURL = "https://www.google.com/maps/dir/?api=1&destination=" + googleDirectionsParameter;

        return (
            <div>
                <link href='http://fonts.googleapis.com/css?family=Pacifico' rel='stylesheet' type='text/css'></link>
                <CardWrapper style={this.wrapperStyle} addEndCard={this.getEndCard.bind(this)}>
                    {this.characters.map((character) =>
                        <Card style={{ backgroundImage: 'url(' + character.url + ')' }}>
                            <div className="restaurantName">
                                <h3>{character.name}</h3>
                            </div>
                            <div className="restaurantRatingPrice">
                                <h5> 4.6 | $$ </h5>
                            </div>
                            <div className="restaurantDistance">
                                <h5> 1.2KM </h5>
                            </div>
                        </Card>
                    )}
                </CardWrapper>
                <Popup
                    open={this.state.open}
                    closeOnDocumentClick
                    contentStyle={this.popupStyle}
                >
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
                </Popup>
            </div >
        );

    }
}

export default TinderCardComponent;