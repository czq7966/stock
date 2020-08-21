import * as fs from 'fs';
import * as path from 'path'
import * as Url from 'url'

var ConfigFile = './config.json'

export interface IHttpOption {
    port: number
}
export interface IHttpsOption {
    port: number,
    key: string,
    cert: string,
    ca: string
}
export interface IHttpsOption2 {
    port: number,
    key: string | Array<string>,
    cert: string | Array<string>,
    ca: string | Array<string>
}

export interface IRtcConfig {
    codec: string
    iceTransportPolicy: string
    iceServers: []
}
export interface IClientConfig {
    rtcConfig: IRtcConfig
}

export interface IConfig {
    version: string
    updateUrl: string
    configUrl: string
    autoUpdateConfig: boolean
    websites: {[name:string]: string}
    http: Array<IHttpOption>
    https: Array<IHttpsOption2>
    httpsOption2To1(option2: IHttpsOption2): IHttpsOption
}

export class Config implements IConfig {
    version: string
    configUrl: string
    updateUrl: string
    autoUpdateConfig: boolean
    namespaces: {[name:string]: string}
    websites: {[name:string]: string}
    clientConfig: IClientConfig
    http: Array<IHttpOption>
    https: Array<IHttpsOption2>
    constructor() {
        let jsonConfig = Config.getJsonConfig();
        Object.assign(this, jsonConfig)        
    }
    destroy() {

    }

    static update(url?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let jsonConfig = this.getJsonConfig();
            let addr = url || jsonConfig.configUrl;
            let addrUrl: URL;
            try {
                addrUrl = new Url.URL(addr)            
            } catch (error) {
                addrUrl = new Url.URL(addr, jsonConfig.updateUrl)                        
            }
        })
    }
    static getJsonConfig(): IConfig {
        let file = ConfigFile;
        let jsonConfig: IConfig;
        if (fs.existsSync(file)) {
            jsonConfig = JSON.parse(fs.readFileSync(file, 'utf8'))
        } else {
            jsonConfig = require('./config.json');
        }    
        jsonConfig.updateUrl = jsonConfig.updateUrl[jsonConfig.updateUrl.length - 1] !== '/' ? jsonConfig.updateUrl + '/'  : jsonConfig.updateUrl;
        return jsonConfig;
    }    
    httpsOption2To1(option2: IHttpsOption2): IHttpsOption {
        let option: IHttpsOption = {
            port: option2.port,
            key: "",
            cert: "",
            ca: ""
        }

        let keyFile = "";
        let certFile = "";
        if (typeof option2.key == "string") {
            keyFile = path.resolve(__dirname, option2.key as any);
            certFile = path.resolve(__dirname, option2.cert as any);
        } else {
            for (let idx = 0; idx < option2.key.length; idx++) {
                let _keyFile = path.resolve(__dirname, option2.key[idx]);
                let _certFile = path.resolve(__dirname, option2.cert[idx]);     

                if (fs.existsSync(_keyFile) && fs.existsSync(_certFile)) {
                    keyFile = _keyFile;
                    certFile = _certFile;
                    break;
                } else {
                    keyFile = _keyFile;
                    certFile = _certFile;
                }
            }
        }
        option.key = keyFile;
        option.cert = certFile;

        return option;
    }    
}