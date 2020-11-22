import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { Unit } from "../../Units/Units";

const startSwiping = (socket) => socket.emit("initiate swiping");

const EveryoneIsInButton = ({ isCreator, socket }) => {
  if (isCreator) {
    return (
      <button onClick={() => startSwiping(socket)}> EVERYONE IS IN </button>
    );
  }

  return null;
};

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    let roomNumber = this.props.match.params.roomNumber;
    let creatorId = this.props.match.params.creatorId;
    this.state = {
      city: "Retrieving...",
      roomNumber,
      creatorId,
      participants: [],
    };
    this.joinRoom = this.joinRoom.bind(this);
    this.updateStateInfo = this.updateStateInfo.bind(this);
  }

  redirectHome() {
    window.location.assign("/");
  }

  componentDidMount() {
    let socket = this.props.socket;
    let parentThis = this;

    // Check if already joined a room (e.g. if user clicked browser prev page to this page after joining a room)
    socket.emit("check joined room", (hasJoinedRoom) => {
      if (hasJoinedRoom) {
        // User should NOT have already joined a room at this page's mounting, so we redirect to home.
        // No need to leave room since we are using location.assign. The user will get disconnected and
        // automatically leave the room on server side.
        parentThis.redirectHome();
      } else {
        // Attempt to join room
        parentThis.joinRoom(parentThis.state.roomNumber);
      }
    });

    // Listen on new user joining room
    socket.on("room info", (result) => {
      this.updateStateInfo(result);
    });

    // Listen on whether joined invalid room
    socket.on("invalid room error", (errMsg) => {
      console.error(errMsg);
      this.props.history.push("/rooms");
    });

    // Listen on general errors
    socket.on("general error", (e) => {
      alert("Server error");
      console.error(e);
      this.redirectHome();
    });

    // Listen on user disconnect
    socket.on("user disconnect", (result) => {
      this.updateStateInfo(result);
    });

    /* Listen on creator disconnect */
    socket.on("room creator disconnect", (result) => {
      alert("Creator disconnected");
      console.log("Creator disconnected");
      this.redirectHome();
    });

    // Listen on attempting to join an already active room
    socket.on("room already swiping", () => {
      // No need to leave room since we are using location.assign. The user will get disconnected and
      // automatically leave the room on server side.
      window.location.assign("/already-swiping");
    });

    // Listen on room started swiping
    socket.on("room started swiping", () => {
      this.props.history.push("/swiping", {
        roomNumber: this.state.roomNumber,
      });
    });
  }

  updateStateInfo(result) {
    const data = JSON.parse(result);

    const { city, radius, creatorId, participants: participantsData } = data;

    /* Extract participant IDs, don't need to worry about anything else  */
    const participants = participantsData.map(
      (participant) => participant.socketID
    );

    this.setState({ city, radius, creatorId, participants });
  }

  joinRoom(roomNumber) {
    let socket = this.props.socket;
    socket.emit("room", roomNumber);
  }

  render() {
    return (
      <div className="main-page">
        <link
          href="https://fonts.googleapis.com/css?family=Damion&display=swap"
          rel="stylesheet"
        />
        <h2> Room {this.state.roomNumber} </h2>
        <div style={{ paddingTop: "5px", paddingBottom: "5px" }}>
          <h4> Looking for restaurants near</h4>
          <FontAwesomeIcon icon={faLocationArrow} size="xs" />
          <h4 style={{ display: "inline-block", margin: "2px" }}>
            {this.state.city}
          </h4>
          <h4 style={{ padding: "0px" }}>
            {this.state.radius
              ? `(${Unit(this.state.radius, {
                  metric: "km",
                  imperial: "mi",
                })} radius)`
              : ""}
          </h4>
        </div>
        <h4>
          {this.state.participants.length} user
          {this.state.participants.length === 1 ? "" : "s"} in this room
        </h4>

        <EveryoneIsInButton
          isCreator={this.state.creatorId === this.props.socket.id}
          socket={this.props.socket}
        />
      </div>
    );
  }
}

export default Lobby;
