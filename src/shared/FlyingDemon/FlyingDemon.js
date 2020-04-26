import React from 'react';
import './FlyingDemon.css';
import anime from 'animejs';

export default class FlyingDemon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHiding: true
    };
  }

  componentDidMount() {
    let keys = [];
    for (let i = 0; i < 5; i++) {
      keys.push({
        translateX: () => anime.random(50, window.innerWidth - 50),
        translateY: () => anime.random(50, window.innerHeight - 50)
      })
    }

    this.anim = anime({
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

    setInterval(() => {
      if (Math.random() > 0.6) {
        this.setState({ isHiding: false });
        this.anim.restart();
      }
    }, 5000);
  }

  ///////////////////////////// Render ////////////////////////////////

  render() {
    const classes = this.state.isHiding ? 'FlyingDemon hide' : 'FlyingDemon';
    return (
      <div className={classes}>I'm the flying demon</div>
    )
  }

  /////////////////////////// Member variables /////////////////

  anim = {};
}
