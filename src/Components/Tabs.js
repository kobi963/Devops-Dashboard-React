import React, { Component } from 'react';
import '../css/Tabs.css'

class Tabs extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='tabs-container'>
                <div className='microservice-container'>
                    <header className='microservice-header'>Microservice</header>
                </div>
                <div className='project-domain-container'>
                    <header className='microservice-header'>Project Domain</header>
                </div>
            </div>
        );
    }
}

export default Tabs;