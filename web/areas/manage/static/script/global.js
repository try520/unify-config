var layer,element;
var appEditWindowIndex;//记录打开浮动层的index
var IsConnent = false;
var mqttClient;
window.Config={};
$(function () {
     fixNavMenuActive();
    getWebFrontConfig();
    mqttClient=mqtt.connent();
    mqttClient.onMessageArrived = function (payload) {
        console.log(payload);
        if(payload.topic.startsWith("logs")){
            let strs=payload.topic.split('/');
            let appCode=strs[strs.length-2];
            let level=strs[strs.length-1];
            $(document).trigger(`logs/${appCode}/+`, [appCode,level,payload.payloadString]);
        }

    };

});

function getWebFrontConfig(){
    var ret = $.ajax({
        type:"post",
        url: "/manage/getFrontWebConfig",
        async: false,
        dataType:"json",
    }).responseText;
    ret=JSON.parse(ret);
    if(ret.Result==1){
        window.Config=ret.Data;
    }
}

var mqtt = function() {
    let connent=function() {
        let clientId=UUID(16,16);
        let client = new Paho.Client(Config.mqtt.host, Config.mqtt.port,clientId);
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
        client.onConnected=function(){
            IsConnent = true;
            console.log("客户端上线");

        };
        client.onConnectionLost = function (responseObject) {
            IsConnent = false;
            console.log("客户端离线");
        };

        return client;
    }

    return{
        connent:connent
    }
}();

function fixNavMenuActive() {
    var urls = location.pathname.split('/');
    var area = urls[2];
    $(".layui-header").find(".layui-nav-item").removeClass("layui-this");
    $(".layui-header").find(".layui-nav-item").each(function () {
        if (area == $(this).attr('area')) {
            $(this).addClass('layui-this');
        }
    })
}

var  Screen=function(CB) {
    var WinWidth = $(window).width();
    var WinHeigh = $(window).height();

    var OnReSize = function(CB) {
        var ResizedWinWidth = $(window).width();
        var ResizedWinHeight = $(window).height();
        var scale_w = ResizedWinWidth / WinWidth;
        var scale_h = ResizedWinHeight / WinHeigh;
        var scale = scale_w >= scale_h ? scale_h : scale_w;
        if (CB) {
            CB(ResizedWinWidth, ResizedWinHeight, scale);
        }
        window.onresize = function() {
            OnReSize(CB);
        }
    };

    return {
        OnReSize: OnReSize
    }
}();

var UUID = function(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++)
            uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

