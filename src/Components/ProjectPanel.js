import React, { Component } from 'react';
import '../css/ProjectPanel.css'

class ProjectPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectList: props.projectList,
            callback: props.callback
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({projectList: nextProps.projectList})
    }

    render() {
        return (
                <div className='project-panel-container'>
                    <div className='project-tools-container'>
                        <div className='project-list-container'>
                            <select onChange={this.change}>
                                {this.getOptions()}
                            </select>
                        </div>
                        <div className='project-searchBar-container'>
                            <div className={'project-searchBar'}>
                                <input className='project-searchBar-input' type="search" id="site-search" name="q"
                                       placeholder="Search the site..."
                                       aria-label="Search through site content"/>
                                <button className='project-searchBar-btn'>Search</button>
                            </div>
                        </div>
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