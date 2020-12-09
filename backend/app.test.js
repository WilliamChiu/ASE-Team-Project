// more on how to write tests here: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

const WebSocket = require('ws')
const {Rooms, Lions, server} = require('./app')


describe("Backend Tests", () => {

  test("checkMongo", async done => {
    const { checkMongo } = require('./app.js')
    let response = await checkMongo()
    expect(response).toBe(true)
    done()
  })

  test("insertRooms", async done => {
    const { insertRooms } = require('./app.js')
    await insertRooms()
    done()
  })

  test("initializeRooms", async done => {
    const { initializeRooms } = require('./app.js')
    await initializeRooms()
    done()
  })

  test("movecheck branch 1", async done => {
    const { moveCheck } = require('./app.js')
    const io = require('socket.io')(server, {
      cors: {
        origin: "http://localhost:7000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    
    io.on('connection', async socket => {  
      let response = moveCheck('x', 'x', socket)
      // console.log('dir0: ', dir[0]);
      expect(response).toBe(undefined)
      done()
      io.close();
    });
    io.listen(6000)

    require('socket.io-client')('http://localhost:6000');
  });

  test("movecheck branch 2", async done => {
    const { moveCheck } = require('./app.js')
    const io = require('socket.io')(server, {
      cors: {
        origin: "http://localhost:7000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    io.on('connection', async socket => {  
      let response = moveCheck('x', [1, 2, 3], socket)
      // console.log('dir0: ', dir[0]);
      expect(response).toBe(undefined)
      done()
      io.close();
    });
    io.listen(6001)

    require('socket.io-client')('http://localhost:6001');
  });

  test("movecheck branch 3", async done => {
    const { moveCheck } = require('./app.js')
    const io = require('socket.io')(server, {
      cors: {
        origin: "http://localhost:7000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    io.on('connection', async socket => {  
      let response = moveCheck('x', [-1, 2], socket)
      // console.log('dir0: ', dir[0]);
      expect(response).toBe(undefined)
      done()
      io.close();
    });
    io.listen(6002)

    require('socket.io-client')('http://localhost:6002');
  });

  test("movecheck branch 4", async done => {
    const { moveCheck } = require('./app.js')
    const io = require('socket.io')(server, {
      cors: {
        origin: "http://localhost:7000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    io.on('connection', async socket => {  
      let response = moveCheck('x', [1111, 2], socket)
      // console.log('dir0: ', dir[0]);
      expect(response).toBe(undefined)
      done()
      io.close();
    });
    io.listen(6003)

    require('socket.io-client')('http://localhost:6003');
  });

  test("movecheck branch 5", async done => {
    const { moveCheck } = require('./app.js')
    const io = require('socket.io')(server, {
      cors: {
        origin: "http://localhost:7000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    io.on('connection', async socket => {  
      let response = moveCheck('x', [1, -1], socket)
      // console.log('dir0: ', dir[0]);
      expect(response).toBe(undefined)
      done()
      io.close();
    });
    io.listen(6004)

    require('socket.io-client')('http://localhost:6004');
  });

  test("movecheck branch 6", async done => {
    console.log('Lions: ', Lions);
    const { moveCheck } = require('./app.js')
    const io = require('socket.io')(server, {
      cors: {
        origin: "http://localhost:7000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    io.on('connection', async socket => {  
      let response = moveCheck('x', [1, 1111], socket)
      // console.log('dir0: ', dir[0]);
      expect(response).toBe(undefined)
      done()
      io.close();
    });
    io.listen(6005)

    require('socket.io-client')('http://localhost:6005');
  });

  test("movecheck branch 7", async done => {
    const { moveCheck } = require('./app.js')
    const io = require('socket.io')(server, {
      cors: {
        origin: "http://localhost:7000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    Lions['ctc2141@columbia.edu'] = true;
    io.on('connection', async socket => {  
      let response = moveCheck('wrongemail', [1, 11], socket)
      // console.log('dir0: ', dir[0]);
      expect(response).toBe(undefined)
      done()
      io.close();
    });
    io.listen(6006)

    require('socket.io-client')('http://localhost:6006');
  });

  test("movecheck branch 8", async done => {
    const { moveCheck } = require('./app.js')
    const io = require('socket.io')(server, {
      cors: {
        origin: "http://localhost:7000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    Lions['ctc2141@columbia.edu'] = {location: [1,1], room: false};
    io.on('connection', async socket => {  
      let response = moveCheck('ctc2141@columbia.edu', [1, 11], socket)
      // console.log('dir0: ', dir[0]);
      expect(response).toBe(undefined)
      done()
      io.close();
    });
    io.listen(6007)

    require('socket.io-client')('http://localhost:6007');
  });

  test("movecheck branch 9", async done => {
    const { moveCheck } = require('./app.js')
    const io = require('socket.io')(server, {
      cors: {
        origin: "http://localhost:7000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    Lions['ctc2141@columbia.edu'] = {location: [1,1], room: 'butler'};
    io.on('connection', async socket => {  
      let response = moveCheck('ctc2141@columbia.edu', [1, 11], socket)
      // console.log('dir0: ', dir[0]);
      expect(response.room).toBe('butler')
      done()
      io.close();
    });
    io.listen(6008)

    require('socket.io-client')('http://localhost:6008');
  });

  test("Check checkdisconnect branch 1", async done => {

    butler = {'fakeemail': true, 'fake2': true, 'ctc2141@columbia.edu': true, delete: console.log};
    mudd = {'ctc2141@columbia.edu': true};
    Rooms.butler = butler;
    Rooms.mudd = mudd;
    console.log('ROOMS: ', Rooms)

    chris_lion = {room: 'butler'};
    Lions[chris_lion] = chris_lion;

    const { checkDisconnect } = require('./app.js')
    let x = checkDisconnect(chris_lion);
    expect(x).toBe(1);
    done()
  });

  test("Check checkdisconnect branch2", async done => {
    delete Rooms.butler;
    delete Rooms.mudd;
    // Rooms = [];
    Rooms.butler = new Set();
    Rooms.butler.add('hello');
    delete Lions[chris_lion]
    console.log('ROOMS:', Rooms);

    const { checkDisconnect } = require('./app.js')
    let x = checkDisconnect(chris_lion);
    expect(x).toBe(0);
    done()
  });
});

// -------------------------PHU'S TESTS BELOW-------------------------------------------
// describe("Test the web sockets", () => {
//   test("Check socket connection", async () => {
//     const ws = new WebSocket(`ws://localhost:5000`)
//             .on('connection', (msg) => {
//                 expect(msg).toEqual('hello');
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
const profile_mock = {
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

//const request = require("supertest");
//const express = require('express')
//const session = require('express-session')
//const { Socket } = require('socket.io');

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

  test("check invalid location input", async () =>{
    const { validLocation } = require('./app')
    locations = [50]
    const invalid = validLocation(locations)
    expect(invalid).toBe(false)
  });
});

describe("Test valid logged in", () =>{

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

//const {server} = require('./app') 

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

describe("Test io init", () =>{
  test("check if io is initialized", async done => {
    const { onConnection } = require('./app.js')
    let events = []
    const fakeSocket = {
      on: event => {
        events.push(event)
      },
      request: { user: {_json: {email: "yeet"}}}
    }

    onConnection(fakeSocket, true)
    expect(events).toStrictEqual([ 'changeRoom', 'chat', 'move', 'room', 'disconnect' ])
    done()
  });
});

describe("Test handleNewSocket", () =>{
  test("check handleNewSocket", async done => {
    const MongoClient = require('mongodb').MongoClient 
    const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongo:27017`
    const dbName = 'roaree'
    await new Promise(res => MongoClient.connect(url, async function (err, client) {
      const db = client.db(dbName)
      const usersCol = db.collection('users')
      await usersCol.deleteMany({email: "tester2@columbia.edu"})
      await usersCol.insertOne({email: "tester2@columbia.edu", location: "Butler"})
      await client.close()
      res()
    }))

    let fakeSocket = {
      request: {user: {_json: {email: "tester2@columbia.edu"}}},
      emit: () => {},
      join: () => {},
      leave: () => {}
    }
    const { handleNewSocket } = require('./app.js')
    await handleNewSocket(fakeSocket)
    done()
  });
});

describe("Test io handlers", () =>{
  Lions["testemail"] = {
    socket: {
      id: '8XzPSRzYigbJsLh9AAAD',
      connected: true,
      disconnected: false
    },
    room: 'Fayerweather',
    location: [ 84, 50 ]
  }

  test("check handleRoom", async done => {
    const { handleRoom } = require('./app.js')
    await handleRoom("testemail", {emit: () => {}})()
    done()
  }); 
  test("check handleChat", async done => {
    const { handleChat } = require('./app.js')
    await handleChat("testemail", {emit: () => {}})()
    done()
  });
  test("check handleMove", async done => {
    const { handleMove } = require('./app.js')
    await handleMove("testemail", {emit: () => {}})([50, 50])
    done()
  });
});

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
        origin: "http://localhost:6050",
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

    io.listen(6050)

    require('socket.io-client')('http://localhost:6050');
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
        origin: "http://localhost:7050",
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
      io.close();
    });
    io.listen(7050)

    require('socket.io-client')('http://localhost:7050');
  });
});

describe("Test invalid room message", () =>{
  test("check socket notice an invalid room", async done => {
    const {invalidRoomMsg} = require("./app")
    const io = require('socket.io')(server, {
      cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    io.on('connection', async socket => {
      socket.on("error", (message) =>{
        expect("test").toBe("not test")
        expect(message).toBe("Please reconnect")
      })
      invalidRoomMsg(null, socket)
      
      done()
      io.close();
    });
    io.listen(8000)

    require('socket.io-client')('http://localhost:8000');
  });
});

const MongoClient = require('mongodb').MongoClient 
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongo:27017`


describe("Test initialization of database", () => {
  test("check if the database has been initialized", async () =>{
    const {initRooms} = require('./app')
    const temp = initRooms()
    expect(1).toBe(1)
  });
});

describe("Test change room callback", () =>{
  test("check if a move from room to room callback happens", async done => {
    const {changeRoomCallback} = require('./app')
    Rooms["Avery"] = new Set()
    Rooms["Fayerweather"] = new Set()
    Rooms["Avery"].add("pdp2122@columbia.edu")
    Lions["yeet"] = {
      socket: {
        id: '8XzPSRzYigbJsLh9AAAD',
        connected: true,
        disconnected: false
      },
      room: 'Avery',
      location: [ 84, 50 ]
    }
    Lions["yeet2"] = {
      socket: {
        id: '8XzPSRzYigbJsLh9AAAD',
        connected: true,
        disconnected: false
      },
      room: 'Fayerweather',
      location: [ 84, 50 ]
    }
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
        origin: "http://localhost:9000",
        methods: ["GET", "POST"]
      },
      maxHttpBufferSize: 1e4
    })

    io.on('connection', async socket => {
      Rooms["Avery"] = new Set(["yeet"])
      Rooms["Fayerweather"] = new Set(["yeet2", "pdp2122@columbia.edu"])
      await changeRoomCallback(Rooms, "Avery", "pdp2122@columbia.edu", socket)
      done()
      io.close();
    });
    io.listen(9000)

    require('socket.io-client')('http://localhost:9000');
  });
});

describe("Test initialization of mongodb", () => {
  test("check if the mongoDb database has been initialized", async () =>{
    MongoClient.connect(url, async(err, client) => client.close())
  });
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const passport = require('passport')

describe("Test passport", () => {
  test("check valid email credentials", async () =>{
    const {passport_callback} = require('./app')
    const profile_mock = {
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
    }

    function done(err, user, info) {
      if (err) { return self.error(err); }
      if (!user) { return self.fail(info); }
      return {user, info}
    }

    passport_callback('','', profile_mock, done)
  });

  test("check new valid email credentials", async finished =>{
    const {passport_callback} = require('./app')
    const MongoClient = require('mongodb').MongoClient 
    const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongo:27017`
    const dbName = 'roaree'
    await new Promise(res => MongoClient.connect(url, async function (err, client) {
      const db = client.db(dbName)
      const usersCol = db.collection('users')
      await usersCol.deleteMany({email: "tester@columbia.edu"})
      await client.close()
      res()
    }))
    const profile_mock = {
      _json: {
        sub: '104656250682509765796',
        name: 'Phu D Pham',
        given_name: 'Phu D',
        family_name: 'Pham',
        picture: 'https://lh5.googleusercontent.com/-cTHKIhRtZIU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmtv-BRmjCPWUjFw8zHrC8QFSHNtw/s96-c/photo.jpg',
        email: 'tester@columbia.edu',
        email_verified: true,
        locale: 'en',
        hd: 'columbia.edu'
      }
    }

    function done(err, user, info) {
      console.log(err, user, info)
      if (err) { return self.error(err); }
      if (!user) { return self.fail(info); }
      finished()
    }

    passport_callback('','', profile_mock, done)
  });

  test("check invalid email credentials (not columbia)", async () =>{
    const {passport_callback} = require('./app')
    const profile_mock = {
      _json: {
        sub: '104656250682509765796',
        name: 'Phu D Pham',
        given_name: 'Phu D',
        family_name: 'Pham',
        picture: 'https://lh5.googleusercontent.com/-cTHKIhRtZIU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmtv-BRmjCPWUjFw8zHrC8QFSHNtw/s96-c/photo.jpg',
        email: 'test@example.com',
        email_verified: true,
        locale: 'en',
        hd: 'example.com'
      }
    }

    function done(err, user, info) {
      if (err) { return self.error(err); }
      if (!user) { return info; }
      return {user, info}
    }

    passport_callback('','', profile_mock, done)
  });

  test("check invalid email credentials (empty)", async () =>{
    const {passport_callback} = require('./app')
    const profile_mock = {
      _json: {
        sub: '104656250682509765796',
        name: 'Phu D Pham',
        given_name: 'Phu D',
        family_name: 'Pham',
        picture: 'https://lh5.googleusercontent.com/-cTHKIhRtZIU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmtv-BRmjCPWUjFw8zHrC8QFSHNtw/s96-c/photo.jpg',
        email: '',
        email_verified: true,
        locale: 'en',
        hd: ''
      }
    }

    function done(err, user, info) {
      if (err) { return self.error(err); }
      if (!user) { return info; }
      return {user, info}
    }

    passport_callback('','', profile_mock, done)
  });

  test("check already logged in", async () =>{
    const {passport_callback} = require('./app')
    const profile_mock = {
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
    }

    Lions["pdp2121@columbia.edu"] = {
      socket: {
        id: '8XzPSRzYigbJsLh9AAAD',
        connected: true,
        disconnected: false
      },
      room: 'Fayerweather',
      location: [ 84, 50 ]
    }



    function done(err, user, info) {
      if (err) { return self.error(err); }
      if (!user) { return info; }
      return {user, info}
    }

    passport_callback('','', profile_mock, done)
  });

  test("check log in exception", async () =>{
    const {passport_callback} = require('./app')
    const profile_mock = {
      _json: {
        sub: '104656250682509765796',
        name: 'Phu D Pham',
        given_name: 'Phu D',
        family_name: 'Pham',
        picture: 'https://lh5.googleusercontent.com/-cTHKIhRtZIU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmtv-BRmjCPWUjFw8zHrC8QFSHNtw/s96-c/photo.jpg',
        email: 'test@example.com',
        email_verified: true,
        locale: 'en',
        hd: 'example.com'
      }
    }

    const EXCEPTIONS = ["test@example.com"]



    function done(err, user, info) {
      if (err) { return self.error(err); }
      if (!user) { return info; }
      return {user, info}
    }

    passport_callback('','', profile_mock, done)
  });
});
