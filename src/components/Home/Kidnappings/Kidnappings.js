import React from 'react';
import './Kidnappings.css';

import Environment from 'environment';

/**
 * @brief Show kidnappings data (Eurostats source)
 * @url https://db.nomics.world/Eurostat/crim_off_cat?q=kidnapping
 */
export default class Kidnappings extends React.Component {
  componentDidMount() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/crim_off_cat?limit=1000&offset=0&q=kidnapping&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        // console.log(json.dataset.dimensions_values_labels.FREQ.A); // Frequency
        const data = json.series.docs
          .filter(country => country.dimensions.unit !== 'P_HTHAB')
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'kidnappings': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] }))
          }));
  
        console.log(data);
        // this.setState({ name: json[0].firstname })
      })
      .catch(err => {
        // TODO
        // this.setState({ name: `failed to get data from : ${Environment.testUrl}`  })
        console.error(`[Kidnappings] Cannot get  ${Environment.dbNomicsUrl}`);
      });
  }

  render() {
    return (
      <div className="Kidnappings">
        <p>Kidnappings</p>
      </div>
    )
  }
}
