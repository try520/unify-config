module.exports = (function () {
    let config = {};
    switch (global.NODE_ENV) {
        case 'dev':
            config = require('./config.dev');
            break;
        case 'micro':
            config = require('./config.micro');
            break;
        case 'prod':
            config = require('./config.prod');
            break;
        case 'production':
            config = require('./config.prod');
            break;
        default:
            config = require('./config.dev');
            break;
    }



    if (config.clusterWorkerNum !== 1) {
        config.isShareMemory = true;
    }

    for(let key in config){
        if(process.env[key]){
            if(process.env[key].indexOf("{")>-1){
                config[key]=JSON.parse(process.env[key]);
            }
            else {
                config[key]=process.env[key];
            }

        }
    }

    // if (process.env.StaticRes) {
    //     config.StaticRes = JSON.parse(process.env.StaticRes);
    // }
    //
    // if (process.env.redis) {
    //     config.redis = JSON.parse(process.env.redis);
    // }
    //
    // if (process.env.mqtt) {
    //     config.mqtt = JSON.parse(process.env.mqtt);
    // }
    //
    // if (process.env.clickHouse) {
    //     config.clickHouse = JSON.parse(process.env.clickHouse);
    // }
    // console.log(config);
    return config;

})();