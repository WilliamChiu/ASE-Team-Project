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
const {app} = require('./app')
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

describe("Test the server routes", () => {
  test("check the authentication route (redirect)", async () => {
    var {shouldMockAuthentication} = require('./app')
    shouldMockAuthentication = true;
    const response = await request(app).get('/auth/google');
    expect(response.statusCode).toBe(302);
  });
});

describe("Test valid location on the grid", () =>{
  test("check valid move", async () => {
    const { validLocation } = require('./app')
    locations = [50,50]
    const valid = validLocation(locations)
    expect(valid).toBe(true)
  });
});

// describe("Test the web sockets", () => {
//   test("Check socket connection", async () => {
//     const ws = new WebSocket(`ws://localhost:5000`)
//             .on('connection', (msg) => {
//                 expect(JSON.parse(msg).id).toEqual(0);
//                 ws.close();
//             })
//             .on('close', () => done());
//   });

// describe("Test passport mocking", () =>{
//   test("Test authentication", async () =>{
//     passport.authenticate = jest.fn((authType, options, callback) => () => { callback('This is an error', null); });
//     const response = await request(app).get('/auth/google', passport.authenticate);
//     expect(response.statusCode).toBe(302);
//   });
// });

// describe("Test the web sockets", () => {
//   test("Check socket connection", async () => {
//     const ws = new WebSocket(`ws://localhost:5000`)
//             .on('connection', (msg) => {
//                 expect(JSON.parse(msg).id).toEqual(0);
//                 ws.close();
//             })
//             .on('close', () => done());
//   });

// beforeEach(() => {
//   mockResponse = () => {
//     const response = {};
//     response.status = jest.fn().mockReturnValue(response);
//     response.json = jest.fn().mockReturnValue(response);
//     response.sendStatus = jest.fn().mockReturnValue(response);
//     response.clearCookie = jest.fn().mockReturnValue(response);
//     response.cookie = jest.fn().mockReturnValue(response);
//     return response;
//   };
// });

// describe("Test passport", () => {
//   beforeEach(() => {
//     req = {};

//     res = mockResponse();

//     validateLoginForm.mockClear();
//     bcrypt.compare.mockClear();
//   });

//   test("check the authentication route (redirect)", async () => {
//     const response = await request(app).get('/auth/google');
//     expect(response.statusCode).toBe(302);
//   });