import React, {Component} from 'react';
import { GoogleLogin } from 'react-google-login';
import './login.css'
import Cookies from 'universal-cookie'
import {geolocated} from 'react-geolocated';
import GoogleSignInButton from './buttons/googlesigninbutton'






const cookies = new Cookies();

class Login extends Component {


  constructor (props)
  {
    super(props);
    var user_cookie = cookies.get('user_email')
    if (user_cookie !== undefined)
    {
      this.props.history.push('/dashboard');
    }
  }



  /**
   *  Sign in the user upon button click.
   */
  handleAuthClick = (event) => {
    window.gapi.auth2.getAuthInstance().grantOfflineAccess().then((code_obj) =>
    {
      let auth_code = code_obj['code']
      this.responseGoogle(auth_code)
    });
  }



  setCookies = (user_email, session_token) => {
    var cookiePromise = new Promise(function(resolve, reject)
    {
      cookies.set('user_email', user_email);
      cookies.set('session_token', session_token);
      if (cookies.get('session_token') !== undefined)
      {
        resolve('Cookies Set');
      }
      else{
        reject('Failed to set cookies');
      }
    })

    return cookiePromise;
  }


  responseGoogle = (auth_code) => {
    var userLat = this.props.coords.latitude;
    var userLon = this.props.coords.longitude;
    fetch(process.env.REACT_APP_BACKEND_URL + 'sign_in', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        auth_code: auth_code,
        location: [userLon, userLat]
      })
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      const session_token = responseJson['session_token'];
      const user_email = responseJson['user_email'];
      this.setCookies(user_email, session_token).then((response) => 
        {
        console.log(cookies.get('session_token'));
        this.props.setUserDataFunc(user_email, session_token);
        this.props.history.push('/dashboard')
      }
      ).catch(error => console.log(error))
    }).catch((error) => {
      console.error(error);
    });;
  }

  render () {
    return (
      <div className="main">
        <header className="login-header">
          <div>
            <div className="catchup-title">
              Catchup
            </div>
            <div className="description">
              Some description here
            </div>
            <div className="login-container">
              <GoogleSignInButton
              onClick={this.handleAuthClick}
              />
            </div>
          </div>
        </header>
      </div>
    )
  }
}


export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 1000,
})(Login);