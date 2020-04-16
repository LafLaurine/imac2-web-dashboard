import React from 'react';
import { Engine, Render, Runner, Composites, Bodies, World, Mouse, MouseConstraint, Bounds } from "matter-js";
import './GameBackground.css';

export default class GameButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nbInsideCollider: 0
    };
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.createMatterWorld();
  }

  createMatterWorld() {
    // Setup
    const engine = Engine.create();
    const world = engine.world;
    const render = Render.create({
      element: this.myRef.current,
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
      if (count !== this.state.nbInsideCollider)
        this.setState({ nbInsideCollider: count });
    }, 500);

    Engine.run(engine);
  }

  render() {
    return (
      <div>
        <p>{this.state.nbInsideCollider}</p>
        <div ref={this.myRef} />
      </div>
    )
  }
}
