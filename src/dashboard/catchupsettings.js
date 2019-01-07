import React, {Component} from 'react'
import './catchupsettings.css'
import ClearButton from '../buttons/clearbutton';
import InviteeTextField from './inviteetextfield'
import AdditionButton from '../buttons/additionbutton'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


const user_email = "your@email.com"

class CatchupSettings extends Component
{

 constructor(props)
 {
   super(props)
   this.state = {
    catchup: props.catchup,
    accepted_users: props.catchup.accepted_users.map((user_email) => 
    { return({
     text: user_email,
     display_status: true,
     owner: false,
     pending: false,
     key: user_email,
     show_delete: false
    }
    )
   }),
   invited_users: props.catchup.invited_users.map((user_email) => 
   { return({
    text: user_email,
    display_status: true,
    owner: false,
    pending: true,
    key: user_email,
    show_delete: false
   }
   )
  }),
  edit_clicked: false,
  dropdownOpen: false,
   }
 } 

 componentWillReceiveProps(nextProps)
 {
   this.setState({
    catchup: nextProps.catchup,
    edit_clicked: false,
    accepted_users: nextProps.catchup.accepted_users.map((user_email) => 
      { return({
      text: user_email,
      display_status: true,
      owner: false,
      pending: false,
      key: user_email,
      show_delete: false
      }
      )
    }),
    invited_users: nextProps.catchup.invited_users.map((user_email) => 
    { return({
      text: user_email,
      display_status: true,
      owner: false,
      pending: true,
      key: user_email,
      show_delete: false
    }
    )
    })
  });
 }

 editButtonOnClick = () => {
   this.setState({
     edit_clicked: true
   })
   this.setDelete(true);
 }

 setDelete = (del) => {
  var accepted_users_new = this.state.accepted_users;
  for( var i  = 0; i < accepted_users_new.length; i++)
  {
    var item = accepted_users_new[i];
    item.show_delete = del;
  }
  this.setState({
    accepted_users: accepted_users_new
  })
  
 }

 updateButtonOnClick = () => {
  fetch(process.env.REACT_APP_BACKEND_URL + 'update_catchup', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.state.catchup)
  }).then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    this.setDelete(false);
    this.setState({
      edit_clicked: false
    });
    this.props.refreshDash();
  }).catch((error) => {
    console.error(error);
  });;
 }

 deleteButtonOnClick = () => {
  fetch(process.env.REACT_APP_BACKEND_URL + 'delete_catchup', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(this.state.catchup)
  }).then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    this.props.refreshDash();
  }).catch((error) => {
    console.error(error);
  });;
 }

 plusButtonOnClick = () => {
    let invited_users_new  = this.state.invited_users;
    let new_user = {
      text: "",
      display_status: true,
      owner: false,
      pending: true,
      key: "",
      show_delete: true
    };
    if(invited_users_new.length === 0 || invited_users_new[invited_users_new.length - 1].key !== ""){
      invited_users_new.push(new_user);
      this.setState({
        invited_users: invited_users_new
      })
    }
    
 }

 onTextChange = (e, listKey) => {
  for(let i = 0; i < this.state.accepted_users.length; i++)
   {
    if (this.state.accepted_users[i].key === listKey)
    {
      let accepted_users_new = this.state.accepted_users;
      accepted_users_new[i].text = e.target.value;
      accepted_users_new[i].key = e.target.value;
      this.setState({
        accepted_users: accepted_users_new
      })
    }
   }
    
   for(let i = 0; i < this.state.invited_users.length; i++)
   {
    if (this.state.invited_users[i].key === listKey)
    {
      let invited_users_new = this.state.invited_users;
      invited_users_new[i].text = e.target.value;
      invited_users_new[i].key = e.target.value;
      this.setState({
        invited_users: invited_users_new
      })
    }
   } 
 }

 removeInvitee = (listKey) => {
   if(this.state.accepted_users.length > 0)
   {
    for(let i = 0; i < this.state.accepted_users.length; i++)
    {
      if (this.state.accepted_users[i].key === listKey)
      {
        let accepted_users_new = this.state.accepted_users;
        delete accepted_users_new[i];
        this.setState({
          accepted_users: accepted_users_new
        })
      }
    }
   }
   
   if(this.state.accepted_users.length > 0)
   {
    for(let i = 0; i < this.state.invited_users.length; i++)
    {
      if (this.state.invited_users[i].key === listKey)
      {
        let invited_users_new = this.state.invited_users;
        delete invited_users_new[i];
        this.setState({
          invited_users: invited_users_new
        })
      }
    }
   }
   
 }

 toggle = () => {
  this.setState(prevState => ({
    dropdownOpen: !prevState.dropdownOpen
  }));
}


onDropdownClick = (e) => {
  let catchup_new = this.state.catchup;
  catchup_new.frequency = e.target.innerText;
  this.setState({
    catchup: catchup_new
  })
} 

