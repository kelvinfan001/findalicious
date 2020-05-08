import React from 'react';
import JoinRoomForm from '../Rooms/JoinRoom';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formShowing: false
        }
    }

    redirectHome() {
        window.location.assign('/');
    }

    componentDidMount() {
        // Check if already joined a room (e.g. if user clicked browser prev page to this page after joining a room)
        let socket = this.props.socket;
        socket.emit("check joined room");

        // Listen on already joined room response
        socket.on('has joined room response', (hasJoinedRoom) => {
            if (hasJoinedRoom) {
                // We make the client refresh so it can leave the room and join as a new socket connection.
                this.redirectHome();
            }
        });
    }

    render() {
        return (
            <div className="main-page">
                <img
                    src={process.env.PUBLIC_URL + 'logo.png'}
                    className="logo"
                    alt="Chicken Tinder Icon"
                    onClick={() => this.setState({ formShowing: false })}
                />
                <div>
                    {this.state.formShowing ?
                        <JoinRoomForm /> :
                        <div>
                            <button
                                className="pop-up"
                                onTouchStart=""
                                onClick={e => {
                                    this.props.history.push("/create");
                                }}>
                                CREATE ROOM
                            </button>
                            <button onTouchStart="" onClick={() => this.setState({ formShowing: true })}>
                                JOIN ROOM
                            </button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Home;