global.log = require("./common/tools/log4").init();
global.Config = require("./config");
global.webTools=require('./common/module/webtools');
global.moment=require('moment');
global.RootPath = __dirname;
global.Redis=require('./common/tools/redis').init();
global.baseLogic = require('./common/base/base-logic');
global.baseController = require('./common/base/base-controller');
global.baseRouter = require('./common/base/base-router');
global.staticRes=require('./common/module/static-res');
global.clickHouse=require('./common/module/click-house');
global.mqttClient = require('./server/service/mqtt');