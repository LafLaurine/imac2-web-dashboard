import React from 'react';
import './Suicides.css';

import Environment from 'environment';

const step = {
  LOADING: 'loading',
  ERROR: 'error',
  LOADED: 'loaded'
}

/**
 * @brief Show suicides data (World Bank source)
 * @url https://db.nomics.world/WB/WDI?q=suicide
 */

export default class Suicides extends React.Component {
  state = {
    step: step.LOADING,
    data: []
  };


  /**
   * @brief Get data for the component when created
   */
  
  componentDidMount() {
    fetch(Environment.dbNomicsUrl + 'v22/series/WB/WDI/',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
        .filter(country => country.dimensions.country === '1A')
        .map(country => ({
          'country': json.dataset.dimensions_values_labels.country[country.dimensions.country]
        }))
        console.log(data)
        this.setState({ step: step.LOADED, data: data })
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
              <p>How many suicides in { this.state.data[0].country } ? </p>
            </div>
          )
          default: return <p>Error loading kidnappings</p>
        }
      })()}
      </div>
    )
  }
}
