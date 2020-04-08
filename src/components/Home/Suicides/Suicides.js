import React from 'react';
import './Suicides.css';

import Environment from 'environment';

const step = {
  LOADING: 'loading',
  ERROR: 'error',
  LOADED: 'loaded'
}

/**
 * @brief Show suicides data (Eurostats source)
 * @url https://db.nomics.world/Eurostat/yth_hlth_030?q=suicide
 */

export default class Suicides extends React.Component {
  state = {
    frequency: '',
    step: step.LOADING,
    data: []
  };


  /**
   * @brief Get data for the component when created
   */
  
  componentDidMount() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/yth_hlth_030?limit=1000&offset=0&q=&observations=1&align_periods=1&dimensions={}',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
        .map(country => ({
          'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
          'suicide': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] })),
          'sex' : json.dataset.dimensions_values_labels.sex[country.dimensions.sex]
        }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: step.LOADED, data: data })
      })
      .catch(err => {
        this.setState({ hasError: true,  step: step.ERROR})
        console.error(`[Suicides] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  render() {
    return (
      <div className="Suicides">
        {(() => {
        switch(this.state.step) {
          case step.LOADING: return <p>Loading</p>
          case step.LOADED: return (
            <div>
              <p>How many suicides in { this.state.data[0].country } during { this.state.data[0].suicide[4].date } ?</p> 
              <p> Sex : { this.state.data[0].sex[0] }</p>
              <p>Value : { this.state.data[0].suicide[4].value } </p>
              <button>Man</button>
              <button>Woman</button>
            </div>
          )
          default: return <p>Error loading kidnappings</p>
        }
      })()}
      </div>
    )
  }
}
