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

  componentDidMount() {
    fetch(Environment.dbNomicsUrl + '/v22/series/Eurostat/hlth_cd_yro?limit=1000&offset=0&q=&observations=1&align_periods=1&dimensions={}',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'deaths': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] })),
          }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data })
      })
      .catch(err => {
        if (err.name !== 'AbortError')
          console.error(`[CausesOfDeath] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }


  render() {
    console.log(this.state.data);
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
        <p>Error loading Causes of Death</p>
      </div>
    )}
  }


  requestController = new AbortController();
}