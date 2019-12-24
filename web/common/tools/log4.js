module.exports=class {
    constructor(config,name){
        if(!config){
            let serverConfig=require("../../config");
            config=serverConfig.log4js;
        }
        this.log4js=require('log4js').configure(config);
        return this.getLogger(name);

    }

    static init(config,name){
        return new this(config,name);
    }



    getLogger(name){
        let logger= this.log4js.getLogger(name);
        let ret={
            tarce:function(...args){
                logger.debug(...args);
            },
            debug:function (... args) {
                logger.debug(...args);
            },
            info:function (...args) {
               logger.info(...args) ;
            },
            warn:function (...args) {
                logger.warn(...args);
            },
            error:function (...args) {
                logger.error(...args);
            },
            fatal:function (...args) {
                logger.fatal(...args);
            },
            mark:function (...args) {
               logger.mark(...args) ;
            },
            off:function (...args) {
                logger.off(...args);
            }
        };
        return ret;
    }


};