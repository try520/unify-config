
module.exports = class extends baseLogic {
    constructor() {
        super();
        this.redisClient=global.Redis.getClient();
        this.LogsListKey = "StaticRes:Logs:MsgCache";


    }

    async add(data) {
        let pip=this.redisClient.pipeline();
        pip.lpush(this.LogsListKey, JSON.stringify(data));
        let ret = await  pip.exec();
        // let ret = await this.redisClient.lpush(this.LogsListKey, JSON.stringify(data));
        return ret;
    };



    doAdd(appCode, level, content) {
        let model = clickHouse.staticRes.app_log.model;
        model.appCode = appCode;
        model.logLevel = level;
        model.content = content;
        return clickHouse.staticRes.app_log.insertOne(model);
    };

    async getLogs(curPage, pageSize,appCode, level,beginTime,endTime) {

        let findFilter=`appCode='${appCode}' and createTime between '${beginTime}' and '${endTime}'`;
        if (level && level != "") {
            findFilter+=` and logLevel='${level}'`;
        };

        return await clickHouse.staticRes.app_log.findAll({
            where: findFilter,
            order: "createTime asc",
            offset:(curPage-1)*pageSize,
            limit:pageSize
        });
    };
}