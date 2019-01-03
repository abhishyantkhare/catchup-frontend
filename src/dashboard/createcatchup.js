import React, {Component} from 'react'
import TextField from '@material-ui/core/TextField'
import "./createcatchup.css"
import CreateButton from '../buttons/createbutton'
import AdditionButton from '../buttons/additionbutton'


class InviteeTextField extends Component {
  constructor (props)
  {
    super(props)
    this.state = {
      email: ""
    }
  }

  setInviteeEmail = (e) =>{
    this.setState({
      email: e.target.value
    })
  }

  getInviteeEmail = () => {
    return this.state.email;
  }

  render ()
  {
    return(
      <TextField
          label="Invitee Email Address"
          fullWidth={true}
          onChange={this.setInviteeEmail}
       />  
    )
  }
}

class CreateCatchup extends Component
{

  constructor(props) {
    super(props);
    this.state = {
      catchupTitle: "",
      inviteeEmails: [
        <InviteeTextField />,
      ]
    };
    
  }

  setTitle = (e) => {
    this.setState({
      catchupTitle: e.target.value
    })
  }


  addInviteeField = () => {
    var inviteeEmailsNew = this.state.inviteeEmails;
    inviteeEmailsNew.push(<InviteeTextField />)
    this.setState({
      inviteeEmails: inviteeEmailsNew
    })
  }

  popInviteeField = () => {
    var inviteeEmailsNew = this.state.inviteeEmails;
    inviteeEmailsNew.pop()
    this.setState({
      inviteeEmails: inviteeEmailsNew
    }) 
  }

  showMinus = () => {
    console.log(this.state.inviteeEmails.length);
    return this.state.inviteeEmails.length > 1
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
          {this.state.inviteeEmails}
        </div>
        <div className="addition-buttons">
          <AdditionButton 
          onClick={this.addInviteeField}
          buttonType="plus"
          />
          {this.showMinus() ?
          <AdditionButton
          onClick={this.popInviteeField}
          buttonType="minus"
          />
          :
          null
          }
        </div>
        <div className="create-button-container-modal">
          <CreateButton />
        </div>
      </div>
    )
  }
}




export default CreateCatchup;
