const SocketServer = require('socket.io');
const sysConfig=require('../config');
module.exports=class{
    constructor(server){
        let socketServer = SocketServer({transports: ['websocket', 'polling']});
        let IO = socketServer.listen(server);
        if(sysConfig.clusterWorkerNum!==1){
            let redis=require('../common/tools/redis').init();
            let socketRedis = require("socket.io-redis");
            let _socketRedis=socketRedis({
                pubClient:redis.getClient(),
                subClient:redis.getClient()
            });
            IO.adapter(_socketRedis);
        }

        require('../socket/main')(IO);
    }

    static init(server){
        return new this(server);
    }
}
