import React from 'react';
import './Drugs.css';

import Environment from 'environment';
import Step from 'shared/Step';
import Syringue from './img/syringue.png';
import Blood from './img/blood.svg';
import BloodSmall from './img/bloodSmall.svg';
import Button from '../Button/Button';

function LargeBlood() {
  return <img id="blood" src={Blood} alt="Blood" />
}

function SmallBlood() {
  return <img id="bloodSmall" src={BloodSmall} alt="Blood small" />
}

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
    fetch(Environment.dbNomicsUrl + '/v22/series/Eurostat/hlth_cd_yro?limit=1000&offset=0&q=drug&observations=1&align_periods=1&dimensions=%7B%7D={}',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'drugs': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] })),
          }))
          .filter(drugs => drugs.value !== "NA")
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

  orderDrug() {
    if (this.state.data[this.state.indexCountry].drugs[1].value > 5) {
      return <LargeBlood></LargeBlood>
    }
    else if (this.state.data[this.state.indexCountry].drugs[1].value < 5 && this.state.data[this.state.indexCountry].drugs[1].value !== 0) {
      return <SmallBlood></SmallBlood>
    }
  }

  render() {
    switch (this.state.step) {
      case Step.LOADING: return (
        <div className="Drugs">
          <p>Loading</p>
        </div>
      )

      case Step.LOADED: return (
        <div className="Drugs">
          <p>How many death because of drugs in {this.state.data[this.state.indexCountry].drugs[1].date} ?</p>
          <div>
            <p className="Country">{this.state.data[this.state.indexCountry].country} : {this.state.data[this.state.indexCountry].drugs[1].value} </p>
          </div>
          <Button onClick={e => this.updateCountry()} name="Another country"></Button>

          <div className="Blood">
            {this.orderDrug()}
          </div>
          <div className="Syringue">
            <img src={Syringue} alt="Syringue" />
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
