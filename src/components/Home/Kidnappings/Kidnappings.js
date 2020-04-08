import React from 'react';
import './Kidnappings.css';

import Environment from 'environment';

/**
 * @brief Show kidnappings data (Eurostats source)
 * @url https://db.nomics.world/Eurostat/crim_off_cat?q=kidnapping
 */
export default class Kidnappings extends React.Component {
  state = {
    frequency: '',
    hasError: false,
    isLoading: true,
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
        this.setState({ frequency: json.series.docs[0]['@frequency'], hasError: false, isLoading: false, data: data });
      })
      .catch(err => {
        this.setState({ hasError: true, isLoading: false });
        console.error(`[Kidnappings] Cannot get  ${Environment.dbNomicsUrl} : ${err}`);
      });
  }

  render() {
    return (
      <div className="Kidnappings">
        <p>Kidnappings</p>
        { this.state.isLoading && <p>Component is loading</p> }
        <p>{ this.state.data.length }</p>
      </div>
    )
  }
}
