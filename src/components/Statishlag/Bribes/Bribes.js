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

  retrieveData() {
    fetch(Environment.dbNomicsUrl + 'v22/series/WB/WDI?limit=1000&offset=0&q=bribe&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        /*
        const data = json.series.docs
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'bribes': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] }))
          }));

        this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data });
        */
      })
      .catch(err => {
        this.setState({ step: Step.ERROR })
        console.error(`[Bribes] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  render() {
    return (
      <div className="Bribes">
        <p>Mon texte</p>
        <button>Truc 1</button>
        <button>Truc 2</button>
        <button>Truc 3</button>
        <img className="death" src={Death} alt="death" />
      </div>
    )
  }
}
