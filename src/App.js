import React, { Component } from 'react';
import './App.css';
import Login from './login.js'



class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <div className="catchup-title">
              Catchup
            </div>
            <div className="description">
              Some description here
            </div>
            <div className="login-container">
              <Login />
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
