import { Config } from './config';
import { IHttpServers, HttpServers } from './http-servers';
import { IGlobalExpcetion, GlobalExpcetion } from './global-exception';

export interface IServer {
    httpServers: IHttpServers
}

export class Server implements IServer {
    static instance: IServer;
    httpServers: IHttpServers
    globalExpcetion: IGlobalExpcetion

    constructor() {
        Server.instance = this;
        this.httpServers = new HttpServers(new Config());
        this.initEvents();       
        this.run(); 
        this.globalExpcetion = new GlobalExpcetion(this)        
    }    
    destroy() {
        this.globalExpcetion.destroy()
        this.httpServers.destroy();
        delete this.httpServers;
        delete this.globalExpcetion;
        this.unInitEvents();
    }
    initEvents() {

    }
    unInitEvents() {

    }    

    run() {
        this.httpServers.servers.forEach(server => {
            server.httpServer.listen(server.port);
            console.log(server.listenlog || 'listen on port ' + server.port)
        })
    }
    close() {
        this.httpServers.servers.forEach(server => {
            server.httpServer.close();
        })        
    }
}
