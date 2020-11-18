import React, { useEffect } from 'react'
import './Login.css'
import Particles from 'react-particles-js';
import particlesConfig from '../config/particlesConfig';

function Login (props) {
    useEffect(() => {
        fetch('http://localhost:5000/success')
        .then(res => res.json())
        .then(data => {
            if (data) {
                console.log(data)
                props.setAuth(JSON.parse(JSON.stringify(data)));
            }
        })
        .catch(err => console.log(err))
    }, [props])
    return (
        <div className="Content">
        <div style={{ position: 'absolute'}}>
            <Particles height="100vh" width="100vw" params={particlesConfig} />
        </div>
        <div className="Intro-Text">
            Welcome to Club Roaree
            <div style={{ fontSize: "20px", fontWeight: "300" }}>Login to start</div>
        </div>
        <div className="Login-Button">
            <a href="http://localhost:5000/auth/google">
                <button id="auth-button">LOGIN WITH GOOGLE</button>
            </a>
        </div>
        </div>
    )
}

export default Login
