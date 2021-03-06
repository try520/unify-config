var multiparty = require("multiparty");
var moment = require("moment");
var config = require("./config");
var webTools = require("../../../common/module/webtools");
var fs = require("fs");
module.exports = function (req, res) {
    var handler = async function () {
        var CB = {
            state: GetStateMessage(UploadState.Unknown),
            relativeUrl: "",
            absolutelyUrl:"",
            title: null,
            original: null,
            error: null
        };
        try {
            var upFile = req.body[config.scrawlFieldName] || "";
            if (upFile != "") {
                var base64Data = upFile.replace(/^data:image\/\w+;base64,/, "");
                var dataBuffer = new Buffer(base64Data, "base64");
                var PathFormat = config.scrawlPathFormat;
             
                PathFormat = PathFormat.replace(/{yyyy}/g, moment().year());
                PathFormat = PathFormat.replace(/{yy}/g, moment().format("yy"));
                PathFormat = PathFormat.replace(/{mm}/g, moment().format("MM"));
                PathFormat = PathFormat.replace(/{dd}/g, moment().format("DD"));
                PathFormat = PathFormat.replace(/{hh}/g, moment().format("HH"));
                PathFormat = PathFormat.replace(/{ii}/g, moment().format("mm"));
                PathFormat = PathFormat.replace(/{ss}/g, moment().format("ss"));
                PathFormat = PathFormat.replace(/{time}/g, moment().unix());
                PathFormat = PathFormat.replace(/{rand}/g, webTools.myuuid.uuid(6, 16));
    
                var newFilePath = req.app.get("RootPath")+'/www' + PathFormat;

                var dir_array=PathFormat.split('/');
                var curParentsDir= req.app.get("RootPath")+'/www';
                dir_array.forEach(function(item){
                    if(item!==""){
                        if(item.indexOf('.png')<0){
                           curParentsDir=curParentsDir +"/"+ item;
                           if(!fs.existsSync(curParentsDir)){
                               fs.mkdirSync(curParentsDir);
                           }
                        }else{
                            fs.writeFileSync(newFilePath, dataBuffer);
                        }
                    }

                })

                
                CB.state=GetStateMessage(UploadState.Success);
                CB.relativeUrl = PathFormat.replace('www/','');
                CB.absolutelyUrl="http://" + req.headers.host  + CB.relativeUrl;
            }
        } catch (err) {
            console.log(err);
            CB.state = GetStateMessage(UploadState.Unknown);
            CB.error = err;
        }

        res.json(CB);
    };

    var UploadState = {
        Success: 0,
        SizeLimitExceed: -1,
        TypeNotAllow: -2,
        FileAccessError: -3,
        NetworkError: -4,
        Unknown: 1
    };

    var GetStateMessage = function (state) {
        switch (state) {
            case UploadState.Success:
                return "SUCCESS";
            case UploadState.FileAccessError:
                return "文件访问出错，请检查写入权限";
            case UploadState.SizeLimitExceed:
                return "文件大小超出服务器限制";
            case UploadState.TypeNotAllow:
                return "不允许的文件格式";
            case UploadState.NetworkError:
                return "网络错误";
        }
        return "未知错误";
    };

  

    return {
        handler: handler
    };
};