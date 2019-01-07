import React, {Component} from 'react'
import './clearbutton.css'

class ClearButton extends Component
{
  constructor (props)
  {
    super(props);
  }

  

  render ()
  {
    let buttonClass = "clear-button ";
    let textClass = "clear-text ";
    if (this.props.color === "blue")
    {
      buttonClass += "blue-button";
      textClass += "blue-text";
    }
    if (this.props.color === "red")
    {
      buttonClass += "red-button";
      textClass += "red-text";
    }
    if (this.props.color === "dark-blue")
    {
      buttonClass += "dark-blue-button";
      textClass += "dark-blue-text";
    }
    if (this.props.highlighted)
    {
      buttonClass = "highlighted-button";
      textClass = "highlighted-text";
    }
    return(
      <div className={buttonClass}
      onClick={() => this.props.onClick()}
      >
        <div className={textClass}>
          {this.props.text}
        </div>
      </div>
    )
  }
}

export default ClearButton;