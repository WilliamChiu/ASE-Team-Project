import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { Stage, Sprite, Graphics } from '@inlet/react-pixi';
import './Landing.css'

let socket;

function Landing(props) {
    const [room, setRoom] = useState({})
    const [participants, setParticipants] = useState([])
    const [chat, setChat] = useState([])
    const [message, setMessage] = useState('')
    const [curX, setX] = useState(300)
    const [curY, setY] = useState(300)

    useEffect(() => {
        socket = io('ws://localhost:5000', {
            withCredentials: true
        })
    }, [])
    useEffect(() => {
        const appendChat = message => {
            let newChat = [...chat, message]
            setChat(newChat)
        }
        console.log('background', room.background)
        document.getElementById('room').style.backgroundImage = `url(${room.background})`
        socket.on('chat', message => {
            appendChat(message)
        })
        socket.on('room', (data, participants) => {
            setRoom(data)
            console.log(participants)
            setParticipants(participants)
        })
        return () => {
            socket.off('chat')
            socket.off('room')
        }
    }, [chat, room, participants])

    const handleMessage = e => {
        setMessage(e.target.value)
    }
    const sendMessage = e => {
        e.preventDefault()
        if (message.substring(0, 5) === "/move") {
            try {
                let moveTo = JSON.parse(message.substring(6))
                socket.emit('move', moveTo)
            }
            catch (e) {}
        }
        socket.emit('chat', message)
        setMessage('')
    }
    const changeRoom = room => {
        socket.emit('changeRoom', room)
    }

    console.log(participants.length)

    const movePointer = (e) => {
        console.log(e.keyCode)
        var x = e.keyCode;
        switch (x) {
            case 37:
                setX(curX - 10)
                break;
            case 39:
                setX(curX + 10)
                break;
            case 38:
                setY(curY - 10)
                break;
            case 40:
                setY(curY + 10)
                break;
        }
    }

    return (
        <div className="Landing" id="room">
            <Stage tabIndex="0" onKeyDown={(e) => movePointer(e)} style={{outline: 'none', position: 'absolute', width: 'calc(100vw - 40px)', height: 'calc(100vh - 40px)'}} options={{transparent: true}}>
                <Sprite id="lion" image="https://res.cloudinary.com/dvuwk1oua/image/upload/v1606107580/lion_cavx4g.png" scale={{ x: 0.15, y: 0.2 }} anchor={0.5} x={curX} y={curY}/>
                {/*<Graphics draw={draw}/>*/}
            </Stage>
            <div style={{textAlign: "center", fontWeight: "800", fontSize: "30px"}}>Room: {room?.room}</div>
            <div className="userInfo" style={{float: "right"}}>
                <span style={{paddingRight: "10px"}}>Welcome {props.displayName}</span>
                <img src={props.photos[0].value} alt="User" style={{width: "50px", borderRadius: "50%"}} />
            </div>
            <div className="navigation">
                <b>Go to:</b>
                {
                    room?.exits?.map(exit => <p onClick={() => changeRoom(exit.room)}>{exit.room}</p>)
                }
            </div>
            <div className="participants">
            <b>Participants:</b>
                {
                    participants.map(p => <p>{p.email} @ {p.location}</p>)
                }
            </div>
            <div className="chat">
                <b>Chat:</b>
                <div>
                    {
                        chat.map(message => <p>{message}</p>)
                    }
                </div>
                <form onSubmit={sendMessage}>
                    <input type="text" value={message} onChange={handleMessage} />
                </form>
            </div>
        </div>
    )
}

export default Landing;