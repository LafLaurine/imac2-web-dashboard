import React from 'react';
import './Drugs.css';

import Environment from 'environment';
import Step from 'shared/Step';
import Syringue from './img/syringue.svg';
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
      step: Step.LOADING,
      indexCountry: 0,
      indexDate: 0,
      data: []
    };
    this.updateCountry = this.updateCountry.bind(this);
  }

  ///////////////////// React Hooks /////////////////////////

  componentDidMount() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/hlth_cd_yro?limit=100&offset=0&q=drug&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'drugs': country.period
              .map((date, index) => ({ 'date': date, 'value': country.value[index] }))
              .filter(drug => drug.value !== 'NA' && drug.value !== 0)
          }))
          .filter(country => country.drugs.length > 0);

        this.setState({ step: Step.LOADED, data: data });
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(`[Drugs] Cannot get  ${Environment.dbNomicsUrl} : ${err}`);
          this.setState({ step: Step.ERROR });
        }
      });
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  /////////////////////////// Logic ///////////////////////////

  /**
  * @brief Change country when user click on button and get the associated data
  */
  updateCountry() {
    const maxIndex = this.state.data.length - 1;
    if (this.state.indexCountry + 1 < maxIndex)
      this.setState({ indexCountry: (Math.floor(Math.random() * this.state.data.length)) });
    else
      this.setState({ indexCountry: 0 });
  }

  ///////////////////////// Render /////////////////////////

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
            <span> {this.state.data[this.state.indexCountry].drugs[this.state.indexDate].date}</span> ?
          </p>

          <div className="content">
            <h3>{this.state.data[this.state.indexCountry].drugs[this.state.indexDate].value}%</h3>
            <div className="syringe">
              <img className="syringe-img" src={Syringue} alt="Syringue" />
              <Blood blood={this.state.data[this.state.indexCountry].drugs[this.state.indexDate].value}></Blood>
            </div>
          </div>
        </div>
      )

      default: return (
        <div className="Drugs"><p>Error loading drugs</p></div>
      )
    }
  }

  ////////////////////// Member variables /////////////////

  requestController = new AbortController();
}
