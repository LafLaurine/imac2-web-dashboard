import React from 'react';
import './Bribes.css';

export default class Bribes extends React.Component {
  render() {
    return (
      <div className="BribeChild">
        <p>{this.props.name}</p>
      </div>
    )
  }
}
