
import React from 'react';
import './Drugs.css';

import Blood1 from './img/blood1.svg';
import Blood2 from './img/blood2.svg';
import Blood3 from './img/blood3.svg';
import Blood4 from './img/blood4.svg';
import Blood5 from './img/blood5.svg';
import BloodFull from './img/bloodFull.svg';


function Blood10() {
    return <img id="blood" src={Blood1} alt="Blood 10" />
}

function Blood20() {
    return <img src={Blood2} alt="Blood 20" />
}

function Blood30() {
    return <img src={Blood3} alt="Blood 30" />
}

function Blood40() {
    return <img src={Blood4} alt="Blood 40" />
}

function Blood50() {
    return <img src={Blood5} alt="Blood 50" />
}

function BloodOver() {
    return <img src={BloodFull} alt="Blood full" />
}

export default class Blood extends React.Component {

    orderDrug() {
        if (this.props.blood !== 0) {

            if (this.props.blood <= 10) {
                return <Blood10></Blood10>
            }
            else if (this.props.blood <= 20) {
                return <Blood20></Blood20>
            }
            else if (this.props.blood <= 30) {
                return <Blood30></Blood30>
            }
            else if (this.props.blood <= 40) {
                return <Blood40></Blood40>
            }
            else if (this.props.blood <= 50) {
                return <Blood50></Blood50>
            }
            else if (this.props.blood > 50) {
                return <BloodFull></BloodFull>
            }
        }
    }

    render() {
        return (
            <div className="Blood">
                {this.orderDrug()}
            </div>


        )
    }

}