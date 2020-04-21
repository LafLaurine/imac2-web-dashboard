import React from 'react';
import './CountryButton.css'

export default class CountryButton extends React.Component {

    render() {
        return (
            <button className="CountryButton" onClick={this.props.onClick}>{this.props.name}</button>
        )
    }

}