import React, {Component} from 'react'
import TextField from '@material-ui/core/TextField'
import './createcatchup.css'

class CreateCatchup extends Component
{

  constructor(props) {
    super(props);
    this.state = {
      catchupTitle: "",
      inviteeEmails: ""
    };
  }

  setTitle = (e) => {
    this.setState({
      catchupTitle: e.target.value
    })
  }

  setInviteeEmail = (e) => {
    this.setState({
      inviteeEmails: e.target.value
    })
  }



  render() {
    return(
      <div className="create-container">
        <div className="title-container">
          <TextField
          label="Catchup Title"
          fullWidth={true}
          onChange={this.setTitle}
          />
        </div>
        <div className="invitee-field">
          <TextField
          label="Invitee Email Address"
          fullWidth={true}
          onChange={this.setInviteeEmail}
          />
        </div>
        <div className="create-button-right">
          <div className="create-text-right">
            Create
          </div>
        </div>
      </div>
    )
  }
}

export default CreateCatchup;
