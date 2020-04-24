import React from 'react';
import Environment from 'environment';
import Step from 'shared/Step';

import './Poverty.css';
import PovertyChart from './PovertyChart'
import Button from '../Button/Button';
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
      indexCountry: 0
    }
    this.updateCountry = this.updateCountry.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
  }

  ////////////////////// React Hooks ////////////////////

  componentDidMount() {
    this.retrieveData()
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  ////////////////////// Logic  ////////////////////

  retrieveData() {
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

  /**
   * @brief Change country when user click on button and get the associated data
   */
  updateCountry() {
    this.setState({ indexCountry: (Math.floor(Math.random() * this.state.data.length)) });
    this.retrieveData();
  }

  ////////////////////// Render ////////////////////

  renderGraph() {
    return <PovertyChart data={this.state.data[this.state.indexCountry]}></PovertyChart>
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
          <div className="container">
            <div className="element">
              <p>Poverty in {this.state.data[this.state.indexCountry].country} ?</p>
              <Button onClick={e => this.updateCountry()} name="Another country"></Button>
            </div>
            {this.renderGraph()}
          </div>
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
