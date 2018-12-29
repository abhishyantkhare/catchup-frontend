import React, {Component} from 'react';
import { GoogleLogin } from 'react-google-login';
import './login.css'
import { connect } from "react-redux";
import { setUserEmail} from "./actions/index"


function mapDispatchToProps(dispatch)
{
  return {
    setUserEmail: userEmail => dispatch(setUserEmail(userEmail))
  }
}





class ConnectedLogin extends Component {


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
    }).then((response) => {
      console.log(response);
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