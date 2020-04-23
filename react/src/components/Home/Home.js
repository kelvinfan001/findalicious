import React from 'react';
import JoinRoomForm from '../Rooms/JoinRoom';
import logo from './logo.png';

// const logo = require('/public/img/logo.png');

class Home extends React.Component {

    goCreateRoom() {
        this.props.history.push("/create");
    }

    render() {
        return (
            <div className="main-page" >
                <img src={logo} className="logo" alt="Chicken Tinder Icon" />
                <JoinRoomForm />
                <button
                    onTouchStart=""
                    onClick={e => {
                        this.goCreateRoom();
                    }}>
                    NEW ROOM
                </button>
            </div>
        )
    }
}

export default Home;