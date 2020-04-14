import React from 'react';
import './Bribes.css';

import BribeChild from './BribeChild';

export default class Bribes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 10
    };

    setInterval(() => {
      this.setState({ value: this.state.value + 1 });
    }, 1000);
  }

  renderBribe() {
    return <BribeChild name={this.state.value}></BribeChild>
  }

  render() {
    return (
      <div className="Bribes">
        <p>Bribes</p>
        { this.renderBribe() }
      </div>
    )
  }
}
