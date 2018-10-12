import React, { Component } from 'react';
import PropTypes from 'prop-types'
import '../css/BuildHistoryElement.css'
import {BuildStatus} from "../Utils/AppEnums";

class BuildHistoryElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: props.projectName,
            buildNumber: props.buildNumber,
            callback: props.callback,
            buildNumberText: props.buildNumberText ? props.buildNumberText : '#',
            className: this.getClassName(props.status)
        }
    }

    getClassName(status){
        switch(status) {
            case BuildStatus.success:
                return 'build-number-success-container';
            case BuildStatus.failed:
                return 'build-number-failed-container';
            case BuildStatus.aborted:
                return 'build-number-failed-container';
            case BuildStatus.inProgress:
                return 'build-number-in-progress-container';

        }

    }

    render() {
        return (
            <button className={this.state.className} onClick={()=>{this.state.callback(this.state.buildNumber)}}>
                <div className='build-number-text'>{this.state.buildNumberText}</div>
                <div className='build-number-text'>{this.state.buildNumber}</div>
            </button>
        );
    }

}

BuildHistoryElement.propTypes = {
    buildNumberText: PropTypes.string,
    buildNumber: PropTypes.number,
    isSuccess: PropTypes.bool
};



export default BuildHistoryElement;