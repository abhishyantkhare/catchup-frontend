import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField'
import AdditionButton from '../buttons/additionbutton'
import './inviteetextfield.css'



class InviteeTextField extends Component {
  constructor (props)
  {
    super(props)
   
  }

  render ()
  {
    return(
      <div className="text-field-container">
      {this.props.show_delete ? 
        <div className="minus-button">
          <AdditionButton
          buttonType="minus"
          onClick={() => this.props.deleteFunc(this.props.listKey)}
          /> 
        </div>
        :
        null
        } 
      <div className="text-field">
          <TextField
              label={this.props.label}
              fullWidth={true}
              onChange={(e) => this.props.onChange(e, this.props.listKey)}
              value={this.props.text}
              disabled={this.props.disabled}
          /> 
        </div>
        {this.props.display_status ?
        <StatusField
        owner={this.props.owner}
        pending={this.props.pending}
        />
        :
        null
        } 
       </div>
    )
  }
}

class StatusField extends Component {
  constructor(props)
  {
    super(props);
    var text = "Accepted";
    if(this.props.owner)
    {
      text = "Owner";
    }
    else if(this.props.pending)
    {
      text = "Pending";
    }
    this.state = {
      text: text
    }
  }

  render ()
  {
    return(
      <div className="status-field">
        {this.state.text}
      </div>
    )
  }
}

export default InviteeTextField;