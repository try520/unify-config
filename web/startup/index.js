const fs=require('fs');
const path=require('path');
const clickHouse=require("../common/module/click-house/static-res")
module.exports=class{
    constructor(){
        this.config=require('../config');
        // if(process.env.NODE_ENV==='micro'){
        //    // this.regEureka();
        // }
        this.initClickHouse();
        this.loadLaunch();
        this.startTask();
    }

    static init(){
        return new this();
    }

    startTask(){
        let Server = require("../server/index");
        Server.start();//启动调度任务
    }

    /**
     * 初始化clickhouse 数据库中的表 如果没有 则创建
     */
    async initClickHouse(){
        console.log("初始化clickhouse数据库");
        let clusterCount=this.config.clickHouse.clusterCount || 1;
        
   
        //创建库 每个集群点都要创建
        for(let i =0;i<clusterCount;i++){
            await clickHouse.app_log.createDataBase("static_res");
         }

        // 删除表
        // for(let i =0;i<clusterCount;i++){
        //     await clickHouse.app_log.dropTable("app_log");
        // }

        // 创建表 每个集群点都要创建
        for(let i =0;i<clusterCount;i++){
           await clickHouse.app_log.createTable();
        }
        
        
    }

    loadLaunch(){
        try{
            let areasPath=path.join(path.resolve(),'areas');
            let dir = fs.readdirSync(areasPath);
            dir.forEach(item=>{
                if(item.indexOf('.')<0){
                    let launchFilePath=path.join(areasPath,item,'launch.js');
                    require(launchFilePath);
                }
            })
        }
        catch (e) {
            log.error(e);
        }

    }

    /**
     * 注册SpringCode 微服务
     */
    regEureka(){
        let Eureka = require("eureka-js-client").Eureka;
        let client = new Eureka(this.config.eureka);
        client.logger.level('debug');
        client.start((err)=>{
            console.log(err || '应用注册成功');
        });
    }


};
