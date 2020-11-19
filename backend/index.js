const express = require('express')
const session = require('cookie-session');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
// const session = require('express-session')
const passport = require('passport')
const rooms = require('./data/rooms.json')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GOOGLE_CLIENT_ID = '900015218011-8vr250fck2dkr7flrcuiljcc1dvh9lvr.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = 'Wqa3ySu87dLvu_nr5V-9D7IV'
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://root:rootpassword@mongo:27017';
const dbName = 'roaree';
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
    if (profile?._json?.hd !== "columbia.edu" && profile?._json?.hd !== "barnard.edu")
      done(null, false, { message: "Not a Columbia/Barnard email" })
    return done(null, profile)
  }
))

app.use(cors({origin: "http://localhost:3000", credentials:true}))
app.use(session({
  name: 'session-name',
  keys: ['key1', 'key2']
}))
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
  console.log(req.user)
  res.send(req.user)
})
app.get('/error', (req, res) => res.send("error logging in"))

app.get('/initDatabase', (req, res) => {
  MongoClient.connect(url, function (err, client) {
    const db = client.db(dbName)
    const roomsCol = db.collection('rooms')
    roomsCol.insertMany(rooms, (err, result) => {
      console.log(err, result)
      client.close();
      res.send("Initializing database")
    })
  });
})

// TODO
// Find out how to auth protect our endpoints ("/api/room/join", "/api/room/send") with Passport middleware

// TODO
// Use bodyparser https://www.npmjs.com/package/body-parser
// Get the roomId parameter from the POST request
// Get their account identifier (whatever that may be, an email, accountId field, idk)
// If valid, update their entry in database to reflect they are in a new room
app.post("/api/room/join", (req, res) => {

})

// TODO
// Use bodyparser https://www.npmjs.com/package/body-parser
// Get the roomId parameter from the POST request
// Get their account identifier (whatever that may be, an email, accountId field, idk)
// If valid, do nothing for now, since there is no websocket architecture
app.post("/api/room/send", (req, res) => {

})

// TODO
// Figure out how to create a websocket route for clients to connect to and receive messages


// https://socket.io/docs/v3/namespaces/index.html
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(session({ secret: 'cats' })));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  // console.log(socket.request)
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});

io.on('connection', socket => {
  // console.log(socket)
  console.log("test")
  io.send('hi');
});

server.listen(5000);