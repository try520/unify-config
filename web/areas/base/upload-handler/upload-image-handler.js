const multiparty=require("multiparty");
const moment=require("moment");
const config = require('./config');
const webTools=require('../../../common/module/webtools');
const jimp=require("jimp");
const path=require('path');
module.exports = function (req, res) {


    let handler = async function () {
        let CB={
            state : GetStateMessage(UploadState.Unknown),
            relativeUrl: "",
            absolutelyUrl:"",
            title: null,
            original: null,
            error: null
        };
        let form = new multiparty.Form({
            maxFilesSize: config.imageMaxSize,
            uploadDir: req.app.get("RootPath") + '/www/res/upload-temp'
        });
        form.parse(req,async function(err,fields,files){
            try{
                if(err){
                    console.log(err);
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
                    let file =  files[config.imageFieldName][0];
                    let maxWidth=fields.maxWidth || config.imageCompressBorder;
                    let smallWidth=fields.smallWidth || config.imagesSmallCompressBorder;
                  
                    if(file){
                        let paths=file.path.split('/');
                        let fileName=file.originalFilename;
                        let ext = "." + fileName.split('.')[1];

                        if(!CheckFileType(ext)){
                            CB.state=GetStateMessage(UploadState.TypeNotAllow);
                            res.json(CB);
                            return;
                        }
                        if(Number(file.size)>config.imageMaxSize){
                            CB.state=GetStateMessage(UploadState.SizeLimitExceed);
                            res.json(CB);
                            return;
                        }
                        let PathFormat="",newFilePath="",newFilePath_s="";
                        if(req.query.dir && req.query.dir!==''){
                            PathFormat=req.query.dir+"/"+webTools.myuuid.createUUID()+ext;
                            newFilePath =path.join(global.RootPath,'www',PathFormat) ;
                            newFilePath_s=path.join(global.RootPath,'www',PathFormat+"_s.jpg") ;
                        }else{
                            PathFormat=config.imagePathFormat;
                            PathFormat=PathFormat.replace(/{filename}/g,fileName.replace(ext,''));
                            PathFormat=PathFormat.replace(/{yyyy}/g,moment().year());
                            PathFormat=PathFormat.replace(/{yy}/g,moment().format('yy'));
                            PathFormat=PathFormat.replace(/{mm}/g,moment().format('MM'));
                            PathFormat=PathFormat.replace(/{dd}/g,moment().format('DD'));
                            PathFormat=PathFormat.replace(/{hh}/g,moment().format('HH'));
                            PathFormat=PathFormat.replace(/{ii}/g,moment().format('mm'));
                            PathFormat=PathFormat.replace(/{ss}/g,moment().format('ss'));
                            PathFormat=PathFormat.replace(/{time}/g,moment().unix());
                            PathFormat=PathFormat.replace(/{rand}/g,webTools.myuuid.uuid(6, 16));
                            PathFormat = PathFormat + ext;
                            newFilePath =path.join(path.resolve(),'www',PathFormat) ;
                            newFilePath_s=path.join(path.resolve(),'www',PathFormat+"_s.jpg") ;
                        }


                         let img = await jimp.read(file.path);

                         if(maxWidth>0){
                            if(img.bitmap.width>maxWidth){
                                img.resize(maxWidth,jimp.AUTO).quality(72).write(newFilePath);
                            }else{
                                img.resize(img.bitmap.width,jimp.AUTO).write(newFilePath);
                            }
                         }
                        
                   
                        if(smallWidth>0){
                            if(img.bitmap.width>smallWidth){
                                img.resize(smallWidth,jimp.AUTO).write(newFilePath_s);
                            }else{
                                img.resize(imgSize.w,jimp.AUTO).write(newFilePath_s);
                            }
                        }
                       
                        //CB.title=fileName;
                        CB.state=GetStateMessage(UploadState.Success);
                        CB.relativeUrl = PathFormat.replace('www/','');
                        CB.absolutelyUrl="http://" + req.headers.host  + CB.relativeUrl;
                       
                    }
                  
                }
            }
            catch(err){
                CB.state=GetStateMessage(UploadState.Unknown);
                CB.error=err;
            }
            
            res.json(CB); 
        })
    };

    let UploadState = {
        Success: 0,
        SizeLimitExceed: -1,
        TypeNotAllow: -2,
        FileAccessError: -3,
        NetworkError: -4,
        Unknown: 1
    };

    let GetStateMessage = function (state) {
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

    let CheckFileType=function(ext){
       for(let i=0;i< config.imageAllowFiles.length ;i++){
           if(config.imageAllowFiles[i]==ext.toLowerCase()){
               return true;
           }
       }
       return false;
    }

    return {
        handler:handler
    }
  

}