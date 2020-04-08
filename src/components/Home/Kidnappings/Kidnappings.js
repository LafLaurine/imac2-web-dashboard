import React from 'react';
import './Kidnappings.css';

import Environment from 'environment';

const step = {
  LOADING: 'loading',
  ERROR: 'error',
  LOADED: 'loaded'
}

/**
 * @brief Show kidnappings data (Eurostats source)
 * @url https://db.nomics.world/Eurostat/crim_off_cat?q=kidnapping
 */
export default class Kidnappings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      frequency: '',
      step: step.LOADING,
      data: [],
      game: {
        userValue: 0,
        displayCheck: false
      }
    };

    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.checkUserValueAgainstGood = this.checkUserValueAgainstGood.bind(this);
  }

  /**
   * @brief Get data for the component when created
   */
  componentDidMount() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/crim_off_cat?limit=1000&offset=0&q=kidnapping&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .filter(country => country.dimensions.unit !== 'P_HTHAB')
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'kidnappings': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] }))
          }));
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: step.LOADED, data: data });
      })
      .catch(err => {
        this.setState({ hasError: true, step: step.ERROR });
        console.error(`[Kidnappings] Cannot get  ${Environment.dbNomicsUrl} : ${err}`);
      });
  }

  handleSliderChange(event) {
    this.setState({ game: { userValue: event.target.value }});
  }

  checkUserValueAgainstGood() {
    if (this.state.game.userValue > this.state.data[0].kidnappings[0].value)
      console.log("It's less");
    else if (this.state.game.userValue == this.state.data[0].kidnappings[0].value)
      console.log("Got it !");
    else 
      console.log("It's more");
  }

  render() {
    return (
      <div className="Kidnappings">
      {(() => {
        switch(this.state.step) {
          case step.LOADING: return <p>Loading</p>
          case step.LOADED: return (
            <div>
              <p>How many kidnappings in { this.state.data[0].country } during { this.state.data[0].kidnappings[0].date } ? </p>
              <input type="range" 
                value={this.state.game.userValue}
                min={this.state.data[0].kidnappings[0].value - 10}
                max={this.state.data[0].kidnappings[0].value + 10}
                onChange={this.handleSliderChange}>
              </input>
              <p>{ this.state.game.userValue }</p>
              <button onClick={this.checkUserValueAgainstGood}>Check</button>
            </div>
          )
          default: return <p>Error loading kidnappings</p>
        }
      })()}
      </div>
    )
  }
}
