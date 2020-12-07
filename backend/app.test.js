// more on how to write tests here: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
// const request = require("supertest");
// const app ,{ getRoomData } = require('./app')
const WebSocket = require('ws')
// describe("Test the server routes", () => {
//   test("check the authentication route (redirect)", async () => {
//     const response = await request(app).get('/auth/google');
//     expect(response.statusCode).toBe(302);
//   });

//   test("Initialization of databases", async () => {
//     const res = await request(app).get("/initDatabase");
//     expect(res.type).toEqual('text/html');
//     expect(res.text).toEqual('Initializing database')
//   });
// });

describe("Test the web sockets", () => {
  test("Check socket connection", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('connection', (msg) => {
                expect(msg).toEqual('hello');
                ws.close();
            })
            .on('close', () => done());
  });

  test("Web socket on changeRoom", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('changeRoom', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
                ws.close();
            })
            .on('close', () => done());
  });

  test("Web socket on chat", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('chat', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
                ws.close();
            })
            .on('close', () => done());
  });

  test("Web socket on move", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('move', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
                ws.close();
            })
            .on('close', () => done());
  });

  test("Check socket on room", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('room', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
                ws.close();
            })
            .on('close', () => done());
  });

  test("Check socket on disconnect", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('disconnect', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
                ws.close();
            })
            .on('close', () => done());
  });
});

//import passport from 'app';
const profile_mock = {
  id: '104656250682509765796',
  displayName: 'Phu D Pham',
  name: { familyName: 'Pham', givenName: 'Phu D' },
  emails: [ { value: 'pdp2121@columbia.edu', verified: true } ],
  photos: [
    {
      value: 'https://lh5.googleusercontent.com/-cTHKIhRtZIU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmtv-BRmjCPWUjFw8zHrC8QFSHNtw/s96-c/photo.jpg'
    }
  ],
  provider: 'google',
  _raw: '{\n' +
    '  "sub": "104656250682509765796",\n' +
    '  "name": "Phu D Pham",\n' +
    '  "given_name": "Phu D",\n' +
    '  "family_name": "Pham",\n' +
    '  "picture": "https://lh5.googleusercontent.com/-cTHKIhRtZIU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmtv-BRmjCPWUjFw8zHrC8QFSHNtw/s96-c/photo.jpg",\n' +
    '  "email": "pdp2121@columbia.edu",\n' +
    '  "email_verified": true,\n' +
    '  "locale": "en",\n' +
    '  "hd": "columbia.edu"\n' +
    '}',
  _json: {
    sub: '104656250682509765796',
    name: 'Phu D Pham',
    given_name: 'Phu D',
    family_name: 'Pham',
    picture: 'https://lh5.googleusercontent.com/-cTHKIhRtZIU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmtv-BRmjCPWUjFw8zHrC8QFSHNtw/s96-c/photo.jpg',
    email: 'pdp2121@columbia.edu',
    email_verified: true,
    locale: 'en',
    hd: 'columbia.edu'
  }
};

const request = require("supertest");
const express = require('express')
const session = require('express-session')
const { Socket } = require('socket.io');
// const server = require('http').createServer(app)
// const bodyParser = require('body-parser')
// const io = require('socket.io')(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   maxHttpBufferSize: 1e4
// })
// const passport = require('passport')
// const rooms = require('./data/rooms.json')
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
// const cors = require('cors')
// const MongoClient = require('mongodb').MongoClient 
// const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongo:27017`
// const dbName = 'roaree'

// const Lions = {}
// const Rooms = {}
// const {shouldMockAuthentication} = require('./app.js/shouldMockAuthentication')

// describe("Test the server routes", () => {
//   test("check the authentication route (redirect)", async () => {
//     var {shouldMockAuthentication} = require('./app')
//     shouldMockAuthentication = true;
//     const response = await request(app).get('/auth/google');
//     expect(response.statusCode).toBe(302);
//   });
// });

describe("Test valid location on the grid", () =>{
  test("check valid move", async () => {
    const { validLocation } = require('./app')
    locations = [50,50]
    const valid = validLocation(locations)
    expect(valid).toBe(true)
  });
});

