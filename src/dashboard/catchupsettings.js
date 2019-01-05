import React, {Component} from 'react'
import './catchupsettings.css'
import ClearButton from '../buttons/clearbutton';
import InviteeTextField from './inviteetextfield'

class CatchupSettings extends Component
{

 constructor(props)
 {
   super(props)
   this.state = {
    catchup: props.catchup,
    accepted_users: props.catchup.accepted_users.map((user_email) => 
    { return({
      view: <InviteeTextField 
     text={user_email}
     display_status={true}
     listKey={user_email}
     owner={false}
     pending={false}
     />,
     key: user_email
    }
    )
   }),
   invited_users: props.catchup.invited_users.map((user_email) => 
   { return({
     view: <InviteeTextField 
    text={user_email}
    display_status={true}
    listKey={user_email}
    owner={false}
    pending={true}
    />,
    key: user_email
   }
   )
  }) 
   }
 } 

 componentWillReceiveProps(nextProps)
 {
   this.setState({
    catchup: nextProps.catchup,
     accepted_users: nextProps.catchup.accepted_users.map((user_email) => 
     { return({
       view: <InviteeTextField 
      text={user_email}
      display_status={true}
      listKey={user_email}
      owner={false}
      pending={false}
      />,
      key: user_email
     }
     )
    }),
    invited_users: nextProps.catchup.invited_users.map((user_email) => 
    { return({
      view: <InviteeTextField 
     text={user_email}
     display_status={true}
     listKey={user_email}
     owner={false}
     pending={true}
     />,
     key: user_email
    }
    )
   }) 
   })
 }
 render() 
 {
    
    var acceptedUsersView = this.state.accepted_users.map((userObj) => userObj.view);
    var invitedUsersView = this.state.invited_users.map((userObj) => userObj.view);
    var start_date;
    if (this.state.catchup.current_event !== null)
    {
      start_date = new Date(this.state.catchup.current_event.event_start_time);
      var start_month = start_date.getMonth() + 1;
      var start_month = start_month < 10 ? "0" + start_month : start_month;
      var start_day = start_date.getDate();
      var start_day = start_day < 10 ? "0" + start_day : start_day;
      console.log(start_date);
    }
    return(
    <div className="settings-container">
      <div className="top-settings-container">
        <div className="settings-title">
          {this.state.catchup.title}
        </div>
        <div className="edit-button">
          <ClearButton 
          text="Edit"
          color="blue"
          />
        </div>
      </div>
      <InviteeTextField 
      text={this.state.catchup.catchup_owner}
      owner={true}
      display_status={true}
      />
      {acceptedUsersView}
      {invitedUsersView}
      <div className="frequency">
        Frequency: {this.state.catchup.frequency} 
      </div>
      <div className="event">
        {this.state.catchup.current_event !== null ? 
         "Next Event: " + this.state.catchup.current_event.event_name + " On " + start_month+ "/" +start_day:
         "Next Event: Pending Catchup Acceptances" 
        }
       
      </div>
    </div>
    );
 } 
}

export default CatchupSettings;