//var then = require("thenjs");
var webtools = require('../../common/module/webtools');
//var Socket = null;
var IO = null;
var RoomName = "Manage";
var NameSpace = "/socket/manage";
exports.CreateSocket = function(io) {
    IO = io;

    IO.of(NameSpace).on('connection', function(socket) {
        socket.emit('ConnectionState', { ConnectionState: 1, SocketID: socket.id });

        socket.on('SetClientInfo', function(ClientInfo, fn) {

            //socket.ClientInfo = ClientInfo;
            socket.ClientName = ClientInfo.UserID;
            socket.join(RoomName);
            io.of(NameSpace).clients(function(error, clients) {
                console.log("客户端连接数：" + clients.length);
            });


            if (typeof fn == "function") {
                fn({ Result: 1 });
            }
        });

        socket.on('SendMsgToUser', function(data) {
            var MsgData = {};
            MsgData.SrcUserID = socket.ClientName;
            MsgData.TargetUserID = data.UserID;
            MsgData.Msg = data.Msg;
            MsgData.SendMsgDateTime = webtools.Date.GetTimestamp(new Date());
            SendMsgToUser('ReceiveMsg', MsgData.TargetUserID, MsgData);
        });

        socket.on('SendMsgToRoom', function(data) {
            var MsgData = {};
            MsgData.SrcUserID = socket.ClientName;
            MsgData.TargetUserID = data.UserID;
            MsgData.Msg = data.Msg;
            MsgData.cv=2;
            MsgData.SendMsgDateTime = webtools.Date.GetTimestamp(new Date());
            SendMsgToRoom('ReceiveMsg', RoomName, MsgData);
        });

        socket.on('SendMsgToAll', function(data) {
            var MsgData = {};
            MsgData.SrcUserID = socket.ClientName;
            MsgData.TargetUserID = data.UserID;
            MsgData.Msg = data.Msg;
            MsgData.SendMsgDateTime = webtools.Date.GetTimestamp(new Date());
            SendMsgToAll('ReceiveMsg', MsgData);
        });
        //掉线，断开链接处理
        socket.on('disconnect', function() {
            console.log("移除" + socket.ClientName + "时间：" + new Date());
            // socket.broadcast.emit('ConnectionState',{ConnectionState:0,Message:socket.id + '断开连接',sorcketid:socket.id});
        });

        //---------------------------其他业务事件--------------------------------------------


    });
};

/**
 * 发送消息给指定UserID的客户端
 * @param ClientName
 * @param msg
 * @constructor
 */
var SendMsgToUser = function(EventName, ClientName, MsgData) {
    try {
        if (!EventName) EventName = "ReceiveMsg";
        for (var i in IO.of(NameSpace).sockets) {
            var client = IO.of(NameSpace).sockets[i];
            if (client && client.ClientName == ClientName) {
                client.emit(EventName, MsgData);
            }
        }
    } catch (err) {
        console.log(err);
    }

};
exports.SendMsgToUser = SendMsgToUser;

/**
 * 发送消息给Room中的所有客户端
 * @param RoomName
 * @param MsgData
 * @constructor
 */
var SendMsgToAll = function(EventName, MsgData) {
    if (!EventName) EventName = "ReceiveMsg";
    IO.of(NameSpace).emit(EventName, MsgData);
}
exports.SendMsgToAll = SendMsgToAll;

var SendMsgToRoom = function(EventName, RoomName, MsgData) {
    if (!EventName) EventName = "ReceiveMsg";
    IO.of(NameSpace).in(RoomName).emit(EventName, MsgData);
}
exports.SendMsgToRoom = SendMsgToRoom;