//const test = new Socket();

describe("Test valid location on the grid", () =>{
  test("check valid move", async () => {
    const { validLocation } = require('./app')
    locations = [50,50]
    const valid = validLocation(locations)
    expect(valid).toBe(true)
  });

  test("check invalid out of bound move (negative)", async () =>{
    const { validLocation } = require('./app')
    locations = [-50,50]
    const invalid = validLocation(locations)
    expect(invalid).toBe(false)
  });

  test("check invalid out of bound move (over 100)", async () =>{
    const { validLocation } = require('./app')
    locations = [50,150]
    const invalid = validLocation(locations)
    expect(invalid).toBe(false)
  });
});

const {Lions} = require('./app')
const {Rooms} = require('./app')
describe("Test valid loged in", () =>{

  test("check valid socket connection", async () => {
    Lions["pdp2122@columbia.edu"] = {
      socket: {
        id: '8XzPSRzYigbJsLh9AAAD',
        connected: true,
        disconnected: false
      },
      room: 'Fayerweather',
      location: [ 84, 50 ]
    }
    const {loggedIn} = require('./app')
    const valid = loggedIn("pdp2122@columbia.edu")
    expect(valid).toBe(true)

  });

  test("check invalid socket connection", async () => {
    const {loggedIn} = require('./app')
    const invalid = loggedIn("phamdoanphu@gmail.com")
    expect(invalid).toBe(false)

  });


});

const {server} = require('./app') 
// describe("Test move room", () =>{
//   test("check valid move", async () => {
//     Lions["pdp2122@columbia.edu"] = {
//       socket: {
//         id: '8XzPSRzYigbJsLh9AAAD',
//         connected: true,
//         disconnected: false
//       },
//       room: 'Fayerweather',
//       location: [ 84, 50 ]
//     }
//     const io = require('socket.io')(server, {
//       cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//         credentials: true
//       },
//       maxHttpBufferSize: 1e4
//     })
//     var dir = []
    
//     io.join("Avery")

//   });
// });

describe("Test join room", () =>{
  test("check if a room is joined", async done => {
    const {joinRoom} = require('./app')
    Rooms["Avery"] = new Set()
    Lions["pdp2122@columbia.edu"] = {
      socket: {
        id: '8XzPSRzYigbJsLh9AAAD',
        connected: true,
        disconnected: false
      },
      room: 'Fayerweather',
      location: [ 84, 50 ]
    }
    const io = require('socket.io')(server, {
      cors: {
        origin: "http://localhost:6000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    const result = {
      location: "Avery"
    }

    io.on('connection', async socket => {  
      let from = joinRoom( result, "pdp2122@columbia.edu", Lions, Rooms, socket)
      //expect("test").toBe("not test")
      expect(from).toBe("Avery")
      done()
    });

    io.listen(6000)

    require('socket.io-client')('http://localhost:6000');
  });
});

describe("Test change room", () =>{
  test("check if a move from room to room happens", async done => {
    const {moveRoom} = require('./app')
    Rooms["Avery"] = new Set()
    Rooms["Fayerweather"] = new Set()
    Rooms["Fayerweather"].add("pdp2122@columbia.edu")
    Lions["pdp2122@columbia.edu"] = {
      socket: {
        id: '8XzPSRzYigbJsLh9AAAD',
        connected: true,
        disconnected: false
      },
      room: 'Fayerweather',
      location: [ 84, 50 ]
    }
    const io = require('socket.io')(server, {
      cors: {
        origin: "http://localhost:7000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    io.on('connection', async socket => {  
      let dir = moveRoom( "Avery", "pdp2122@columbia.edu", Lions, Rooms, socket)
      //expect("test").toBe("not test")
      expect(dir.length).toBe(2)
      expect(dir[0]).toBe("Fayerweather")
      expect(dir[1]).toBe("Avery")
      done()
    });
    io.listen(7000)

    require('socket.io-client')('http://localhost:7000');
  });
});