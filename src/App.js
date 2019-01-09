import React, { Component } from 'react';
import './App.css';
import Login from './login.js';
import Dashboard from './dashboard/dashboard.js';
import {Route, Switch} from 'react-router-dom'


class App extends Component {
  constructor (props)
  {
    super(props);
    this.state = {
      user_email: '',
      session_token: ''
    }
  }

  setUserData = (user_email, session_token) => {
    this.setState({
      user_email: user_email,
      session_token: session_token
    })
  }
  

  render() {
    return (
      <Switch>
        <Route exact path="/" render={(props) => 
          <Login {...props} 
          setUserDataFunc={this.setUserData}
          />}
        />
        <Route path="/dashboard" render={(props) => 
          <Dashboard {...props} 
          user_email={this.state.user_email}
          session_token={this.state.session_token}
          />}
        />
      </Switch>
    );
  }
}

export default App;
