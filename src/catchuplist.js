import React, {Component} from 'react'
import "./catchuplist.css"

class CatchupList extends Component
{
  render() {
    return (
      <div>
        <div className="title-container">
          <div className="list-title">
            Your Catchups
          </div>
          <div className="create-button">
            <div className="create-text">
              Create
            </div>
          </div>
        </div>
        <div className="divider">
        </div>
      </div>
    )
  }
}

export default CatchupList;