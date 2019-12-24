module.exports = {
    port: 3001,
    upload: {
        dir: '/upload/disk',
        url: '/upload'
    },
    uploadDir: 'disk',
    clusterWorkerNum: 1, //应用运行的进程数，1：开启单进程模式，0：开启多进程模式，进程数=CPU数量，>1:开启多进程模式，数量为设置数量。多进程模式下，需要Redis的支持
    isShareMemory: false, //是否使用共享内存，当是多进程模式时，isShareMemory=true，单进程模式时，可以为false或true
    isHttps: false,
    StaticRes: {
        host: "127.0.0.1",
        port: "3307",
        user: "root",
        pwd: "123456",
        dbName: "static_res",
        dialect: "mysql",
        dirName: "static-res",
        logging: true
    },
    // StaticRes: {
    //     host: "192.168.12.6",
    //     port: "30983",
    //     user: "admin",
    //     pwd: "Kmlc3302133",
    //     dbName: "static_res",
    //     dialect: "mysql",
    //     dirName: "static-res",
    //     logging: true
    // },
    // redis: {
    //     port: 32741, // Redis port
    //     host: '192.168.12.6', // Redis host
    //     family: 4, // 4 (IPv4) or 6 (IPv6)
    //     password: 'tiQAAy4R1s',
    //     db: 1
    // },
    redis: {
        port: 6379, // Redis port
        host: '127.0.0.1', // Redis host
        family: 4, // 4 (IPv4) or 6 (IPv6)
        password: '123456',
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
                appenders: ['ruleConsole', 'ruleFile'],
                level: 'all' //ALL<TRACE<DEBUG<INFO<WARN<ERROR<FATAL<MARK<OFF
            },
            file: {
                appenders: ['ruleFile'],
                level: 'all'
            }
        },
        replaceConsole: true,
        pm2: true
    },
    mqtt: {
        webApi: "http://192.168.12.6:32106/api/v2",
        host: 'mqtt://192.168.12.6:30398',
        qos2Items: 'message',
        auth: {
            username: 'admin',
            password: 'public'
        }

    },
    clickHouse:{
        url: "http://192.168.12.6",
        port:31731,
        user:"kmlc",
        password:"Kmlc3302133",
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
            port:31282,
            auth: {
                username: 'admin',
                password: 'public'
            }
        }
    }
};