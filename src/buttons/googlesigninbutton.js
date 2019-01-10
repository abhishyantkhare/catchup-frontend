import React, {Component} from 'react'
import './googlesigninbutton.css'

class GoogleSignInButton extends Component
{
  constructor (props)
  {
    super(props);
  }



  render ()
  {
    return(
      <div> 
        <img
        src={require('../img/google_signin_button.png')}
        className="google-signin"
        onClick={() => this.props.onClick()}
        />
      </div>
    )
  }
}

export default GoogleSignInButton;