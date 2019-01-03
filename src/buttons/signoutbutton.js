import React, {Component} from 'react'
import './signoutbutton.css'
import Cookies from 'universal-cookie';

const cookies = new Cookies()

class SignOutButton extends Component
{

  render ()
  {
    return(
      <div className="button"
      onClick={() => this.props.onClick()}
      >
        <div className="text">
         Sign Out
        </div>
      </div>
    )
  }
}

export default SignOutButton