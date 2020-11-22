import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import './Landing.css'

let socket;

function Landing(props) {
    const [room, setRoom] = useState({})
    const [participants, setParticipants] = useState([])
    const [chat, setChat] = useState([])
    const [message, setMessage] = useState('')

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
        if (message.substring(0, 5) === "/move") socket.emit('move', message.substring(6))
        socket.emit('chat', message)
        setMessage('')
    }
    const changeRoom = room => {
        socket.emit('changeRoom', room)
    }

    console.log(participants.length)

    return (
        <div className="Landing" id="room">
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