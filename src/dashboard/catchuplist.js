import React, {Component} from 'react'
import CreateButton from "../buttons/createbutton"
import "./catchuplist.css"
import ClearButton from '../buttons/clearbutton';
import Cookies from 'universal-cookie'

const cookies = new Cookies();
//const user_email = cookies.get('user_email')
const user_email = "your@email.com"

class CatchupList extends Component
{

  getUserCatchups = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + 'get_catchups?user_email=user@email.com', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json()).
    then((responseJson) => {
      console.log(responseJson);
      this.setState(
        {
          userCatchups: responseJson['catchups']
        }
      )
    }).catch((error) => {
      console.error(error);
    });;
  }

  constructor(props)
  {
    super(props);
    this.state = {
      showCreateButton: true,
      userCatchups: []
    };
    this.getUserCatchups();
  }

  showCreate = () => {
    this.props.createFunction();
    this.setState({
      showCreateButton: false
    })
  }



  render() {
    var catchupViews = this.state.userCatchups.map((catchup) => 
    <div className="full-item-container">
       <CatchupListItem 
      title={catchup.title}
      pending={catchup.invited_users.includes(user_email)}
      catchup_id={catchup.catchup_id}
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
        email: user_email,
        catchup_id: this.props.catchup_id
      })
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
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
        email: user_email,
        catchup_id: this.props.catchup_id
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
        <div className="item-container">
          <div className="item-title">
            {this.props.title}
          </div>
          <div className="view-button-container">
            <ClearButton 
            color="blue"
            text="View"
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