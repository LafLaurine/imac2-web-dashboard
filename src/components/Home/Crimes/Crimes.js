import React from 'react';
import './Crimes.css';

import NextButton from './NextButton';
import Environment from 'environment';

var indexCountry = 0 ;

const step = {
  LOADING: 'loading',
  ERROR: 'error',
  LOADED: 'loaded'
};


export default class Crimes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequency: '',
      step: step.LOADING,
      data: []
    }
    this.updateCountry = this.updateCountry.bind(this)
  }

updateCountry() {
   if(indexCountry < this.state.data.length - 1 ){
   		indexCountry++;
   }else{
   		indexCountry = 0;
   }
   this.retrieveData();
}

retrieveData() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/crim_gen?limit=1000&offset=0&q=homicide&observations=1&align_periods=1&dimensions={}',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
        .map(country => ({
          'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
          'homicides': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] }))
        }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: step.LOADED, data: data })
      })
      .catch(err => {
        this.setState({ hasError: true, step: step.ERROR })
        console.error(`[Crimes] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
}

componentDidMount() {
	this.retrieveData();
}

render() {    
	console.log(this.state.data);
    return (
      <div className="Crimes">
        {(() => {
        switch(this.state.step) {
          case step.LOADING: return <p>Loading</p>
          case step.LOADED: return (
            <div>
            <p>BACK IN THE GOOD OLD 2000's</p>
            <p>{this.state.data[indexCountry].country}</p>
            <p>{this.state.data[indexCountry].homicides[7].value} homicides</p>
            <p></p>
            <NextButton onClick={e => this.updateCountry()} name="Another country"></NextButton>
            </div>
          )
          default: return <p>Error loading crimes</p>
        }
      })()}
      </div>
    )
  }
}