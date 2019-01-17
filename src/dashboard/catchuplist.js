import React, {Component} from 'react'
import CreateButton from "../buttons/createbutton"
import "./catchuplist.css"
import ClearButton from '../buttons/clearbutton';
import Cookies from 'universal-cookie'

const cookies = new Cookies();
//const user_email = cookies.get('user_email')

class CatchupList extends Component
{

 

  constructor(props)
  {
    super(props);
    //props.userCatchups.forEach(function(catchup) {catchup.selected = false})
    this.state = {
      showCreateButton: props.showCreateButton,
      userCatchups: props.userCatchups
    };
  }

  componentWillReceiveProps(nextProps)
  {
    this.setState({
      userCatchups: nextProps.userCatchups,
      showCreateButton: nextProps.showCreateButton
    })
  }

  showCreate = () => {
    this.props.createFunction();
    var catchups_new = this.state.userCatchups;
    for(var i = 0; i < catchups_new.length; i++)
    {
      catchups_new[i].selected = false;  
    }
    this.setState({
      userCatchups: catchups_new
    })
  }

  showView = (catchup) => {
    this.setState({
      showCreateButton: true
    })
    var catchups_new = this.state.userCatchups;
    for(var i = 0; i < catchups_new.length; i++)
    {
      if(catchups_new[i]._id.$oid === catchup._id.$oid)
      {
        catchups_new[i].selected = true; 
      }
      else{
        catchups_new[i].selected = false;  
      }
    }
    this.setState({
      userCatchups: catchups_new
    })
    this.props.viewFunction(catchup);
  }



  render() {
    var catchupViews = this.state.userCatchups.map((catchup) => 
    <div className="full-item-container">
       <CatchupListItem 
      pending={catchup.invited_users.includes(this.props.user_email)}
      catchup={catchup}
      viewFunction={this.showView}
      highlighted={catchup.selected}
      user_email={this.props.user_email}
      session_token={this.props.session_token}
      refreshDash={this.props.refreshDash}
      />
      <div className="gray-divider" />
    </div>
   )
    return (
      <div>
        <div className="title-container">
          <div className="list-title">
            Your Catchups
          </div>
          <div className="create-button-container"
          >
          {
          this.state.showCreateButton ?
          <CreateButton 
          onClick={this.showCreate}
          />
          :
          null
          }
          </div>
        </div>
        <div className="divider"/>
        <div>
          {catchupViews}
        </div>
      </div>
    )
  }
}

class CatchupListItem extends Component
{
  constructor (props)
  {
    super(props);
  }

  acceptCatchup = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + 'accept_catchup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_email: this.props.user_email,
        catchup_id: this.props.catchup._id.$oid,
        session_token: this.props.session_token
      })
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.props.refreshDash();
    }).catch((error) => {
      console.error(error);
    });;
  }

  denyCatchup = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + 'deny_catchup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_email: this.props.user_email,
        catchup_id: this.props.catchup._id.$oid,
        session_token: this.props.session_token
      })
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.props.refreshDash()
    }).catch((error) => {
      console.error(error);
    });;
  }

  render() {
    return(
        <div className="item-container">
          <div className="item-title">
            {this.props.catchup.catchup_title}
          </div>
          <div className="view-button-container">
            <ClearButton 
            color="blue"
            text="View"
            highlighted={this.props.highlighted}
            onClick={() => this.props.viewFunction(this.props.catchup)}
            />
          </div>
          {this.props.pending ?
          <div className="accept-deny-container">
            <div className="button-container">
              <ClearButton 
              color="blue"
              text="Accept"
              onClick={this.acceptCatchup}
              />
            </div>
            <div className="button-container">
              <ClearButton 
              color="red"
              text="Deny"
              onClick={this.denyCatchup}
              />
            </div>
          </div> :
          null
          }
        </div>
    )
  }
}

export default CatchupList;