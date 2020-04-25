import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

import Letter from './img/letter.png';
import Door from './img/door.png';
import Stat from './img/stat.png';

export default class BottomNav extends React.Component {
  render() {
    return (
      <div className="BottomNav">
        <div>
          <NavLink to={"/HellsDoor"} activeClassName="selected"><img src={Door} alt="Hell's door" /></NavLink>
        </div>
        <div>
          <NavLink to={"/Statishlag"} activeClassName="selected"><img src={Stat} alt="Statishlag" /></NavLink>
        </div>
        <div>
          <NavLink to={"/Contact"} activeClassName="selected"><img src={Letter} alt="Contact" /></NavLink>
        </div>
      </div>
    )
  }
}
