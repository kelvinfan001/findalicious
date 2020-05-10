import React from 'react';
import './TinderCard.css';
import { Card, CardWrapper } from '../../react-swipeable-cards';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

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

                <h3> THE END </h3>
                <p style={textStyle}> Your friends might still be swiping...</p>

                <Link to="/">
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" />
                </Link>
            </div>
        );
    }
}

class TinderCardComponent extends React.Component {
    characters = db;

    wrapperStyle = {
        width: "100vw",
        height: "100vh",
        position: "absolute",
        left: "0%",
        top: "0%",
    }

    getEndCard() {
        return (
            <MyEndCard />
        );
    }

    render() {
        return (
            <div>
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
            </div >
        );

    }
}

export default TinderCardComponent;