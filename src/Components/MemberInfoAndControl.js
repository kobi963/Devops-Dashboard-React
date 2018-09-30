import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/MemberInfoAndControl.css';
import Configurations from './Configurations';

class MemberInfoAndControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            jobTitle: props.jobTitle,
            toast: props.toast,
            config: props.config
        }
    }

    componentWillReceiveProps(props){
        this.setState({
            config: props.config
        })
    }

    render() {
        return (
            <div className='member-and-logout'>
                <div className='member-container'>
                    <div className='member-table'>
                        <div>
                            <h3 className='member-name'>{this.state.name}</h3>
                        </div>
                        <div>
                            <h3 className='member-separator'>{' | '}</h3>
                        </div>
                        <div>
                            <h3 className='member-job-title'>{this.state.jobTitle}</h3>

                        </div>
                    </div>
                </div>
                <div className='logout-container-and-configurations'>
                    <div className='configurations-container'>
                        <div className='configuration-button'>
                            <Configurations toast={this.state.toast} config={this.state.config}/>
                        </div>
                    </div>
                    <div className='logout-btn'>
                        |
                    </div>
                    <div className='logout-container'>
                        <button className='logout-btn'>Logout</button>
                    </div>
                </div>

            </div>
        );
    }
}

MemberInfoAndControl.propTypes = {
    name: PropTypes.string,
    jobTitle: PropTypes.string
}

export default MemberInfoAndControl;