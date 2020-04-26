import React from 'react';
import './FlyingDemon.css';
import anime from 'animejs';

export default class FlyingDemon extends React.Component {
  componentDidMount() {
    anime({
      targets: '.FlyingDemon',
      keyframes: [
        {
          translateX: () => anime.random(0, window.innerWidth),
          translateY: () => anime.random(0, window.innerHeight)
        },
        {
          translateX: () => anime.random(0, window.innerWidth),
          translateY: () => anime.random(0, window.innerHeight)
        },
        {
          translateX: () => anime.random(0, window.innerWidth),
          translateY: () => anime.random(0, window.innerHeight)
        },
        {
          translateX: () => anime.random(0, window.innerWidth),
          translateY: () => anime.random(0, window.innerHeight)
        },
        {
          translateX: () => anime.random(0, window.innerWidth),
          translateY: () => anime.random(0, window.innerHeight)
        }
      ],
      direction: 'alternate',
      easing: 'easeInOutQuad',
      autoplay: true,
      loop: true
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
