const express = require('express')
const session = require('express-session')
const app = express()
const EventEmitter = require('events');
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
const passport = require('passport')
const rooms = require('./data/rooms.json')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mongo:27017`
const dbName = 'roaree'

class RoomEmitter extends EventEmitter {}

const roomChanges = new RoomEmitter();


// TODO
// Require MongoClient and implement database logic

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
    // TODO
    // We do not need to worry about storing sessions on database
    // Express handles sessions for us with cookies or some shit
    // When people login though we need to create an account for them on
    // the database if it does not exist yet
    // This is the callback from Google, so this is where we check if
    // a user has an account, and if not, we create one from them
    let email = profile?._json?.email
    if (!email) 
      done(null, false, { message: "Not a Columbia/Barnard email" })
    if (profile?._json?.hd !== "columbia.edu" && profile?._json?.hd !== "barnard.edu")
      done(null, false, { message: "Not a Columbia/Barnard email" })
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
    const db = client.db(dbName)
    const roomsCol = db.collection('rooms')
    roomsCol.insertMany(rooms, (err, result) => {
      console.log(err, result)
      client.close()
      res.send("Initializing database")
    })
  })
})

// TODO
// Find out how to auth protect our endpoints ("/api/room/join", "/api/room/send") with Passport middleware

// TODO
// Use bodyparser https://www.npmjs.com/package/body-parser
// Get the roomId parameter from the POST request
// Get their account identifier (whatever that may be, an email, accountId field, idk)
// If valid, update their entry in database to reflect they are in a new room
app.post("/api/room/join", (req, res) => {
  // let email = req?.user?._json?.email
  // if (!email){
  //   res.send("get out")
  // }
  let email = "wnc2105@columbia.edu"
  MongoClient.connect(url, function (err, client) {
    // console.log(client)
    const db = client.db(dbName)
    const usersCol = db.collection('users')
    usersCol.findOne({ email }, (err, result) => {
      if (!result) {
        client.close()
        res.send("getout")
      }
      else {
        let from = result.location
        let to = req.body.room
        usersCol.updateOne({ email }, {$set: { location: to }}, (err, result) => {
          // console.log(err, result)
          client.close()
          roomChanges.emit('event', email, from, to)
          res.send("user updated")
        })
      }
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

io.on('connection', async socket => {
  let email = socket.request.user?._json?.email
  await new Promise((res, rej) => MongoClient.connect(url, function (err, client) {
    // console.log(client)
    const db = client.db(dbName)
    const usersCol = db.collection('users')
    usersCol.findOne({ email }, (err, result) => {
      let from = result.location
      console.log("Joining " + from)
      socket.join(from)
      res()
    })
  }))
  roomChanges.on('event', (_email, from, to) => {
    if (_email === email) {
      console.log("Updating location for " + email)
      socket.leave(from)
      socket.join(to)
    }
  });

  socket.on('chat', message => {
    socket.rooms.forEach(room => {
      socket.to(room).emit(message)
    })
  })
  // io.send('hi')
})

server.listen(5000)