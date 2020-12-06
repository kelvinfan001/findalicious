import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import LoadingOverlay from 'react-loading-overlay'
import BeatLoader from 'react-spinners/BeatLoader'
import RadiusButtons from './RadiusButtons'

const expressServer = process.env.REACT_APP_EXPRESS_SERVER

class CreateRoom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCity: 'Retrieving Location...',
      longitude: 0,
      latitude: 0,
      locationRetrieved: false,
      radius: 1,
      loading: false
    }
    this.createJoinRoom = this.createJoinRoom.bind(this)
    this.goToRoom = this.goToRoom.bind(this)
    this.updateRadius = this.updateRadius.bind(this)
  }

  updateRadius(radius) {
    this.setState({ radius })
  }

  /* eslint-disable-next-line class-methods-use-this */
  redirectHome() {
    window.location.assign('/')
  }

  componentDidMount() {
    const parentThis = this

    // Check if already joined a room (e.g. if user clicked browser prev page to this page after joining a room)
    const { socket } = this.props
    socket.emit('check joined room', hasJoinedRoom => {
      if (hasJoinedRoom) {
        // Leave the previous room since client is at home page.
        socket.emit('leave room')
      }
    })

    // Geolocation and reverse geocoding
    const options = {
      enableHighAccuracy: true
    }

    async function success(pos) {
      const { coords } = pos
      const { latitude } = coords
      const { longitude } = coords
      const state = { latitude, longitude, currentCity: 'Coordinates Retrieved...' }
      parentThis.setState(state)
      try {
        const geocodeResult = await fetch(`${expressServer}/api/location?longitude=${longitude}&latitude=${latitude}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        if (geocodeResult.status === 200) {
          geocodeResult.text().then(geocodeResultText => {
            const state = { currentCity: geocodeResultText, locationRetrieved: true }
            parentThis.setState(state)
          })
        } else {
          parentThis.setState({ currentCity: 'Cannot get location' })
          throw new Error('Google geocoding API cannot get a location')
        }
      } catch (e) {
        parentThis.setState({ currentCity: 'Cannot get location' })
        console.error(e)
      }
    }

    function error(err) {
      alert(err.message)
      console.warn(`ERROR(${err.code}): ${err.message}`)
    }

    if (!navigator.geolocation) {
      alert('Browser geolocation must be enabled.')
      console.warn('Geolocation not enabled on this browser.')
    }

    navigator.geolocation.getCurrentPosition(success, error, options)
  }

  createJoinRoom() {
    const { longitude } = this.state
    const { latitude } = this.state
    const { radius } = this.state
    const { currentCity } = this.state
    this.setState({ loading: true })
    fetch(`${expressServer}/api/create-room`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        longitude,
        latitude,
        radius,
        city: currentCity,
        creatorId: this.props.socket.id
      })
    })
      .then(result => {
        if (result.status === 200) {
          result.json().then(resultJSON => {
            const { roomNumber } = resultJSON
            const roomURL = `/rooms/${roomNumber}`
            this.goToRoom(roomURL)
          })
        } else if (result.status === 404) {
          this.setState({ loading: false })
          alert('No restaurants found in your area. Try a larger radius.')
        } else {
          alert('Unknown error. Server may be down.')
          this.props.history.push('/')
        }
      })
      .catch(e => {
        console.log(e)
      })
  }

  goToRoom(roomURL) {
    this.props.history.push(roomURL)
  }

  render() {
    return (
      <LoadingOverlay active={this.state.loading} spinner={<BeatLoader />} text="Creating Room...">
        <div className="main-page">
          <link href="https://fonts.googleapis.com/css?family=Damion&display=swap" rel="stylesheet" />
          <h2> Restaurants Near </h2>
          <div>
            <FontAwesomeIcon icon={faLocationArrow} size="xs" />
            <h4 style={{ display: 'inline-block', margin: '6px' }}>{this.state.currentCity}</h4>
          </div>
          <RadiusButtons updateRadius={this.updateRadius.bind(this)} />
          <button disabled={!this.state.locationRetrieved} onClick={this.createJoinRoom}>
            CREATE
          </button>
        </div>
      </LoadingOverlay>
    )
  }
}

export default CreateRoom
