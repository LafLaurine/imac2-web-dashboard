import React from 'react';
import './CausesOfDeath.css';

import Environment from 'environment';
import Step from 'shared/Step';

export default class CausesOfDeath extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequency: '',
      step: Step.LOADING,
      data: []
    };
  }

  ////////////////////// React Hooks /////////////////////////

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  componentDidMount() {
    fetch(Environment.dbNomicsUrl + '/v22/series/Eurostat/hlth_cd_yro?limit=1000&offset=0&q=&observations=1&align_periods=1&dimensions={}',
      { method: 'GET', signal: this.requestController.signal })
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
        if (err.name !== 'AbortError')
          console.error(`[CausesOfDeath] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  ////////////////////////// Render /////////////////////////

  render() {
  switch (this.state.step) {
    case Step.LOADING: return (
      <div className="CausesOfDeath">
        <p>Loading</p>
      </div>
    )

    case Step.LOADED: return (
      <div className="CausesOfDeath">
        <p>TOP CAUSES OF DEATH</p>
      </div>
    )

    default: return (
      <div className="CausesOfDeath">
        <p>Error loading drugs</p>
      </div>
    )}
  }

  ////////////////////// Member variables ////////////////

  requestController = new AbortController();
}