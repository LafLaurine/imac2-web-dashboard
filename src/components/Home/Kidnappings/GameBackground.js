import React from 'react';
import Matter from "matter-js";
import './GameBackground.css';
import Head from './img/tony-kornheiser.png';

export default class GameButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.createMatterWorld();
  }

  createMatterWorld() {
    const engine = Matter.Engine.create({
      // positionIterations: 20
    });

    const render = Matter.Render.create({
      element: this.refs.scene,
      engine: engine,
      options: {
        width: 400,
        height: 400,
        wireframes: false
      }
    });

    const ballA = Matter.Bodies.circle(210, 100, 30, { restitution: 0.5 });
    const ballB = Matter.Bodies.circle(110, 50, 30, { restitution: 0.5 });
    Matter.World.add(engine.world, [
      // walls
      Matter.Bodies.rectangle(100, 0, 300, 50, { isStatic: true }),
      Matter.Bodies.rectangle(100, 300, 300, 50, { isStatic: true }),
      Matter.Bodies.rectangle(160, 150, 50, 300, { isStatic: true }),
      Matter.Bodies.rectangle(0, 300, 50, 300, { isStatic: true })
    ]);

    Matter.World.add(engine.world, [ballA, ballB]);

    // add mouse control
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
    });

    Matter.World.add(engine.world, mouseConstraint);

    Matter.Events.on(mouseConstraint, "mousedown", event => {
      Matter.World.add(engine.world, Matter.Bodies.circle(150, 50, 30, { restitution: 0.7 }));
    });

    Matter.Engine.run(engine);

    Matter.Render.run(render);
  }

  render() {
    return <div ref="scene" />;
  }
}
