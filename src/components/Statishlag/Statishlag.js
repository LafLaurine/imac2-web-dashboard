import React from 'react';
import './Statishlag.css';

import Bribes from './Bribes/Bribes';
import Kidnappings from './Kidnappings/Kidnappings';
import CausesOfDeath from './CausesOfDeath/CausesOfDeath';
import Crimes from './Crimes/Crimes';
import Drugs from './Drugs/Drugs';
import Employments from './Employments/Employments';
import Poverty from './Poverty/Poverty';
import Suicides from './Suicides/Suicides';

export default class Statishlag extends React.Component {
  render() {
    return (
      <div className="Statishlag">
        <Bribes></Bribes>
        <CausesOfDeath></CausesOfDeath>
        <Crimes></Crimes>
        <Drugs></Drugs>
        <Employments></Employments>
        <Kidnappings></Kidnappings>
        <Poverty></Poverty>
        <Suicides></Suicides>
      </div>
    )
  }
}
