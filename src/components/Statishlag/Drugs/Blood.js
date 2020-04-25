import React from 'react';
import './Drugs.css';

import Blood1 from './img/blood1.svg';
import Blood2 from './img/blood2.svg';
import Blood3 from './img/blood3.svg';
import Blood4 from './img/blood4.svg';
import Blood5 from './img/blood5.svg';
import BloodFull from './img/bloodFull.svg';

export default class Blood extends React.Component {
  orderDrug() {
    if (this.props.blood !== 0) {
      if (this.props.blood <= 10)
        return this.Blood10();
      else if (this.props.blood <= 20)
        return this.Blood20();
      else if (this.props.blood <= 30)
        return this.Blood30();
      else if (this.props.blood <= 40)
        return this.Blood40();
      else if (this.props.blood <= 50)
        return this.Blood50();
      else if (this.props.blood > 50)
        return this.BloodOver();
    }
  }

  Blood10() {
    return <img id="blood" src={Blood1} alt="Blood 10" />
  }
  
  Blood20() {
    return <img src={Blood2} alt="Blood 20" />
  }
  
  Blood30() {
    return <img src={Blood3} alt="Blood 30" />
  }
  
  Blood40() {
    return <img src={Blood4} alt="Blood 40" />
  }
  
  Blood50() {
    return <img src={Blood5} alt="Blood 50" />
  }
  
  BloodOver() {
    return <img src={BloodFull} alt="Blood full" />
  }

  render() {
    return (
      <div className="Blood">
        {this.orderDrug()}
      </div>
    )
  }

}