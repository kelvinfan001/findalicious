import React from 'react';

function PageNotFound() {
    return (
        <div>
            <h1>Page Not Found</h1>
            <a href="/">Go back</a>
        </div>
    );
}

function RoomNotFound() {
    return (
        <div>
            <h1>Room Not Found</h1>
            <p>Please make sure you've entered a valid room ID in the URL   </p>
            <a href="/">Go back</a>
        </div>
    );
}

export { PageNotFound, RoomNotFound };