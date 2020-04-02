import React from 'react';
import './App.css';

import TestBtn from './components/TestBtn/TestBtn';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <TestBtn name="Hello world"></TestBtn>
      </div>
    )
  }
}
