import React, { Component } from 'react'
import "./createbutton.css"

class CreateButton extends Component
{
  constructor (props)
  {
    super(props);
    this.state = {
      show: true
    }
  }

  render ()
  {
    return(
      <div className="create-button"
      onClick = {() => this.props.onClick()}
      >
        <div className="create-text">
          Create
        </div>
      </div>
    )
  }
}


export default CreateButton;