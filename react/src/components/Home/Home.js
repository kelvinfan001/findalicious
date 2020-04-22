import React from 'react';
import DribbleButton from 'react-dribble-button';
import JoinRoomForm from '../Rooms/JoinRoom';
import logo from './logo.png';

// const logo = require('/public/img/logo.png');

function Home() {
    return (
        <div className="main-page">
            <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
            {/* <h1>Chicken Tinder</h1> */}

            <img src={logo} className="logo" />
            <JoinRoomForm />
            <button onTouchStart=""> CREATE ROOM </button>
        </div>
    );
}

export default Home;