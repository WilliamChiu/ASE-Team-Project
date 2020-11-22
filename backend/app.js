const express = require('express')
const session = require('express-session')
const app = express()
//const EventEmitter = require('events');
const server = require('http').createServer(app)
const bodyParser = require('body-parser')
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true  
  }
})
// const session = require('express-session')
//require('dotenv').config()
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

// Initialize Rooms
MongoClient.connect(url, async (err, client) => {
  if (err) return console.log(err);
  const db = client.db(dbName)
  const roomsCol = db.collection('rooms')
  let rooms = await roomsCol.find().toArray()
  rooms.map(({ room }) => {
    Rooms[room] = new Set()
  })
})

class Lion {
  constructor(socket, room, location) {
    this.socket = socket
    this.room = room
    this.location = location
  }
}

function loggedIn(email) {
  return Lions?.[email]?.socket.connected ? true : false
}

passport.serializeUser(function (user, cb) {
  cb(null, user)
})

passport.deserializeUser(function (obj, cb) {
  cb(null, obj)
})

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    let email = profile?._json?.email
    // if (!email)
    //   done(null, false, { message: "Not a Columbia/Barnard email" })
    // else if (profile?._json?.hd !== "columbia.edu" && profile?._json?.hd !== "barnard.edu")
    //   done(null, false, { message: "Not a Columbia/Barnard email" })
    // else if (loggedIn(email))
    //   done(null, false, { message: "Already logged in" })
    // else {
    MongoClient.connect(url, function (err, client) {
      const db = client.db(dbName)
      const usersCol = db.collection('users')
      usersCol.findOne({ email }, (err, result) => {
        if (!result) {
          usersCol.insertOne({ email, location: "butler" }, (err, result) => {
            if (err) console.log(err)
          })
        }
      })
    })
    return done(null, profile)
    // }
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

app.get('/initDatabase', (req, res) => {
  MongoClient.connect(url, function (err, client) {
    if (err) return console.log(err);
    const db = client.db(dbName)
    const roomsCol = db.collection('rooms')
    roomsCol.createIndex({ room: 1 }, { unique: true })
    roomsCol.insertMany(rooms, (err, result) => {
      console.log(err, result)
      client.close()
      res.send("Initializing database")
    })
  })
})

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

export const getRoomData = async room => {
  return new Promise((res, rej) => MongoClient.connect(url, function (err, client) {
    const db = client.db(dbName)
    const roomsCol = db.collection('rooms')
    roomsCol.findOne({ room }, (err, result) => {
      let { _id, ...data } = result
      client.close()
      res(data)
    })
  }))
}


io.on('connection', async socket => {
  let email = socket.request.user?._json?.email
  if (loggedIn(email)) socket.disconnect(true)
  await new Promise((res, rej) => MongoClient.connect(url, function (err, client) {
    const db = client.db(dbName)
    const usersCol = db.collection('users')
    usersCol.findOne({ email }, async (err, result) => {
      let from = result.location
      console.log("Joining " + from)
      socket.join(from)
      Lions[email] = new Lion(socket, from, [50, 50])
      console.log(Rooms)
      Rooms[from].add(email)
      io.to(from).emit('room', await getRoomData(from), [...Rooms[from]].map(email => {
        let { location } = Lions[email]
        return { email, location }
      }))
      client.close()
      res()
    })
  }))

  socket.on('changeRoom', room => {
    MongoClient.connect(url, function (err, client) {
      // console.log(client)
      const db = client.db(dbName)
      const usersCol = db.collection('users')
      usersCol.updateOne({ email }, { $set: { location: room } }, async (err, result) => {
        // console.log(err, result)
        client.close()
        let from = Lions[email].room
        let to = room
        console.log("Updating location for " + email, from, to)
        socket.leave(from)
        Rooms[from].delete(email)
        socket.join(to)
        Rooms[to].add(email)
        Lions[email].room = to
        io.to(from).emit('room', await getRoomData(from), [...Rooms[from]].map(email => {
          let { location } = Lions[email]
          return { email, location }
        }))
        io.to(to).emit('room', await getRoomData(to), [...Rooms[to]].map(email => {
          let { location } = Lions[email]
          return { email, location }
        }))
      })
    })
  })

  socket.on('chat', message => {
    let room = Lions[email].room
    console.log(room, message)
    io.to(room).emit('chat', `${email}: ${message}`)
  })

  socket.on('move', async location => {
    console.log("Moving", email, location)
    if (!Lions[email]) {
      socket.emit('error', "Please reconnect")
      return
    }
    Lions[email].location = location
    let room = Lions?.[email]?.room
    if (!room) {
      socket.emit('error', "Please reconnect")
      return
    }
    io.to(room).emit('room', await getRoomData(room), [...Rooms[room]].map(email => {
      let { location } = Lions[email]
      return { email, location }
    }))
  })

  socket.on('room', async () => {
    let room = Lions?.[email]?.room
    if (!room) {
      socket.emit('error', "Please reconnect")
      return
    }
    socket.emit('room', await getRoomData(room), [...Rooms[room]].map(email => {
      let { location } = Lions[email]
      return { email, location }
    }))
  })

  socket.on('disconnect', () => {
    console.log(`${email} disconnected`)
    if (Lions[email]) {
      Rooms[Lions[email].room].delete(email)
      delete Lions.email
    }
    else {
      for (let room of Rooms) {
        if (room.has(email)) room.delete(email)
      }
    }
  })
  // io.send('hi')
})

module.exports = server;