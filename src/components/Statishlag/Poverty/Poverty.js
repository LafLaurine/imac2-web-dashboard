import React from 'react';
import Environment from 'environment';
import Step from 'shared/Step';

import './Poverty.css';
import PovertyChart from './PovertyChart'
import PovertyButton from './PovertyButton';

let indexCountry = 0;

/**
 * @brief Show poverty data (Eurostats source)
 * @url https://db.nomics.world/Eurostat/ilc_peps02
 */

export default class Poverty extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      frequency: '',
      step: Step.LOADING,
      data: [],
    }
    this.updateCountry = this.updateCountry.bind(this)
  }

  retrieveData() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/ilc_peps02?limit=1000&offset=0&q=poverty&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'poverty': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] }))
          }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data })
      })
      .catch(err => {
        this.setState({ hasError: true, step: Step.ERROR })
        console.error(`[Poverty] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }


  /**
   * @brief Change country when user click on button and get the associated data
   */
  updateCountry() {
    indexCountry = (Math.floor(Math.random() * this.state.data.length))
    this.retrieveData();
  }


  /**
  * @brief Get data for the component when created
  */
  componentDidMount() {
    this.retrieveData()
  }

  renderGraph() {
    return <PovertyChart data={this.state.data[indexCountry]}></PovertyChart>
  }


  render() {
    return (
      <div className="Poverty">
        {(() => {
          switch (this.state.step) {
            case Step.LOADING: return <p>Loading</p>
            case Step.LOADED: return (
              <div className="container">
                <div className="element">
                  <p>Poverty in {this.state.data[indexCountry].country} ?</p>
                  <PovertyButton onClick={e => this.updateCountry()} name="Another country"></PovertyButton>
                </div>
                {this.renderGraph()}
              </div>
            )
            default: return <p>Error loading suicide</p>
          }
        })()}
      </div>
    )

  }
}
