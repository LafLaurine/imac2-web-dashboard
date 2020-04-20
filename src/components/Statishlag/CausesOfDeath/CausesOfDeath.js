import React from 'react';
import './CausesOfDeath.css';

import Environment from 'environment';
import Step from 'shared/Step';

export default class CausesOfDeath extends React.Component {
  state = {
    frequency: '',
    step: Step.LOADING,
    data: []
  };
componentDidMount() {
    fetch(Environment.dbNomicsUrl + '/v22/series/Eurostat/hlth_cd_yro?limit=1000&offset=0&q=&observations=1&align_periods=1&dimensions={}',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
        //.filter(age => age.dimensions.age === this.state.age)
          .map(cause => ({
            'cause': json.dataset.dimensions_values_labels.icd10[cause.dimensions.icd10],
          }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data })
      })
      .catch(err => {
        this.setState({ hasError: true, step: Step.ERROR })
        console.error(`[CausesOfDeath] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
 }


  render() {
    //console.log(this.state.data)
    return (
      <div className="CausesOfDeath">
        {(() => {
        switch(this.state.step) {
          case Step.LOADING: return <p>Loading</p>
          case Step.LOADED: return (
            <div>
            <p>TOP CAUSES OF DEATH</p>
             
            </div>
          )
          default: return <p>Error loading drugs</p>
        }
      })()}
      </div>
    )
  }
}