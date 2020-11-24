import React, { useState } from 'react'
import './App.css'
import { Login, Landing } from './components'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

function App() {
  const [ authCreds, setAuth ] = useState({})
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          {Object.keys(authCreds).length === 0 ? <Login setAuth={setAuth} authCreds={authCreds} /> : <Redirect to='/landing' /> }
        </Route>
        <Route exact path='/landing'>
          <Landing {...authCreds} setAuth={setAuth} />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
