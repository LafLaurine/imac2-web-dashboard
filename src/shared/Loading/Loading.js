import React from 'react';
import './Loading.css';

import Skull from './img/skull.gif';
import God from './img/god.gif';
import Hell from './img/hell.gif';
import Fire from './img/fire.gif';

export default class Loading extends React.Component {

  ///////////////////////////// Render ////////////////////////////////

  render() {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    return (
      <div className="Loading">
        <img src={this.images[randomIndex]} alt="loading" />
      </div>
    )
  }

  ///////////////////////// Member variables ///////////////////

  images = [Skull, God, Hell, Fire];
}
