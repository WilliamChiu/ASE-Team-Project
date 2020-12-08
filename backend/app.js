const express = require('express')
const session = require('express-session')
const app = express()
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

const https = require('https')

const filter = JSON.stringify({
  searchTerm: 'edwards'
})

const options = {
  hostname: 'directory.columbia.edu',
  port: 443,
  path: '/people/search',
  method: 'POST',
  headers: {
    'Content-Length': filter.length
  }
}

const req = https.request(options, res => {
  console.log('statusCode:', res.statusCode)

  res.on('data', d => {
    console.log('d:', d)
    process.stdout.write(d)
  })
})

const Lions = {}
const Rooms = {}

const EXCEPTIONS = ["williamchiu16@gmail.com", "william.chiu16@gmail.com"]

async function initRooms() {
  let mongoOnline = false
  while (!mongoOnline) {
    await new Promise(r => setTimeout(r, 1000));
    await new Promise(res => {
      console.log("Checking Mongo...")
      MongoClient.connect(url, async (err, client) => {
        if (!err) {
          mongoOnline = true
          client.close()
        }
        res()
      })
    })
  }
  console.log("Inserting necessary rooms...")
  await new Promise(res => {
    MongoClient.connect(url, function (err, client) {
      if (err) {
        setTimeout(initRooms, 1000)
      }
      const db = client.db(dbName)
      const roomsCol = db.collection('rooms')
      roomsCol.createIndex({ room: 1 }, { unique: true })
      roomsCol.insertMany(rooms, (err, result) => {
        console.log(err, result)
        client.close()
        res()
      })
    })
  })
  // Initialize Rooms
  console.log("Initializing in-memory rooms...")
  await new Promise(res => {
    MongoClient.connect(url, async (err, client) => {
      if (err) return console.log(err);
      const db = client.db(dbName)
      const roomsCol = db.collection('rooms')
      let rooms = await roomsCol.find().toArray()
      rooms.map(({ room }) => {
        Rooms[room] = new Set()
      })
      res()
    })
  })
}

initRooms()


class Lion {
  constructor(socket, room, location) {
    this.socket = socket
    this.room = room
    this.location = location
  }
}

function loggedIn(email) {
  console.log("PHUUUU!!!")
  console.log(Lions)
  return Lions?.[email]?.socket.connected ? true : false
}

passport.serializeUser(function (user, cb) {
  cb(null, user)
})

passport.deserializeUser(function (obj, cb) {
  cb(null, obj)
})

function passport_callback (accessToken, refreshToken, profile, done){
  let email = profile?._json?.email
  // console.log("HEREEEE HEREEEEEE!!!!")
  // console.log(email)
  // if (EXCEPTIONS.includes(email)) {
  //   MongoClient.connect(url, function (err, client) {
  //     const db = client.db(dbName)
  //     const usersCol = db.collection('users')
  //     usersCol.findOne({ email }, (err, result) => {
  //       if (!result) {
  //         usersCol.insertOne({ email, location: "Butler" }, err => {
  //           if (err) console.log(err)
  //         })
  //       }
  //     })
  //   })
  //   return done(null, profile)
  // }
  if (!email)
    done(null, false, { message: "Not a Columbia/Barnard email" })
  else if (profile?._json?.hd !== "columbia.edu" && profile?._json?.hd !== "barnard.edu")
    done(null, false, { message: "Not a Columbia/Barnard email" })
  else if (loggedIn(email))
    done(null, false, { message: "Already logged in" })
  else {
    MongoClient.connect(url, function (err, client) {
      const db = client.db(dbName)
      const usersCol = db.collection('users')
      usersCol.findOne({ email }, (err, result) => {
        if (!result) {
          usersCol.insertOne({ email, location: "Butler" }, err => {
            if (err) console.log(err)
          })
        }
      })
    })
    return done(null, profile)
  }
}


passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    passport_callback (accessToken, refreshToken, profile, done)
  }
))

app.use(bodyParser.json())
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
const sessionMiddleware = session({ secret: 'keyboard cat', resave: false, saveUninitialized: true })

app.use(sessionMiddleware)

app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect('http://localhost:3000')
  })

app.get('/success', (req, res) => {
  // console.log(req.user)
  res.send(req.user)
})
app.get('/error', (req, res) => res.send("error logging in"))

// TODO
// Figure out how to create a websocket route for clients to connect to and receive messages


// https://socket.io/docs/v3/namespaces/index.html
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))
io.use(wrap(passport.initialize()))
io.use(wrap(passport.session()))

io.use((socket, next) => {
  // console.log("Socket user found: ", socket.request.user)
  if (socket.request.user) {
    next()
  } else {
    next(new Error('unauthorized'))
  }
})

const getRoomData = async room => {
  return new Promise(res => MongoClient.connect(url, function (err, client) {
    const db = client.db(dbName)
    const roomsCol = db.collection('rooms')
    roomsCol.findOne({ room }, (err, result) => {
      let { _id, ...data } = result // eslint-disable-line no-unused-vars
      client.close()
      res(data)
    })
  }))
}


function joinRoom (result, email, Lions, Rooms, socket) {
  let from = result.location
  //console.log("TESTTTTTT!!!!!!")
  console.log("Joining " + from)
  socket.join(from)
  Lions[email] = new Lion(socket, from, [50, 50])
  Rooms[from].add(email)
  console.log(Rooms)
  return from
  
};

function moveRoom (room, email, Lions, Rooms, socket){
  let from = Lions[email].room
  let to = room
  console.log("Updating location for ", email, from, to)
  socket.leave(from)
  Rooms[from].delete(email)
  socket.join(to)
  Rooms[to].add(email)
  Lions[email].room = to
  console.log(Lions[email])
  return [from, to]
};

function validLocation (location) {
  if (location.length !== 2){
    return false
  }
  if (location[0] < 0 || location[0] > 100 || location[1] < 0 || location[1] > 100){
    return false
  }
  return true
};

function invalidRoomMsg (room, socket){
  if (!room) {
    socket.emit('error', "Please reconnect")
    return
  }
}

function changeRoomCallback(Rooms,room,email, socket) {
  if (Rooms[room]) {
    MongoClient.connect(url, function (err, client) {
      // console.log(client)
      const db = client.db(dbName)
      const usersCol = db.collection('users')
      usersCol.updateOne({ email }, { $set: { location: room } }, async () => {
        // console.log(err, result)
        client.close()
        let dir = moveRoom(room, email, Lions, Rooms, socket)
          let from = dir[0]
          let to = dir[1]
        if (Rooms[from].size()) io.to(from).emit('room', await getRoomData(from), [...Rooms[from]].map(email => {
          let { location } = Lions[email]
          return { email, location }
        }))
        if (Rooms[to].size()) io.to(to).emit('room', await getRoomData(to), [...Rooms[to]].map(email => {
          let { location } = Lions[email]
          return { email, location }
        }))
      })
    })
  }
}


// module.exports = joinRoom;

module.exports = {validLocation: validLocation, joinRoom:joinRoom, moveRoom:moveRoom};

// module.exports = moveRoom;

