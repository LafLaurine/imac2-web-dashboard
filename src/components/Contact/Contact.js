import React from 'react';
import './Contact.css';
import SkeletonFire from './img/skeletonFire.gif';
import SkeletonDeo from './img/skeletonDeo.gif';
import SkeletonSax from './img/skeletonSax.gif';
import SkeletonSpoon from './img/skeletonSpoon.gif';
import SkeletonCoffee from './img/skeletonCoffee.gif';

export default class Contact extends React.Component {

  render() {
    return (
      <div className="Contact">
        <img src={SkeletonFire} alt="SkeletonFire gif" />
        <img src={SkeletonDeo} alt="SkeletonDeo gif" />
        <img src={SkeletonSax} alt="SkeletonSax gif" />
        <img src={SkeletonSpoon} alt="SkeletonSpoon gif" />
        <img src={SkeletonCoffee} alt="SkeletonCoffee gif" />
        <img src={SkeletonFire} alt="SkeletonFire gif" />
        <h2 id="call-hell" > <p className="glitch" data-text="CALL 666">CALL 666</p></h2>
      </div >
    )
  }
}
