import React from 'react'
import { withRouter } from 'react-router-dom'

class JoinRoomForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      roomNumber: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.goToRoom = this.goToRoom.bind(this)
  }

  handleChange(event) {
    this.setState({ roomNumber: event.target.value.replace(/\D/, '') })
  }

  goToRoom() {
    if (this.state.roomNumber.length !== 4) {
      alert('Please enter a 4 digit room number.')
      this.setState({ roomNumber: '' })
      return
    }
    const roomURL = `/rooms/${this.state.roomNumber}`
    this.props.history.push(roomURL)
  }

  render() {
    return (
      <form
        onSubmit={this.submit}
        ref={node => {
          this.setWrapperRef = node
        }}
      >
        <input
          className="pop-up"
          type="text"
          value={this.state.roomNumber}
          placeholder="Room Number"
          onChange={this.handleChange}
          required
          maxLength="4"
          pattern="[0-9]*"
        />
        <button style={{ backgroundColor: 'rgb(95, 204, 95)' }} onClick={this.goToRoom}>
          JOIN
        </button>
      </form>
    )
  }
}

export default withRouter(JoinRoomForm)
