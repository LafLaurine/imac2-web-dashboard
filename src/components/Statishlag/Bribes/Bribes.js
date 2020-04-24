import React from 'react';
import Environment from 'environment';
import Step from 'shared/Step';
import './Bribes.css';
import Loading from 'shared/Loading/Loading';

import Death from './img/death.png';

const GameStep = {
  INTRO: 'intro',
  END: 'end'
};

export default class Bribes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: Step.LOADING,
      gameStep: GameStep.INTRO,
      data: []
    }
  }

  ////////////////////// React Hooks /////////////////////////

  componentDidMount() {
    this.retrieveData();
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  //////////////////////// Logic ////////////////////////////

  retrieveData() {
    fetch(Environment.dbNomicsUrl + 'v22/series/WB/WDI?limit=1000&offset=0&q=bribe&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs.map(country => ({
          'country': json.dataset.dimensions_values_labels.country[country.dimensions.country],
          'bribes': country.period
            .map((date, index) => ({ 'date': date, 'value': country.value[index] }))
            .filter(bribe => bribe.value !== 'NA')
        }));

        this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data });
        console.log(this.state)
      })
      .catch(err => {
        if (err.name !== 'AbortError')
          console.error(`[Bribes] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  ///////////////////////// Render /////////////////////////

  renderInteraction() {
    switch (this.state.gameStep) {
      case GameStep.INTRO: return (
        <div>
          <p>{this.introQuotes[0]}</p>
          <button>{this.bribeQuotes[0]}</button>
          <button>{this.bribeQuotes[1]}</button>
          <button>{this.bribeQuotes[2]}</button>
        </div>
      )

      case GameStep.END: return (
        <div>
          <p>{this.conclusionQuotes[0]}</p>
          <button>Ok I get it</button>
        </div>
      )

      default: return (
        <div><p>Invalid state</p></div>
      )
    }
  }

  render() {
    switch (this.state.step) {
      case Step.LOADING: return (
        <div className="Bribes">
          <Loading></Loading>
        </div>
      )

      case Step.LOADED: return (
        <div className="Bribes">
          {this.renderInteraction()}
          <img className="death" src={Death} alt="death" />
        </div>
      )

      default: return (
        <div className="Bribes">
          <p>Error</p>
        </div>
      )
    }
  }

  ////////////////////// Member variables /////////////////////

  requestController = new AbortController();

  introQuotes = [
    "I'm here for you, come with me"
  ];

  bribeQuotes = [
    "Maybe I can offer you a coffee ?",
    "Wow, great shoes ! Can I buy them ?",
    "I get it, that's why she left you ?"
  ];

  conclusionQuotes = [
    "There is already NUMBER of people in COUNTRY who encountered bribe, I will not fall for it"
  ];
}
