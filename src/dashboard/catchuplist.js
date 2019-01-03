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
              />
            </div>
            <div className="button-container">
              <ClearButton 
              color="red"
              text="Deny"
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