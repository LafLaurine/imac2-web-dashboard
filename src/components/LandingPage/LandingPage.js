import React from 'react';
import './LandingPage.css';
import chaosDashboard from './img/chaosDashboard.png'
import elmo from './img/elmo.gif'
import hell from './img/hell.gif'
import satan from './img/satan.gif'
import gatesOfHell from './img/gatesOfHell.gif'
import SideNav from 'components/SideNav/SideNav';

export default class LandingPage extends React.Component {
    render() {
        return (
            <div className="landingPage">
                <SideNav></SideNav>
                <div className="container">
                    <img className="wordart" src={chaosDashboard} alt="chaosDashboard wordart"></img>
                    <img className="gif" src={elmo} alt="elmo gif" />
                    <img className="gif" src={hell} alt="hell gif" />
                    <img className="gif" src={gatesOfHell} alt="gatesOfHell gif" />
                    <img className="gif" src={satan} alt="satan gif" />
                </div >
            </div >
        )
    }
}
