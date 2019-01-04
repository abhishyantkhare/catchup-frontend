import React, {Component} from 'react'
import "./createcatchup.css"
import CreateButton from '../buttons/createbutton'
import AdditionButton from '../buttons/additionbutton'
import InviteeTextField from './inviteetextfield'
import TextField from '@material-ui/core/TextField'


const user_email = "your@email.com";


class CreateCatchup extends Component
{

  constructor(props) {
    super(props);
    this.state = {
      catchupTitle: "",
      inviteeViews: [
        {
          view:  <InviteeTextField
          onChange={this.setEmail}
          listKey={0}
          />,
          email: "",
          key: 0
        }

      ]
    };
    
  }

  setTitle = (e) => {
    this.setState({
      catchupTitle: e.target.value
    })
  }

  setEmail = (e, listKey) => {
    var inviteeViewsNew = this.state.inviteeViews;
    var inviteeView = inviteeViewsNew[listKey];
    inviteeView.email = e.target.value;
    inviteeViewsNew[listKey] = inviteeView;
    this.setState({
      inviteeViews: inviteeViewsNew
    })
  }


  addInviteeField = () => {
    var inviteeViewsNew = this.state.inviteeViews;
    inviteeViewsNew.push({view: <InviteeTextField 
                          onChange={this.setEmail}
                          listKey={this.state.inviteeViews.length}
                        />,
                        email: "",
                        key: this.state.inviteeViews.length
                      })

    this.setState({
      inviteeViews: inviteeViewsNew
    })
  }

  popInviteeField = () => {
    var inviteeViewsNew = this.state.inviteeViews;
    inviteeViewsNew.pop()
    this.setState({
      inviteeViews: inviteeViewsNew
    }) 
  }

  showMinus = () => {
    console.log(this.state.inviteeViews.length);
    return this.state.inviteeViews.length > 1
  }
   

  createCatchup = () => {
    var inviteeEmails = this.state.inviteeViews.map((inviteeView) => inviteeView.email) 
    fetch(process.env.REACT_APP_BACKEND_URL + 'create_catchup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        invitedUsers: inviteeEmails,
        owner: user_email,
        title: this.state.catchupTitle
      })
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
    }).catch((error) => {
      console.error(error);
    });;
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
          {this.state.inviteeViews.map((inviteeView) => inviteeView.view)}
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
          <CreateButton 
          onClick={this.createCatchup}
          />
        </div>
      </div>
    )
  }
}




export default CreateCatchup;
