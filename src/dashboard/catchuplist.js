import React, {Component} from 'react'
import CreateButton from "../buttons/createbutton"
import "./catchuplist.css"

class CatchupList extends Component
{

  constructor(props)
  {
    super(props);
    this.state = {
      showCreateButton: true
    }
  }

  showCreate = () => {
    this.props.createFunction();
    this.setState({
      showCreateButton: false
    })
  }

  render() {
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
        <div className="divider">
        </div>
      </div>
    )
  }
}

export default CatchupList;