export class Environment {
    constructor(){
        this._envConfig = {
            baseURL: "http://localhost:8080",
            jenkinsUrl: "http://ec2-52-36-106-204.us-west-2.compute.amazonaws.com:8080",
            user: 'meori20',
            password: 'zqxwce321',
            microservices: {},
        }
    }

    forUpdate(){
        let configurations = {configuration: {jenkinsServer: {}}};
        configurations.configuration.jenkinsServer.jenkinsUrl = this._envConfig.jenkinsUrl;
        configurations.configuration.jenkinsServer.user = this._envConfig.user;
        configurations.configuration.jenkinsServer.password = this._envConfig.password;
        configurations.configuration.jenkinsServer.microservises = this._envConfig.microservices;
        return configurations;
    }
}