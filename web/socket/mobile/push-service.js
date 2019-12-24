//var then = require("thenjs");
var webtools = require('../../common/module/webtools');
//var Socket = null;
var IO = null;
var RoomName = "Mobile";
var NameSpace = "/socket/mobile/push";

exports.CreateSocket = function(io) {
    IO = io.of(NameSpace);
    //IO = io;
    IO.on('connection', function(socket) {
        console.log(socket.id);
        var MsgData = {};
        MsgData.SrcUser = 'system';
        MsgData.Type = 'ConnectionState';
        MsgData.Msg = { ConnectionState: 1, SocketID: socket.id };
        MsgData.SendMsgDateTime = webtools.Date.GetTimestamp(new Date());
        socket.emit('ReceiveMsg', MsgData);

        socket.on('SetClientInfo', function(ClientInfo, fn) {
            try {
                if (typeof ClientInfo == "string") {
                    ClientInfo = JSON.parse(ClientInfo);
                }

                socket.ClientName = ClientInfo.Name;
                if (ClientInfo.Room) {
                    socket.join(ClientInfo.Room);
                } else {
                    socket.join(RoomName);
                }
                SendMsgToAll("ReceiveMsg", "UserJoin", "system", { UserName: socket.ClientName, ClientID: socket.id });
                IO.clients(function(error, clients) {
                    console.log("ID:" + socket.id + " 连接成功，Name=" + ClientInfo.Name + ", 当前手机客户端连接数：" + clients.length);
                });

                if (typeof fn == "function") {
                    fn({ Result: 1 });
                }
            } catch (err) {
                if (typeof fn == "function") {
                    fn({ Result: 0, Msg: err });
                }
            }
        });

        socket.on('SendMsg', function(data) {
            console.log(data);
        });

        socket.on('SendMsgToUser', function(data) {
            SendMsgToUser('ReceiveMsg', data.TargetUser, data.Type, socket.ClientName, data.Msg);
        });

        socket.on('SendMsgToRoom', function(data) {
            SendMsgToRoom('ReceiveMsg', data.Room, data.Type, socket.ClientName, data.Msg);
        });

        socket.on('SendMsgToAll', function(data) {
            SendMsgToAll('ReceiveMsg', data.Type, socket.ClientName, data.Msg);
        });
        //掉线，断开链接处理
        socket.on('disconnect', function() {
            IO.clients(function(error, clients) {
                console.log("移除" + socket.id + "时间：" + new Date() + " 当前手机客户端连接数：" + clients.length);
            });
            SendMsgToAll("ReceiveMsg", { Type: 'UserLeave', Msg: { UserName: socket.ClientName, ClientID: socket.id } });
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
var SendMsgToUser = function(EventName, TargetUser, MsgType, SrcUser, MsgData) {
    try {

        if (!EventName) EventName = "ReceiveMsg";
        var Data = {
            Type: MsgType,
            SrcUser: SrcUser,
            Msg: MsgData,
            SendMsgDateTime: webtools.Date.GetTimestamp(new Date())
        };
        for (var i in IO.sockets) {
            var client = IO.sockets[i];
            if (client && client.ClientName == TargetUser) {
                client.emit(EventName, Data);
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
var SendMsgToAll = function(EventName, MsgType, SrcUser, MsgData) {
    if (!EventName) EventName = "ReceiveMsg";
    console.log(MsgData);
    var Data = {
        Type: MsgType,
        SrcUser: SrcUser,
        Msg: MsgData,
        SendMsgDateTime: webtools.Date.GetTimestamp(new Date())
    };
    IO.emit(EventName, Data);
};
exports.SendMsgToAll = SendMsgToAll;

var SendMsgToRoom = function(EventName, RoomName, MsgType, SrcUser, MsgData) {
    if (!EventName) EventName = "ReceiveMsg";
    var Data = {
        Type: MsgType,
        SrcUser: SrcUser,
        Msg: MsgData,
        SendMsgDateTime: webtools.Date.GetTimestamp(new Date())
    };
    IO.in(RoomName).emit(EventName, Data);
};
exports.SendMsgToRoom = SendMsgToRoom;