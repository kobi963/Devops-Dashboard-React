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
import "react-toastify/dist/ReactToastify.css";
// import mockData from '../Mock/mockJenkinsResponse'



class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            config: false
        };

        this.firstReload = true;
        this.evtSource = new EventSource(applicationManager.preferencesManager.getStreamURL());
        this.evtSource.onmessage = (e) => {
            try {
                let data = JSON.parse(e.data);
                this.handleGetNewBuildResponse(data.ProjectName, data.AllBuilds);
            } catch (e) {
                // console.log(e);
            }
        };
        this.updateAll();
        applicationManager.preferencesManager.getConfigurations().then(()=>{
            this.setState({
                config: true
            })
        }).catch((e)=>{});
    }

    updateAll(){
        applicationManager.MainScreenClient.get().then(response=>{
            if(!response.error){
                this.handleMainScreenResponse(response);
                this.getLastBuild(applicationManager.sessionManager.projectName);
            }
        }).catch(error => {
            console.log('this is failing because: ' + error)
        });
    }

    handleMainScreenResponse(response){
        if(this.firstReload){
            applicationManager.sessionManager.projectList = response.projectList;
            applicationManager.sessionManager.projectName = Object.keys(response.projectList)[0];
            applicationManager.sessionManager.buildHistory = Object.values(response.projectList)[0].buildList;
            applicationManager.sessionManager.sonarQube = Object.values(response.projectList)[0].sonarQube;

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
    }

    //
    // checkIntervalStatus(stages){
    //     let result = true;
    //     stages.forEach(stage =>{
    //         if(stage.status !== BuildStatus.success)
    //             result = false;
    //     });
    //     return result;
    // }

    // getLastBuildInterval = (projectName) => {
    //     this.interval = setInterval(()=>{
    //         this.getLastBuild(projectName)}
    //         , 1000)
    // };

    getLastBuild = (buildProjectName) => {
        applicationManager.LastBuildClient.resetURL(applicationManager.sessionManager.projectName);
        applicationManager.LastBuildClient.get().then(response => {
            this.handleGetNewBuildResponse(buildProjectName, response)
        }).catch(error => {
            this.setState({
                allBuilds: null,
                lastBuildStages: [],
                ableToLoadPipeline: false
            })
        });
    };

    handleGetNewBuildResponse(project,data){
        if(this.checkIfPipelineEnable(project)){
            this.handleBuildHistoryFromAllBuilds(data);
            this.setState({
                allBuilds: data,
                lastBuildStages: data[0].stages,
                ableToLoadPipeline: this.checkIfPipelineEnable(project),
                selectedBuildID: data[0].id
            })
        }

    }

    getPipelineForBuildHistoryElement(id){
        if(this.state.allBuilds){
            this.state.allBuilds.forEach(build =>{
                if(build.id === String(id)){
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

    checkIfPipelineEnable = (buildProjectName) =>{
        return buildProjectName === this.state.projectName;
    };

    async displayBuildHistory(projectName){
        applicationManager.sessionManager.projectName = projectName;
        await this.getLastBuild(applicationManager.sessionManager.projectName);
        await this.setState({
            projectName: projectName,
            buildHistory: this.state.projectList[projectName].buildList
        })
    };

    handleBuildHistoryFromAllBuilds(allBuilds){
        let buildList = [];
        allBuilds.forEach(build => {
            buildList.push({
                buildNumber: parseInt(build.id),
                buildStatus: build.status
            })
        });
        this.setState({
            buildHistory: buildList
        });
    }

    async abortBuild(){
        applicationManager.AbortBuildClient.resetURL(applicationManager.sessionManager.projectName);
        await applicationManager.AbortBuildClient.get()
            .then((response) =>{
                console.log(response);
            })
            .catch((error) => {console.log(error)});
        this.setState({
            needToAbort: false
        });
    }

    buildNow(){
        applicationManager.TriggerBuildClient.resetURL(applicationManager.sessionManager.projectName);
        applicationManager.TriggerBuildClient.get()
            .then((response) =>{
                applicationManager.newBuildClient.resetURL(applicationManager.sessionManager.projectName);
                applicationManager.newBuildClient.get()
                    .then(()=>{})
                    .catch((e)=>{
                        toast.success(`New build is running on ${applicationManager.sessionManager.projectName} project`);
                });
            })
            .catch((error) => {console.log(error)});
    }

    render() {
        return (
            <div className="limiter">
                <ToastContainer autoClose={5000}/>
                <div className="container-main-screen100">
                    <div className="wrap-main-screen100">
                        <MemberInfoAndControl
                            name={this.state.user.name}
                            jobTitle={this.state.user.jobTitle}
                            toast={toast}
                            config={this.state.config}
                        />
                        <Tabs/>
                        <div className='main-panel-container'>
                            <BuildHistory
                                buildHistoryList={this.state.buildHistory}
                                projectName={this.state.projectName}
                                callback={this.getPipelineForBuildHistoryElement.bind(this)}/>
                            <div className='project-panel-container'>
                                <ProjectPanel
                                    projectList={this.state.projectList}
                                    callback={this.displayBuildHistory.bind(this)}
                                    abortBuild={this.abortBuild.bind(this)}
                                    buildNow={this.buildNow.bind(this)}
                                />
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