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
            this.MainScreenClient = new HttpClient(5000, this.preferencesManager.getSubscribeBuildURL(), null, new Headers());
            this.LastBuildClient = new HttpClient(5000, this.preferencesManager.getLastBuildURL(), this.authorizationString, new Headers({
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }));
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
}

export let applicationManager = new ApplicationManager();