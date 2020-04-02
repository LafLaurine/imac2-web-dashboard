import React from 'react';
import logo from './logo.svg';
import './App.css';

import TestBtn from './components/TestBtn/TestBtn';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.js</code> and save to reload.</p>
        <a className="App-link" href="https://reactjs.org" rel="noopener noreferrer">Learn React</a>
      </header>
      <TestBtn name="Hello world"></TestBtn>
    </div>
  );
}

export default App;
