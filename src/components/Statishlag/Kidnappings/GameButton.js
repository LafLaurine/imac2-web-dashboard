import React from 'react';
import './GameButton.css';

export default class GameButton extends React.Component {
  render() {
    return (
        <button className="GameButton" onClick={this.props.onClick}>{this.props.name}</button>
    )
  }
}
