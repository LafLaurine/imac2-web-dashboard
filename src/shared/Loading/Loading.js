import React from 'react';
import './Loading.css';
import anime from 'animejs';

import Skull from './img/skull.gif';

export default class Loading extends React.Component {

  ///////////////////////////// Render ////////////////////////////////

  render() {
    const loading =  Math.floor(Math.random() * this.animCount);
    switch(loading) {
      default: return (
        <div className="Loading">
          <img src={Skull} alt="loading skull"/>
        </div>
      )
    }
  }

  ///////////////////////// Member variables ///////////////////

  animCount = 1;
}
