import React from 'react';
import { Link } from 'react-router-dom';
import './SideNav.css';

export default class SideNav extends React.Component {
  render() {
    return (
      <div className="SideNav">
        <h2><Link to={"/"}>Hell's Door</Link></h2>
        <h2><Link to={"/Statishlag"}>Statislhlag</Link></h2>
        <h2><Link to={"/Contact"}>Contact</Link></h2>
      </div >
    )
  }
}
