export class Environment {
    constructor(){
        this._envConfig = {
            baseURL: "http://localhost:8080",
            jenkinsUrl: "http://ec2-52-36-106-204.us-west-2.compute.amazonaws.com:8080",
            userName: 'meori20',
            password: 'zqxwce321',
            microservices: {},
        }
    }

    forUpdate(){
        let configurations = {configuration: {jenkinsServer: {}}};
        configurations.configuration.jenkinsServer.jenkinsUrl = this._envConfig.jenkinsUrl;
        configurations.configuration.jenkinsServer.userName = this._envConfig.userName;
        configurations.configuration.jenkinsServer.password = this._envConfig.password;
        configurations.configuration.jenkinsServer.microservices = this._envConfig.microservices;
        return configurations;
    }
}