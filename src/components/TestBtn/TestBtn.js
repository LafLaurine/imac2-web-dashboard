import React from 'react';
import './TestBtn.css';

function TestBtn(props) {
  return (
    <div className="TestBtn">
      <button>My super test button : {props.name}</button>
    </div>
  );
}

export default TestBtn;
