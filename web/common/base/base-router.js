module.exports=class{
    constructor(){

    }



     autoUserRouter(nameSpace, app, filePath) {
        let self=this;
        let fs = require("fs");
        let files = fs.readdirSync(filePath);
        if(nameSpace=='/') nameSpace="";
         filePath=filePath.replace(/\\/g,'/');
        files.forEach(function (item) {
            if (!item.startsWith('.')) {
                if (item.indexOf(".js") === -1) { //目录
                    self.autoUserRouter(nameSpace , app, filePath + "/" + item);
                } else {
                    let filePath1=filePath.split('controls');
                    let fileName=`/${filePath1[1]}/${item}`;

                    fileName=fileName.replace(/\/\//g,'/');
                    let filePath2=filePath.split('areas/');
                    let subjectName=filePath2[1].replace(/\//g,'\\').split('\\')[0];
                    let url = nameSpace + fileName.replace('.js', '');
                    if(url.indexOf('/index')){
                        url=url.replace('/index','');
                    }
                    let router = require("../../areas/"+subjectName+"/controls" + fileName).init();
                    app.use(url, router);
                    if(url.toLowerCase().indexOf('/index')>-1 || url.toLowerCase().indexOf('/default')>-1){
                        url=url.replace(/index/g,'').replace(/default/g,'');
                        app.use(url, router);
                    }
                }
            }
        })
    };
};
