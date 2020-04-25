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

  //TODO : FILTER ARRAY WHEN BRIDE EMPTY
  retrieveData() {
    fetch(Environment.dbNomicsUrl + 'v22/series/WB/WDI?limit=1000&offset=0&q=bribe&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs.map(country => ({
          'country': json.dataset.dimensions_values_labels.country[country.dimensions.country],
          'bribes': country.period
            .map((date, index) => ({ 'date': date, 'value': country.value[index] }))
            .filter(bribe => bribe.length !== 0)
            .filter(bribe => bribe.value !== 'NA')
        }));

        this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data });
      })
      .catch(err => {
        if (err.name !== 'AbortError')
          console.error(`[Bribes] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  handleClick() {
    if (this.state.gameStep === GameStep.INTRO) {
      this.setState({ gameStep: GameStep.END });
    }
    else if (this.state.gameStep === GameStep.END) {
      this.setState({ gameStep: GameStep.INTRO });
    }
  }

  ///////////////////////// Render /////////////////////////

  renderInteraction() {
    const randomNumberQuotes = Math.floor(Math.random() * (this.bribeQuotes.length - 2)) + 2;
    const randomNumberIntro = Math.floor(Math.random() * this.introQuotes.length);
    const randomNumberConclusion = Math.floor(Math.random() * this.conclusionQuotes.length);
    const randomCountryIndex = Math.floor(Math.random() * this.state.data.length)

    switch (this.state.gameStep) {
      case GameStep.INTRO: return (
        <div className="container">
          <div className="frame-inset">
            <p>{this.introQuotes[randomNumberIntro]}</p>
            <button onClick={() => this.handleClick()}>{this.bribeQuotes[randomNumberQuotes]}</button>
            <button onClick={() => this.handleClick()} >{this.bribeQuotes[randomNumberQuotes - 1]}</button>
            <button onClick={() => this.handleClick()}>{this.bribeQuotes[randomNumberQuotes - 2]}</button>
          </div>
        </div>
      )

      case GameStep.END: return (
        <div className="container">
          <div className="frame-inset">
            <p>{this.conclusionQuotes[randomNumberConclusion].replace(/NUMBER/i, Math.floor(this.state.data[randomCountryIndex].bribes[0].value))
              .replace(/COUNTRY/i, this.state.data[randomCountryIndex].country)}</p>
            <button onClick={() => this.handleClick()}>Ok I get it</button>
          </div>
        </div >
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
    "I'm here for you, come with me",
    "Time's up, this is your final day",
    "I'm here to knock of some lived body",
    "Say hello to my scythe",
    "Your time has come, you must follow me peasant"
  ];

  bribeQuotes = [
    "Maybe I can offer you a coffee ?",
    "Wow, great shoes ! Can I buy them ?",
    "I get it, that's why she left you ?",
    "I have a chrysanthemum ",
    "I heard Satan wants to promote you",
    "What name should I put on the check ?",
    "I have a VIP pass to paradise",
    "Do you accept payment in kind ?",
    "I'm not good to eat I taste very badly, you know...",
    "I haven't made a will for my big diamonds yet, so maybe we can work something out ?",
    "Do you know Netflix ? I can share my account with you as long as you let me be..."
  ];

  conclusionQuotes = [
    "There is already NUMBER percent of people in COUNTRY who encountered bribe, I will not fall for it",
    "NUMBER percent of people in COUNTRY try to scam me with bribe, I am not this weak",
    "You took me for one of the NUMBER percent corrupted politicians of COUNTRY ?",
    "You, despicable humans... That's not because in COUNTRY, NUMBER percent of people are corrupted that I will be too"
  ];
}
