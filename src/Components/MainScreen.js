import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "../css/MainSecreen.css";
import MemberInfoAndControl from "./MemberInfoAndControl";
import {applicationManager} from "../Managers/ApplicationManager/ApplicationManager";

import Microsevice from "./Microsevice";
import Domain from "./Domain";
import Tabs from "./Tabs";



class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            config: false,
            tabsMicroservice: true
        };
        applicationManager.preferencesManager.getConfigurations().then(()=>{
            this.setState({
                config: true
            })
        }).catch((e)=>{});
    }

    changeToMicroservice(){
        this.setState({
            tabsMicroservice: true
        })
    };

    changeToDomain(){
        console.log(this.state.tabsMicroservice);
        this.setState({
            tabsMicroservice: false
        })
    };

    logoutMainScreen = () => {
        this.props.logout();
    };


    render() {
        return (
            <div className="limiter">
                <div className="container-main-screen100">
                    <div className="wrap-main-screen100">
                        <MemberInfoAndControl
                            name={this.state.user.name}
                            jobTitle={this.state.user.jobTitle}
                            toast={this.props.toast}
                            config={this.state.config}
                            logoutMainScreen={this.logoutMainScreen.bind(this)}
                        />
                        <Tabs
                            micro={this.changeToMicroservice.bind(this)}
                            domain={this.changeToDomain.bind(this)}
                        />
                        {
                            this.state.tabsMicroservice ? <Microsevice toast={this.props.toast}/> : <Domain/>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

MainScreen.propTypes = {
    user: PropTypes.object,
};

export default MainScreen;