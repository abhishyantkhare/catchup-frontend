import React, {Component} from 'react'
import './catchupsettings.css'
import ClearButton from '../buttons/clearbutton';

class CatchupSettings extends Component
{

 constructor(props)
 {
   super(props)
 } 
 render() 
 {
    return(
    <div className="settings-container">
      <div className="top-settings-container">
        <div className="settings-title">
          {this.props.catchup.title}
        </div>
        <div className="edit-button">
          <ClearButton 
          text="Edit"
          color="blue"
          />
        </div>
      </div>
    </div>
    );
 } 
}

export default CatchupSettings;