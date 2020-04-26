import React from 'react';
import './FlyingDemon.css';
import anime from 'animejs';

export default class FlyingDemon extends React.Component {
  componentDidMount() {
    anime({
      targets: '.FlyingDemon',
      translateX: 250
    });
  }

  ///////////////////////////// Render ////////////////////////////////

  render() {
    const loading =  Math.floor(Math.random() * this.animCount);
    return (
      <div className="FlyingDemon">I'm the flying demon</div>
    )
  }
}
