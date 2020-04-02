import React from 'react';
import './TestConsumer.css';

import { TestContext } from '../../providers/TestProvider';

export default class TestConsumer extends React.Component {
  static contextType = TestContext;
  
  render() {
    return (
      <div className="TestConsumer">
        <p>My consummed value : {this.context.name}</p>
      </div>
    )
  }
}
