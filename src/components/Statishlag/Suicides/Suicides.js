import React from 'react';
import './Suicides.css';
import Environment from 'environment';
import Step from 'shared/Step';

import SuicideAnimation from './SuicideAnimation'
import Button from '../Button/Button';
import Loading from '../../Loading/Loading'


/**
 * @brief Show suicides data (Eurostats source)
 * @url https://db.nomics.world/Eurostat/yth_hlth_030?q=suicide
 */
export default class Suicides extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frequency: '',
      step: Step.LOADING,
      sex: 'F',
      age: 'Y15-19',
      data: [],
      indexCountry: 0,
      value: 1
    }
    this.changeSex = this.changeSex.bind(this)
    this.changeAge = this.changeAge.bind(this)
    this.retrieveData = this.retrieveData.bind(this)
    this.updateCountry = this.updateCountry.bind(this)

  }

  ////////////////////// React Hooks /////////////////////////

  /**
  * @brief Get data for the component when created
  */
  componentDidMount() {
    this.retrieveData()
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  ////////////////////// Logic ////////////////////

  /**
   * @brief Get data for the component
   */
  retrieveData() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/yth_hlth_030?limit=1000&offset=0&q=&observations=1&align_periods=1&dimensions={}',
      { method: 'GET' })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .filter(age => age.dimensions.age === this.state.age)
          .filter(sex => sex.dimensions.sex === this.state.sex)
          .filter(value => value.dimensions.value !== "NA")
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'suicide': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] }))
          }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: Step.LOADED, data: data, value: data[this.state.indexCountry].suicide[4].value })

      })
      .catch(err => {
        if (err.name !== 'AbortError')
          console.error(`[Suicides] Cannot get  ${Environment.dbNomicsUrl} : ${err}`);
      });
  }

  ////////////////////// Render ////////////////////

  /**
  * @brief Change country when user click on button and get the associated data
  */
  updateCountry() {
    this.setState({ indexCountry: (Math.floor(Math.random() * this.state.data.length)) });
    this.retrieveData();
  }

  /**
   * @brief Change sex when user click on button and get the associated data
   */
  changeSex() {
    if (this.state.sex === 'F') {
      this.setState({ sort: { ...this.state.sex }, sex: 'M' });
      this.retrieveData();
    } else {
      this.setState({ sort: { ...this.state.sex }, sex: 'F' });
      this.retrieveData();
    }
  }

  /**
   * @brief Change age when user click on button and get the associated data
   */
  changeAge() {
    if (this.state.age === 'Y15-19') {
      this.setState({ sort: { ...this.state.age }, age: 'Y20-24' });
      this.retrieveData();
    }
    else {
      this.setState({ sort: { ...this.state.age }, age: 'Y15-19' });
      this.retrieveData();
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
            <p className="title">How many suicides in {this.state.data[this.state.indexCountry].country} during {this.state.data[this.state.indexCountry].suicide[4].date} ?</p>
            <p>Value : {this.state.data[this.state.indexCountry].suicide[4].value} %</p>
            <p>Sex : {this.state.sex}</p>
            <button onClick={this.changeSex} id="chgSexButton">Change sex</button>
            <p>Age : {this.state.age}</p>
            <button onClick={this.changeAge} id="chgAgeButton">Change age</button>
            <Button onClick={e => this.updateCountry()} name="Another country"></Button>
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
