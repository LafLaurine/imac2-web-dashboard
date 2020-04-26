import React from 'react';
import './Button.css'

export default class Button extends React.Component {
  render() {
    return (
      <button className="Button" onClick={this.props.onClick}>{this.props.name}</button>
    )
  }
}
