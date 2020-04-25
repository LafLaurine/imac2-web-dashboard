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
      data: [],
      indexCountry: 0,
      indexYear: 0
    }
    this.switchSex = this.switchSex.bind(this);
    this.switchAge = this.switchAge.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.updateDate = this.updateDate.bind(this);
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
            'sex': json.dataset.dimensions_values_labels.sex[country.dimensions.sex],
            'suicides': country.period
              .map((date, index) => ({ 'date': date, 'value': country.value[index] }))
              .filter(suicide => suicide.value !== 'NA' && suicide.value !== 0)
          }))
          .filter(country => country.suicides.length > 0);

        // TODO merge country data
        console.log(data);

        this.setState({ step: Step.LOADED, data: data, sex: data[this.state.indexCountry].sex, age: data[this.state.indexCountry].age });
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
    const maxIndex = this.state.data.length - 1;
    if (this.state.indexCountry + 1 >= maxIndex)
      this.setState({ indexYear: 0, indexCountry: 0 });
    else
      this.setState({ indexYear: 0, indexCountry: this.state.indexCountry + 1 });
  }

  /**
  * @brief Change country when user on name of the country and get the associated data
  */
  updateDate() {
    const maxIndex = this.state.data[this.state.indexCountry].suicides.length - 1;
    if (this.state.indexYear + 1 >= maxIndex)
      this.setState({ indexYear: 0 });
    else
      this.setState({ indexYear: this.state.indexYear + 1 });
  }

  /**
   * @brief Change sex when user click on button and get the associated data
   */
  switchSex() {

  }

  /**
   * @brief Change age when user click on button and get the associated data
   */
  switchAge() {

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
            <p className="title">How many suicides in 
              <span className="settings" onClick={this.updateCountry}> {this.state.data[this.state.indexCountry].country}</span> during
              <span className="settings" onClick={this.updateDate}> {this.state.data[this.state.indexCountry].suicides[this.state.indexYear].date}</span> ?
            </p>
            <p>Sex : {this.state.data[this.state.indexCountry].sex}</p>
            <button onClick={this.switchSex}>Change sex</button>
            <p>Age : {this.state.data[this.state.indexCountry].age}</p>
            <button onClick={this.switchAge}>Change age</button>
          </div>
          <SuicideAnimation length={Math.ceil(this.state.data[this.state.indexCountry].suicides[this.state.indexYear].value)}></SuicideAnimation>
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
