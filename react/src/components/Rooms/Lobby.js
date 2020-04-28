import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        let roomNumber = this.props.match.params.roomNumber;
        this.state = {
            city: "Retrieving...",
            roomNumber: roomNumber,
            participants: []
        }
        this.joinRoom = this.joinRoom.bind(this);
        this.updateStateInfo = this.updateStateInfo.bind(this);
    }

    componentDidMount() {
        let socket = this.props.socket;
        this.joinRoom(this.state.roomNumber);
        let parentThis = this;

        // Check if joined valid room
        socket.on('room info', function (result) {
            parentThis.updateStateInfo(result);
        });

        // Check if joined invalid room
        socket.on('error', () => {
            parentThis.props.history.push("/rooms");
        });

        socket.on('user disconnect', function (result) {
            parentThis.updateStateInfo(result);
        });
    }

    updateStateInfo(result) {
        let data = JSON.parse(result);
        // Set participants
        let participantsObjectArray = data.participants;
        let participantsArray = [];
        for (let i = 0; i < participantsObjectArray.length; i++) {
            participantsArray.push(participantsObjectArray[i].socketID)
        }
        this.setState({ participants: participantsArray });
        // Set city
        this.setState({ city: data.city });
    }

    joinRoom(roomNumber) {
        let socket = this.props.socket;
        socket.emit('room', roomNumber);
    }

    render() {
        return (
            <div className="main-page">
                <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
                <h2> Room {this.state.roomNumber} </h2>
                <div>
                    <FontAwesomeIcon icon={faLocationArrow} size="xs" />
                    <h4 style={{ display: "inline-block", margin: "6px" }}>{this.state.city}</h4>
                </div>
                <h4> {this.state.participants.length} user(s) in this room </h4>
                <button
                    onTouchStart="">
                    EVERYONE IS IN
                </button>
            </div>
        )
    }
}

export default Lobby;