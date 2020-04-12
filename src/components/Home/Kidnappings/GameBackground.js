import React from 'react';
import './GameBackground.css';
import Head from './img/tony-kornheiser.png';

export default class GameButton extends React.Component {

  renderHeads(number) {
    let heads = [];
    for (let i = 0; i < number; i++) {
      heads.push(<img src={Head} alt="Tony Kornheiser"></img>)
    }
    return heads;
  }

  render() {
    return (
      <div className="GameBackground">
        { this.renderHeads(this.props.value) }
      </div>
    )
  }
}
