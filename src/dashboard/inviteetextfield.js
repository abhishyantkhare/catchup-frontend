import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField'



class InviteeTextField extends Component {
  constructor (props)
  {
    super(props)
   
  }

  render ()
  {
    return(
      <TextField
          label="Invitee Email Address"
          fullWidth={true}
          onChange={(e) => this.props.onChange(e, this.props.listKey)}
       />  
    )
  }
}

export default InviteeTextField;