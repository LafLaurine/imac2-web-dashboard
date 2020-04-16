import React from 'react';
import './App.css';

import { Switch, BrowserRouter, Route } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import Home from './Home/Home';


const NotFound = () => {
  return (
    <div>404 not found</div>
  );
};


export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={"/"} component={LandingPage} />
          <Route exact path={"/Home"} component={Home} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter >
    )
  }
}
