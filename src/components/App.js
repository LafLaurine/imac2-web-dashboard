import React from 'react';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';

import HellsDoor from './HellsDoor/HellsDoor';
import Statishlag from './Statishlag/Statishlag';
import Contact from './Contact/Contact';
import SideNav from 'components/SideNav/SideNav';
import BottomNav from './BottomNav/BottomNav';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { screenWidth: null };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
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
      <BrowserRouter>
        { (this.state.screenWidth > 1000 ) 
        ? <SideNav></SideNav> 
        : <BottomNav></BottomNav> 
        }
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
