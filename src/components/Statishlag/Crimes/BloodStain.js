import React from 'react';
import Blood from './img/blood.svg';


export default class BloodStain extends React.Component {
  

  render() {
    
    return (

      <div className="BloodStain">
        
        <img src = {Blood} alt = "blood"/>
      </div>
    );
  }
}

