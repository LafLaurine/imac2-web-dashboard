import React from 'react';
import './TestBtn.css';

export default class TestBtn extends React.Component {
  render() {
    return (
      <div className="TestBtn">
        <button>My super test button : {this.props.name}</button>
      </div>
    )
  }
}
