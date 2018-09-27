import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import "../css/MainSecreen.css";
import Pipeline from "./Pipeline";
import Statistics from "./Statistics";
import MemberInfoAndControl from "./MemberInfoAndControl";
import Tabs from "./Tabs";
import BuildHistory from "./BuildHistory";
import ProjectPanel from "./ProjectPanel";
import {applicationManager} from "../Managers/ApplicationManager/ApplicationManager";
import {BuildStatus} from "../Utils/AppEnums";
import "react-toastify/dist/ReactToastify.css";


class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state={
            user: props.user,
        };
        this.intervalOn = false;
        this.firstReload = true;
        this.evtSource = new EventSource(applicationManager.preferencesManager.getStreamURL());
        this.evtSource.onmessage = (e) => {
            console.log(e);
            let data = e.data;
            let projectName = data.split(';')[0].split('/')[2];
            if(projectName){
                projectName = projectName.substring(0,projectName.length - 1);
                if(!this.intervalOn){
                    this.getLastBuildInterval(projectName);
                    this.intervalOn = true;
                }
            }
        };

    }





    async componentDidMount(){
        await applicationManager.MainScreenClient.get().then(response=>{
            if(this.firstReload){
                applicationManager.sessionManager.projectList = response.projectList;
                applicationManager.sessionManager.projectName = Object.keys(response.projectList)[0];
                applicationManager.sessionManager.buildHistory = Object.values(response.projectList)[0].buildList;
                applicationManager.sessionManager.sonarQube = Object.values(response.projectList)[0].sonarQube;

                console.log(Object.values(response.projectList)[0].sonarQube);
                this.setState({
                    projectList: response.projectList,
                    projectName: Object.keys(response.projectList)[0],
                    buildHistory: Object.values(response.projectList)[0].buildList,
                    sonarQube: Object.values(response.projectList)[0].sonarQube,
                });
                this.firstReload = false;
            }else{
                this.setState(state => {
                    return {
                        projectList: response.projectList,
                        buildHistory: response.projectList[state.projectName].buildList
                }});
            }
        }).catch(error => {
            console.log('this is failing because: ' + error)
        });

    }

    getLastBuildInterval = (projectName) => {
        //TODO: popup massage that will inform about new build in project
        toast.success(`New build is running on ${projectName} project`);
        this.interval = setInterval(()=>{
            this.getLastBuild(projectName)}
            , 1000)
    };

    getLastBuild = (buildProjectName) => {
        applicationManager.LastBuildClient.resetURL();
        applicationManager.LastBuildClient._urlWithParams = applicationManager.LastBuildClient._urlWithParams.formatString(buildProjectName);
        applicationManager.LastBuildClient.get().then(response => {
            if(this.checkIntervalStatus(response[0].stages) && this.intervalOn){
                clearInterval(this.interval);
                this.intervalOn = false;
            }
            this.setState({
                allBuilds: response,
                lastBuildStages: response[0].stages,
                ableToLoadPipeline: this.checkIfPipelineEnable(buildProjectName)
            })
        }).catch(error => {
            this.setState({
                allBuilds: null,
                lastBuildStages: [],
                ableToLoadPipeline: false
            })
        });
    };

    getPipelineForBuildHistoryElement(id){
        if(this.state.allBuilds){
            console.log('in here', this.state.allBuilds);
            this.state.allBuilds.forEach(build =>{
                if(build.id === String(id)){
                    console.log(build);
                    this.setState({
                        lastBuildStages: build.stages,
                        selectedBuildID: id
                    })
                }
            })
        }else{
            toast.error("pipeline is not available for this project")
        }
    }

    checkIntervalStatus(stages){
        let result = true;
        stages.forEach(stage =>{
            if(stage.status !== BuildStatus.success)
                result = false;
        });
        return result;
    }

    checkIfPipelineEnable = (buildProjectName) =>{
        if(buildProjectName === this.state.projectName){
            return true;
        }
    };

    async displayBuildHistory(projectName){
        applicationManager.sessionManager.projectName = projectName;
        await this.getLastBuild(applicationManager.sessionManager.projectName);
        await this.setState({
            projectName: projectName,
            buildHistory: this.state.projectList[projectName].buildList
        })
    };


    render() {
        return (
            <div className="limiter">
                <ToastContainer autoClose={5000}/>
                <div className="container-main-screen100">
                    <div className="wrap-main-screen100">
                        <MemberInfoAndControl name={this.state.user.name} jobTitle={this.state.user.jobTitle}/>
                        <Tabs/>
                        <div className='main-panel-container'>
                            <BuildHistory
                                buildHistoryList={this.state.buildHistory}
                                projectName={this.state.projectName}
                                callback={this.getPipelineForBuildHistoryElement.bind(this)}/>
                            <div className='project-panel-container'>
                                <ProjectPanel projectList={this.state.projectList} callback={this.displayBuildHistory.bind(this)}/>
                                <div className='all-statistic-container'>
                                    <Pipeline
                                        stages={this.state.lastBuildStages}
                                        ableToLoadPipeline={this.state.ableToLoadPipeline}
                                        buildID={this.state.selectedBuildID}
                                    />
                                    <Statistics sonarQube={this.state.sonarQube}/>
                                </div>
                            </div>
                        </div>
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