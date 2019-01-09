import React, {Component} from 'react'
import CatchupList from './catchuplist.js'
import CatchupCreate from './createcatchup.js'
import "./dashboard.css"
import { connect } from "react-redux"
import SignoutButton from "../buttons/signoutbutton"
import Cookies from "universal-cookie"
import CatchupSettings from "./catchupsettings"


const mapStateToProps = state => {
  return (
    {userEmail: state.userEmail
    });
};

const cookies = new Cookies();

class ConnectedDashboard extends Component
{
  constructor (props){
    super(props)
    this.state = {
      showCreate : false,
      showSettings: false,
      currentCatchup: null,
      userCatchups: []
    }
    this.getUserCatchups();

  }

  getUserCatchups = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + 'get_catchups?user_email=' + this.props.user_email + '&session_token=' + this.props.session_token, {
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
          userCatchups: responseJson['catchups'],
          currentCatchup: null,
          showSettings: false,
          showCreate: false
        }
      )
    }).catch((error) => {
      console.error(error);
    });;
  }

  signout = () =>
  {
   
    fetch(process.env.REACT_APP_BACKEND_URL + 'sign_out', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user_email: cookies.get("user_email")})
      ,
    }).then((response) => {
      cookies.remove('user_email');
      this.props.history.push('/');
    }).catch((error) => {
      console.error(error);
    });;
  }

  setShowCreate = () => {
    this.setState({
      showCreate : true,
      showSettings: false,
      currentCatchup: null
    })
  }

  setShowSettings = (set_catchup) => {
    this.setState({
      showCreate: false,
      showSettings: true,
      currentCatchup: set_catchup
    })
  }

  render (){
    return(
      <div className="dashboard-container">
        <div className="catchuplist-container">
          <CatchupList
          createFunction = {this.setShowCreate}
          viewFunction = {this.setShowSettings}
          userCatchups={this.state.userCatchups}
           />
        <div className="signoutbutton-container">
          <SignoutButton
          onClick={this.signout}
           />
        </div>
        </div>
        <div className="catchupcreate-container">
        {this.state.showCreate ? 
        <CatchupCreate /> : 
        null}
        {this.state.showSettings ? 
        <CatchupSettings 
        catchup={this.state.currentCatchup}
        refreshDash={this.getUserCatchups}
        /> :
        null}
        </div>
      </div>
    )
  }
}

const Dashboard = connect(mapStateToProps)(ConnectedDashboard)

export default Dashboard;