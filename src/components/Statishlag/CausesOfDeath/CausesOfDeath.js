import React from 'react';
import './CausesOfDeath.css';
import Button from '../Button/Button';

import Environment from 'environment';
import Step from 'shared/Step';

let arrayTierList = {
  0: { country : "Lithuania"},
  1: { country : "Romania"},
  2: { country : "Latvia"},
  3: { country : "Portugal"},
  4: { country : "Croatia"},
  5: { country : "Bulgaria"},
  6: { country : "Estonia"},
  7: { country : "France"},
  8: { country : "Finland"},
  9: { country : "Poland"}
};

let countryTierList;

export default class CausesOfDeath extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: Step.LOADING,
      data: [],
      year : 2014,
      countries : ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'EL', 'FR', 'DE', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'ES', 'SE'],
      frequency: '',
    }
    this.setYear = this.setYear.bind(this)
    this.organizeTierList = this.organizeTierList.bind(this)
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  componentDidMount() {
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
      })
      .catch(err => {
        if (err.name !== 'AbortError')
          console.error(`[CausesOfDeath] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  setYear(addValue){
    if((this.state.year > 2011 && addValue === -1 ) || (addValue === 1 && this.state.year < 2016)){
      let newYear = this.state.year + addValue;
      this.setState({ year : newYear});
      this.organizeTierList(this.state.year);
    }
  }

  organizeTierList(chosenDate){
    arrayTierList = [];
    for(let i = 0; i < this.state.data.length; i++){
      if(this.state.data[i].deaths[chosenDate-2011].value !== "NA"){
        countryTierList = this.state.data[i].country;
        arrayTierList[i] = {'country' : countryTierList, 'value' :(this.state.data[i].deaths[chosenDate-2011].value)};
      }
    }
    arrayTierList = arrayTierList.sort(function(a, b) {
      return parseFloat(b.value) - parseFloat(a.value);  
    });

    arrayTierList.splice(10);
    //console.log(arrayTierList);
    //console.log(remains);
  }

  render() {
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
        <Button onClick={e => this.setYear(-1)} name="<"></Button>
        <Button onClick={e => this.setYear(1)} name=">"></Button>
        
        {Object.keys(arrayTierList).map((item, index) => {
            return <p className = "arrayTierList-input" key={index}> {index+1}. {arrayTierList[index].country}</p>
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