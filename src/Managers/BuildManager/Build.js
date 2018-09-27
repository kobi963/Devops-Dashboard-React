export default class Build{
    constructor(){
        this._links = null;
        this.id = null;
        this.name = null;
        this.status =  null;
        this.startTimeMillis = null;
        this.endTimeMillis =  null;
        this.durationMillis = null;
        this.queueDurationMillis = null;
        this.pauseDurationMillis =  null;
        this.stages = null;
    }
}