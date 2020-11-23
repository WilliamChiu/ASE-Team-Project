import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { Stage, Sprite, Graphics } from '@inlet/react-pixi';
import './Landing.css'

let socket;

function getLocation(participants, email) {
    return participants.find(p => p.email === email).location
}

function Landing(props) {
    let email = props._json.email
    const [room, setRoom] = useState({})
    const [participants, setParticipants] = useState([])
    const [chat, setChat] = useState([])
    const [message, setMessage] = useState('')
    const [closestRoom, setClosestRoom] = useState('')

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
        console.log('key code', e.keyCode)
        let [curX, curY] = getLocation(participants, email)
        console.log('position', curX * 8 * screenRatio - 20, curY * 8)

        let coordX = curX * 8 * screenRatio - 20
        let coordY = curY * 8
        room.exits.forEach(function (item) {
            var location = item.coords
            console.log('x diff', Math.abs(location[1] - coordX))
            console.log('y diff', Math.abs(location[0] - coordY))
            if (Math.abs(location[1] - coordX) < 50 && Math.abs(location[0] - coordY) < 50) {
                console.log('CLOSEST ROOM', item.room)
                setClosestRoom(item.room)
            }
        });    
        console.log('closest exit', closestRoom)

        var x = e.keyCode;
        switch (x) {
            case 13:
                if (closestRoom != '') {
                    changeRoom(closestRoom)
                }
                break;
            case 37:
                socket.emit('move', [curX - 2.5, curY])
                break;
            case 39:
                socket.emit('move', [curX + 2.5, curY])
                break;
            case 38:
                socket.emit('move', [curX, curY - 2.5])
                break;
            case 40:
                socket.emit('move', [curX, curY + 2.5])
                break;
        }
    }

    let screenRatio = window.innerWidth / window.innerHeight

    return (
        <div className="Landing" id="room">
            {
                room?.exits?.map(exit => 
                    <div className="exitLabel" onClick={() => changeRoom(exit.room)} style={{ top: `${exit.coords[0]}px`, left: `${exit.coords[1]}px` }}>
                        <b>{exit.room.toUpperCase()}</b>
                    </div>)
            }
            <Stage width={800 * screenRatio} height={800} tabIndex="0" onKeyDown={(e) => movePointer(e)} style={{outline: 'none', position: 'absolute', width: 'calc(100vw - 40px)', height: 'calc(100vh - 40px)'}} options={{transparent: true}}>
                {
                    participants.map(p => {
                        return <Sprite id="lion" image="https://res.cloudinary.com/dvuwk1oua/image/upload/v1606107580/lion_cavx4g.png" scale={{ x: 0.15, y: 0.15 }} anchor={0.5} x={p.location[0] * 8 * screenRatio} y={p.location[1] * 8}/>
                    })
                }
            </Stage>
            <div class="roomName">{room?.room}</div>
            <div className="userInfo" style={{position: 'absolute', right: '20px', top: '20px'}}>
                <span style={{paddingRight: "10px"}}>Welcome {props.displayName}</span>
                <img src={props.photos[0].value} alt="User" style={{width: "50px", borderRadius: "50%"}} />
            </div>
            {/*
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
            </div>*/}
        </div>
    )
}

export default Landing;
