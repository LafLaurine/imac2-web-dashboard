import React from 'react';
import './SideNav.css';
import { Link } from 'react-router-dom';


export default class SideNav extends React.Component {

  render() {
    return (
      <div className="SideNav">
        <div className="sidebar">
          <div className="sidebar-wrapper">
            <ul className="nav">
              <li className="element"> <Link to={"/"}>Dashboard</Link></li>
              <li className="element"><Link to={"/Home"}>Death</Link></li>
              <li className="element"> <Link to={"/Home"}>Sadness</Link></li>
            </ul>
          </div>
        </div >
      </div >
    )
  }
}