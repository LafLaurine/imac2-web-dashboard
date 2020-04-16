import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';

import HellsDoor from './HellsDoor/HellsDoor';
import Statishlag from './Statishlag/Statishlag';
import SideNav from 'components/SideNav/SideNav';

const NotFound = () => {
  return (
    <div>404 not found</div>
  )
};

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <SideNav></SideNav>
        <Switch>
          <Route exact path={"/"} component={HellsDoor} />
          <Route exact path={"/Statishlag"} component={Statishlag} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    )
  }
}