io.on('connection', async socket => {              
  let email = socket.request.user?._json?.email
  if (loggedIn(email)) socket.disconnect(true)
  await new Promise(res => MongoClient.connect(url, function (err, client) {
    const db = client.db(dbName)
    const usersCol = db.collection('users')
    usersCol.findOne({ email }, async (err, result) => {
      let from = joinRoom(result,email, Lions, Rooms, socket)
      io.to(from).emit('room', await getRoomData(from), [...Rooms[from]].map(email => {
        let { location } = Lions[email]
        return { email, location }
      }))
      client.close()
      res()
    })
  }))

  socket.on('changeRoom', room => {
    changeRoomCallback(Rooms, room,email, socket)
  })
// -------------------------------------------> my responsibility below this line

// keep this the same... such a short function anyway
  socket.on('chat', message => {
    let room = Lions[email].room
    console.log(room, email, message)
    io.to(room).emit('chat', email, message)
  })

  socket.on('move', async location => {
    console.log("Moving", email, location, socket)
    /*
    if (typeof location !== "object") {
      socket.emit('error', "Invalid location")
      return
    }
    location = location.map(i => parseInt(i))
    if (!validLocation(location)) {
      socket.emit('error', "Invalid location")
      return
    }
    else if (!Lions[email]) {
      socket.emit('error', "Please reconnect")
      return
    }
    Lions[email].location = location
    let room = Lions?.[email]?.room
    invalidRoomMsg (room, socket)
    console.log(email, room)
    */
   let x = moveCheck(email, location, socket);

   // if return is please reconnect or invalid location
   /*
   if (typeof x === 'string') {
     console.log('socket error warning: ', x);
     socket.emit('error', x);
     return;
   }
   */

    io.to(x.room).emit('room', await getRoomData(x.room), [...Rooms[x.room]].map(email => {
      let { location } = Lions[email]
      return { email, location }
    }))
  })

/*
  function roomCheck(email, socket) {
    let room = Lions?.[email]?.room
    if (!room) {
      socket.emit('error', "Please reconnect")
      return
    }
    
    socket.emit('room', await getRoomData(room), [...Rooms[room]].map(email => {
      let { location } = Lions[email]
      return { email, location }
    }))
    
  }
*/

  socket.on('room', async () => {
    // return roomCheck(email, socket);
    
    let room = Lions?.[email]?.room
    invalidRoomMsg (room, socket)
    socket.emit('room', await getRoomData(room), [...Rooms[room]].map(email => {
      let { location } = Lions[email]
      return { email, location }
    }))
  })


  socket.on('disconnect', () => {
    checkDisconnect(socket, email);
  })
  // io.send('hi')
})

function checkDisconnect(socket, email) {
  console.log(`${email} disconnected`)
  console.log('DISCONNECT BEFORE', Rooms)
  console.log('Lions: ', Lions)
  if (Lions[email]) {
    console.log('blah blah: ', Rooms[Lions[email].room])
    Rooms[Lions[email].room].delete(email)
    delete Lions.email
    console.log('DISCONNECT AFTER', Rooms)
    return 1;
  }
  else {
    for (let room in Rooms) {
      if (Rooms[room]) {
       delete room.email;
      }
    }
    return 0;
  }
}

function moveCheck(email, location, socket) {
  if (typeof location !== "object") {
    socket.emit('error', "Invalid location")
    return
  }

  location = location.map(i => parseInt(i))
  if (location.length !== 2 || location[0] < 0 || location[0] > 100 || location[1] < 0 || location[1] > 100) {
    console.log('2ND ERROR LOCATION')
    socket.emit('error', "Invalid location")
    return
  }
  else if (!Lions[email]) {
    socket.emit('error', "Please reconnect")
    return
  }
  Lions[email].location = location
  let room = Lions?.[email]?.room

  if (!room) {
    console.log('NO ROOM!')
    socket.emit('error', "Please reconnect")
    return
  }
  console.log('moveCheck: ', email, room);
  return {room: room, email: email, location: location}
}

module.exports = {server:server, app:app, checkDisconnect:checkDisconnect, Lions:Lions, Rooms:Rooms, io:io, moveCheck:moveCheck,
validLocation: validLocation, joinRoom:joinRoom, moveRoom:moveRoom, loggedIn: loggedIn, invalidRoomMsg: invalidRoomMsg, 
changeRoomCallback: changeRoomCallback, initRooms:initRooms, passport_callback: passport_callback};
// module.exports = server;
