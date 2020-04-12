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

    // add bodies
    const group = Body.nextGroup(true);

    const stack = Composites.stack(250, 255, 1, 6, 0, 0, function(x, y) {
        return Bodies.rectangle(x, y, 30, 30);
    });

    // TODO check for object if they ar inside the collider when a collision happens (using Events.on(engine, 'collisionStart', ...))
    const catapult = Bodies.rectangle(400, 520, 320, 20, { collisionFilter: { group: group } });
    const leftCollider = Bounds.create([{ x: 255, y: 255 }, { x: 300, y: 300 }]);
    console.log(leftCollider);
    console.log(Bounds.contains(leftCollider, catapult.position));

    World.add(world, [
        stack,
        catapult,
        Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }), // Ground
        Bodies.rectangle(250, 555, 20, 50, { isStatic: true }), // Catapult bottom
        Bodies.rectangle(400, 535, 20, 80, { isStatic: true, collisionFilter: { group: group } }),
        Bodies.circle(560, 100, 50, { density: 0.005 }),
        Constraint.create({ 
            bodyA: catapult, 
            pointB: Vector.clone(catapult.position),
            stiffness: 1,
            length: 0
        })
    ]);

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
