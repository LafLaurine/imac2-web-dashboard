import React from 'react';
import './NextButton.css';

export default class NextButton extends React.Component {
  render() {
    return (
        <button className="NextButton" onClick={this.props.onClick}>{this.props.name}</button>
    )
  }
}
