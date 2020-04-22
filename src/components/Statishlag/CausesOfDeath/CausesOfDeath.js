import React from 'react';
import './CausesOfDeath.css';
import Button from '../Button/Button';

import Environment from 'environment';
import Step from 'shared/Step';

export default class CausesOfDeath extends React.Component {

//NEED TO FIX LE DECALAGE DES ANNEES
  constructor(props) {
    super(props);
    this.state = {
      step: Step.LOADING,
      data: [],
      year : 2014,
      countries : ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'EL', 'FR', 'DE', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'ES', 'SE'],
      frequency: '',
      tierList : {}
    }
    this.retrieveData = this.retrieveData.bind(this)
    this.setYear = this.setYear.bind(this)
    this.organizeTierList = this.organizeTierList.bind(this)
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData(){
    fetch(Environment.dbNomicsUrl + '/v22/series/Eurostat/hlth_cd_acdr2?limit=1000&offset=0&q=&observations=1&align_periods=1&dimensions={"icd10"%3A["ACC"]%2C"age"%3A["TOTAL"]%2C"sex"%3A["T"]}',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .filter(geo => this.state.countries.includes(geo.dimensions.geo))
          .filter(values => values.value[0] < 4)
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'deaths': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] })),
          }))

          this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data })
          //console.log(this.state.data)
          this.setYear(0)
      })
      .catch(err => {
        if (err.name !== 'AbortError')
          console.error(`[CausesOfDeath] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  setYear(addValue){
    if((this.state.year > 2011 && this.state.year && this.state.year <= 2016 && addValue === -1 ) || (addValue === 1 && this.state.year < 2016 && this.state.year >= 2011) || addValue === 0){
      let newYear = this.state.year + addValue;
      this.setState({ year : newYear});
      this.organizeTierList(this.state.year);
    }
  }

  organizeTierList(chosenDate){
    let arrayTierList = [];
    for(let i = 0; i < this.state.data.length; i++){
      if(this.state.data[i].deaths[chosenDate-2011].value !== "NA"){
        arrayTierList[i] = {'country' : this.state.data[i].country, 'value' :(this.state.data[i].deaths[chosenDate-2011].value)};
      }
    }
    arrayTierList = arrayTierList.sort(function(a, b) {
      return parseFloat(b.value) - parseFloat(a.value);  
    });
    arrayTierList.splice(10);
    this.setState({tierList : arrayTierList});
    //console.log(chosenDate);
    //console.log(this.state.year);
    //console.log(arrayTierList);
  }

  render() {
  //console.log("state year : " + this.state.year);
  //console.log(this.state.tierList);
  switch (this.state.step) {
    case Step.LOADING: return (
      <div className="CausesOfDeath">
        <p>Loading</p>
      </div>
    )

    case Step.LOADED: return (
      <div className="CausesOfDeath">
        <h3>TOP EU COUNTRIES : crude deaths</h3>
        <p>{this.state.year}</p>
        <Button onClick={e => this.setYear(-1)} name="<" ></Button>
        <Button onClick={e => this.setYear(1)} name=">" ></Button>
        {Object.keys(this.state.tierList).map((item, index) => {
            return <p className = "TierList-input" key={index}> {index+1}. {this.state.tierList[index].country}</p>
        })}
      </div>
    )

    default: return (
      <div className="CausesOfDeath">
        <p>Error loading Causes of Death</p>
      </div>
    )}
  }
  requestController = new AbortController();
}