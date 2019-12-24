var fs = require('fs');
var path = require('path');
var params = process.argv.splice(2); //获取命令中带入的参数
var subjectName = params[0]; //项目名称
var config = require('../../config');
var exec = require('child_process').exec;


//创建数据库模型目录
var CreateDbDir = function () {
    if (!subjectName) {
        console.error('命令语法 参数丢失 正确使用方法：npm run createDb [配置文件中的数据配置属性名称]');
        return false;
    }
    if (!config[subjectName]) {
        console.error('配置文件中不存在【' + subjectName + '】数据库访问配置属性');
        return false;
    }
    let dbDir = path.resolve(__dirname, '../module/' + config[subjectName].dirName);
    if (!fs.existsSync(dbDir)) {
        console.log('创建数据模型目录-' + dbDir);
        fs.mkdirSync(dbDir);
        fs.mkdirSync(dbDir + `/models`);
        fs.mkdirSync(dbDir + `/logic`);
        fs.mkdirSync(dbDir + `/libs`);
        fs.appendFileSync(dbDir + '/libs/db.js', `
       
module.exports =new class{
    constructor() {
        this.config = global.Config;
        this.sequelize=this.getSequelize();

    }


    getSequelize(){
        let Sequelize = require('sequelize');
        let sequelize = new Sequelize(this.config.${subjectName}.dbName, this.config.${subjectName}.user, this.config.${subjectName}.pwd, {
            host: this.config.${subjectName}.host,
            port: this.config.${subjectName}.port,
            dialect: this.config.${subjectName}.dialect,
            logging: this.config.${subjectName}.logging,
            timezone: '+08:00',
            pool: {
                minConnections: 2,
                maxIdleTime: 1000 * 30
            },
            define: {
                timestamps: false,
                createdAt: false,
                updatedAt: false
            }
        });
        return sequelize;
    }

    async query(sql,model){
          return await this.sequelize.query(sql, {
              replacements:model,
              type: this.sequelize.QueryTypes.SELECT
          });
    }

};
        `);

    } else {
        console.log('目录已经存在-' + dbDir);
    }
    return dbDir;
};

//创建逻辑类
var CreateLogicFile = function (dbDir, fileName) {

    let filePath = dbDir + "/logic/" + fileName;
    let ModelName = fileName.replace('.js', '');
    if (!fs.existsSync(filePath)) {

        fs.appendFileSync(filePath, `
        module.exports = function() {
            let sequelize = require("../libs/db").sequelize;
            let Access = sequelize.import("../models/${ModelName}");
            /**
             * 这是个实例
             */
            let Example=function(){

            };

            return {
                Access: Access,
                Example:Example
            }
        }();`);
        console.log(`${fileName}-生成完毕`);
    } else {
        console.log(`${fileName}-已经存在，不允许被覆盖`);
    }
};

//清除logic类垃圾
var ClearLogicFile = function (dbDir) {
    var modelFiles = fs.readdirSync(dbDir + "/models");
    var logicFiles = fs.readdirSync(dbDir + "/logic");
    var files = [];
    logicFiles.forEach((logic) => {
        let isHas = false;
        modelFiles.forEach((model) => {
            if (model == logic) {
                isHas = true;
            }
        });
        if (!isHas) {
            files.push(logic);
        }
    });
    files.forEach(function (item) {
        fs.unlinkSync(dbDir + "/logic/" + item);
    });
};

//建立索引
var CreateIndex = function (dbDir) {
    let FileItems = fs.readdirSync(dbDir + "/models");
    let indexPath = dbDir + "/index.js";
    if (fs.existsSync(indexPath)) {
        fs.unlinkSync(indexPath);
    }
    fs.appendFileSync(indexPath, `module.exports={
        base:require("./libs/db"),`);
    for (var i = 0; i < FileItems.length; i++) {
        var item = FileItems[i];
        var name = item.replace('.js', '');
        if (i == FileItems.length - 1) {
            fs.appendFileSync(indexPath, `${name}:require('./logic/${item}')`);
        } else {
            fs.appendFileSync(indexPath, `${name}:require('./logic/${item}'),`);
        }

    }
    fs.appendFileSync(indexPath, `}`);
};


//开始创建
var Start = function () {
    let dbDir = CreateDbDir();
    if (!dbDir) return;

    console.log("------清除数据模型------");
    var files = fs.readdirSync(dbDir + "/models");
    files.map(function (item) {
        fs.unlinkSync(dbDir + "/models/" + item);
    });
    console.log("------开始生成数据访问层------");
    var cmdStr = 'sequelize-auto -o ' + dbDir + '/models -d ' + config[subjectName].dbName + ' -h ' + config[subjectName].host + ' -u ' + config[subjectName].user + ' -p ' + config[subjectName].port + ' -x ' + config[subjectName].pwd + ' -e ' + config[subjectName].dialect;
    console.log(cmdStr);
    exec(cmdStr, function (err, ret) {
        if (err) console.error(err);
        let files = fs.readdirSync(dbDir + "/models");
        //ClearLogicFile(dbDir);
        console.log("------共生成模型（" + files.length + "）个");
        console.log("------开始生成逻辑层，一些联表查询可以放在这里--------");
        files.map(function (item) {
            CreateLogicFile(dbDir, item);
        });
        console.log("------正在的创建索引------");
        CreateIndex(dbDir);
        console.log("------生成成功------");
    })
};

Start();