const express = require('express')
const app = express()
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GOOGLE_CLIENT_ID = '900015218011-8vr250fck2dkr7flrcuiljcc1dvh9lvr.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = 'Wqa3ySu87dLvu_nr5V-9D7IV'
const cors = require('cors')
// TODO
// Require MongoClient and implement database logic

var userProfile

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // TODO
    // We do not need to worry about storing sessions on database
    // Express handles sessions for us with cookies or some shit
    // When people login though we need to create an account for them on
    // the database if it does not exist yet
    // This is the callback from Google, so this is where we check if
    // a user has an account, and if not, we create one from them
    if (profile?._json?.hd !== "columbia.edu" && profile?._json?.hd !== "barnard.edu")
      done(null, false, {message: "Not a Columbia/Barnard email"})
    userProfile=profile
    return done(null, userProfile)
  }
))
app.use(cors())        
app.use(passport.initialize())
app.use(passport.session())
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }))
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('http://localhost:3000')
  })

app.get('/success', (req, res) => res.send(userProfile))
app.get('/error', (req, res) => res.send("error logging in"))

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


passport.serializeUser(function(user, cb) {
  cb(null, user)
})

passport.deserializeUser(function(obj, cb) {
  cb(null, obj)
})

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}))

const port = process.env.PORT || 5000
app.listen(port , () => console.log('App listening on port ' + port))