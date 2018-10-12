import HttpClient from "../../Utils/HttpClient";
import {PreferencesManager} from "../PreferencesManager/PreferencesManager";
import {Environment} from "../PreferencesManager/Environment";
import base64 from'base-64'
import SessionManager from "../SessionManager/SessionManager";

let atob = base64.encode;

class ApplicationManager {

    constructor() {
        if (!global.instance) {
            this.preferencesManager = new PreferencesManager(new Environment());
            this.authorizationString = "Basic " + String(atob(this.preferencesManager.getAuthorization()));
            this.newBuildClient = new HttpClient(5000, this.preferencesManager.getNewBuildURL(), null, new Headers());
            this.MainScreenClient = new HttpClient(5000, this.preferencesManager.getSubscribeBuildURL(), null, new Headers());
            this.TriggerBuildClient = new HttpClient(5000, this.preferencesManager.getTriggerBuildURL(), null, new Headers());
            this.AbortBuildClient = new HttpClient(5000, this.preferencesManager.getAbortBuildURL(), null, new Headers());
            this.LastBuildClient = new HttpClient(5000, this.preferencesManager.getLastBuildURL(), this.authorizationString, new Headers({
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }));
            this.DomainClient = new HttpClient(5000, this.preferencesManager.getDomainURL(), null, new Headers());
            this.LoginClient = new HttpClient(5000, this.preferencesManager.getLoginURL(), null, new Headers());
            this.createUserClient = new HttpClient(5000, this.preferencesManager.getCreateUserURL(), null, new Headers());
            this.sessionManager = new SessionManager();
            this.addFormatFunctionToStringPrototype();
            global.instance = this;
        }
        return global.instance;
    };

    addFormatFunctionToStringPrototype(){
        String.prototype.format = String.prototype.formatString = function() {
            let s = this,
                i = arguments.length;

            while (i--) {
                s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
            }
            return s;
        };
    }

    msToTime(duration) {
        // let milliseconds = parseInt((duration % 1000) / 100);
        let seconds = parseInt((duration / 1000) % 60, 10);
        let minutes = parseInt((duration / (1000 * 60)) % 60, 10);
        // hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        // hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return minutes + ":" + seconds
    };
}

export let applicationManager = new ApplicationManager();