import React from 'react';
import './Suicides.css';
import Environment from 'environment';
import Step from 'shared/Step';
import Loading from 'shared/Loading/Loading';
import SuicideAnimation from './SuicideAnimation';

/**
 * @brief Show suicides data (Eurostats source)
 * @url https://db.nomics.world/Eurostat/yth_hlth_030?q=suicide
 */
export default class Suicides extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: Step.LOADING,
      sex: 'F',
      age: 'Y15-19',
      data: [],
      indexCountry: 0,
      value: 1
    }
    this.switchSex = this.switchSex.bind(this);
    this.switchAge = this.switchAge.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
  }

  ////////////////////// React Hooks /////////////////////////

  /**
  * @brief Get data for the component when created
  */
  componentDidMount() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/yth_hlth_030?limit=1000&offset=0&q=&observations=1&align_periods=1&dimensions={}',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'age': json.dataset.dimensions_values_labels.age[country.dimensions.age],
            'suicide': country.period
              .map((date, index) => ({ 'date': date, 'value': country.value[index] }))
              .filter(suicide => suicide.value !== 'NA' && suicide.value !== 0)
          }));

        console.log(data);

        // this.setState({ step: Step.LOADED, data: data, value: data[this.state.indexCountry].suicide[4].value });
      })
      .catch(err => {
        if (err.name !== 'AbortError')
          console.error(`[Suicides] Cannot get  ${Environment.dbNomicsUrl} : ${err}`);
      });
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  ////////////////////// Render ////////////////////

  /**
  * @brief Change country when user on name of the country and get the associated data
  */
  updateCountry() {
    this.setState({ indexCountry: (Math.floor(Math.random() * this.state.data.length)) });
  }

  /**
   * @brief Change sex when user click on button and get the associated data
   */
  switchSex() {
    if (this.state.sex === 'F')
      this.setState({ sex: 'M' });
    else
      this.setState({ sex: 'F' });
  }

  /**
   * @brief Change age when user click on button and get the associated data
   */
  switchAge() {
    if (this.state.age === 'Y15-19')
      this.setState({ sort: { ...this.state.age }, age: 'Y20-24' });
    else
      this.setState({ sort: { ...this.state.age }, age: 'Y15-19' });
  }

  render() {
    switch (this.state.step) {
      case Step.LOADING: return (
        <div className="Suicides">
          <Loading></Loading>
        </div>
      )

      case Step.LOADED: return (
        <div className="Suicides">
          <div className="display">
            <p className="title">How many suicides in <span className="settings" onClick={this.updateCountry}>{this.state.data[this.state.indexCountry].country}</span> during {this.state.data[this.state.indexCountry].suicide[4].date} ?</p>
            <p>Sex : {this.state.sex}</p>
            <button onClick={this.switchSex}>Change sex</button>
            <p>Age : {this.state.data[this.state.indexCountry].age}</p>
            <button onClick={this.switchAge}>Change age</button>
          </div>
          <SuicideAnimation length={Math.ceil(this.state.value)}></SuicideAnimation>
        </div>
      )

      default: return (
        <div className="Suicides">
          <p>Error loading suicide</p>
        </div>
      )
    }
  }

  ////////////////////// Member variables //////////////////////

  requestController = new AbortController();
}
