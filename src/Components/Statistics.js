import React, { Component } from 'react';
import '../css/Statistics.css'
import StatisticsElement from "./StatisticsElement";

class Statistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sonarQube: props.sonarQube,
            git: props.git
        }
    }

    componentWillReceiveProps(props){
        console.log(props);
        this.setState({
            sonarQube: props.sonarQube,
            git: props.git
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
                        {this.getSonarLink()}
                    </div>
                </div>
            )

        }
    }

    getSonarLink(){
        if(this.state.sonarQube.m_SonarRefURL){
            let link = <a className='statistics-element-body-text' href={this.state.sonarQube.m_SonarRefURL}>click here</a>;
            return <div>For More Details: {link}</div>;
        }
    }

    getGitText(){
        if(this.state.git.topCommiters){
            return (
                <div className={'statistics-element-body-contain'}>
                    <div className='statistics-element-body-text'>
                        <ul>Top Commiters: {this.state.git.topCommiters.map((commiter, index)=>{
                            return <li key={`${index}.${commiter}`}>{++index + ". " + JSON.stringify(commiter).replace("\"", "").replace("\"", "")}</li>
                        })}
                        </ul>
                    </div>
                    <div className='statistics-element-body-text'>
                        {this.getGitLink()}
                    </div>
                </div>
            )

        }
    }

    getGitLink(){
        if(this.state.git.lastCommitString) {
            let link = <a className='statistics-element-body-text' href={this.state.git.lastCommitString}>click
                here</a>;
            return <div>Last Commit Details: {link}</div>;
        }
    }


    render() {
        console.log("test git" + JSON.stringify(this.state.git));
        return (
            <div className='statistics-container'>
                {!this.isEmpty(this.state.sonarQube) ? <StatisticsElement header={'Sonar'} body={this.getSonarText()} key={`${this.state.sonarQube.m_SonarRefURL}`}/> : ""}
                {!this.isEmpty(this.state.git) ? <StatisticsElement header={'Git'} body={this.getGitText()} key={`${this.state.git.lastCommitString}`}/> : "" }
            </div>
        );
    }

    isEmpty(value){
        if(value){
            return Object.keys(value).length === 0;
        }
        return true;
    }
}

export default Statistics;