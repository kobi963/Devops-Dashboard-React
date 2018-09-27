import React, { Component } from 'react';
import '../css/Statistics.css'
import StatisticsElement from "./StatisticsElement";

class Statistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sonarQube: props.sonarQube,
        }
    }

    componentWillReceiveProps(props){
        this.setState({
            sonarQube: props.sonarQube,
        })
    }

    getSonarText(){
        if(this.state.sonarQube){
            return (
                <div className={'statistics-element-body-contain'}>
                    <div className='statistics-element-body-text'>
                        {`Code Coverage: ${this.state.sonarQube.m_CodeCoverage}`}
                    </div>
                    <div className='statistics-element-body-text'>
                        {`Code Smells: ${this.state.sonarQube.m_CodeSmells}`}
                    </div>
                    <div className='statistics-element-body-text'>
                        {this.getLink()}
                    </div>
                </div>
            )

        }

    }
    getLink(){
        let link = <a className='statistics-element-body-text' href={this.state.sonarQube.m_SonarRefURL}>click here</a>;
        return <div>For More Details: {link}</div>;
    }


    render() {
        return (
            <div className='statistics-container'>
                {this.state.sonarQube && <StatisticsElement header={'Sonar'} body={this.getSonarText()}/>}
            </div>
        );
    }
}

export default Statistics;