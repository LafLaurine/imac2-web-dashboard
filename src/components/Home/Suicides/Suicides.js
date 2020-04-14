import React from 'react';
import './Suicides.css';
import Environment from 'environment';
import SuicideAnimation from './SuicideAnimation'
import SuicidesButton from './SuicidesButton';

const step = {
  LOADING: 'loading',
  ERROR: 'error',
  LOADED: 'loaded'
}

let indexCountry = 0;
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
      age: 'Y15-19',
      data: []
    }
    this.changeSex = this.changeSex.bind(this)
    this.changeAge = this.changeAge.bind(this)
    this.updateCountry = this.updateCountry.bind(this)
  }

  /**
   * @brief Change sex when user click on button and get the associated data
   */
  changeSex() {
    if (this.state.sex === 'F') {
      this.setState({ sexo: { ...this.state.sex }, sex: 'M' })
      this.retrieveData()
    }
    else {
      this.setState({ sexo: { ...this.state.sex }, sex: 'F' })
      this.retrieveData()
    }
  }

  /**
 * @brief Change age when user click on button and get the associated data
 */
  changeAge() {
    if (this.state.age === 'Y15-19') {
      this.setState({ sort: { ...this.state.age }, age: 'Y20-24' })
      this.retrieveData()
    }
    else {
      this.setState({ sort: { ...this.state.age }, age: 'Y15-19' })
      this.retrieveData()
    }
  }

  /**
   * @brief Change country when user click on button and get the associated data
   */
  updateCountry() {
    if (indexCountry < this.state.data.length - 1) {
      indexCountry += Math.floor(Math.random() * 2) + 1
    } else {
      indexCountry = 0;
    }
    this.retrieveData();
  }


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
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'suicide': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] })),
          }))
        this.setState({ frequency: json.series.docs[0]['@frequency'], step: step.LOADED, data: data })
      })
      .catch(err => {
        this.setState({ hasError: true, step: step.ERROR })
        console.error(`[Suicides] Cannot get  ${Environment.dbNomicsUrl} : ${err}`)
      });
  }

  /**
 * @brief Get data for the component when created
 */
  componentDidMount() {
    this.retrieveData()
  }

  render() {
    return (
      <div className="Suicides">
        {(() => {
          switch (this.state.step) {
            case step.LOADING: return <p>Loading</p>
            case step.LOADED: return (
              <div>
                <p>How many suicides in {this.state.data[indexCountry].country} during {this.state.data[indexCountry].suicide[4].date} ?</p>
                <p>Value : {this.state.data[indexCountry].suicide[4].value} %</p>
                <p>Sex : {this.state.sex} </p>
                <p><button onClick={this.changeSex} id="chgSexButton">Change sex</button></p>
                <p>Age : {this.state.age} </p>
                <p><button onClick={this.changeAge} id="chgAgeButton">Change age</button></p>
                <SuicidesButton onClick={e => this.updateCountry()} name="Another country"></SuicidesButton>
                <SuicideAnimation></SuicideAnimation>
              </div>
            )
            default: return <p>Error loading suicide</p>
          }
        })()}
      </div >
    )
  }
}
