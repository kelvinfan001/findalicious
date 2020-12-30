import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

class EndCard extends React.Component {
  render() {
    const textStyle = {
      margin: '20px',
      marginTop: '5px',
      marginBottom: '35px'
    }
    return (
      <div>
        <img src={process.env.PUBLIC_URL + 'logo.png'} className="logo" alt="Findalicious Icon" />
        <h3> THAT&apos;S ALL WE FOUND </h3>
        <p style={textStyle}> Your friends might still be swiping...</p>

        <Link to="/">
          <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" />
        </Link>
      </div>
    )
  }
}

export default EndCard
