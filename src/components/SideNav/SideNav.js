import React from 'react';
import './SideNav.css';

export default class Home extends React.Component {
  render() {
    return (
      <div className="SideNav">
        <div className="sidebar">
          <div className="sidebar-wrapper">
            <ul className="nav">
              <li className="element"><p>Dashboard</p></li>
              <li className="element"><p>Death</p></li>
              <li className="element"><p>Sadness</p></li>
            </ul>
          </div>
        </div>
      </div >
    )
  }
}
