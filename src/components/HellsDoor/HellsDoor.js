import React from 'react';
import './HellsDoor.css';

import chaosDashboard from './img/chaos-dashboard.png'
import elmo from './img/elmo.gif'
import hell from './img/hell.gif'
import satan from './img/satan.gif'
import gatesOfHell from './img/gates-of-hell.gif'

export default class HellsDoor extends React.Component {
  render() {
    return (
      <div className="HellsDoor">
        <div className="wordart">
          <img src={chaosDashboard} alt="chaosDashboard wordart"/>
        </div>
        <div className="gifs">
          <img src={elmo} alt="elmo gif" />
          <img src={hell} alt="hell gif" />
          <img src={gatesOfHell} alt="gatesOfHell gif" />
          <img src={satan} alt="satan gif" />
        </div>
      </div >
    )
  }
}
