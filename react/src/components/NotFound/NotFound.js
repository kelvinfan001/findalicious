import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function PageNotFound() {
    return (
        <div className="main-page">
            <h2>Page Not Found</h2>
            <Link to="/">
                <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" />
            </Link>
        </div>
    );
}

function RoomNotFound() {
    return (
        <div className="main-page">
            <h2>Room Not Found</h2>
            <p>Please make sure you've entered a valid room ID in the URL   </p>
            <Link to="/">
                <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" />
            </Link>
        </div>
    );
}

function UserDisconnect() {
    return (
        <div className="main-page">
            <h2>User Disconnected</h2>
            <p>A user in your room has disconnected.</p>
            <p>Tip: Make sure not to refresh your browser while swiping. </p>
            <Link to="/">
                <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" />
            </Link>
        </div>
    );
}

export { PageNotFound, RoomNotFound, UserDisconnect };