import React from 'react';
import './App.css';

import { TestProvider } from './providers/TestProvider';

import TestBtn from './components/TestBtn/TestBtn';
import TestConsumer from './components/TestConsumer/TestConsumer';
import TestChildToParent from './components/TestChildToParent/TestChildToParent';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.childHandler = this.childHandler.bind(this);
  }

  childHandler(dataFromChild) {
    console.log(`data recieved from child : ${dataFromChild}`);
  }

  render() {
    return (
      <div className="App">
        <TestBtn name="Hello world"></TestBtn>
        <p>------------------------</p>
        <TestProvider>
          <TestConsumer></TestConsumer>
        </TestProvider>
        <p>------------------------</p>
        <TestChildToParent action={this.childHandler}></TestChildToParent>
      </div>
    )
  }
}
