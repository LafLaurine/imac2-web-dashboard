import React from 'react';
import './Kidnappings.css';

import Environment from 'environment';

const Step = {
  LOADING: 'loading',
  ERROR: 'error',
  LOADED: 'loaded'
};

const GameStep = {
  LOWER: 'lower',
  GREATER: 'greater',
  WIN: 'win'
};

/**
 * @brief Show kidnappings data (Eurostats source)
 * @url https://db.nomics.world/Eurostat/crim_off_cat?q=kidnapping
 */
export default class Kidnappings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      frequency: '',
      step: Step.LOADING,
      data: [],
      game: {
        userValue: 0,
        displayCheck: false,
        GameStep: GameStep.LOWER
      }
    };

    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.checkUserValueAgainstData = this.checkUserValueAgainstData.bind(this);
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
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data });
      })
      .catch(err => {
        this.setState({ hasError: true, step: Step.ERROR });
        console.error(`[Kidnappings] Cannot get  ${Environment.dbNomicsUrl} : ${err}`);
      });
  }

  handleSliderChange(event) {
    this.setState({ game: { userValue: event.target.value }});
  }

  checkUserValueAgainstData() {
    if (this.state.game.userValue > this.state.data[0].kidnappings[0].value)
      this.setState({ game: { ...this.state.game, displayCheck: true, GameStep: GameStep.LOWER }});
    else if (Number(this.state.game.userValue) === Number(this.state.data[0].kidnappings[0].value))
      this.setState({ game: { ...this.state.game, displayCheck: true, GameStep: GameStep.WIN }});
    else 
      this.setState({ game: { ...this.state.game, displayCheck: true, GameStep: GameStep.GREATER }});

    setTimeout(() => {
      this.setState({ game: { ...this.state.game, displayCheck: false }});
    }, 3000);
  }

  render() {
    return (
      <div className="Kidnappings">
      {(() => {
        switch(this.state.step) {
          case Step.LOADING: return <p>Loading</p>
          case Step.LOADED: return (
            <div>
              <p>How many kidnappings in { this.state.data[0].country } during { this.state.data[0].kidnappings[0].date } ? </p>
              <input type="range" 
                value={this.state.game.userValue}
                min={this.state.data[0].kidnappings[0].value - 10}
                max={this.state.data[0].kidnappings[0].value + 10}
                onChange={this.handleSliderChange}>
              </input>
              <p>{ this.state.game.userValue }</p>
              <button onClick={this.checkUserValueAgainstData}>Check</button>
              { this.state.game.displayCheck &&
              (() => {
                switch(this.state.game.GameStep) {
                  case GameStep.GREATER: return <p>Greater</p>
                  case GameStep.WIN: return <p>You got it !</p>
                  default: return <p>Lower</p>
                }
              })()}
            </div>
          )
          default: return <p>Error loading kidnappings</p>
        }
      })()}
      </div>
    )
  }
}