onGenerateClick = () => {
  fetch(process.env.REACT_APP_BACKEND_URL + 'generate_new_event', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  }).then((response) => response.json())
  .then((responseJson) => {
    console.log(responseJson);
    let catchup_new = this.state.catchup;
    catchup_new.current_event = responseJson;
    this.setState({
      catchup: catchup_new
    })
  }).catch((error) => {
    console.error(error);
  });; 
}
 

 render() 
 {
    
    var acceptedUsersView = this.state.accepted_users.map((userObj) => 
    <InviteeTextField 
    text={userObj.text}
    display_status={userObj.display_status}
    owner={userObj.owner}
    pending={userObj.pending}
    show_delete={userObj.show_delete}
    disabled={!this.state.edit_clicked}
    listKey={userObj.key}
    deleteFunc={this.removeInvitee}
    onChange={this.onTextChange}
    />);
    var invitedUsersView = this.state.invited_users.map((userObj) => 
    <InviteeTextField 
    text={userObj.text}
    display_status={userObj.display_status}
    owner={userObj.owner}
    pending={userObj.pending}
    show_delete={userObj.show_delete}
    disabled={!this.state.edit_clicked}
    listKey={userObj.key}
    deleteFunc={this.removeInvitee}
    onChange={this.onTextChange}
    />);
    var start_date;
    if (this.state.catchup.current_event !== null)
    {
      start_date = new Date(this.state.catchup.current_event.event_start_time);
      var start_month = start_date.getMonth() + 1;
      var start_month = start_month < 10 ? "0" + start_month : start_month;
      var start_day = start_date.getDate();
      var start_day = start_day < 10 ? "0" + start_day : start_day;
    }
    return(
    <div className="settings-container">
      <div className="top-settings-container">
        <div className="settings-title">
          {this.state.catchup.title}
        </div>
        <div className="edit-button">
        {this.props.catchup.catchup_owner === user_email && !this.state.edit_clicked ?
          <ClearButton 
          text="Edit"
          color="blue"
          onClick={this.editButtonOnClick}
          /> :
          null
        }
        {this.props.catchup.catchup_owner === user_email && this.state.edit_clicked ?
        <div>
          <div className="update">
            <ClearButton 
            text="Update"
            color="blue"
            onClick={this.updateButtonOnClick}
            />
          </div>
          <ClearButton 
          text="Delete"
          color="red"
          onClick={this.deleteButtonOnClick}
          />
        </div> :
          null
        }
        {this.props.catchup.accepted_users.includes(user_email) ?
          <ClearButton
          text="Leave"
          color="red"
          /> :
          null
        }
        </div>
      </div>
      <InviteeTextField 
      text={this.state.catchup.catchup_owner}
      owner={true}
      display_status={true}
      show_delete={false}
      disabled={true}
      />
      {acceptedUsersView}
      {invitedUsersView}
      {this.state.edit_clicked ? 
      <div className="plus-button-settings">
        <AdditionButton
        buttonType="plus"
        onClick={this.plusButtonOnClick}
        />
      </div> :
      null
      }
      <div className="frequency">
        Frequency:
        {this.state.edit_clicked ?
        <div className="dropdown-arrow-settings">
         <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle color="primary" caret>
            {this.state.catchup.frequency}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={(e) => this.onDropdownClick(e)}>Weekly</DropdownItem>
            <DropdownItem onClick={(e) => this.onDropdownClick(e)}>Biweekly</DropdownItem>
            <DropdownItem onClick={(e) => this.onDropdownClick(e)}>Monthly</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        </div> :
        <div className="dropdown-arrow-settings">
        <Dropdown isOpen={false}>
         <DropdownToggle color="primary" caret>
           {this.state.catchup.frequency}
         </DropdownToggle>
         <DropdownMenu>
           <DropdownItem onClick={(e) => this.onDropdownClick(e)}>Weekly</DropdownItem>
           <DropdownItem onClick={(e) => this.onDropdownClick(e)}>Biweekly</DropdownItem>
           <DropdownItem onClick={(e) => this.onDropdownClick(e)}>Monthly</DropdownItem>
         </DropdownMenu>
       </Dropdown>
       </div>
        }
      </div>
      <div className="event">
        {this.state.catchup.current_event !== null ? 
         "Next Event: " + this.state.catchup.current_event.event_name + " On " + start_month+ "/" +start_day:
         "Next Event: Pending Catchup Acceptances" 
        }
       
      </div>
      {this.state.edit_clicked ? 
      <div className="generate-button">
        <ClearButton
        color="dark-blue"
        highlighted={false}
        text="Generate New Event"
        onClick={this.onGenerateClick}
        /> 
      </div>:
      null
      }
    </div>
    );
 } 
}

export default CatchupSettings;