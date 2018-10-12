import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/BuildHistory.css'
import BuildHistoryElement from "./BuildHistoryElement";
import {BuildStatus} from "../Utils/AppEnums";

class BuildHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectName: props.projectName,
            buildHistoryList: props.buildHistoryList
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            buildHistoryList: nextProps.buildHistoryList,
            projectName: nextProps.projectName
        })
    }

    renderBuildHistoryList(buildHistoryElement, index){
        let temp = <BuildHistoryElement
            status={buildHistoryElement.buildStatus}
            buildNumber={buildHistoryElement.buildNumber}
            key={`${this.state.projectName}.${buildHistoryElement.buildNumber}.${buildHistoryElement.buildStatus}`}
            callback={this.props.callback}
        />;
        return temp
    }

    getHistoryList(){
        if(this.state.buildHistoryList){
            return this.state.buildHistoryList.slice(0,12).map((buildElement, index) => {
                return this.renderBuildHistoryList(buildElement, index);
            })
        }
    }

    render() {
        return (
            <div className='build-history-container'>
                <header className='build-history-header'>Build History</header>
                <div id='buildList' className='build-number-list'>
                    {this.getHistoryList()}
                </div>
            </div>

        );
    }
}

BuildHistory.propTypes = {
    buildHistoryList: PropTypes.array
};

export default BuildHistory;