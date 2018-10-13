import React, {Component} from "react";
import Popup from "reactjs-popup";
import "../css/Configurations.css"
import '../css/MemberInfoAndControl.css';
import {applicationManager} from "../Managers/ApplicationManager/ApplicationManager";


class Configurations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toast: props.toast,
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            microservices: JSON.stringify(applicationManager.preferencesManager.env._envConfig.microservices),
            baseURL: applicationManager.preferencesManager.env._envConfig.baseURL,
            jenkinsURL: applicationManager.preferencesManager.env._envConfig.jenkinsUrl,
            userName: applicationManager.preferencesManager.env._envConfig.userName,
            password: applicationManager.preferencesManager.env._envConfig.password
        })
    }

    render() {
        return (
            <div>
                {this.configurations()}
            </div>
        )
    }

    handleSubmit = () => {
        try {
            applicationManager.preferencesManager.env._envConfig.microservices = JSON.parse(this.state.microservices);
            applicationManager.preferencesManager.env._envConfig.baseURL = this.state.baseURL;
            applicationManager.preferencesManager.env._envConfig.jenkinsUrl = this.state.jenkinsURL;
            applicationManager.preferencesManager.env._envConfig.userName = this.state.userName;
            applicationManager.preferencesManager.env._envConfig.password = this.state.password;
            applicationManager.preferencesManager.updateConfigurations().then(() => {
                this.state.toast.success(`configurations saved`);
            });
        } catch (e) {
            this.state.toast.error(`cant't save microservices json is not valid`);
        }
    };


    configurations = () => {
        return(
            <Popup trigger={<button className="logout-btn"> Settings </button>} modal>
                {close => (
                    <div>
                        <a className="left-close-button" onClick={close}>
                            &times;
                        </a>
                        <div className="configurations-container">
                            <div className="header"> Configurations</div>

                            <div className='body-container'>
                                <div className='element-container'>
                                    <div className='element-disc'>
                                        Base URL:
                                    </div>
                                    <input className='element-input' value={this.state.baseURL} type='text'
                                           onChange={(event) => {
                                               this.setState({baseURL: event.target.value})
                                           }}/>
                                </div>
                                <div className='element-container'>
                                    <div className='element-disc'>
                                        Jenkins URL:
                                    </div>
                                    <input className='element-input' value={this.state.jenkinsURL} type='text'
                                           onChange={(event) => {
                                               this.setState({jenkinsURL: event.target.value})
                                           }}/>
                                </div>
                                <div className='element-container'>
                                    <div className='element-disc'>
                                        User Name:
                                    </div>
                                    <input className='element-input' value={this.state.userName} type='text'
                                           onChange={(event) => {
                                               this.setState({userName: event.target.value})
                                           }}/>
                                </div>
                                <div className='element-container'>
                                    <div className='element-disc'>
                                        Password:
                                    </div>
                                    <input className='element-input' value={this.state.password} type='text'
                                           onChange={(event) => {
                                               this.setState({password: event.target.value})
                                           }}/>
                                </div>
                                <div className='element-container'>
                                    <div className='element-disc'>
                                        Microservices:
                                    </div>
                                    <input className='element-input' value={this.state.microservices} type='text'
                                           onChange={(event) => {
                                               this.setState({microservices: event.target.value})
                                           }}/>
                                </div>
                            </div>
                            <div className="button-container">
                                <button
                                    className="button"
                                    onClick={this.handleSubmit}
                                >
                                    Save
                                </button>
                                <button
                                    className="button"
                                    onClick={() => {
                                        close()
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>
        );
    }
}

export default Configurations;
