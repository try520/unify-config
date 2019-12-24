
module.exports = class {
    constructor(){
        this.config =  global.Config;
        this.Redis=require("ioredis");
    }

    static  init(){
        return new this();
    }


    getClient() {
        let redis =  new this.Redis(this.config.redis);
        let luaScript=`
        local rst={};
        for i,v in pairs(ARGV) do
          rst[i]=redis.call('hgetall', v);
        end;
        return rst;
        `;
        redis.defineCommand('mhgetall',{
            lua:luaScript
        });
        return redis;
    }
};
