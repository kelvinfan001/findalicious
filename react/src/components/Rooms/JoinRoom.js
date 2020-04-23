import React from 'react';

class JoinRoomForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomNumber: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleChange(event) {
        this.setState({ roomNumber: event.target.value });
    }

    submit(event) {
        // ... use email and acceptedTerms in an ajax request or similar ...
        alert('You submitted this room number:' + this.state.roomNumber);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.submit}>
                <input
                    type="text"
                    value={this.state.roomNumber}
                    placeholder="Room Number"
                    onChange={this.handleChange}
                    required
                    maxLength="4"
                    pattern="[0-9]*"
                />
                <button onTouchStart="">
                    JOIN ROOM
                </button>
            </form >
        )
    }
}

export default JoinRoomForm;