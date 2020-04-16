import React from 'react';
import { Engine, Render, Runner, Composites, Bodies, World, Mouse, MouseConstraint, Bounds } from "matter-js";
import './Kidnappings.css';

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
      step: Step.LOADING,
      data: [],
      userValue: 0,
      showFeedBack: false,
      gameStep: GameStep.LOWER
    };

    this.updateGameStateTo = this.updateGameStateTo.bind(this);
    this.renderFeedBack = this.renderFeedBack.bind(this);
    this.canvasRef = React.createRef();
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
        this.createMatterWorld();
      })
      .catch(err => {
        this.setState({ hasError: true, step: Step.ERROR });
        console.error(`[Kidnappings] Cannot get  ${Environment.dbNomicsUrl} : ${err}`);
      });
  }

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
        showDebug: true,
        showAngleIndicator: true,
        showCollisions: true,
        showVelocity: true,
        showBounds: true,
        showIds: true,
        showPositions: true
      }
    });
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // World
    const squares = Composites.stack(600, 255, 1, 6, 0, 0, (x, y) => {
      return Bodies.rectangle(x, y, 40, 40);
    });
    World.add(world, [
      squares,
      Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }), // Ground
      Bodies.rectangle(400, 420, 20, 300, { isStatic: true }),  // Wall center
      Bodies.rectangle(10, 300, 20, 600, { isStatic: true }) // Wall left
    ]);

    // Mouse
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
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
   * @brief Change game state to match user input
   * @param number
   */
  updateGameStateTo(number) {
    if (number > this.state.data[0].kidnappings[0].value)
      this.setState({ showFeedBack: true, userValue: number, gameStep: GameStep.LOWER });
    else if (number === Number(this.state.data[0].kidnappings[0].value))
      this.setState({ showFeedBack: true, userValue: number, gameStep: GameStep.WIN });
    else 
      this.setState({ showFeedBack: true, userValue: number, gameStep: GameStep.GREATER });

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
    case GameStep.GREATER: return <p>It's More !</p>
    case GameStep.WIN: return <p>You got it !</p>
    default: return <p>It's less !</p>
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
        <div className="ui">
          <p>Number of Kidnappings in {this.state.data[0].country}</p>
          <p>You set : { this.state.userValue }</p>
          { this.state.showFeedBack && this.renderFeedBack() }
        </div>
        <div ref={this.canvasRef} className="game"/>
      </div>
    )

    default: return (
      <div className="Kidnappings">
        <p>Error loading kidnappings</p>
      </div>
    )}
  }
}
