import React, {Component} from 'react'
import CatchupList from './catchuplist.js'
import CatchupCreate from './createcatchup.js'
import "./dashboard.css"
import { connect } from "react-redux"
import SignoutButton from "../buttons/signoutbutton"
import Cookies from "universal-cookie"


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
      showCreate : false
    }

  }

  signout = () =>
  {
    cookies.remove("user_email");
    this.props.history.push("/");
  }

  setShowCreate = () => {
    this.setState({
      showCreate : true
    })
  }

  render (){
    console.log(this.props.userEmail);
    return(
      <div className="dashboard-container">
        <div className="catchuplist-container">
          <CatchupList
          createFunction = {this.setShowCreate}
           />
        <div className="signoutbutton-container">
          <SignoutButton
          onClick={this.signout}
           />
        </div>
        </div>
        <div className="catchupcreate-container">
        {this.state.showCreate ? <CatchupCreate /> : null}
        </div>
      </div>
    )
  }
}

const Dashboard = connect(mapStateToProps)(ConnectedDashboard)

export default Dashboard;