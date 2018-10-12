import React, {Component} from "react";
import "../css/MainSecreen.css";
import {applicationManager} from "../Managers/ApplicationManager/ApplicationManager";
import DomainElement from "./DomainElement";

class Domain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toast: props.toast,
        };
    }

    componentDidMount(){
        applicationManager.DomainClient.get().then(response => {
            this.setState({
                domainDataList: response.domainsDataList,
                domains: response.domains
            })
        })
    }

    getBody(element) {
        return (
            <div className={'statistics-element-body-contain'}>
                <div className='statistics-element-body-text'>
                    {
                        element.toDomainCommiters ?
                            <ul>Commiters: {element.toDomainCommiters.map((commiter, index) => {
                            return <li
                                key={`${index}.${commiter}`}>{++index + ". " + JSON.stringify(commiter).replace("\"", "").replace("\"", "")}</li>
                        })}
                        </ul> : ""
                    }
                </div>
                <div className='statistics-element-body-text'>
                    {element.domainCoverage ? `Total Coverage: ${element.domainCoverage}` : ""}
                </div>
                <div className='statistics-element-body-text'>
                    {element.totalDomainCodeSmells ? `Total CodeSmells: ${element.domainCoverage}` : ""}
                </div>
                <div className='statistics-element-body-text'>
                    {element.microserviceCount ? `Total Microservices: ${element.microserviceCount}` : ""}
                </div>
            </div>
        )
    }

    getKey(element){
        return `${element.domainCoverage}.${element.domainCoverage}.${element.microserviceCount}.${element.domainName}`
    }


    getDomainContainers(list){
        if(list){
            return list.map((element, index) => {
                return (<DomainElement header={element.domainName} body={this.getBody(element)} key={this.getKey(element)}/>)
            })
        }

    }

    render() {
        return (
            <div className='main-panel-container'>
                <div className='project-panel-container-domain'>
                    {this.getDomainContainers(this.state.domainDataList)}
                </div>
            </div>
        )
    }
}

export default Domain;