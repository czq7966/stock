import * as express from 'express'
import path = require('path')

export class ExpressApp {
    websites: {[name: string]: string}
    express: express.Application;
    constructor(websites: {[name: string]: string}) {
        this.websites = websites || {};
        this.express = express();
        this.routes();
    }
    routes() {
        Object.keys(this.websites).forEach(key => {
            let dir = __dirname + this.websites[key];
            console.log('11111111', dir)
            this.express.use('/' + key.trim(), express.static(dir));
        })              
    }
}