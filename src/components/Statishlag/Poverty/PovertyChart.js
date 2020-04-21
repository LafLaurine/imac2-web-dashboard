import React from 'react'
import './Poverty.css';
import { Line } from 'react-chartjs-2';

const data = {
    labels: [],
    datasets: [
        {
            label: 'Percentage of poverty',
            fill: false,
            lineTension: 0.1,
            borderColor: 'rgb(0,163,255)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.5,
            borderJoinStyle: 'miter',
            pointBorderColor: 'white',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgb(0,163,255)',
            pointHoverBorderColor: 'rgb(0,163,255)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
        }
    ],
    options: {
        responsive: true,
        scales: {
            gridLines: {
                color: 'rgba(1, 0, 0, 0.1)'
            }
        }
    }

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
            <div className="PovertyChart" >
                <div>
                    {this.generatePovertyValue()}
                    {this.generateLabels()}
                    <Line data={data} />
                </div>
            </div>
        );
    }
} 