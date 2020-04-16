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
                <div className="gifs">
                    <img src={SkeletonFire} id="skeletonOnFire" alt="SkeletonFire gif" />
                    <img src={SkeletonDeo} id="skeletonClean" alt="SkeletonDeo gif" />
                    <img src={SkeletonSax} id="skeletonSax" alt="SkeletonSax gif" />
                    <img src={SkeletonSpoon} id="skeletonSpoon" alt="SkeletonSpoon gif" />
                    <img src={SkeletonCoffee} id="skeletonCoffee" alt="SkeletonCoffee gif" />
                </div>
                <div className="contactInfo">
                    <h2 id="callHell">CALL 666</h2>
                </div>
            </div >
        )
    }
}
