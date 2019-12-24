module.exports = {
    port:80,
    upload:{
        dir:'/upload/disk',
        url:'/upload'
    },
    uploadDir:'disk',
    clusterWorkerNum:1,//应用运行的进程数，1：开启单进程模式，0：开启多进程模式，进程数=CPU数量，>1:开启多进程模式，数量为设置数量。多进程模式下，需要Redis的支持
    isShareMemory:false,//是否使用共享内存，当是多进程模式时，isShareMemory=true，单进程模式时，可以为false或true
    isHttps:false,
    StaticRes: {
        host: "127.0.0.1",
        port: "3306",
        user: "root",
        pwd: "123456",
        dbName: "static_res",
        dialect: "mysql",
        dirName: "static-res",
        logging: true
    },
    redis: {
        port: 6379, // Redis port
        host: '127.0.0.1', // Redis host
        family: 4, // 4 (IPv4) or 6 (IPv6)
        password: '',
        db: 1
    },
    log4js: {
        appenders: {
            ruleConsole: {
                type: 'console'
            },
            ruleFile: {
                type: 'dateFile',
                filename: './logs/server-',
                pattern: 'yyyy-MM-dd.log',
                maxLogSize: 10 * 1000 * 1000,
                numBackups: 3,
                alwaysIncludePattern: true
            },
            // ruleDb: {
            //   type: "DateFile",
            //   filename: "./logs/db",
            //   pattern: "-yyyy-MM-dd.log",
            //   alwaysIncludePattern: true,
            //   layout: {
            //     type: "pattern",
            //     pattern: "[%d{yyyy-MM-dd hh:mm:ss} %5.5p] %m"
            //   }
            // },

        },
        categories: {
            default: {
                appenders: ['ruleConsole','ruleFile'],
                level: 'INFO' //ALL<TRACE<DEBUG<INFO<WARN<ERROR<FATAL<MARK<OFF
            },
            file: {
                appenders: ['ruleFile'],
                level: 'INFO'
            }
        },
        replaceConsole: true,
        pm2:true
    },
    mqtt: {
        webApi: "http://127.0.0.1:8080/api/v2",
        host: 'mqtt://127.0.0.1:1883',
        qos2Items: 'message',
        auth: {
            username: 'admin',
            password: 'public'
        }

    },
    clickHouse:{
        url: "http://127.0.0.1",
        port:8123,
        user:"",
        password:"",
        clusterName:'default_cluster',
        clusterCount:3,
        basicAuth: null,
        isUseGzip: false,
        debug: false
    },
    //--前端页面配置---------------
    frontWebConfig:{
        mqtt:{
            host:"192.168.12.6",
            port:8083,
            auth: {
                username: 'admin',
                password: 'public'
            }
        }
    }

};

