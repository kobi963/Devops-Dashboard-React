import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/MemberInfoAndControl.css'

class MemberInfoAndControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            jobTitle: this.props.jobTitle
        }
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
                <div className='logout-container'>
                    <button className='logout-btn'>logout</button>
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