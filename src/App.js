import React from 'react';
import './App.css';

import { TestProvider } from './providers/TestProvider';

import TestBtn from './components/TestBtn/TestBtn';
import TestConsumer from './components/TestConsumer/TestConsumer';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <TestBtn name="Hello world"></TestBtn>
        <p>------------------------</p>
        <TestProvider>
          <TestConsumer></TestConsumer>
        </TestProvider>
      </div>
    )
  }
}
