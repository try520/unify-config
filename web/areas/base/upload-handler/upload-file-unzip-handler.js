const multiparty=require("multiparty");
const moment=require("moment");
const config = require('./config');
const webTools=require('../../../common/module/webtools');
const fs=require('fs');
const path=require('path');
const compressing=require('compressing');
module.exports = function (req, res) {


    var handler = async function () {
        var CB={
            state : GetStateMessage(UploadState.Unknown)
        };
        var form = new multiparty.Form({
            maxFilesSize:512*1000*1000,
            uploadDir: req.app.get("RootPath") + '/www/res/upload-temp'
        });
        form.parse(req,async function(err,fields,files){
            try{
                if(err){
                    switch(err.ETOOBIG){
                        case 'ETOOBIG':
                        CB.state=GetStateMessage(UploadState.SizeLimitExceed);
                        CB.error=err;
                        break;
                        default :
                        CB.state=GetStateMessage(UploadState.Unknown);
                        CB.error=err;
                        break;
                    }
                }else{
                    var file = files[config.fileFieldName][0];
                    if(file){
                        var paths=file.path.split('/');
                        var fileName=file.originalFilename;
                        var ext = "." + fileName.split('.')[1];

                        if(!CheckFileType(ext)){
                            CB.state=GetStateMessage(UploadState.TypeNotAllow);
                            res.json(CB);
                            return;
                        }
                        
                        let dir=req.query.dir || "";
                        if(dir!==''){
                            let unZipDir=path.join(global.RootPath,'www',dir);
                            if(!fs.existsSync(unZipDir)){
                                CB.state="目录不存在";
                                res.json(CB);
                                return; 
                            }else{
                                let ret =  await compressing.zip.uncompress(file.path,unZipDir);
                            }
                           
                            
                        }

                        CB.state=GetStateMessage(UploadState.Success);
                        
                       
                    }
                  
                };
            }
            catch(err){
                CB.state=GetStateMessage(UploadState.Unknown);
                CB.error=err;
            }
            
            res.json(CB); 
        })
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

    var CheckFileType=function(ext){
       for(var i=0;i< config.fileAllowFiles.length ;i++){
           if(config.fileAllowFiles[i].indexOf(ext.toLowerCase()>-1)){
               return true;
           }
       }
       return false;
    }

    return {
        handler:handler
    }
  

}