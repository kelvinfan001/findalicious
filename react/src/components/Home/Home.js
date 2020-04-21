import React from 'react';
import DribbleButton from 'react-dribble-button';
import JoinRoomForm from '../Rooms/JoinRoom';

function Home() {
    return (
        <div className="main-button">
            <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
            <h1>Chicken Tinder</h1>
            <div className="main-button">
                {/* <DribbleButton color="light-blue" animationDuration={300} >
                    JOIN ROOM
                </DribbleButton> */}
                <JoinRoomForm />
            </div>
            <div className="main-button">
                <DribbleButton color="light-blue" animationDuration={300} >
                    CREATE ROOM
                </DribbleButton>
            </div>
        </div>
    );
}

export default Home;