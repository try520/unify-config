//内部消息通道 用于发送消息
module.exports = new class {
    constructor() {
        this.logsRec=require("./logs-receive");
        this.logsLogic=require("../../logic/logs").init();
        this.ServiceChannel = 'static-res/msg-channel';
        this.mqtt = require('mqtt');
        this.MqttClient = {};
        this.ServerClientId = this.ServiceChannel + "/" + Math.random().toString(16).substr(2, 8);
        this.subscribes ={
            '$share/static-res/logs/#': 0
        }

    }

    start() {
        this.MqttClient = this.mqtt.connect(global.Config.mqtt.host, {
            clientId: this.ServerClientId
            // username: 'admin',
            // password: 'kmlc3302133',
        });

        this.MqttClient.on('connect', () => {
            log.info(this.ServiceChannel + " connect ok.");
            this.MqttClient.subscribe(this.subscribes, (err, granted) => {
                if (err) {
                    console.log(" push-server -> subscribe is error: " + err);
                }
            });
        });

        this.MqttClient.on('message', async (topic, message, packet) => {
            let msg = JSON.parse(message.toString());
             log.debug("push-service 32", topic, msg);
            if(topic.indexOf("logs/")==0){//处理日志
                this.logsLogic.add(msg);
            }

        });

        this.MqttClient.on('error', function(err) {
            log.error(this.ServiceChannel + " is err:" + err);
        });

    }

    sendMsg(aliasTopic,Data,qos){
        this.MqttClient.publish(aliasTopic, JSON.stringify(Data), {qos: qos});
    }
};
