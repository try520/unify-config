var multiparty = require("multiparty");
var moment = require("moment");
var config = require('./config');
var webTools = require('../../../common/module/webtools');
var fs = require('fs');
var then = require('thenjs');
var rd = require('rd');

module.exports = function (req, res) {


    var handler =  function () {

        try {
            var CB = {
                state: GetStateMessage(ResultState.Unknown),
                list: [],
                start: 0,
                size: config.imageManagerListSize,
                total: 0,
                error: null
            };
            var start =req.query.start? Number("0" + req.query.start) :0;
            var size = req.query.size?  Number("0" + req.query.size) : config.imageManagerListSize;
            var allFileList = [];
            var path = req.app.get("RootPath") + config.imageManagerListPath;

       
            then(function (defer) {
                rd.read(path, defer);
            }).then(function (defer, files) {
                files.forEach(function (item) {
                    item=item.replace(req.app.get("RootPath"),'');
                    let strs=item.split('.');
                    let ext = "."+strs[strs.length-1];
                    if(ext && ext!==''){
                        for(var i=0;i<config.imageManagerAllowFiles.length;i++){
                            if(ext.toLowerCase()==config.imageManagerAllowFiles[i] && item.indexOf('_s.jpg')<0){
                                if(fs.existsSync(item+"_s.jpg")){
                                    allFileList.push(item+"_s.jpg");
                                }else{
                                    allFileList.push(item);
                                }
                            }
                        }
                    }
                });

                defer(null,allFileList);
            }).fin(function (defer, err, ret) {
                for(var i=start;i<start+size;i++){
                    if(allFileList[i]){
                        CB.list.push({url:allFileList[i]});  
                    }else{
                        break;
                    }
                }
                CB.total=allFileList.length;
                CB.size=size;
                CB.start=start;
                CB.state=GetStateMessage(ResultState.Success);
                res.json(CB);
            });

        } catch (err) {
            CB.state = GetStateMessage(ResultState.Unknown);
            CB.error = err;
            res.json(CB);
        }


    };



    var ResultState = {
        Success: 0,
        InvalidParam: -1,
        PathNotFound: -2,
        AuthorizError: -3,
        IOError: -4,
        Unknown: 1
    };

    var GetStateMessage = function (state) {
        switch (state) {
            case ResultState.Success:
                return "SUCCESS";
            case ResultState.InvalidParam:
                return "参数不正确";
            case ResultState.PathNotFound:
                return "路径不存在";
            case ResultState.AuthorizError:
                return "文件系统权限不足";
            case ResultState.IOError:
                return "文件系统读取错误";
        }
        return "未知错误";
    };



    return {
        handler: handler
    }


}