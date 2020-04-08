import React from 'react';
import './Kidnappings.css';

import Environment from 'environment';

const step = {
  LOADING: 'loading',
  ERROR: 'error',
  LOADED: 'loaded'
}

/**
 * @brief Show kidnappings data (Eurostats source)
 * @url https://db.nomics.world/Eurostat/crim_off_cat?q=kidnapping
 */
export default class Kidnappings extends React.Component {
  state = {
    frequency: '',
    step: step.LOADING,
    data: []
  };

  /**
   * @brief Get data for the component when created
   */
  componentDidMount() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/crim_off_cat?limit=1000&offset=0&q=kidnapping&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .filter(country => country.dimensions.unit !== 'P_HTHAB')
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'kidnappings': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] }))
          }));
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: step.LOADED, data: data });
      })
      .catch(err => {
        this.setState({ hasError: true, step: step.ERROR });
        console.error(`[Kidnappings] Cannot get  ${Environment.dbNomicsUrl} : ${err}`);
      });
  }

  render() {
    return (
      <div className="Kidnappings">
      {(() => {
        switch(this.state.step) {
          case step.LOADING: return <p>Loading</p>
          case step.LOADED: return (
            <div>
              <p>How many kidnappings in { this.state.data[0].country } during { this.state.data[0].kidnappings[0].date } ? </p>
              <input type="range"></input>
            </div>
          )
          default: return <p>Error loading kidnappings</p>
        }
      })()}
      </div>
    )
  }
}
