import React from 'react';
import './SideNav.css';

export default class Home extends React.Component {
  render() {
    return (
      <div className="SideNav">
        <div class="sidebar">
          <div class="sidebar-wrapper">
            <ul class="nav">
              <li class="element"><p>Dashboard</p></li>
              <li class="element"><p>Death</p></li>
              <li class="element"><p>Sadness</p></li>
            </ul>
          </div>
        </div>
      </div >
    )
  }
}
