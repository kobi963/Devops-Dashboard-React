import React, { Component } from 'react';

import PipelineElement from "./PipelineElement";
import '../css/Pipeline.css'
import {applicationManager} from "../Managers/ApplicationManager/ApplicationManager";

class Pipeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stages: props.stages,
            ableToLoadPipeline: props.ableToLoadPipeline,
            buildID: props.buildID
        }
    }

    renderPipelineElement(element){
        return <PipelineElement
            name={element.name}
            status={element.status}
            duration={applicationManager.msToTime(element.durationMillis)}
            errorText={element.error ? `${element.error.type} ${element.error.message}` : ''}
            key={`${element.name}.${this.state.buildID}.${element.status}`}/>;
    }

    componentWillReceiveProps(props){
        this.setState({
            stages: props.stages,
            ableToLoadPipeline: props.ableToLoadPipeline,
            buildID: props.buildID
        })
    }

    componentDidMount(){

    }


    getPipelineElements(){
        if(this.state.ableToLoadPipeline){
            return this.state.stages.map((element) => {
                return this.renderPipelineElement(element);
            })
        }else{
            return <div/>
        }
    }

    render() {
        return (
            <div className='pipeline-container'>
                <div className={this.state.ableToLoadPipeline ? 'pipeline-list' : 'pipeline-list-unavailable'}>
                    {this.state.ableToLoadPipeline ? this.getPipelineElements() : <div className='pipeline-unable-to-load'>unable to load Pipline</div>}
                </div>
            </div>
        );
    }
}

export default Pipeline;