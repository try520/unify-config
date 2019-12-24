/**
 * Created with JetBrains WebStorm.
 * User: tianling
 * Date: 13-9-24
 * Time: 下午2:15
 * To change this template use File | Settings | File Templates.
 */
/**
 * 验证字符串是否包含非法字符
 * @param str 要验证的字符串
 * @returns {boolean}
 * @constructor
 */
exports.CheckStr = function ( str ) {
    if ( /[\'\"\\\<\>\&\$\*\+\=\%\?\@\#\^\(\)]/.test ( str ) ) {
        return false;
    }
    return true;
}

/**
 * 验证字符串变量是为空
 * @param str
 * @returns {boolean}
 * @constructor
 */
exports.CheckNull = function ( str ) {
    if ( str.trim() == "" ) {
        return false;
    }
    return true;
}

/**
 * 判断字符串是否为数字
 * @param str
 * @returns {boolean}
 * @constructor
 */
exports.IsNum = function ( str ) {
    if ( isNaN ( str ) ) {
        return false;
    }
    return true;
}

/**
 * 获取字符串长度
 * @param str
 * @returns {Number}
 * @constructor
 */
exports.GetLen = function ( str ) {
    var unLen = str.replace ( /[^\x00-\xff]/g , "**" ).length;
    return unLen;
}

/**
 * 获取中文字符串长度
 * @param value
 * @returns {number}
 * @constructor
 */
exports.GetLen_China = function ( value ) {
    var length = value.length;
    var China_Length = 0;
    for ( var i = 0 ; i < value.length ; i ++ ) {
        if ( value.charCodeAt ( i ) > 127 ) {
            China_Length ++;
        }
    }
    return China_Length;
}



/**
 * 判断Email格式是否合法
 * @param str
 * @returns {boolean}
 * @constructor
 */
exports.CheckEmail = function ( str ) {
    var reEml = /^[\w\-\.]+@[a-z0-9]+(\-[a-z0-9]+)?(\.[a-z0-9]+(\-[a-z0-9]+)?)*\.[a-z]{2,4}$/i;
    var isOk = reEml.test ( str );
    if ( isOk == false ) {
        return false;
    }
    return true;
}