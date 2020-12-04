// more on how to write tests here: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
// const request = require("supertest");
// const app ,{ getRoomData } = require('./app')
// const WebSocket = require('ws')

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

// describe("Test the web sockets", () => {
//   test("Check socket connection", async () => {
//     const ws = new WebSocket(`ws://localhost:5000`)
//             .on('connection', (msg) => {
//                 expect(JSON.parse(msg).id).toEqual(0);
//                 ws.close();
//             })
//             .on('close', () => done());
//   });

//   test("Web socket on changeRoom", async () => {
//     const ws = new WebSocket(`ws://localhost:5000`)
//             .on('changeRoom', (msg) => {
//                 expect(JSON.parse(msg).id).toEqual(0);
//                 ws.close();
//             })
//             .on('close', () => done());
//   });

//   test("Web socket on chat", async () => {
//     const ws = new WebSocket(`ws://localhost:5000`)
//             .on('chat', (msg) => {
//                 expect(JSON.parse(msg).id).toEqual(0);
//                 ws.close();
//             })
//             .on('close', () => done());
//   });

//   test("Web socket on move", async () => {
//     const ws = new WebSocket(`ws://localhost:5000`)
//             .on('move', (msg) => {
//                 expect(JSON.parse(msg).id).toEqual(0);
//                 ws.close();
//             })
//             .on('close', () => done());
//   });

//   test("Check socket on room", async () => {
//     const ws = new WebSocket(`ws://localhost:5000`)
//             .on('room', (msg) => {
//                 expect(JSON.parse(msg).id).toEqual(0);
//                 ws.close();
//             })
//             .on('close', () => done());
//   });

//   test("Check socket on disconnect", async () => {
//     const ws = new WebSocket(`ws://localhost:5000`)
//             .on('disconnect', (msg) => {
//                 expect(JSON.parse(msg).id).toEqual(0);
//                 ws.close();
//             })
//             .on('close', () => done());
//   });
// });

//import passport from 'app';
const request = require("supertest");
const express = require('express')
const session = require('express-session')
const app = require('./app.js')
const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  maxHttpBufferSize: 1e4
})
const passport = require('passport')
const rooms = require('./data/rooms.json')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient 
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongo:27017`
const dbName = 'roaree'

const Lions = {}
const Rooms = {}
// const {shouldMockAuthentication} = require('./app.js/shouldMockAuthentication')

describe("Test the server routes", () => {
  test("check the authentication route (redirect)", async () => {
    var {shouldMockAuthentication} = require('./app')
    shouldMockAuthentication = true;
    const response = await request(app).get('/auth/google');
    expect(response.statusCode).toBe(302);
  });
});

describe("Test passport mocking", () =>{
  test("Test authentication", async () =>{
    passport.authenticate = jest.fn((authType, options, callback) => () => { callback('This is an error', null); });
    const response = await request(app).get('/auth/google', passport.authenticate);
    expect(response.statusCode).toBe(302);
  });
});

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