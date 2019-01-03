import React, { Component } from 'react'
import "./additionbutton.css"

class AdditionButton extends Component
{
  constructor(props)
  {
    super(props);
    var buttonSrc = require("../img/plus_button.png");
    if(this.props.buttonType === "minus")
    {
      buttonSrc = require("../img/minus_button.png");
    }
    this.state = {
      imgSrc: buttonSrc
    }
  }

  render ()
  {
    return(
      <img
      src={this.state.imgSrc}
      className="additionbutton"
      onClick={() => this.props.onClick()}
      />
    )
  }
}

export default AdditionButton;