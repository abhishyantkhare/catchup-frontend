import React, {Component} from 'react'
import './dropdownbutton.css'
class DropdownButton extends Component
{
  render() {
    return(
      <div className="dropdown">
        <img 
          src={require('../img/dropdown_arrow.png')}
          className="dropdown"
          onClick={() => this.props.onClick()}
        />
      </div>
    )
  }
}

export default DropdownButton;