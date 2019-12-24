
const express = require('express');
module.exports = class router {
    constructor() {
        this.router = express.Router();
        this.webTools = global.webTools;
        this.staticRes = global.staticRes;
        this.moment = global.moment;

    }

    static init(){
        return new this();
    }



    loadLogic(path,params){
        if(path.indexOf('.js')<0){
            path+='.js';
        }
        let realPath=`../../logic/${path}`;
        return require(realPath).init(params);
    }

    Success(Result, Data) {
        let cb = {
            Result: Result,
            Data: Data
        };
        return cb;
    }

    Error(msg,err) {
        let cb = {
            Result: 0,
            Msg: msg,
            Error:err
        };
        log.error(err);
        return cb;
    }

};
