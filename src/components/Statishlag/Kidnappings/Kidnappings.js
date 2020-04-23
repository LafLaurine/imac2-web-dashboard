import React from 'react';
import { Engine, Render, Runner, Composites, Bodies, World, Mouse, MouseConstraint, Bounds } from "matter-js";
import Step from 'shared/Step';
import './Kidnappings.css';

import Environment from 'environment';
import Background from './img/bg.jpg';
import Tony from './img/tony-kornheiser.png';

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
      step: Step.LOADING,
      data: [],
      userValue: 0,
      baseCount: 1,
      countryIndex: 0,
      dateIndex: 0,
      showFeedBack: false,
      gameStep: GameStep.LOWER
    };

    this.updateGameStateTo = this.updateGameStateTo.bind(this);
    this.renderFeedBack = this.renderFeedBack.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.canvasRef = React.createRef();
  }

  ///////////////////// React Hooks /////////////////////////

  /**
   * @brief Get data for the component when created
   */
  componentDidMount() {
    fetch(Environment.dbNomicsUrl + 'v22/series/Eurostat/crim_off_cat?limit=1000&offset=0&q=kidnapping&observations=1&align_periods=1&dimensions=%7B%7D',
      { method: 'GET', signal: this.requestController.signal })
      .then(res => { return res.json() })
      .then(json => {
        const data = json.series.docs
          .filter(country => country.dimensions.unit !== 'P_HTHAB')
          .map(country => ({
            'country': json.dataset.dimensions_values_labels.geo[country.dimensions.geo],
            'kidnappings': country.period.map((date, index) => ({ 'date': date, 'value': country.value[index] }))
          }));
        this.setState({ step: Step.LOADED, data: data });
        this.createMatterWorld();
      })
      .catch(err => {
        if (err.name !== 'AbortError')
          console.error(`[Kidnappings] Cannot get  ${Environment.dbNomicsUrl} : ${err}`);
      });
  }

  componentWillUnmount() {
    if (this.state.step === Step.LOADING)
      this.requestController.abort();
  }

  ///////////////////// Logic /////////////////////////

  /**
   * @brief Change game state to match user input
   * @param number
   */
  updateGameStateTo(number) {
    if (number > this.state.data[this.state.countryIndex].kidnappings[this.state.dateIndex].value)
      this.setState({ showFeedBack: true, userValue: number, gameStep: GameStep.LOWER });
    else if (number === Number(this.state.data[this.state.countryIndex].kidnappings[this.state.dateIndex].value))
      this.setState({ showFeedBack: true, userValue: number, gameStep: GameStep.WIN });
    else
      this.setState({ showFeedBack: true, userValue: number, gameStep: GameStep.GREATER });

    // FIXME must be relaunched and not queueud
    setTimeout(() => {
      this.setState({ showFeedBack: false });
    }, 3000);
  }

  changeCountry() {
    // TODO improve to prevent invalid index and handle looping + head value
    this.setState({ countryIndex: this.state.countryIndex + 1 });
  }

  changeDate() {
    // TODO improve to prevent invalid index and handle looping + head value
    this.setState({ dateIndex: this.state.dateIndex + 1 });
  }

  ///////////////////////// Render /////////////////////////

  createMatterWorld() {
    // Setup
    const engine = Engine.create();
    const world = engine.world;
    const render = Render.create({
      element: this.canvasRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: `no-repeat bottom url(${Background})`
      }
    });
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // World
    const squares = Composites.stack(600, 255, 1, 6, 0, 0, (x, y) => {
      return Bodies.circle(x, y, 40, {
        render: {
          strokeStyle: '#ffffff',
          sprite: {
            texture: Tony
          }
        }
      });
    });
    World.add(world, [
      squares,
      // walls
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(400, 450, 50, 300, { isStatic: true })
    ]);

    // Mouse
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    World.add(world, mouseConstraint);
    render.mouse = mouse;

    // Victory conditions
    const leftCollider = Bounds.create([{ x: 0, y: 200 }, { x: 420, y: 600 }]);
    setInterval(() => {
      let count = 0
      squares.bodies.forEach(body => {
        if (Bounds.contains(leftCollider, body.position))
          count++;
      });
      if (count !== this.state.userValue)
        this.updateGameStateTo(count);
    }, 500);

    Engine.run(engine);
  }

  /**
   * @brief Show how the user is getting the game
   */
  renderFeedBack() {
    switch (this.state.gameStep) {
      case GameStep.GREATER: return <p className="feedback">It's More !</p>
      case GameStep.WIN: return <p className="feedback">You got it !</p>
      default: return <p className="feedback">It's less !</p>
    }
  }

  render() {
    switch (this.state.step) {
      case Step.LOADING: return (
        <div className="Kidnappings">
          <p>Loading</p>
        </div>
      )

      case Step.LOADED: return (
        <div className="Kidnappings">
          <div className="ui">
            <p className="country">Number of Kidnappings in
              <span className="settings" onClick={this.changeCountry}> {this.state.data[this.state.countryIndex].country}</span> during
              <span className="settings" onClick={this.changeDate}> {this.state.data[this.state.countryIndex].kidnappings[this.state.dateIndex].date}</span>
            </p>
            <p className="user-number">You set : <span className="value">{this.state.userValue}</span></p>
            {this.state.showFeedBack && this.renderFeedBack()}
          </div>
          <div ref={this.canvasRef} className="game" />
        </div>
      )

      default: return (
        <div className="Kidnappings">
          <p>Error loading kidnappings</p>
        </div>
      )
    }
  }

  ////////////////////// Member variables //////////////////

  requestController = new AbortController();
}
