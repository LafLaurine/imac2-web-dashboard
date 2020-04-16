import React from 'react';
import './Poverty';

export default class PovertyButton extends React.Component {
    render() {
        return (
            <button className="povertyButton" onClick={this.props.onClick}>{this.props.name}</button>
        )
    }
}
