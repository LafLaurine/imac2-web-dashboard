import React from 'react';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';

import HellsDoor from './HellsDoor/HellsDoor';
import Statishlag from './Statishlag/Statishlag';
import Contact from './Contact/Contact';
import SideNav from 'components/SideNav/SideNav';

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <SideNav></SideNav>
        <Switch>
          <Route exact path={"/HellsDoor"} component={HellsDoor} />
          <Route exact path={"/Statishlag"} component={Statishlag} />
          <Route exact path={"/Contact"} component={Contact} />
          <Route exact path={"/"}>
            <Redirect to="/HellsDoor" />
          </Route>
        </Switch>
      </BrowserRouter>
    )
  }
}
