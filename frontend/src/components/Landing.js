import React from 'react'
import './Landing.css'

function Landing(props) {
    return (
        <div className="Landing">
            <h1>This is the landing page! </h1>
            Welcome {props.displayName} <br />
            <img src={props.photos[0].value} />
        </div>
    )
}

export default Landing;