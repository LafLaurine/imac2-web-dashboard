import React from 'react'
import PovertyButton from './PovertyButton';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    MarkSeries
} from 'react-vis';

function generateData() {
    return [...new Array(10)].map(row => ({
        x: Math.random() * 5,
        y: Math.random() * 10
    }));
}

const colorRanges = {
    typeA: ['#59E4EC', '#0D676C'],
    typeB: ['#EFC1E3', '#B52F93']
};


const MODE = ['noWobble', 'gentle', 'wobbly', 'stiff'];

export default class Example extends React.Component {
    state = {
        data: generateData(),
        modeIndex: 0,
        colorType: 'typeA'
    };

    render() {
        const { data, colorType } = this.state;
        return (
            <div className="centered-and-flexed">
                <XYPlot width={300} height={300}>
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />
                    <MarkSeries animation={MODE[1]} data={data} />
                </XYPlot>
                <PovertyButton onClick={() => this.setState({ data: generateData() })} buttonContent={'UPDATE DATA'} />
            </div>
        );
    }
} 