module.exports = new class{
    constructor() {
        this.LogsListKey="StaticRes:Logs:MsgCache";
        this.monitorRedisClient=global.Redis.getClient();
        this.logsLogic=require("../../logic/logs").init();
        setTimeout(() => {
            this.onLogsMsg();
            log.info('开始监听日志消息队列');
        }, 1000);
    }

    onLogsMsg() {

        this.monitorRedisClient.blpop(this.LogsListKey, 0, (err, res) => {
            try{
                if (res) {
                    let Data = JSON.parse(res[1]);
                    // log.debug(Data);
                    ((Data) => {
                        this.logsLogic.doAdd(Data.appCode, Data.level, Data.content);
                    })(Data);
                }

                process.nextTick(() => {
                    this.onLogsMsg();
                });
            }catch (e) {
                console.log(e);
            }

        })
    };
}