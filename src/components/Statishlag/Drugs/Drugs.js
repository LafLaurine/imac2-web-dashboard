import React from 'react';
import './Drugs.css';

import Environment from 'environment';
import Step from 'shared/Step';
import Syringue from './img/syringue.png';
import Blood from './Blood';
import Loading from 'shared/Loading/Loading';

/**
 * @brief Show number of death because of drug data (Eurostats source)
 * @url https://db.nomics.world/Eurostat/hlth_cd_yro?q=drug
 */
export default class Drugs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequency: '',
      step: Step.LOADING,
      indexCountry: 0,
      countries: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'EL', 'FR', 'DE', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'ES', 'SE'],
      data: []
    };
    this.retrieveData = this.retrieveData.bind(this)
    this.updateCountry = this.updateCountry.bind(this)
  }

  ///////////////////// React Hooks /////////////////////////

  componentDidMount() {
    this.retrieveData()
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  ////////////////////// Logic ////////////////////

  /**
   * @brief Get data for the component
   */
  retrieveData() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/hlth_cd_yro?limit=1000&offset=0&q=drug&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .filter(geo => this.state.countries.includes(geo.dimensions.geo))
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'drugs': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] }))
          }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data })
      })
      .catch(err => {
        if (err.name !== 'AbortError')
          console.error(`[Drugs] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }


  ///////////////////////// Render /////////////////////////

  /**
  * @brief Change country when user click on button and get the associated data
  */
  updateCountry() {
    this.setState({ indexCountry: (Math.floor(Math.random() * this.state.data.length)) });
    this.retrieveData();
  }


  render() {
    switch (this.state.step) {
      case Step.LOADING: return (
        <div className="Drugs">
          <Loading></Loading>
        </div>
      )

      case Step.LOADED: return (
        <div className="Drugs">
          <p className="title">Death because of drugs in
          <span className="settings" onClick={this.updateCountry}> {this.state.data[this.state.indexCountry].country} </span> during
          <span>{this.state.data[this.state.indexCountry].drugs[1].date}</span> ?</p>

          <div className="element">
            <Blood blood={this.state.data[this.state.indexCountry].drugs[1].value}></Blood>
            <div className="Syringue">
              <img src={Syringue} alt="Syringue" />
            </div>
          </div>
        </div>
      )

      default: return (
        <p>Error loading drugs</p>
      )
    }
  }

  ////////////////////// Member variables /////////////////

  requestController = new AbortController();
}
