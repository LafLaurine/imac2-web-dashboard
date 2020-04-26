import React from 'react';
import './FlyingDemon.css';
import anime from 'animejs';

import Demon from './img/demon.gif';

export default class FlyingDemon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHiding: true
    };
  }

  /////////////////////////// React hooks ////////////////////

  componentDidMount() {
    setInterval(() => {
      if (Math.random() > 0.6) {
        this.anim = this.getNewAnim();
        this.anim.play();
        this.setState({ isHiding: false });
      }
    }, 10000);
  }

  //////////////////////////////// Logic ///////////////////////

  getNewAnim() {
    let keys = [];
    for (let i = 0; i < 5; i++) {
      keys.push({
        translateX: () => anime.random(50, window.innerWidth - 50),
        translateY: () => anime.random(50, window.innerHeight - 50)
      })
    }

    return anime({
      targets: '.FlyingDemon',
      keyframes: keys,
      direction: 'alternate',
      easing: 'easeInOutQuad',
      loop: false,
      autoplay: false,
      duration: 5000,
      complete: (anim) => {
        this.setState({ isHiding: true });
      }
    });
  }

  ///////////////////////////// Render ////////////////////////////////

  render() {
    const classes = this.state.isHiding ? 'FlyingDemon hide' : 'FlyingDemon';
    return (
      <div className={classes}><img src={Demon} alt="Flying demon baby"/></div>
    )
  }

  /////////////////////////// Member variables /////////////////

  anim = {};
}
