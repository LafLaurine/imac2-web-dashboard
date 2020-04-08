import React from 'react';
import './App.css';
import SideNav from 'components/SideNav/SideNav'
import Home from 'components/Home/Home';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <SideNav></SideNav>
        <Home></Home>
      </div>
    )
  }
}
