import React, { Component } from 'react';
import './App.css';
import Login from './login.js';
import Dashboard from './dashboard/dashboard.js';
import {Route, Switch} from 'react-router-dom'


class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/dashboard" component={Dashboard}/>
      </Switch>
    );
  }
}

export default App;
