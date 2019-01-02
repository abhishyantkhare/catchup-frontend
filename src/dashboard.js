import React, {Component} from 'react'
import CatchupList from './catchuplist.js'
import CatchupCreate from './createcatchup.js'
import "./dashboard.css"
import { connect } from "react-redux"

const mapStateToProps = state => {
  return (
    {userEmail: state.userEmail
    });
};

class ConnectedDashboard extends Component
{
  constructor (props){
    super(props)
    this.setState({
      showCreate : false
    })
  }
  render (){
    console.log(this.props.userEmail);
    return(
      <div className="dashboard-container">
        <div className="catchuplist-container">
          <CatchupList />
        </div>
        <div className="catchupcreate-container">
          <CatchupCreate />
        </div>
      </div>
    )
  }
}

const Dashboard = connect(mapStateToProps)(ConnectedDashboard)

export default Dashboard;