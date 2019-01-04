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
      currentCatchup: null
    }

  }

  signout = () =>
  {
    cookies.remove("user_email");
    fetch(process.env.REACT_APP_BACKEND_URL + 'sign_out', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.props.history.push("/");
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

  setShowSettings = (catchup) => {
    this.setState({
      showCreate: false,
      showSettings: true,
      currentCatchup: catchup
    })
  }

  render (){
    return(
      <div className="dashboard-container">
        <div className="catchuplist-container">
          <CatchupList
          createFunction = {this.setShowCreate}
          viewFunction = {this.setShowSettings}
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
        catchup={this.state.currentCatchup}/> :
        null}
        </div>
      </div>
    )
  }
}

const Dashboard = connect(mapStateToProps)(ConnectedDashboard)

export default Dashboard;