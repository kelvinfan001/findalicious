import React from 'react';
import DribbleButton from 'react-dribble-button';
import JoinRoomForm from '../Rooms/JoinRoom';
import logo from './logo.jpg';

// const logo = require('/public/img/logo.png');

function Home() {
    return (
        <div className="main-page">
            <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
            <h1>Chicken Tinder</h1>
            {/* <img src={logo} className="logo" /> */}
            <div className="main-button">
                {/* <DribbleButton color="light-blue" animationDuration={300} >
                    JOIN ROOM
                </DribbleButton> */}
                <JoinRoomForm />
            </div>
            <div className="main-button">
                <div className="button"> CREATE ROOM </div>
            </div>
        </div>
    );
}

export default Home;