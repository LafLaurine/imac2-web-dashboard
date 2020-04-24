import React from 'react';
import './Crimes.css';


//import Blood from './img/blood.svg';
import BloodStain from './BloodStain';
import Button from '../Button/Button';
import Environment from 'environment';
import Step from 'shared/Step';
import Loading from 'shared/Loading/Loading';

export default class Crimes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequency: '',
      step: Step.LOADING,
      data: [],
      indexCountry: 0,
      indexCountry2: 1,
      indexCountry3: 2,
      indexCountry4: 3,
      selectedIndex: 0
    }
    this.updateCountry = this.updateCountry.bind(this);
    this.updateCrimesSection = this.updateCrimesSection.bind(this);
    this.updateCountry = this.updateCountry.bind(this)
    this.updateBloodStain = this.updateBloodStain.bind(this)
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
    this.setState({ indexCountry: (Math.floor(Math.random() * this.state.data.length)) });
    this.setState({ indexCountry2: (Math.floor(Math.random() * this.state.data.length)) });
    this.setState({ indexCountry3: (Math.floor(Math.random() * this.state.data.length)) });
    this.setState({ indexCountry4: (Math.floor(Math.random() * this.state.data.length)) });

  }

  /////////////////////// Render ///////////////////////////

  updateBloodStain() {
    console.log(this.state.data[this.state.selectedIndex].homicides[7].value);
    //FIX ME PLEASE

    //let element = document.getElementById('bloodStain');
    //element.style.transform = 'scale('+(this.state.data[this.state.selectedIndex].homicides[7].value)*0.05+')';

  }

  updateCountry() {
    this.randomizeIndexes();
    this.setState({ selectedIndex: this.state.indexCountry });
  }

  updateCrimesSection(myIndex) {
    this.setState({ selectedIndex: myIndex });
  }

  render() {
    switch (this.state.step) {
      case Step.LOADING: return (
        <div className="Crimes">
          <Loading></Loading>
        </div>
      )

      case Step.LOADED: return (
        <div className="Crimes">
          <h2>2000's CRIMES</h2>

          <div id="container">

            <BloodStain id="bloodStain"></BloodStain>

            <div id="selectCountry">
              <h3> Select a country !</h3>

              <Button onClick={e => this.updateCrimesSection(this.state.indexCountry)} name={this.state.data[this.state.indexCountry].country}></Button>
              <Button onClick={e => this.updateCrimesSection(this.state.indexCountry2)} name={this.state.data[this.state.indexCountry2].country}></Button>
              <Button onClick={e => this.updateCrimesSection(this.state.indexCountry3)} name={this.state.data[this.state.indexCountry3].country}></Button>
              <Button onClick={e => this.updateCrimesSection(this.state.indexCountry4)} name={this.state.data[this.state.indexCountry4].country}></Button>
              <Button onClick={e => this.updateCountry()} name="Change countries"></Button>
            </div>
            <div id="contentBlood">
              <h3>{this.state.data[this.state.selectedIndex].country}</h3>
              <p>{this.state.data[this.state.selectedIndex].homicides[7].value} homicides</p>
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