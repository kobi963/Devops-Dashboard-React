import HttpClient from "../../Utils/HttpClient";

export class PreferencesManager {

    constructor(env) {
        this.env = env;
        this.version = '1.0';

        this._REQUEST_INIT_SCREEN = "/getInitialScreen";
        this._REQUEST_BUILD_STREAM = "/subscribeBuild";
        this._REQUEST_RUNNING_BUILD = "/getJobPipelines/{0}";
        this._REQUEST_GET_CONFIGURATIONS = '/getConfigurations';
        this._REQUEST_UPDATE_CONFIGURATIONS = '/updateConfigurations';
        this._REQUEST_TRIGGER_BUILD = '/getTriggerBuild/{0}';
        this._REQUEST_ABORT_BUILD = '/getAbortBuild/{0}';
        this._REQUEST_NEW_BUILD = '/getLastBuild/{0}';
        this.getConfigurationsClient = new HttpClient(4000, this.env._envConfig.baseURL + this._REQUEST_GET_CONFIGURATIONS, this.getAuthorization(), new Headers());
        this.updateConfigurationsClient = new HttpClient(4000, this.env._envConfig.baseURL + this._REQUEST_UPDATE_CONFIGURATIONS, this.getAuthorization(), new Headers());
    }

    async getConfigurations(){
        await this.getConfigurationsClient.get().then(response=>{
            response = response.configuration.jenkinsServer;
            this.env._envConfig.jenkinsUrl = response.jenkinsUrl;
            this.env._envConfig.user = response.user;
            this.env._envConfig.microservices = response.microservices;
            this.env._envConfig.password = response.password;
        });
        return this.env._envConfig;
    }

    async updateConfigurations(){
        await this.updateConfigurationsClient.post(this.env.forUpdate()).then(response =>{
        })
    }

    getSubscribeBuildURL(){
        return this.env._envConfig.baseURL + this._REQUEST_INIT_SCREEN;
    }

    getNewBuildURL(){
        return this.env._envConfig.baseURL + this._REQUEST_NEW_BUILD;
    }

    getStreamURL(){
        return this.env._envConfig.baseURL + this._REQUEST_BUILD_STREAM;
    }

    getAuthorization() {
        return `${this.env._envConfig.user}:${this.env._envConfig.password}`;
    }

    getLastBuildURL() {
        return this.env._envConfig.baseURL + this._REQUEST_RUNNING_BUILD;
    }

    getTriggerBuildURL(){
        return this.env._envConfig.baseURL + this._REQUEST_TRIGGER_BUILD;
    }

    getAbortBuildURL(){
        return this.env._envConfig.baseURL + this._REQUEST_ABORT_BUILD;
    }
}