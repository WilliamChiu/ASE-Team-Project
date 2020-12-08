// more on how to write tests here: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

const request = require("supertest");
const express = require('express')
const session = require('express-session')
const { Socket } = require('socket.io');

const {app} = require('./app')

const WebSocket = require('ws')
let {Rooms} = require('./app')
let {Lions} = require('./app')
const {server} = require('./app');

/*
const io = require('socket.io');
const http = require('http');
const ioBack = require('socket.io');

const session = require('express-session');
const {socket} = require('socket.io'); 
*/

// beforeAll
/*
describe("Test the web sockets", () => {
  test("Check socket connection", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('connection', (msg) => {
                console.log("message", msg)
                expect(JSON.parse(msg)).toEqual(555);
                ws.close();
            })
            .on('close', () => done());
  });
});
*/
/*
function checkDisconnect(socket, email) {
  console.log(`${email} disconnected`)
  console.log(typeof email)
  console.log('DISCONNECT BEFORE', Rooms)
  console.log('LIONS: ', Lions, Lions['ctc2141@columbia.edu'])
  if (Lions[email]) {
    Rooms[Lions[email].room].delete(email)
    delete Lions.email
    console.log('DISCONNECT AFTER', Rooms)
    return 1;
  }
  else {
    for (let room of Rooms) {
      if (room.has(email)) room.delete(email)
    }
    return 0;
  }
}
*/
describe("Backend Tests", () => {
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
    });
    io.listen(6008)

    require('socket.io-client')('http://localhost:6008');
  });

  test("Check checkdisconnect branch 1", async () => {

    butler = {'fakeemail': true, 'fake2': true, 'ctc2141@columbia.edu': true, delete: console.log};
    mudd = {'ctc2141@columbia.edu': true};
    Rooms.butler = butler;
    Rooms.mudd = mudd;
    console.log('ROOMS: ', Rooms)

    chris_lion = {room: 'butler'};
    Lions[chris_lion] = chris_lion;

    const ws = new WebSocket(`ws://localhost:5000`);

    const { checkDisconnect } = require('./app.js')
    let x = checkDisconnect(ws, chris_lion);
    expect(x).toBe(1);
  });

  test("Check checkdisconnect branch2", async () => {
    delete Rooms.butler;
    delete Rooms.mudd;
    // Rooms = [];
    Rooms.butler = new Set();
    Rooms.butler.add('hello');
    delete Lions[chris_lion]
    console.log('ROOMS:', Rooms);
    /*
    butler = {'fakeemail': true, 'fake2': true, 'ctc2141@columbia.edu': true, delete: console.log};
    mudd = {'ctc2141@columbia.edu': true};
    Rooms.butler = butler;
    Rooms.mudd = mudd;
    console.log('ROOMS: ', Rooms)

    chris_lion = {room: 'butler'};
    Lions[chris_lion] = chris_lion;
    */
    const ws = new WebSocket(`ws://localhost:5000`);

    const { checkDisconnect } = require('./app.js')
    let x = checkDisconnect(ws, chris_lion);
    expect(x).toBe(0);
  });
});

// jest.fn((authType, options, callback) => () => { callback('This is an error', null); });

/*
describe('Persistent Login Controller', () => {
  beforeEach(() => {
    req = {};

    res = mockResponse();

    validateLoginForm.mockClear();
    bcrypt.compare.mockClear();
  });

  // Passport authenication error
  test('Should show passport authenication error', async () => {
    passport.authenticate = jest.fn((authType, options, callback) => callback('This is an error', null));

    await persistentLogin(req, res);

    expect(passport.authenticate).toHaveBeenCalledTimes(1);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});
*/


// OLD WAY (As shown on Jest website). still works tho
/*
describe("test index", () => {
  test("test my index", async () => {
    return request(app)
    .get("/")
    .then(response => {
      expect(response.statusCode).toBe(200);
      console.log('index: ', response);
    });
  });
});
*/


/*
describe("test auth", () => {
  test("test my index", async () => {
    request(app)
    .get("/randomskdfsjdof")
    .then(response => {
      expect(response.statusCode).toBe(404);
      done();
    });
  })
})
*/

/*
describe("Test the server routes", () => {
  test("check the authentication route (redirect)", async () => {
    const response = await request(app).get('');
    expect(response.statusCode).toBe(200);
  });
})
*/

/*
describe("Test the server routes", () => {
  test("check the authentication route (redirect)", async () => {
    const response = await request(app).get('/auth/google');
    expect(response.statusCode).toBe(302);
  });

  test("Initialization of databases", async () => {
    const res = await request(app).get("/initDatabase");
    expect(res.type).toEqual('text/html');
    expect(res.text).toEqual('Initializing database')
  });
});

describe("Test the web sockets", () => {
  test("Check socket connection", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('connection', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
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

*/