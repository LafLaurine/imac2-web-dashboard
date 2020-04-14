import React from 'react';
import Environment from 'environment';
import './Poverty.css';

const step = {
  LOADING: 'loading',
  ERROR: 'error',
  LOADED: 'loaded'
}

/**
 * @brief Show poverty data (Eurostats source)
 * @url https://db.nomics.world/Eurostat/ilc_peps02
 */

export default class Poverty extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      frequency: '',
      step: step.LOADING,
      data: []
    }
  }

  retrieveData() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/ilc_peps02?limit=1000&offset=0&q=poverty&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
          }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: step.LOADED, data: data })

      })
      .catch(err => {
        this.setState({ hasError: true, step: step.ERROR })
        console.error(`[Poverty] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  /**
  * @brief Get data for the component when created
  */
  componentDidMount() {
    this.retrieveData()
  }


  render() {
    return (
      <div className="Poverty">
        {(() => {
          switch (this.state.step) {
            case step.LOADING: return <p>Loading</p>
            case step.LOADED: return (
              <p>Poverty in {this.state.data[0].country} ?</p>
            )
            default: return <p>Error loading suicide</p>
          }
        })()}
      </div>
    )

  }
}
