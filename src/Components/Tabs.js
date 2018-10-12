import React, { Component } from 'react';
import '../css/Tabs.css'

class Tabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            micro: props.micro,
            domain: props.domain
        }
    }

    render() {
        return (
            <div className='tabs-container'>
                <div className='microservice-container'>
                    <button className='microservice-header' onClick={this.state.micro}>Microsevice</button>
                </div>
                <div className="microservice-header">
                    |
                </div>
                <div className='project-domain-container'>
                    <button className='microservice-header' onClick={this.state.domain}>Project Domain</button>
                </div>
            </div>
        );
    }
}

export default Tabs;