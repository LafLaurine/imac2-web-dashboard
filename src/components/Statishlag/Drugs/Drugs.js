import React from 'react';
import './Drugs.css';

import Environment from 'environment';
import Step from 'shared/Step';
import Syringue from './img/seringue3.png';

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
      data: []
    };
  }

  ///////////////////// React Hooks /////////////////////////

  componentDidMount() {
    fetch(Environment.dbNomicsUrl + '/v22/series/Eurostat/hlth_cd_yro?limit=1000&offset=0&q=drug&observations=1&align_periods=1&dimensions=%7B%7D={}',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'drugs': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] })),
            //'sex' : json.dataset.dimensions_values_labels.sex[country.dimensions.sex]
          }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data })
      })
      .catch(err => {
        if (err.name !== 'AbortError')
          console.error(`[Drugs] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  ///////////////////////// Render /////////////////////////

  render() {
    switch (this.state.step) {
    case Step.LOADING: return (
      <div className="Drugs">
        <p>Loading</p>
      </div>
    )

    case Step.LOADED: return (
      <div className="Drugs">
        <p>How many death because of drugs in {this.state.data[0].drugs[0].date} ?</p>
        <div>
          <p className="Pays">{this.state.data[0].country} : {this.state.data[0].drugs[0].value} </p>
          <p className="Pays">{this.state.data[12].country} : {this.state.data[12].drugs[0].value} </p>
          <p className="Pays">{this.state.data[23].country} : {this.state.data[23].drugs[0].value} </p>
          <p className="Pays">{this.state.data[20].country} : {this.state.data[20].drugs[0].value} </p>
        </div>
        <div>
          <img src={Syringue} alt="Seringue" />
        </div>
      </div>
    )

    default: return (
      <p>Error loading drugs</p>
    )}
  }

  ////////////////////// Member variables /////////////////

  requestController = new AbortController();
}
