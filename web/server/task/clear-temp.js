
var schedule = require("node-schedule");
var moment = require('moment');
var path = require('path');
var fs = require('fs');
module.exports = function() {
    var Task = null;
    var Start = function(timePlan) {
        Task = schedule.scheduleJob(timePlan, function() {
            Main();
        });
    };
    var Stop = function() {
        Task.cancel();
        log.info("任务计划-关闭");
    };

    var Main = async function() {
        log.info("------任务计划-开始------");
       let tempDir=path.join(path.resolve(),'www','res','upload-temp');
       let pa = fs.readdirSync(tempDir);  
       pa.forEach(function(ele,index){  
          let filePath=path.join(tempDir,ele);
          fs.unlinkSync(filePath);
       }) 
        log.info("------任务计划-结束-清除临时文件："+pa.length +"-----");
    };

    return {
        Start: Start,
        Stop: Stop
    }
};
