import React from 'react';
import Environment from 'environment';
import Step from 'shared/Step';

import './Poverty.css';
import PovertyChart from './PovertyChart'
import Loading from 'shared/Loading/Loading';

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
      countryIndex: 0,
    }
    this.changeCountry = this.changeCountry.bind(this);
  }

  ////////////////////// React Hooks ////////////////////

  componentDidMount() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/ilc_peps02?limit=1000&offset=0&q=poverty&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET', signal: this.requestController.signal })
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
        if (err.name !== 'AbortError')
          console.error(`[Poverty] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  ////////////////////// Logic  ////////////////////

  /**
   * @brief Change country when user click on button and get the associated data
   */
  changeCountry() {
    const maxIndex = this.state.data.length - 1;
    if (this.state.countryIndex >= maxIndex)
      this.setState({ countryIndex: 0 });
    else
      this.setState({ countryIndex: this.state.countryIndex + 1 });
  }

  ////////////////////// Render ////////////////////

  renderGraph() {
    return <PovertyChart data={this.state.data[this.state.countryIndex]}></PovertyChart>
  }

  render() {
    switch (this.state.step) {
      case Step.LOADING: return (
        <div className="Poverty">
          <Loading></Loading>
        </div>
      )

      case Step.LOADED: return (
        <div className="Poverty">
          <div className="element">
            <h2>Poverty in <span className="settings" onClick={this.changeCountry}> {this.state.data[this.state.countryIndex].country} </span>?</h2>
          </div>
          {this.renderGraph()}
        </div>
      )

      default: return (
        <div className="Poverty">
          <p>Error loading suicide</p>
        </div>
      )
    }
  }

  ////////////////////// Member variables ////////////////////

  requestController = new AbortController();
}
