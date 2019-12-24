/**
 * Created by ming on 13-10-25.
 */
function CallBackData() {
    this.Result = 0; //
    this.Msg = "";
    this.Data = {};
}
CallBackData.prototype.Success = function (result, data) {
    let cb = new CallBackData();
    cb.Result = result;
    cb.Data = data;
    cb.Msg = '';
    return cb;
}

CallBackData.prototype.Error = function (msg) {
    console.log(msg);
    let cb = new CallBackData();
    cb.Result = 0;
    cb.Msg = msg;
    return cb;
}

module.exports = CallBackData;