import React, {Component} from 'react';
import { GoogleLogin } from 'react-google-login';
import './login.css'
import { connect } from "react-redux";
import { setUserEmail} from "./actions/index"
import Cookies from 'universal-cookie'


function mapDispatchToProps(dispatch)
{
  return {
    setUserEmail: userEmail => dispatch(setUserEmail(userEmail))
  }
}



const cookies = new Cookies();

class ConnectedLogin extends Component {


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
    console.log(process.env.REACT_APP_BACKEND_URL + 'new_user')
    fetch(process.env.REACT_APP_BACKEND_URL + 'new_user', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail
      })
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      cookies.set('user_email', userEmail)
      this.props.history.push('/dashboard');
    }).catch((error) => {
      console.error(error);
    });;
    this.props.setUserEmail(userEmail)
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

const Login = connect(null, mapDispatchToProps)(ConnectedLogin);

export default Login;