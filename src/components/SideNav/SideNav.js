import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideNav.css';

import Skull from './img/skull.png';
import Skeleton from './img/skeletonHead.gif';
import Music from 'shared/Music/Music';

export default class SideNav extends React.Component {
  render() {
    return (
      <div className="SideNav">
        <div className="logo">
          <h1><NavLink to={"/HellsDoor"} activeClassName="selected">Chaos<br />Dashboard</NavLink></h1>
          <img src={Skull} alt="chaosDashboard wordart" />
          <Music></Music>
        </div>
        <div className="links">
          <h2><NavLink to={"/HellsDoor"} activeClassName="selected">Hell's Door</NavLink></h2>
          <h2><NavLink to={"/Statishlag"} activeClassName="selected">Statislhlag</NavLink></h2>
          <h2><NavLink to={"/Contact"} activeClassName="selected">Contact</NavLink></h2>
        </div>
        <div className="skeleton">
          <img src={Skeleton} alt="skeleton gif" />
        </div>
      </div >
    )
  }
}
