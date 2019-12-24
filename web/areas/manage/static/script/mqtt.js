var IsConnent = false;
var client, clientId,connectId, appid, devCode, devType, ServerChannel;

//连接
function Connent() {
    client = new Paho.Client(Config.mqtt.host, Config.mqtt.port);
    client.connect({
        userName:Config.mqtt.auth.username,
        password:Config.mqtt.auth.password,
        cleanSession:true,
        onSuccess:function () {

        },
        onFailure:function () {
            IsConnent = false;
        }

    });
}