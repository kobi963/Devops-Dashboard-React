import React, { Component } from 'react';
import '../css/PipelineElement.css'
import {BuildStatus} from "../Utils/AppEnums";
import Popup from './Popup';

class PipelineElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            status: props.status,
            duration: props.duration,
            reload: false,
            errorText: props.errorText
        }
    }
    async componentWillReceiveProps(props){
        await this.setState(state =>{
            return {
                name: this.props.name,
                    status: this.props.status,
                duration: this.props.duration,
                reload: !state.reload,
            }
        })
    }

    componentDidMount(){
        this.setState({
            name: this.props.name,
            status: this.props.status,
            duration: this.props.duration
        })
    }
    getPipelineElementStyole(status){
        if(status === BuildStatus.success){
            return 'pipeline-element-status-success-container';
        }else if(status === BuildStatus.inProgress){
            return 'pipeline-element-status-in-progress-container';
        }else{
            return 'pipeline-element-status-failed-container';
        }
    }

    getErrorText(){
        return <header className='text-for-popup'>{this.state.errorText}</header>;
    }

    render() {
        return (
            <div className='pipeline-element-container'>
                <div className='pipeline-element-header-container'>
                    <header className='pipeline-element-header'>{this.state.name}</header>
                </div>
                <div className='pipeline-element-time'>{this.state.duration}</div>
                <div className={this.getPipelineElementStyole(this.state.status)}>
                    <div className='pipeline-element-status'>
                        {this.state.status}
                    </div>
                    <div className='pipeline-element-logs-ref'>
                        {this.state.status === BuildStatus.failed && Popup(this.getErrorText())}
                    </div>
                </div>

            </div>
        );
    }
}

export default PipelineElement;