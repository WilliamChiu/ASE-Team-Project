const express = require('express')
const app = express()
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GOOGLE_CLIENT_ID = '900015218011-8vr250fck2dkr7flrcuiljcc1dvh9lvr.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = 'Wqa3ySu87dLvu_nr5V-9D7IV'

var userProfile

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    if (profile?._json?.hd !== "columbia.edu" && profile?._json?.hd !== "barnard.edu")
      done(null, false, {message: "Not a Columbia/Barnard email"})
    userProfile=profile
    return done(null, userProfile)
  }
))

app.use(passport.initialize())
app.use(passport.session())
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }))
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success')
  })

app.get('/success', (req, res) => res.send(userProfile))
app.get('/error', (req, res) => res.send("error logging in"))

passport.serializeUser(function(user, cb) {
  cb(null, user)
})

passport.deserializeUser(function(obj, cb) {
  cb(null, obj)
})

app.set('view engine', 'ejs')

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}))

const port = process.env.PORT || 5000
app.listen(port , () => console.log('App listening on port ' + port))