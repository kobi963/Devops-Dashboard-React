import React, { Component } from 'react';
import Pipeline from "./Pipeline";
import Statistics from "./Statistics";
import Tabs from "./Tabs";
import BuildHistory from "./BuildHistory";
import ProjectPanel from "./ProjectPanel";
import "../css/MainSecreen.css";
import {applicationManager} from "../Managers/ApplicationManager/ApplicationManager";
// import mockData from '../Mock/mockJenkinsResponse'

class Microsevice extends Component {
    constructor(props){
        super(props);
        this.firstReload = true;
        this.evtSource = new EventSource(applicationManager.preferencesManager.getStreamURL());
        this.state = {};
        this.evtSource.onmessage = (e) => {
            try {
                let data = JSON.parse(e.data);
                this.handleGetNewBuildResponse(data.ProjectName, data.AllBuilds);
            } catch (e) {
                // console.log(e);
            }
        };
        this.updateAll();
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
            applicationManager.sessionManager.git = Object.values(response.projectList)[0].gitDataDM;

            this.setState({
                projectList: response.projectList,
                projectName: Object.keys(response.projectList)[0],
                buildHistory: Object.values(response.projectList)[0].buildList,
                sonarQube: Object.values(response.projectList)[0].sonarQube,
                git: Object.values(response.projectList)[0].gitDataDM
            });
            this.firstReload = false;
        }else{
            this.setState(state => {
                return {
                    projectList: response.projectList,
                    buildHistory: response.projectList[state.projectName].buildList,
                    sonarQube: Object.values(response.projectList)[0].sonarQube,
                    git: Object.values(response.projectList)[0].gitDataDM
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
            if(Array.isArray(response) && response.length)
                this.handleGetNewBuildResponse(buildProjectName, response)
        }).catch(error => {
            this.setState({
                lastBuildStages: []
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

    handleBuildHistoryFromAllBuilds(allBuilds){
        let buildList = [];
        allBuilds.forEach(build => {
            buildList.push({
                buildNumber: parseInt(build.id),
                buildStatus: build.status
            })
        });
        if(Array.isArray(buildList) && buildList.length){
            this.setState({
                buildHistory: buildList
            });
        }
    }

    getPipelineForBuildHistoryElement(id){
        if(this.state.allBuilds){
            console.log(this.state.allBuilds);
            this.state.allBuilds.forEach(build =>{
                if(build.id === String(id)){
                    this.setState({
                        lastBuildStages: build.stages,
                        selectedBuildID: id
                    })
                }
            })
        }else{
            this.props.toast.error("pipeline is not available for this project")
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
            buildHistory: applicationManager.sessionManager.projectList[projectName].buildList,
            sonarQube: applicationManager.sessionManager.projectList[projectName].sonarQube,
            git: applicationManager.sessionManager.projectList[projectName].gitDataDM
        })
    };

    async abortBuild(){
        applicationManager.AbortBuildClient.resetURL(applicationManager.sessionManager.projectName);
        this.props.toast.error("aborting build");
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
                        this.props.toast.success(`New build is running on ${applicationManager.sessionManager.projectName} project`);
                    });
            })
            .catch((error) => {console.log(error)});
    }

    render(){
        return (
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
                        <Statistics
                            sonarQube={this.state.sonarQube}
                            git={this.state.git}
                        />
                    </div>
                </div>
            </div>)
    }
}

export default Microsevice;