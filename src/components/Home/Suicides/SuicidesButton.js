import React from 'react';
import './Suicides';

export default class SuicidesButton extends React.Component {
    render() {
        return (
            <button className="suicideButton" onClick={this.props.onClick}>{this.props.name}</button>
        )
    }
}
