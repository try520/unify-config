/**
 * Created by tianling on 13-10-2.
 */

var common=require('./common');

function CookiesOptions() {
    this.httpOnly = true;
    this.secure = false;
    this.domain = null;
    this.path = "/";
}

/**
 * 设置Cookie
 * @param res
 * @param Name
 * @param Value
 * @param ExpireTime {Number}  过期时间，单位：分钟
 * @constructor
 */
exports.SetCookie = function (res, Name, Value, ExpireTime) {
    var array=[];
    var secret='manage';
    var Options = new CookiesOptions();
    if (ExpireTime && ExpireTime.constructor === Number) {
        // Options.expires  =new Date(Date.now() + ExpireTime*60*1000);
        if(ExpireTime>0){
            Options.maxAge = ExpireTime * 60 * 1000;     //maxAge说明：>0 设置过期时间 ；=0 删除此Cookie ; =-1 设置为浏览器关闭后就过期  （默认值=-1）
        }
    }
    for(var i in Value){
        array.push(Value[i]);
    }
    array.push(secret);
    array.sort();
    var all_value_str=array.join();
    var vk=common.GetMD5(all_value_str);
    Value.vk=vk;
    res.cookie(Name, Value , Options);
}

/**
 * 读取Cookie
 * @param req
 * @param Name
 * @returns {*}
 * @constructor
 */
exports.GetCookie = function (req, Name) {
    var array=[];
    var secret='manage';
   var obj =req.cookies[Name];

    if (obj) {
        for(var i in obj){
            if(i !== 'vk'){
                array.push(obj[i]);
            }
        }
        array.push(secret);
        array.sort();
        var all_value_str=array.join();
        var vk=common.GetMD5(all_value_str);
       if( obj.vk=== vk){
           return JSON.parse(JSON.stringify(req.cookies[Name])) ;
        }

    }
    return null;
}

exports.ClearCookie = function (res, Name) {
    var Options = new CookiesOptions();
    res.clearCookie(Name, Options);
}
