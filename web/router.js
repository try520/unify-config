/**
 * 自动路由
 */
var fs = require('fs');
var path = require('path');
var express = require('express');
exports.GetRouter = function(app) {

    var files = fs.readdirSync(__dirname + "/areas");
    let isHasHome=false;
    let homeDir="";
    files.forEach(function(item) {
        let area = require("./areas/" + item + "/router").init();
        if(area && area.nameSpace==='/'){
            isHasHome=true;
            homeDir=item;
        }else{
            if (item.indexOf(".js") == -1 && !item.startsWith('.')) {
                app.use('/' + item + '/static', express.static(path.join(__dirname + '/areas/' + item, '/static'))); //动态设置静态路径
                if (area) {
                    area.GetRouter(app);
                }
            }
        }

    });
    if(isHasHome){
        app.use('/' + homeDir + '/static', express.static(path.join(__dirname + '/areas/' + homeDir, '/static'))); //动态设置静态路径
        let area = require("./areas/" + homeDir + "/router").init();
        if (area) {
            area.GetRouter(app);
        }
    }

};
