import React, {Component} from 'react';
import { GoogleLogin } from 'react-google-login';
import './login.css'
import Cookies from 'universal-cookie'
import {geolocated} from 'react-geolocated';






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


  responseGoogle = (response) => {
    console.log(response);
    var profileObj = response['profileObj'];
    var userEmail = profileObj['email'];
    var userLat = this.props.coords.latitude;
    var userLon = this.props.coords.longitude;
    fetch(process.env.REACT_APP_BACKEND_URL + 'sign_in', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail,
        location: [userLon, userLat]
      })
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      const session_token = responseJson['session_token'];
      cookies.set('user_email', userEmail);
      cookies.set('session_token', session_token);
      this.props.history.push('/dashboard');
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
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_ID}
                buttonText="Sign In With Google"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
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
  userDecisionTimeout: 5000,
})(Login);