import React from 'react';
import Environment from 'environment';
import Step from 'shared/Step';
import './Bribes.css';

import Death from './img/death.png';

export default class Bribes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: Step.LOADING,
      data: []
    }
  }

  componentDidMount() {
    this.retrieveData();
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING) 
      this.controller.abort();
  }

  retrieveData() {
    fetch(Environment.dbNomicsUrl + 'v22/series/WB/WDI?limit=1000&offset=0&q=bribe&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET', signal: this.controller.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs.map(country => ({
          'country': json.dataset.dimensions_values_labels.country[country.dimensions.country],
          'bribes': country.period
            .map((date, index) => ({ 'date': date, 'value': country.value[index] }))
            .filter(bribe => bribe.value !== 'NA')
        }));

        this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data });
      })
      .catch(err => {
        if (err.name !== 'AbortError')
          console.error(`[Bribes] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  render() {
    switch(this.state.step) {
    case Step.LOADING: return (
      <div className="Bribes">
        <p>Loading</p>
      </div>
    )

    case Step.LOADED: return (
      <div className="Bribes">
        <p>Mon texte</p>
        <button>Truc 1</button>
        <button>Truc 2</button>
        <button>Truc 3</button>
        <img className="death" src={Death} alt="death" />
      </div>
    )

    default: return (
      <div className="Bribes">
        <p>Error</p>
      </div>
    )}
  }

  controller = new AbortController();
}
