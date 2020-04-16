import React from 'react';
import './Kidnappings.css';

import GameButton from './GameButton';
import GameBackground from './GameBackground';
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
      userValue: 0,
      showFeedBack: false,
      gameStep: GameStep.LOWER
    };

    this.updateGameStateBy = this.updateGameStateBy.bind(this);
    this.renderFeedBack = this.renderFeedBack.bind(this);
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

  /**
   * @brief Change game state to match user input
   * @param number
   */
  updateGameStateBy(number) {
    const newUserValue = this.state.userValue + number;
    if (newUserValue < 0)
      return;

    if (newUserValue > this.state.data[0].kidnappings[0].value)
      this.setState({ showFeedBack: true, userValue: newUserValue, gameStep: GameStep.LOWER });
    else if (newUserValue === Number(this.state.data[0].kidnappings[0].value))
      this.setState({ showFeedBack: true, userValue: newUserValue, gameStep: GameStep.WIN });
    else 
      this.setState({ showFeedBack: true, userValue: newUserValue, gameStep: GameStep.GREATER });

    // FIXME must be relaunched and not queueud
    setTimeout(() => {
      this.setState({ showFeedBack: false });
    }, 3000);
  }

  /**
   * @brief Show how the user is getting the game
   */
  renderFeedBack() {
    switch(this.state.gameStep) {
    case GameStep.GREATER: return <p>Greater</p>
    case GameStep.WIN: return <p>You got it !</p>
    default: return <p>Lower</p>
    }
  }

  render() {
    switch(this.state.step) {
    case Step.LOADING: return (
      <div className="Kidnappings">
        <p>Loading</p>
      </div>
    )

    case Step.LOADED: return (
      <div className="Kidnappings">
        <p>How many kidnappings in { this.state.data[0].country } during { this.state.data[0].kidnappings[0].date } ? </p>

        <GameButton onClick={e => this.updateGameStateBy(+10)} name="+10"></GameButton>
        <GameButton onClick={e => this.updateGameStateBy(+1)} name="+1"></GameButton>
        <GameButton onClick={e => this.updateGameStateBy(-1)} name="-1"></GameButton>
        <GameButton onClick={e => this.updateGameStateBy(-10)} name="-10"></GameButton>
        <p>{ this.state.userValue }</p>

        { this.state.showFeedBack && this.renderFeedBack() }
        <GameBackground value={ this.state.userValue }></GameBackground>
      </div>
    )

    default: return (
      <div className="Kidnappings">
        <p>Error loading kidnappings</p>
      </div>
    )}
  }
}
