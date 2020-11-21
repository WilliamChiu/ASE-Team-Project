import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import './Landing.css'

let socket;
let changeRoom;

function Landing(props) {
    const [room, setRoom] = useState({})
    const [chat, setChat] = useState([])
    const [message, setMessage] = useState('')
    const appendChat = message => {
        let newChat = [...chat, message]
        setChat(newChat)
    }
    useEffect(() => {
        socket = io('ws://localhost:5000', {
            withCredentials: true
        })
    }, [])
    useEffect(() => {
        socket.on('chat', message => {
            appendChat(message)
        })
        socket.on('room', (data, participants) => {
            setRoom(data)
        })
        changeRoom = async room => {
            await fetch('http://localhost:5000/api/room/join', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ room })
            })
        }
        return () => {
            socket.off('chat')
            socket.off('room')
        }
    }, [chat, room])

    const handleMessage = e => {
        setMessage(e.target.value)
    }
    const sendMessage = e => {
        e.preventDefault()
        socket.emit('chat', message)
        setMessage('')
    }

    return (
        <div className="Landing">
            Welcome {props.displayName} <br />
            <img src={props.photos[0].value} />
            <div>Room: {room?.room}</div>
            {
                room?.exits?.map(exit => <p onClick={() => changeRoom(exit.room)}>{exit.room}</p>)
            }
            <div>
                {
                    chat.map(message => <p>{message}</p>)
                }
            </div>
            <form onSubmit={sendMessage}>
                <input type="text" value={message} onChange={handleMessage} />
            </form>
        </div>
    )
}

export default Landing;