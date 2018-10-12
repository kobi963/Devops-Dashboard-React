export default class HttpClient {
    constructor(responseTimeout, url, authorizationString,headers){
        this.COOKIES_SET_HEADER = "Set-Cookie";
        this.COOKIES_HEADER = "Cookie";
        this.CONTENT_TYPE_HEADER = "Content-Type";
        this.POST_HEADER = "POST";
        this.GET_HEADER = "GET";
        this.PATCH_HEADER = "PATCH";
        this.AUTHORIZATION = "Authorization";

        this._url = url;
        this._urlWithParams = url;
        this._responseTimeout = responseTimeout;

        this._headers = headers;
        // this._headers.append('Access-Control-Allow-Origin', '*');

        if(authorizationString){
            // this._headers[this.AUTHORIZATION] = authorizationString;
            // this._headers['Access-Control-Expose-Headers'] = this.CONTENT_TYPE_HEADER;

        }
        this.postMethod = {
            method: this.POST_HEADER,
            // mode: 'no-cors'
        };
        this.getMethod = {
            method: this.GET_HEADER,
            // mode: 'no-cors'

        };
    }

    initializeParameters(params){
        if(params && this._url === this._urlWithParams){
           this.addParams(params);
        }else{
            this._urlWithParams = this._url;
            this.addParams(params);
        }
        return this;
    }

    resetURL(projectName){
        this._urlWithParams = this._url.formatString(projectName);
    }

    addParams(params){
        let esc = encodeURIComponent;
        if((typeof params === typeof {}) && (!Array.isArray(params))){
            if(Object.keys(params).length > 0){
                this._urlWithParams += '?';
                this._urlWithParams += Object.keys(params)
                    .map(k => esc(k) + '=' + esc(params[k]))
                    .join('&');
            }
        }
    }

    post(data) {
        this._headers.append(this.CONTENT_TYPE_HEADER,'application/json');
        this._headers.append("Accept",'application/json');
        this.postMethod.body = JSON.stringify(data);
        this.postMethod.headers = this._headers;
        return this.fetchContent(this.postMethod);
    }


    get() {
        this.getMethod.headers = this._headers;
        return this.fetchContent(this.getMethod);
    }

    async fetchContent(method){
        let response = await fetch(this._urlWithParams, method);
        response = await response.json();
        return response;
    };

}