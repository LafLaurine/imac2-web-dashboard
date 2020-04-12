import React from 'react';
import './Crimes.css';

import Environment from 'environment';

const step = {
  LOADING: 'loading',
  ERROR: 'error',
  LOADED: 'loaded'
};

export default class Crimes extends React.Component {
  state = {
    frequency: '',
    step: step.LOADING,
    data: []
};

componentDidMount() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/crim_gen?limit=1000&offset=0&q=homicide&observations=1&align_periods=1&dimensions={}',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
        .map(country => ({
          
          //'sex' : json.dataset.dimensions_values_labels.sex[country.dimensions.sex]
        }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: step.LOADED, data: data })
      })
      .catch(err => {
        this.setState({ hasError: true, step: step.ERROR })
        console.error(`[Crimes] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
}

 render() {
    console.log(this.state.data)
    return (
      <div className="Crimes">
        {(() => {
        switch(this.state.step) {
          case step.LOADING: return <p>Loading</p>
          case step.LOADED: return (
            <div>
            <p>Murders from last year</p>
            </div>
          )
          default: return <p>Error loading crimes</p>
        }
      })()}
      </div>
    )
  }
}