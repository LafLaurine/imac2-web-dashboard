import React from 'react';
import './HellsDoor.css';

import chaosDashboard from './img/chaosDashboard.png'
import elmo from './img/elmo.gif'
import hell from './img/hell.gif'
import satan from './img/satan.gif'
import gatesOfHell from './img/gatesOfHell.gif'

export default class HellsDoor extends React.Component {
  render() {
    return (
      <div className="HellsDoor">
        <img className="wordart" src={chaosDashboard} alt="chaosDashboard wordart"/>
        <img className="gif" src={elmo} alt="elmo gif" />
        <img className="gif" src={hell} alt="hell gif" />
        <img className="gif" src={gatesOfHell} alt="gatesOfHell gif" />
        <img className="gif" src={satan} alt="satan gif" />
      </div >
    )
  }
}