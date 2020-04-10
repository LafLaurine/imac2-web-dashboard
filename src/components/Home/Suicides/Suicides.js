import React from 'react';
import './Suicides.css';
import hangingMan from './img/hangingMan.svg';

import Environment from 'environment';

const step = {
  LOADING: 'loading',
  ERROR: 'error',
  LOADED: 'loaded'
}

/**
 * @brief Show suicides data (Eurostats source)
 * @url https://db.nomics.world/Eurostat/yth_hlth_030?q=suicide
 */

export default class Suicides extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequency: '',
      step: step.LOADING,
      sex: 'F',
      data: []
    }
    this.changeSex = this.changeSex.bind(this)
  }

  /**
   * @brief Get data for the component when created
   */

  componentDidMount() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/yth_hlth_030?limit=1000&offset=0&q=&observations=1&align_periods=1&dimensions={}',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .filter(sex => sex.dimensions.sex === this.state.sex)
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'suicide': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] })),
          }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: step.LOADED, data: data })
        console.log(this.state.sex)
      })
      .catch(err => {
        this.setState({ hasError: true, step: step.ERROR })
        console.error(`[Suicides] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  componentDidUpdate(prevState) {
    if (this.state.sex !== prevState.sex) {
    }
  }

  changeSex() {
    if (this.state.sex === 'F') {
      this.setState({ sexo: { ...this.state.sex }, sex: 'M' })
    }
    else {
      this.setState({ sexo: { ...this.state.sex }, sex: 'F' })
    }
  }

  render() {
    return (
      <div className="Suicides">
        {(() => {
          switch (this.state.step) {
            case step.LOADING: return <p>Loading</p>
            case step.LOADED: return (
              <div>
                <p>How many suicides in {this.state.data[0].country} during {this.state.data[0].suicide[4].date} ?</p>
                <p>Value : {this.state.data[0].suicide[4].value} </p>
                <p>Sex : {this.state.sex} </p>
                <button onClick={this.changeSex}>Change sex</button>
                <p>
                  <object id="hangingMan" data={hangingMan} type="image/svg+xml"></object>
                </p>
              </div>
            )
            default: return <p>Error loading suicide</p>
          }
        })()}
      </div>
    )
  }
}
