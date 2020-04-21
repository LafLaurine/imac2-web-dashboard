import React from 'react';
import './Crimes.css';

import NextButton from './NextButton';
import Environment from 'environment';
import Step from 'shared/Step';

// TODO move inside of the class
let indexCountry = 0;
let indexCountry2 = 1;
let indexCountry3 = 2;
let indexCountry4 = 3;
let selectedIndex = indexCountry;

export default class Crimes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequency: '',
      step: Step.LOADING,
      data: []
    }
    this.updateCountry = this.updateCountry.bind(this);
    this.updateCrimesSection = this.updateCrimesSection.bind(this);
  }

  ////////////////////// React Hooks /////////////////////////

  componentDidMount() {
    this.retrieveData();
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  ////////////////////////// Logic ///////////////////////////

  retrieveData() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/crim_gen?limit=1000&offset=0&q=homicide&observations=1&align_periods=1&dimensions={}',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'homicides': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] }))
          }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data })
      })
      .catch(err => {
        if (err.name !== 'AbortError')
          console.error(`[Crimes] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  randomizeIndexes() {
    indexCountry = (Math.floor(Math.random() * this.state.data.length));
    indexCountry2 = (Math.floor(Math.random() * this.state.data.length));
    indexCountry3 = (Math.floor(Math.random() * this.state.data.length));
    indexCountry4 = (Math.floor(Math.random() * this.state.data.length));
  }

  /////////////////////// Render ///////////////////////////

  updateCountry() {
    this.randomizeIndexes();
    while (indexCountry === indexCountry2 || indexCountry2 === indexCountry3 || indexCountry3 === indexCountry4) {
      this.randomizeIndexes();
    }
    selectedIndex = indexCountry;
    this.retrieveData();
  }

  updateCrimesSection(myIndex) {
    selectedIndex = myIndex;
    this.retrieveData();
  }

  render() {
    switch (this.state.step) {
      case Step.LOADING: return (
        <div className="Crimes">
          <p>Loading</p>
        </div>
      )

      case Step.LOADED: return (
        <div className="Crimes">
          <h2>2000's CRIMES</h2>
          <div id="container">
            <div id="selectCountry">
              <h3> Select a country !</h3>
              <NextButton onClick={e => this.updateCrimesSection(indexCountry)} name={this.state.data[indexCountry].country}></NextButton>
              <NextButton onClick={e => this.updateCrimesSection(indexCountry2)} name={this.state.data[indexCountry2].country}></NextButton>
              <NextButton onClick={e => this.updateCrimesSection(indexCountry3)} name={this.state.data[indexCountry3].country}></NextButton>
              <NextButton onClick={e => this.updateCrimesSection(indexCountry4)} name={this.state.data[indexCountry4].country}></NextButton>
              <NextButton onClick={e => this.updateCountry()} name="Change countries"></NextButton>
            </div>
            <div id="contentBlood">
              <div id="bloody">
                <h3>{this.state.data[selectedIndex].country}</h3>
                <p>{this.state.data[selectedIndex].homicides[7].value} homicides</p>
              </div>
            </div>
          </div>
        </div>
      )

      default: return (
        <div className="Crimes">
          <p>Error</p>
        </div>
      )
    }
  }

  ////////////////////// Member variables ///////////////////

  requestController = new AbortController();
}