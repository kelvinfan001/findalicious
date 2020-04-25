import React from 'react';
import JoinRoomForm from '../Rooms/JoinRoom';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formShowing: false
        }
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