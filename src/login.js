import React, {Component} from 'react';
import { GoogleLogin } from 'react-google-login';


const responseGoogle = (response) => {
  console.log(response);
}

class Login extends Component {
  render () {
    return (
      <GoogleLogin
      clientId="process.env.REACT_APP_GOOGLE_CLIENT_ID"
      buttonText="Sign In With Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      />
    )
  }
}

export default Login;