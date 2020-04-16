import React from 'react';
import './SideNav.css';
import { Link } from 'react-router-dom';

export default class SideNav extends React.Component {
  render() {
    return (
      <div className="SideNav">
        <h2><Link to={"/"}>Dashboard</Link></h2>
        <h2><Link to={"/Home"}>Death</Link></h2>
        <h2><Link to={"/Home"}>Sadness</Link></h2>
      </div >
    )
  }
}
