import React, { Component } from 'react';
import '../css/ProjectPanel.css'

class ProjectPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectList: props.projectList,
            callback: props.callback,
            buildNow: props.buildNow,
            abortBuild: props.abortBuild
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({projectList: nextProps.projectList})
    }

    render() {
        return (

                    <div className='project-tools-container'>
                        <div className='project-list-container'>
                            <select onChange={this.change}>
                                {this.getOptions()}
                            </select>
                        </div>
                        <div className={'buttons-container'}>
                            <button className='build-now-button' onClick={this.state.buildNow}>Build Now</button>
                            <button className='abort-build-button' onClick={this.state.abortBuild}>Abort Build</button>
                        </div>
                    </div>

        );
    }

    change = (event) => {
        this.state.callback(event.target.value)
    };

    getOptions= () => {
        if(this.state.projectList){
            return Object.keys(this.state.projectList).map(value => {
                return <option key={value}>{value}</option>
            })
        }
    };

}

export default ProjectPanel;