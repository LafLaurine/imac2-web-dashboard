import React from 'react';
import './Crimes.css';
import './Anim.css';

import Button from '../../../shared/Button/Button';
import Environment from 'environment';
import Step from 'shared/Step';
import Loading from 'shared/Loading/Loading';

export default class Crimes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: Step.LOADING,
      data: [],
      indexCountry: 0,
      selectedIndex: 0
    }
    this.updateCountry = this.updateCountry.bind(this);
    this.updateCrimesSection = this.updateCrimesSection.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.updateRadius = this.updateRadius.bind(this);
  }

  ////////////////////// React Hooks /////////////////////////

  componentDidMount() {
    this.retrieveData();
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  ////////////////////////// Logic ///////////////////////////

  retrieveData() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/crim_gen?limit=100&offset=0&q=homicide&observations=1&align_periods=1&dimensions={}',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .filter(geo => geo.dimensions.geo !== 'FX' && geo.dimensions.geo !== 'ME' && geo.dimensions.geo !== 'MK')
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'homicides': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] }))
          }))
        this.setState({ step: Step.LOADED, data: data })
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(`[Crimes] Cannot get  ${Environment.dbNomicsUrl} : ${err}`);
          this.setState({ step: Step.ERROR });
        }
      });
  }

  updateRadius() {
    if (this.state.data[this.state.selectedIndex]) {
      let value = this.state.data[this.state.selectedIndex].homicides[7].value;
      if (value > 2500)
        return "svgAnim0";
      else if (value > 1000)
        return "svgAnim1";
      else if (value > 600)
        return "svgAnim2"
      else if (value > 400)
        return "svgAnim3"
      else if (value > 200)
        return "svgAnim4"
      else if (value > 150)
        return "svgAnim5"
      else if (value > 100)
        return "svgAnim6"
      else if (value > 50)
        return "svgAnim7"
      else if (value > 20)
        return "svgAnim8"
      else if (value >= 0)
        return "svgAnim9"
    }
    return "svgAnim9";
  }

  /////////////////////// Render ///////////////////////////

  updateCountry() {
    if (this.state.indexCountry + 6 < this.state.data.length - 1) {
      this.setState({ indexCountry: this.state.indexCountry + 4 });
    }
    else
      this.setState({ indexCountry: 0 });
  }

  updateCrimesSection(myIndex) {
    this.setState({ selectedIndex: myIndex });
  }

  render() {
    switch (this.state.step) {
      case Step.LOADING: return (
        <div className="Crimes">
          <Loading></Loading>
        </div>
      )

      case Step.LOADED: return (
        <div className="Crimes">
          <div id="blackfilter">
            <svg className={"svgContainer " + this.updateRadius()} height="350" width="350" xmlns="http://www.w3.org/2000/svg" fill="red" >
              <path d="M412.36,223.23C415,230,415,238,414,
                245c-3,19-18,34-18.17,53.27a19.84,19.84,0,0,0,2.65,10C432,321,426,358,407,381c-8,10-24,9-37,9-4.48.14-9,.24-13.46.4-13.46.46-26.9,
                1.41-40.07,5.43a92.46,92.46,0,0,0-13.08,5.1C265,422,219,433,176.39,418.71c-4.5-1.83-8.92-3.81-13.22-5.93a189.07,189.07,0,0,
                1-34.34-21.56,119.74,119.74,0,0,1-7.16-11.15,122.71,122.71,0,0,1-10.44-23.89c-1-5.12-1.82-10.35-2.5-15.57S107.5,330.17,107,
                325c-1-19-17-35-15.12-56.26,0-3.5.17-7,.49-10.5.39-4.2,1-8.39,1.81-12.58,3.41-14.33,9.86-28,15.46-41.95,1.87-4.65,3.64-9.34,
                5.17-14.09C116,131,183,124,228.64,119.61A45.14,45.14,0,0,1,239,119c17.5.83,35,1.67,51.34-3.87a81.07,81.07,0,0,0,9.7-4C313,
                105,325,114,329,125c5.63,18.75,15.33,29.06,27.37,35.05A80,80,0,0,0,369,164.89c26,4.11,50,22.11,41.94,50.66C411.27,218.12,411.75,
                220.69,412.36,223.23Z" transform="translate(-91.73 -109.14)" />
            </svg>

            <div id="container">
              <h2>CRIMES (2000)</h2>
              <div id="selectCountry">
                <Button onClick={e => this.updateCrimesSection(this.state.indexCountry)} name={this.state.data[this.state.indexCountry].country}></Button>
                <Button onClick={e => this.updateCrimesSection(this.state.indexCountry + 1)} name={this.state.data[this.state.indexCountry + 1].country}></Button>
                <Button onClick={e => this.updateCrimesSection(this.state.indexCountry + 2)} name={this.state.data[this.state.indexCountry + 2].country}></Button>
                <Button onClick={e => this.updateCrimesSection(this.state.indexCountry + 3)} name={this.state.data[this.state.indexCountry + 3].country}></Button>
                <Button onClick={e => this.updateCountry()} name="Change countries"></Button>
              </div>

              <div id="contentBlood">
                <h3>{this.state.data[this.state.selectedIndex].country}</h3>
                <p>{this.state.data[this.state.selectedIndex].homicides[7].value} homicides</p>
              </div>
            </div>
          </div>
        </div>
      )

      default: return (
        <div className="Crimes">
          <p>Error loading Crimes</p>
        </div>
      )
    }
  }

  ////////////////////// Member variables ///////////////////

  requestController = new AbortController();
}