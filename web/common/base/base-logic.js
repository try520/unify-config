
const axios=require("axios");
module.exports=class{
    constructor(){
        this.config = global.Config;
        this.webTools = global.webTools;
        this.staticRes = global.staticRes;
        this.moment = global.moment;
        this.http=this.http();
        this.axios=axios;
    }

    static init(){
        return new this();
    }

    loadLogic(path,params){
        let realPath=`../../logic/${path}`;
        return require(realPath).init(params);
    }

    http(){
        var instance = axios.create({
            // baseURL: '',
            timeout: 5000,
            headers: {}
        });
        let get = async function(url,params){
            let ret = await instance.get(url,{
                params:params
            });
            return ret.data;

        };


        let post=async function(url,params){
            let ret = await instance.post(url,params);
            return ret.data;
        };

        return{
            get:get,
            post:post
        }

    }

    async subscribe(connectItems,serviceChannel,appId,type,name){
        for(let i=0;i<connectItems.length;i++){
            let conn=connectItems[i];
            let info=conn.id.split('/');
            let label=info[2];
            let postData={
                topic:`${serviceChannel}/${appId}/${type}/${name}`,
                client_id:conn.id
            };
            if(this.config.mqtt.qos2Items.indexOf(label)>-1){
                postData.qos=2;
            }else{
                postData.qos=0;
            }
            let ret = await this.axios({
                url:this.config.mqtt.webApi+"/mqtt/subscribe",
                method: 'post',
                auth: {
                    username: this.config.mqtt.auth.username,
                    password: this.config.mqtt.auth.password
                },
                data:postData
            });
        }
        return true;

    }

    async unSubscribe(connectItems,serviceChannel,appId,type,name){
        for(let i=0;i<connectItems.length;i++){
            let conn=connectItems[i];
            let postData={
                topic:`${serviceChannel}/${appId}/${type}/${name}`,
                client_id:conn.id
            };
            await this.axios({
                url:this.config.mqtt.webApi+"/mqtt/unsubscribe",
                method: 'post',
                auth: {
                    username: this.config.mqtt.auth.username,
                    password: this.config.mqtt.auth.password
                },
                data:postData
            });
        }
        return true;

    }

};
