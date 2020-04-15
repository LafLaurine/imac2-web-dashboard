import React from 'react'
import PovertyButton from './PovertyButton';
import './Poverty.css';

import {
    XYPlot,
    XAxis,
    YAxis,
    Hint,
    VerticalGridLines,
    HorizontalGridLines,
    MarkSeries
} from 'react-vis';

function generateData() {
    return new Array(100).fill(0).map(row => ({
        x: Math.random() * 10,
        y: Math.random() * 20,
        size: Math.random() * 10
    }));
}

const colorRanges = {
    typeA: ['#59E4EC', '#0D676C'],
};

const MODE = ['noWobble', 'gentle', 'wobbly', 'stiff'];

export default class Example extends React.Component {
    state = {
        data: generateData(),
        modeIndex: 0,
        value: false
    };

    render() {
        const { data } = this.state;
        const markSeriesProps = {
            animation: true,
            sizeRange: [5, 15],
            colorRange: colorRanges[0],
            data,
            onNearestXY: value => this.setState({ value })
        };

        return (
            <div className="centered-and-flexed">
                <XYPlot width={300} height={300} onMouseLeave={() => this.setState({ value: false })}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    <MarkSeries animation={MODE[1]} {...markSeriesProps} />
                    {this.state.value ? <Hint value={this.state.value} /> : null}
                </XYPlot>
                <PovertyButton onClick={() => this.setState({ data: generateData() })} buttonContent={'UPDATE DATA'} />
            </div>
        );
    }
} 