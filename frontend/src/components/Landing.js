import React, { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client';
import { Stage, Sprite, Text } from '@inlet/react-pixi/animated';
import { TextStyle } from 'pixi.js';
import { Spring } from 'react-spring'
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
    const [prevMoved, setPrevMoved] = useState(false)

    const chatRef = useRef(null)
    chatRef.current = chat


    useEffect(() => {
        socket = io('ws://localhost:5000', {
            withCredentials: true
        })
    }, [])

    const checkChat = () => {
        let newChat = chatRef.current.filter(message => Date.now() - message.time < 5000)
        console.log(newChat)
        if (newChat.length !== chatRef.current.length) {
            console.log("setting new chat", newChat, chatRef.current)
            setChat(newChat)
        }
    }

    useEffect(() => {
        if (chat.length) setTimeout(checkChat, 5000)
    }, [chat])

    useEffect(() => {
        const appendChat = (email, message) => {
            let newChat = [...chat, { email, message, time: Date.now() }]
            setChat(newChat)
        }
        document.getElementById('room').style.backgroundImage = `url(${room.background})`
        socket.on('chat', (email, message) => {
            appendChat(email, message)
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
        let nearAnExit = false
        room.exits.forEach(function (item) {
            var location = item.coords
            if (Math.abs(location[0] - curX) < 5 && Math.abs(location[1] - curY) < 5 && !prevMoved) {
                console.log('CLOSEST ROOM', item.room)
                changeRoom(item.room)
                nearAnExit = true
                setPrevMoved(true)
            }
            else if (Math.abs(location[0] - curX) < 10 && Math.abs(location[1] - curY) < 10)
                nearAnExit = true
        });
        console.log(prevMoved)
        if (!nearAnExit) setPrevMoved(false)

        var x = e.keyCode;
        switch (x) {
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
                    <div className="exitLabel" onClick={() => changeRoom(exit.room)} style={{ top: `${exit.coords[1]}vh`, left: `${exit.coords[0]}vw` }}>
                        <b>{exit.room.toUpperCase()}</b>
                    </div>)
            }
            <Stage width={800 * screenRatio} height={800} tabIndex="0" onKeyDown={(e) => movePointer(e)} style={{ outline: 'none', position: 'absolute', width: 'calc(100vw - 40px)', height: 'calc(100vh - 40px)' }} options={{ transparent: true }}>
                {
                    participants.map(p => {
                        let location = {
                            x: p.location[0] * 8 * screenRatio,
                            y: p.location[1] * 8
                        }
                        return <Spring native to={location} config={{duration: 200}}>
                            { location => 
                                <Sprite
                                    id="lion"
                                    image="https://res.cloudinary.com/dvuwk1oua/image/upload/v1606107580/lion_cavx4g.png"
                                    scale={{ x: 0.15, y: 0.15 }}
                                    anchor={0.5}
                                    {...location}
                                />
                            }
                        </Spring>
                    })
                }
                {/* {
                    participants.map(p => {
                        let location = {
                            x: p.location[0] * 8 * screenRatio,
                            y: p.location[1] * 8 + 50
                        }
                        return <Spring native to={location} config={{duration: 200}}>
                            { location => 
                                <Text
                                id={`chat${p.email}`}
                                image="https://res.cloudinary.com/dvuwk1oua/image/upload/v1606107580/lion_cavx4g.png"
                                anchor={0.5}
                                {...location}
                                style={
                                    new TextStyle({
                                        align: 'center',
                                        fontFamily: '"Comic Sans", Helvetica, sans-serif',
                                        fontSize: 30,
                                        fontWeight: 100,
                                        fill: ['#ffffff'], // gradient
                                        stroke: '#01d27e',
                                        strokeThickness: 5,
                                        letterSpacing: 20,
                                        dropShadow: true,
                                        dropShadowColor: '#ccced2',
                                        dropShadowBlur: 4,
                                        dropShadowAngle: Math.PI / 6,
                                        dropShadowDistance: 6,
                                        wordWrap: true,
                                        wordWrapWidth: 440,
                                    })
                                }
                                color={"white"}
                                text={p.email}
                            />
                            }
                        </Spring>
                    })
                } */}
                {
                    participants.map(p => {
                        let location = {
                            x: p.location[0] * 8 * screenRatio,
                            y: p.location[1] * 8
                        }
                        return <Text
                            anchor={0.5}
                            x={location.x}
                            y={location.y + 60}
                            style={
                                new TextStyle({
                                    align: 'center',
                                    fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
                                    fontSize: 20,
                                    wordWrap: true,
                                    wordWrapWidth: 440,
                                    dropShadow: true,
                                    fill: "white",
                                    padding: 10,
                                })
                            }
                            text={props.displayName}
                        />
                    })
                }
                {
                    chat.map((c, i) => {
                        let location = getLocation(participants, c.email)
                        return <Text
                            id={`chat${i}`}
                            anchor={0.5}
                            x={location[0] * 8 * screenRatio}
                            y={location[1] * 8 - 60}
                            style={
                                new TextStyle({
                                    align: 'center',
                                    fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
                                    fontSize: 20,
                                    wordWrap: true,
                                    wordWrapWidth: 440,
                                    dropShadow: true,
                                    fill: "white",
                                    padding: 10,
                                })
                            }
                            color={"white"}
                            text={c.message}
                        />
                    })
                }
            </Stage>
            <div class="roomName">{room?.room}</div>
            <div className="userInfo" style={{ position: 'absolute', right: '20px', top: '20px' }}>
                <span style={{ paddingRight: "10px" }}>Welcome {props.displayName}</span>
                <img src={props.photos[0].value} alt="User" style={{ width: "50px", borderRadius: "50%" }} />
            </div>
            <div className="chat">
                <form onSubmit={sendMessage}>
                    <input id="login" placeholder="Send a message..." type="text" value={message} onChange={handleMessage} />
                </form>
            </div>
        </div>
    )
}

export default Landing;
