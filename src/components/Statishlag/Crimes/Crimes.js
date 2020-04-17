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
	indexCountry = (Math.floor(Math.random()*this.state.data.length));
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
    return (
      <div className="Crimes">
        {(() => {
        switch(this.state.step) {
          case step.LOADING: return <p>Loading</p>
          case step.LOADED: return (
            <div>
	            <h2>2000's CRIMES</h2>
	            <div id = "contentBlood">
	            	<h3>{this.state.data[indexCountry].country}</h3>
	            	<p>{this.state.data[indexCountry].homicides[7].value} homicides</p>
	            </div>
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