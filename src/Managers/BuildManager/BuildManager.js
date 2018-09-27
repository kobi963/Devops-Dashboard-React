import Build from "./Build";

export default class BuildManager{
    constructor(buildArray){
        this.builds = [];
        buildArray.forEach(build =>{
            this.builds.push(Object.assign(new Build, build));
        })
    }
}