import React from 'react';
import './TestCond.css';

export default class TestCond extends React.Component {
  view1() {
    return <p>Data is > 2</p>
  }

  view2() {
    return <p>Data is 2 or less</p>
  }
  
  render() {
    const myData = ["zbeul", "yeah", "look"];

    return (
      <div className="TestCond">
        { myData.map((value, index) => {
          return <li key={index}>{value}</li>
        }) }
        <br/>
        { myData.length > 2 
          ? this.view1()
          : this.view2()
        }
      </div>
    )
  }
}
