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
        socket.emit("check joined room", function (hasJoinedRoom) {
            if (hasJoinedRoom) {
                // Leave the previous room since client is at home page.
                socket.emit('leave room');
            }
        });
    }

    render() {
        return (
            <div className="main-page">
                <img
                    src={process.env.PUBLIC_URL + 'logo.png'}
                    className="logo"
                    alt="Findalicious Icon"
                    onClick={() => this.setState({ formShowing: false })}
                />
                <div>
                    {this.state.formShowing ?
                        <JoinRoomForm /> :
                        <div>
                            <button
                                className="pop-up"
                                onClick={e => {
                                    this.props.history.push("/create");
                                }}>
                                CREATE ROOM
                            </button>
                            <button
                                onClick={() => this.setState({ formShowing: true })}>
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