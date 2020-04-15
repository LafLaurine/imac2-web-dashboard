import React from 'react'
import './Poverty.css';
import { Line } from 'react-chartjs-2';

const data = {
    labels: [],
    datasets: [
        {
            label: 'Percentage',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: []
        }
    ]
};


export default class PovertyChart extends React.Component {

    generatePovertyValue() {
        let arr = []
        for (let i = 0; i < this.props.data.poverty.length; i++) {
            if (this.props.data.poverty[i].value !== 'NA') {
                this.povertyValue = this.props.data.poverty[i].value
                arr.push(this.povertyValue)
            }
        }
        data.datasets[0].data = arr
    }

    generateLabels() {
        let arr = []
        for (let i = 0; i < this.props.data.poverty.length; i++) {
            if (this.props.data.poverty[i].date !== 'NA') {
                this.date = this.props.data.poverty[i].date
                arr.push(this.date)
            }
        }
        data.labels = arr
    }

    render() {
        return (
            <div className="PovertyChart">
                <div>
                    {this.generatePovertyValue()}
                    {this.generateLabels()}
                    <Line data={data} />
                </div>
            </div>
        );
    }
} 