import './Suicides.css';
import React from 'react';
import Matter from "matter-js";

export default class SuicideAnimation extends React.Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef()
    }

    componentDidMount() {
        this.animate();
    }

    createMatterWorld() {
        const Engine = Matter.Engine,
            Render = Matter.Render,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Body = Matter.Body,
            Constraint = Matter.Constraint,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            Composite = Matter.Composite,
            Composites = Matter.Composites;

        const engine = Engine.create();
        engine.world.gravity.x = 0;
        engine.world.gravity.y = 6;

        const group = Body.nextGroup(true);
        const render = Render.create({
            canvas: this.myRef.current,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframeBackground: '#ffffff',
                wireframes: false
            }
        });

        this.myRef.current.width = 500;
        this.myRef.current.height = 500;
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: Mouse.create(this.myRef.current)
        });


        // create person
        function createPinata(x, y) {
            const headOptions = { friction: 1, frictionAir: .09, collisionFilter: { group: group } };
            const chestOptions = { friction: 1, frictionAir: .09, collisionFilter: { group: group } };
            const armOptions = { friction: 1, frictionAir: .09, collisionFilter: { group: group } };
            const legOptions = { friction: 1, frictionAir: .09, collisionFilter: { group: group } };
            const head = Bodies.circle(x, y - 70, 30, headOptions);
            const chest = Bodies.rectangle(x, y, 60, 80, chestOptions);//40,120
            const rightUpperArm = Bodies.rectangle(x + 40, y - 20, 20, 40, armOptions);
            const rightLowerArm = Bodies.rectangle(x + 40, y + 20, 20, 60, armOptions);
            const leftUpperArm = Bodies.rectangle(x - 40, y - 20, 20, 40, armOptions);
            const leftLowerArm = Bodies.rectangle(x - 40, y + 20, 20, 60, armOptions);
            const leftUpperLeg = Bodies.rectangle(x - 20, y + 60, 20, 40, legOptions);
            const rightUpperLeg = Bodies.rectangle(x + 20, y + 60, 20, 40, legOptions);
            const leftLowerLeg = Bodies.rectangle(x - 20, y + 100, 20, 60, legOptions);
            const rightLowerLeg = Bodies.rectangle(x + 20, y + 100, 20, 60, legOptions);

            const legTorso = Body.create({
                parts: [chest, leftUpperLeg, rightUpperLeg],
                collisionFilter: { group: group },
            });

            const chestToRightUpperArm = Constraint.create({
                bodyA: legTorso,
                pointA: { x: 25, y: -40 },
                pointB: { x: -5, y: -10 },
                bodyB: rightUpperArm,
                stiffness: .4,
                length: 2
            });
            const chestToLeftUpperArm = Constraint.create({
                bodyA: legTorso,
                pointA: { x: -25, y: -40 },
                pointB: { x: 5, y: -10 },
                bodyB: leftUpperArm,
                stiffness: .4,
                length: 2
            });

            const upperToLowerRightArm = Constraint.create({
                bodyA: rightUpperArm,
                bodyB: rightLowerArm,
                pointA: { x: 0, y: 15 },
                pointB: { x: 0, y: -20 },
                stiffness: .2
            });

            const upperToLowerLeftArm = Constraint.create({
                bodyA: leftUpperArm,
                bodyB: leftLowerArm,
                pointA: { x: 0, y: 15 },
                pointB: { x: 0, y: -20 },
                stiffness: .2,
                length: 1
            });

            const upperToLowerLeftLeg = Constraint.create({
                bodyA: legTorso,
                bodyB: leftLowerLeg,
                pointA: { x: -20, y: 60 },
                pointB: { x: 0, y: -25 },
                stiffness: .4
            });

            const upperToLowerRightLeg = Constraint.create({
                bodyA: legTorso,
                bodyB: rightLowerLeg,
                pointA: { x: 20, y: 60 },
                pointB: { x: 0, y: -25 },
                stiffness: .4
            });

            const headContraint = Constraint.create({
                bodyA: head,
                pointA: { x: 0, y: 10 },
                pointB: { x: 0, y: -20 },
                bodyB: legTorso,
                stiffness: .7
            });

            return Composite.create({
                bodies: [
                    legTorso,
                    head,
                    leftLowerArm,
                    leftUpperArm,
                    rightLowerArm,
                    rightUpperArm,
                    leftLowerLeg,
                    rightLowerLeg
                ],
                constraints: [
                    headContraint,
                    chestToLeftUpperArm,
                    chestToRightUpperArm,
                    upperToLowerLeftArm,
                    upperToLowerRightArm,
                    upperToLowerLeftLeg,
                    upperToLowerRightLeg
                ]
            });
        }

        // create rope
        const ropeA = Composites.stack(50, 10, 1, 1, 1, 1, function (x, y) {
            return Bodies.rectangle(x, y, 80, 2, { collisionFilter: { group: group } });
        });

        Composites.chain(ropeA, 0.5, 0, -0.5, 0, { stiffness: 0.5, length: 5 });
        Composite.add(ropeA, Constraint.create({
            pointA: { x: 200 / 2, y: 10 },
            pointB: { x: -20, y: 0 },
            bodyB: ropeA.bodies[0],
            stiffness: 0.5,
            length: 5
        }));
        World.add(engine.world, ropeA);

        // create pinata, connect to rope
        const pinata = createPinata(200 / 2 - 50, 200 / 2);
        const pinataConstraint = Constraint.create({
            bodyA: ropeA.bodies[ropeA.bodies.length - 1],
            bodyB: pinata.bodies[1],
            pointA: { x: 25, y: 0 },
            pointB: { x: 0, y: -30 },
            stiffness: 0.5,
            length: 5
        });
        World.add(engine.world, [pinata, pinataConstraint]);

        setTimeout(function () {
            setInterval(function () {
                const c = pinata.constraints[pinata.constraints.length - 1];
                if (c === undefined) {
                    alert("YOU KILLED SOMEONE");
                    alert("DO YOU THINK THAT THE WORLD DOESN'T HAVE ENOUGH DEATH ?");
                    alert("DO YOU LIKE DEATH ?");
                    alert("WOW AND NOW YOU WANT TO ESCAPE FROM THIS ?");
                    alert("CONGRATS FOR BEING A MONSTER");
                }
                else if (c.bodyB.angularSpeed < 0.1) {
                    return;
                }
                Composite.remove(pinata, c);
            }, 1000);
        }, 2000);

        // 
        World.add(engine.world, [mouseConstraint]);
        Engine.run(engine);
        Render.run(render);
    }

    animate() {
        if (this.myRef.current) {
            this.createMatterWorld()
        }
    }

    render() {
        return (
            <div className="SuicideAnimation">
                <canvas ref={this.myRef} id="animationCanva" width={200} height={200}></canvas>
            </div>
        )
    }
}