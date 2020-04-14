import React from 'react';
import Matter, { Engine, Render, Runner, Composites, Constraint, Body, Vector, Bodies, World, Mouse, MouseConstraint, Events, Bounds } from "matter-js";
import './GameBackground.css';
import Head from './img/tony-kornheiser.png';

export default class GameButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.createMatterWorld();
  }

  createMatterWorld() {
    // create engine
    const engine = Engine.create(),
        world = engine.world;

    // create renderer
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

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);


    const squares = Composites.stack(250, 255, 1, 6, 0, 0, (x, y) => {
        return Bodies.rectangle(x, y, 30, 30);
    });
    const catapult = Bodies.rectangle(400, 520, 320, 20);
    const ground = Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true });
    
    World.add(world, [
        ground,
        squares,
        catapult,
        Constraint.create({ 
            bodyA: catapult, 
            pointB: Vector.clone(catapult.position),
            stiffness: 1,
            length: 0
        })
    ]);

    // 0,0 is top left
    const leftCollider = Bounds.create([{ x: 0, y: 0 }, { x: 300, y: 300 }]);
    setInterval(() => {
        squares.bodies.forEach(body => {
            if (Bounds.contains(leftCollider, body.position))
                console.log("Inside the collider");
        })
    }, 500);

    // add mouse control
    const mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    Engine.run(engine);
  }

  render() {
    return <div ref={this.myRef} />;
  }
}
