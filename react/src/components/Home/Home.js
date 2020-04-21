import React from 'react';
import DribbleButton from 'react-dribble-button';

function Home() {
    return (
        <div>
            <div className="main-button">
                {/* <h1 className='infoText'>Chicken Tinder</h1> */}
                <DribbleButton color="blue" animationDuration={300} >
                    CREATE ROOM
            </DribbleButton>
            </div>
            <div className="main-button">
                <DribbleButton color="blue" animationDuration={300} >
                    JOIN ROOM
            </DribbleButton>
            </div>
        </div>
    );
}

export default Home;