import React from 'react';
import './TestChildToParent.css';

export default class TestChildToParent extends React.Component {
  render() {
    return (
      <div className="TestChildToParent">
        <button onClick={() => this.props.action('fromChildWithLove')}> data to parent</button>
      </div>
    )
  }
}
