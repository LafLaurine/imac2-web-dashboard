import React from 'react';
import './Music.css'
import hellMusic from './music/hellMusic.mp3'

export default class Music extends React.Component {
  render() {
    return (
      <div className="Music">
        <audio controls autoPlay loop className="audio-element">
          <source src={hellMusic}></source>
        </audio>
      </div>
    );
  }
}
