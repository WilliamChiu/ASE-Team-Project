import React from 'react'
import io from 'socket.io-client';
import './Landing.css'

function Landing(props) {
    const socket = io('ws://localhost:5000');
    socket.on('message', data => {
        console.log(data);
    });
    return (
        <div className="Landing">
            <h1>This is the landing page! </h1>
            Welcome {props.displayName} <br />
            <img src={props.photos[0].value} />
        </div>
    )
}

export default Landing;