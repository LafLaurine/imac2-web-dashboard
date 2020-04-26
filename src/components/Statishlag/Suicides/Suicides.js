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
      indexValues: 0,
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
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/yth_hlth_030?limit=100&offset=0&q=&observations=1&align_periods=1&dimensions={}',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const countryMap = new Map();
        json.series.docs.forEach(country => {
          let countryValue = {};
          if (countryMap.has(country.dimensions.geo))
            countryValue = countryMap.get(country.dimensions.geo);
          else
            countryValue = { 'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo], 'values': [] };

          const value = {
            'age': json.dataset.dimensions_values_labels.age[country.dimensions.age],
            'sex': json.dataset.dimensions_values_labels.sex[country.dimensions.sex],
            'suicides': country.period
              .map((date, index) => ({ 'date': date, 'value': country.value[index] }))
              .filter(suicide => suicide.value !== 'NA' && suicide.value !== 0)
          };
          
          if (value.suicides.length > 0)
            countryValue.values.push(value);

          countryMap.set(country.dimensions.geo, countryValue);
        });

        const data = Array.from(countryMap, country => country[1]);
        console.log(data);
        this.setState({ step: Step.LOADED, data: data });
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(`[Suicides] Cannot get  ${Environment.dbNomicsUrl} : ${err}`);
          this.setState({ step: Step.ERROR });
        }
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
      this.setState({ indexYear: 0, indexValues: 0, indexCountry: 0 });
    else
      this.setState({ indexYear: 0, indexValues: 0, indexCountry: this.state.indexCountry + 1 });
  }

  /**
  * @brief Change country when user on name of the country and get the associated data
  */
  updateDate() {
    const maxIndex = this.state.data[this.state.indexCountry].values[this.state.indexValues].suicides.length - 1;
    if (this.state.indexYear + 1 >= maxIndex)
      this.setState({ indexYear: 0 });
    else
      this.setState({ indexYear: this.state.indexYear + 1 });
  }

  /**
   * @brief Change sex when user click on button and get the associated data
   */
  switchSex() {
    const currentSex = this.state.data[this.state.indexCountry].values[this.state.indexValues].sex;
    for (let i = 0; i < this.state.data[this.state.indexCountry].values.length; i++) {
      if (currentSex !== this.state.data[this.state.indexCountry].values[i].sex) {
        this.setState({ indexValues: i });
        return;
      }
    }
  }

  /**
   * @brief Change age when user click on button and get the associated data
   */
  switchAge() {
    const currentAge = this.state.data[this.state.indexCountry].values[this.state.indexValues].age;
    let i = this.state.indexValues;
    if (i >= this.state.data[this.state.indexCountry].values.length - 1)
      i = 0;

    while (i < this.state.data[this.state.indexCountry].values.length) {
      if (currentAge !== this.state.data[this.state.indexCountry].values[i].age) {
        this.setState({ indexValues: i });
        return;
      }
      i++;
    }
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
              <span className="settings" onClick={this.updateDate}> {this.state.data[this.state.indexCountry].values[this.state.indexValues].suicides[this.state.indexYear].date}</span> ?
            </p>
            <button onClick={this.switchSex}>Change Sex</button>
            <p>Sex : {this.state.data[this.state.indexCountry].values[this.state.indexValues].sex}</p>
            <button onClick={this.switchAge}>Change Age</button>
            <p>Age : {this.state.data[this.state.indexCountry].values[this.state.indexValues].age}</p>
          </div>
          <SuicideAnimation length={Math.ceil(this.state.data[this.state.indexCountry].values[this.state.indexValues].suicides[this.state.indexYear].value)}></SuicideAnimation>
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
