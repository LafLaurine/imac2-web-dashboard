import React from 'react';
import { Switch, HashRouter, Route, Redirect } from 'react-router-dom';

import HellsDoor from './HellsDoor/HellsDoor';
import Statishlag from './Statishlag/Statishlag';
import Contact from './Contact/Contact';
import SideNav from 'components/SideNav/SideNav';
import BottomNav from './BottomNav/BottomNav';
import FlyingDemon from 'shared/FlyingDemon/FlyingDemon';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { screenWidth: 1001 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    this.setState({ screenWidth: window.innerWidth });
  }

  render() {
    return (
      <HashRouter hashType="noslash">
        { (this.state.screenWidth > 1000 ) 
        ? <SideNav></SideNav> 
        : <BottomNav></BottomNav> 
        }
        <FlyingDemon></FlyingDemon>
        <Switch>
          <Route exact path={"/HellsDoor"} component={HellsDoor} />
          <Route exact path={"/Statishlag"} component={Statishlag} />
          <Route exact path={"/Contact"} component={Contact} />
          <Route exact path={"/"}>
            <Redirect to="/HellsDoor" />
          </Route>
        </Switch>
      </HashRouter>
    )
  }
}
