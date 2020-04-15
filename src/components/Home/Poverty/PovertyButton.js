import React from 'react';
import propTypes from 'prop-types';

function PovertyButton(props) {
    const { buttonContent, onClick } = props;
    return (
        <button className="povertyButton" onClick={onClick}>
            {buttonContent}
        </button>
    );
}

PovertyButton.propTypes = {
    buttonContent: propTypes.string.isRequired,
    onClick: propTypes.func.isRequired
}

export default PovertyButton; 