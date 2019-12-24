/**
 * Created with JetBrains WebStorm.
 * User: tianling
 * Date: 13-9-24
 * Time: 下午2:25
 * To change this template use File | Settings | File Templates.
 */

exports.Now = function () {
    var now = new Date();
    return DateToFullDateTimeString(now);
}

/**
 * 获取某年的某个月有几天
 * @param year
 * @param month
 * @returns {number}
 */
var getDaysInOneMonth = function(year, month){
    month = parseInt(month, 10);
    var d= new Date(year, month, 0);
    return d.getDate();
}
exports.getDaysInOneMonth=getDaysInOneMonth;

/**
 * 将ISO时间转换为长时间字符串 格式为：（yyyy-MM-dd hh:mm:ss）
 * @param date
 * @returns {string}
 * @constructor
 */
var DateToFullDateTimeString = function (date) {

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    var datestr;

    if (month <= 9) {
        month = '0' + (month + 1);
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }

    datestr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return datestr;
}


exports.DateToFullDateTimeString = DateToFullDateTimeString;


var DateToShortDate = function (date) {
    var type1 = typeof date;
    if (type1 == 'string')
        date = stringToDate(date);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var datestr;
    month += 1;
    if (month <= 9) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    datestr = year + "-" + month + '-' + day;
    return datestr;
}
exports.DateToShortDate = DateToShortDate;


var DateToShortDate_month = function (date) {
    var type1 = typeof date;
    if (type1 == 'string')
        date = stringToDate(date);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var datestr;
    month += 1;
    if (month <= 9) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    datestr = month + '-' + day;
    return datestr;
}
exports.DateToShortDate_month = DateToShortDate_month;

var DateToShortDate_year = function (date) {
    var type1 = typeof date;
    if (type1 == 'string')
        date = stringToDate(date);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var datestr;
    month += 1;
    if (month <= 9) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    datestr = year + "-" + month ;
    return datestr;
}
exports.DateToShortDate_year = DateToShortDate_year;

/**
 * 将ISO时间转换为短时间字符串 格式为：（MM-dd hh:mm）
 * @param date
 * @returns {string}
 * @constructor
 */
var DateToShortDateTimeString = function (date) {

    var type1 = typeof date;
    if (type1 == 'string')
        date = stringToDate(date);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    var datestr;

    if (month <= 9) {
        month = '0' + (month + 1);
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }

    datestr = month + '-' + day + ' ' + hour + ':' + minute;
    return datestr;
}
exports.DateToShortDateTimeString = DateToShortDateTimeString;
/**
 * 时间相减
 * @param  date1  时间1 可以为Date或String
 * @param  date2  时间2 可以为Date或String
 * @returns {number}  结果是秒
 */
var dateDiff = function (date1, date2) {
    var type1 = typeof date1, type2 = typeof date2;
    if (type1 == 'string')
        date1 = stringToTime(date1);
    else if (date1.getTime)
        date1 = date1.getTime();
    if (type2 == 'string')
        date2 = stringToTime(date2);
    else if (date2.getTime)
        date2 = date2.getTime();
    return (date1 - date2) / 1000;//结果是秒
}
exports.dateDiff  =  dateDiff;

/**
 * 将字符串转换为时间
 * @param {String} string
 * @returns {number}
 */
var stringToTime = function (string) {
    var f = string.split(' ', 2);
    var d = (f[0] ? f[0] : '').split('-', 3);
    var t = (f[1] ? f[1] : '').split(':', 3);
    return (new Date(
        parseInt(d[0], 10) || null,
        (parseInt(d[1], 10) || 1) - 1,
        parseInt(d[2], 10) || null,
        parseInt(t[0], 10) || null,
        parseInt(t[1], 10) || null,
        parseInt(t[2], 10) || null
    )).getTime();
}

/**
 * 将字符串转换为时间
 * @param {String} string
 * @returns {number}
 */
exports.stringToTime = stringToTime;
/**
 * 将字符串转换为日期
 * @param string
 * @returns {Date}
 */
var stringToDate = function (string) {
    var f = string.split(' ', 2);
    var d = (f[0] ? f[0] : '').split('-', 3);
    var t = (f[1] ? f[1] : '').split(':', 3);
    return new Date(
        parseInt(d[0], 10) || null,
        (parseInt(d[1], 10) || 1) - 1,
        parseInt(d[2], 10) || null,
        parseInt(t[0], 10) || null,
        parseInt(t[1], 10) || null,
        parseInt(t[2], 10) || null
    );

}
exports.stringToDate = stringToDate;
/**
 * 格式化时间为（几天前，几分钟前，几小时前）
 * @param {Date} time
 * @returns {String}
 * @constructor
 */
exports.FormatData = function (time) {
    var now = new Date();
    var SpanS = parseInt(dateDiff(now, time));
    var SpanM = parseInt(SpanS / 60);//分钟
    if (SpanM < 60) {
        return SpanM + "分钟前";
    }
    var SpanH = parseInt(SpanM / 60);
    if (SpanH < 24) {
        return SpanH + "小时前";
    }
    var SpanD = parseInt(SpanH / 24);
    if (SpanD < 14) {
        return SpanD + "天前";
    }

    var SpanW = parseInt(SpanD / 7);
    if (SpanW < 4) {
        return SpanW + "周前";
    }
    return DateToShortDateTimeString(time);
}

/**
 * 根据时间获取时间戳
 * @param DateTime
 * @returns {number}
 * @constructor
 */
var GetTimestamp = function (DateTime) {
    return Math.round(DateTime.getTime() / 1000);
}
exports.GetTimestamp = GetTimestamp;
/**
 * 根据时间戳获取时间
 * @param Timestamp
 * @returns {string}
 * @constructor
 */
exports.GetDateTimeByTimestamp = function (Timestamp) {
    var UTCTime = new Date(Timestamp * 1000);
    var reYear = UTCTime.getFullYear();
    var reMonth = (UTCTime.getMonth() + 1);
    reMonth = Number(reMonth) < 10 ? "0" + reMonth : reMonth;
    var reDate = UTCTime.getDate();
    reDate = Number(reDate) < 10 ? "0" + reDate : reDate;
    var reHour = UTCTime.getHours();
    reHour = Number(reHour) < 10 ? "0" + reHour : reHour;
    var reMinute = UTCTime.getMinutes();
    reMinute = Number(reMinute) < 10 ? "0" + reMinute : reMinute;
    var reSecond = UTCTime.getSeconds();
    reSecond = Number(reSecond) < 10 ? "0" + reSecond : reSecond;
    var RealTime = reYear + "-" + reMonth + "-" + reDate + " " + reHour + ":" + reMinute + ":" + reSecond;
    return RealTime;
}

/**
 * 添加 cruij
 * 根据时间戳获取日期 - 无时间
 * @param Timestamp
 * @returns {string}
 * @constructor
 */
exports.GetDateByTimestamp = function (Timestamp) {
    var UTCTime = new Date(Timestamp * 1000);
    var reYear = UTCTime.getFullYear();
    var reMonth = (UTCTime.getMonth() + 1);
    reMonth = Number(reMonth) < 10 ? "0" + reMonth : reMonth;
    var reDate = UTCTime.getDate();
    reDate = Number(reDate) < 10 ? "0" + reDate : reDate;

    var RealTime = reYear + "-" + reMonth + "-" + reDate ;
    return RealTime;
}

/**Javascript设置要保留的小数位数，四舍五入。
 *   @param {number} Dight  Dight要格式化的 数字
 *   @param  {number} How  How要保留的小数位数
 * @returns  {number}
 * @constructor
 */
exports.ForDight = function (Dight, How) {
    Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);
    return Dight;
}


/**
 *    本周日期对象
 */
exports.GetCurWeekDateObj=function(){
    var DateObj={};
    DateObj.BeginTime="";
    DateObj.BeginTimeStamp="";
    DateObj.EndTime="";
    DateObj.EndTimeStamp="";
    DateObj.AllDate=[];
    DateObj.AllDateStamp=[];
    DateObj.X_Label=[];
    var currentDate=new Date();
    var idendity=currentDate.getDay();//返回值0-6 ,分别表示这个礼拜的星期日到星期六
    if(idendity==0){
        idendity=7;
    }

    var firstDay= new Date(currentDate.getFullYear(),currentDate.getMonth(),Number(currentDate.getDate())-Number(idendity-1));
    for(var i=0;i<7;i++){
        //然后在星期一的基础上得到其他星期
        var day=DateToShortDate( new Date(firstDay.getFullYear(),firstDay.getMonth(),firstDay.getDate() + i));
        var TimeStamp=GetTimestamp(stringToDate(day));
        DateObj.AllDate.push(day);
        DateObj.X_Label.push(day);
        DateObj.AllDateStamp.push(TimeStamp);
    }

    DateObj.BeginTime=DateObj.AllDate[0];
    DateObj.EndTime=DateObj.AllDate[6];
    DateObj.BeginTimeStamp=DateObj.AllDateStamp[0];
    DateObj.EndTimeStamp=DateObj.AllDateStamp[6];
    return   DateObj;
}

/**
 * 本月日期对象
 * @returns {{}}
 * @constructor
 */
exports.GetCurMonthDateObj=function(){
    var DateObj={};
    DateObj.BeginTime="";
    DateObj.BeginTimeStamp="";
    DateObj.EndTime="";
    DateObj.EndTimeStamp="";
    DateObj.AllDate=[];
    DateObj.AllDateStamp=[];
    DateObj.X_Label=[];
    var currentDate=new Date();
    var CurMonth=currentDate.getMonth() + 1;

    var firstDay= new Date(currentDate.getFullYear(),currentDate.getMonth(),1);

    for(var i=0;i<32;i++){
        //然后在1号的基础上得到其他日期
        var day=  new Date(firstDay.getFullYear(),firstDay.getMonth(),firstDay.getDate() + i);
        var daystr=DateToShortDate( day);
        var daystr2=DateToShortDate_month( day);
        var TimeStamp=GetTimestamp(stringToDate(daystr));
        if(day.getMonth()+1 !=CurMonth){
            break;
        }
        DateObj.AllDate.push(daystr);
        DateObj.X_Label.push(daystr2.split("-")[1]+"日");
        DateObj.AllDateStamp.push(TimeStamp);
    }

    DateObj.BeginTime=DateObj.AllDate[0];
    DateObj.EndTime=DateObj.AllDate[DateObj.AllDate.length - 1];
    DateObj.BeginTimeStamp=DateObj.AllDateStamp[0];
    DateObj.EndTimeStamp=DateObj.AllDateStamp[DateObj.AllDateStamp.length - 1];
    return   DateObj;
}

/**
 * 本年日期对象
 * @returns {{}}
 * @constructor
 */
exports.GetCurYearDateObj=function(){
    var DateObj={};
    DateObj.BeginTime="";
    DateObj.BeginTimeStamp="";
    DateObj.EndTime="";
    DateObj.EndTimeStamp="";
    DateObj.AllDate=[];
    DateObj.AllDateStamp=[];
    DateObj.X_Label=[];
    var currentDate=new Date();
    var CurYear= currentDate.getFullYear();
    var firstDay= new Date(currentDate.getFullYear(),0,1);
    for(var i=0;i<12;i++){
        //然后在1号的基础上得到其他日期
        var day=null;
        if(i==11){
            day=  new Date(firstDay.getFullYear(),firstDay.getMonth() + i,31,23,59,59);
        }else{
            day=  new Date(firstDay.getFullYear(),firstDay.getMonth() + i,1);
        }
        var daystr=DateToShortDate( day);
        var daystr2=DateToShortDate_year( day);

        var TimeStamp=GetTimestamp(stringToDate(daystr));
        DateObj.AllDate.push(daystr2);
        DateObj.X_Label.push(daystr2);
        DateObj.AllDateStamp.push(TimeStamp);

        if(i==0){
            DateObj.BeginTime=daystr;
        }
        if(i==11){
            DateObj.EndTime=daystr;
        }
    }



    DateObj.BeginTimeStamp=DateObj.AllDateStamp[0];
    DateObj.EndTimeStamp=DateObj.AllDateStamp[DateObj.AllDateStamp.length - 1];
    console.log(DateObj);
    return   DateObj;
}

/**
 * 最近几天的日期对象
 * @param daycount
 * @returns {{}}
 * @constructor
 */
exports.GetDayDataObj=function(daycount){
    var DateObj={};
    DateObj.BeginTime="";
    DateObj.BeginTimeStamp="";
    DateObj.EndTime="";
    DateObj.EndTimeStamp="";
    DateObj.AllDate=[];
    DateObj.AllDateStamp=[];
    DateObj.X_Label=[];
    var currentDate=new Date();
    var CurMonth=currentDate.getMonth() + 1;

    var firstDay= new Date(currentDate.getFullYear(),currentDate.getMonth(),Number(currentDate.getDate())-daycount);

    for(var i=1;i<=daycount;i++){
        //然后在1号的基础上得到其他日期
        var day=  new Date(firstDay.getFullYear(),firstDay.getMonth(),firstDay.getDate() + i);
        var daystr=DateToShortDate( day);
        var daystr2="";
        if(daycount<12){
            daystr2=DateToShortDate( day);
        }else{
            daystr2=DateToShortDate_month( day);
        }
        var TimeStamp=GetTimestamp(stringToDate(daystr));

        DateObj.AllDate.push(daystr);
        DateObj.X_Label.push(daystr2);
        DateObj.AllDateStamp.push(TimeStamp);
    }

    DateObj.BeginTime=DateObj.AllDate[0];
    DateObj.EndTime=DateObj.AllDate[DateObj.AllDate.length - 1];
    DateObj.BeginTimeStamp=DateObj.AllDateStamp[0];
    DateObj.EndTimeStamp=DateObj.AllDateStamp[DateObj.AllDateStamp.length - 1];
    return   DateObj;
}

/**
 *   由用户选择统计类型 自定义时间段统计
 * @param BeginTime
 * @param EndTime
 * @returns {{}}
 * @constructor
 */
exports.GetDayDataObj_Costom=function(BeginTime ,EndTime , Xtype){
    var DateObj={};
    DateObj.BeginTime=BeginTime;
    DateObj.BeginTimeStamp=GetTimestamp(stringToDate(DateObj.BeginTime));
    DateObj.EndTime=EndTime;
    DateObj.EndTimeStamp=GetTimestamp(stringToDate(DateObj.EndTime));
    DateObj.AllDate=[];
    DateObj.AllDateStamp=[];
    DateObj.X_Label=[];
    var firstDay=stringToDate(DateObj.BeginTime);
    var EndDay= stringToDate(DateObj.EndTime);
    var dateDiff_v=dateDiff(DateObj.EndTime , DateObj.BeginTime); //相差的秒数
    var daycount=  dateDiff_v/(3600 * 24);  //相差的天数
    DateObj.DayCount=daycount;
    var monthCount=  Math.ceil(daycount / 31);
    DateObj.MonthCount=monthCount;
    if(Xtype=="day"){
        for(var i=0;i<=daycount;i++){
            //然后在1号的基础上得到其他日期
            var day=  new Date(firstDay.getFullYear(),firstDay.getMonth(),firstDay.getDate() + i);
            var daystr=DateToShortDate(day);
            var daystr2="";
            if(daycount<12){
                daystr2=DateToShortDate(day);
            }else{
                daystr2=DateToShortDate_month(day);
            }
            var TimeStamp=GetTimestamp(stringToDate(daystr));

            DateObj.AllDate.push(daystr);
            DateObj.X_Label.push(daystr2);
            DateObj.AllDateStamp.push(TimeStamp);
        }
    }


    if( Xtype=="month"){
        if(monthCount==1){
            var day_b=  new Date(firstDay.getFullYear(),firstDay.getMonth(),1);
            DateObj.BeginTime=DateToShortDate( day_b);
            DateObj.BeginTimeStamp=GetTimestamp(stringToDate(DateObj.BeginTime));
            var CurDays=getDaysInOneMonth(day_b.getFullYear() , day_b.getMonth() + 1);
            var day_e= new Date(day_b.getFullYear(),day_b.getMonth() ,CurDays ,23,59,59);
            DateObj.EndTime=DateToShortDate( day_e);;
            DateObj.EndTimeStamp=GetTimestamp(stringToDate(DateObj.EndTime));
            var daystr2=DateToShortDate_year( day_b);
            DateObj.AllDate.push(daystr2);
            DateObj.X_Label.push(daystr2);
        }else{
            for(var i=0;i<monthCount;i++){
                //然后在1号的基础上得到其他日期
                var day=null;
                if(i>0 && i==monthCount - 1){
                    day=  new Date(firstDay.getFullYear(),firstDay.getMonth() + i,1);
                    var CurDays=getDaysInOneMonth(day.getFullYear() , day.getMonth() + 1);
                    day= new Date(day.getFullYear(),day.getMonth() ,CurDays ,23,59,59);
                }else{
                    day=  new Date(firstDay.getFullYear(),firstDay.getMonth()+i , 1);
                }
                var daystr=DateToShortDate( day);
                var daystr2=DateToShortDate_year( day);
                var TimeStamp=GetTimestamp(stringToDate(daystr));
                DateObj.AllDate.push(daystr2);
                DateObj.X_Label.push(daystr2);
                DateObj.AllDateStamp.push(TimeStamp);
            }
            DateObj.BeginTime=DateObj.AllDate[0];
            DateObj.EndTime=DateObj.AllDate[DateObj.AllDate.length - 1];
            DateObj.BeginTimeStamp=DateObj.AllDateStamp[0];
            DateObj.EndTimeStamp=DateObj.AllDateStamp[DateObj.AllDateStamp.length - 1];

        }


    }


    return   DateObj;
}

/** （没用了）
 * 根据天数智能判断采用日报还是月报
 * @param BeginTime
 * @param EndTime
 * @returns {{}}
 * @constructor
 */
exports.GetDayDataObj_Costom2=function(BeginTime ,EndTime){
    var DateObj={};
    DateObj.BeginTime=BeginTime;
    DateObj.BeginTimeStamp=GetTimestamp(stringToDate(DateObj.BeginTime));
    DateObj.EndTime=EndTime;
    DateObj.EndTimeStamp=GetTimestamp(stringToDate(DateObj.EndTime));
    DateObj.AllDate=[];
    DateObj.AllDateStamp=[];
    DateObj.X_Label=[];
    var firstDay=stringToDate(DateObj.BeginTime);
    var EndDay= stringToDate(DateObj.EndTime);
    var dateDiff=dateDiff(DateObj.EndTime , DateObj.BeginTime); //相差的秒数
    var daycount=  dateDiff/(3600 * 24);  //相差的天数
    DateObj.DayCount=daycount;
    var monthCount=  Math.ceil(daycount / 31);
    DateObj.MonthCount=monthCount;
    if(daycount<=59){
        DateObj.Xtype="day";
        for(var i=0;i<=daycount;i++){
            //然后在1号的基础上得到其他日期
            var day=  new Date(firstDay.getFullYear(),firstDay.getMonth(),firstDay.getDate() + i);
            var daystr=DateToShortDate(day);
            var daystr2="";
            if(daycount<12){
                daystr2=DateToShortDate(day);
            }else{
                daystr2=DateToShortDate_month(day);
            }
            var TimeStamp=GetTimestamp(stringToDate(daystr));

            DateObj.AllDate.push(daystr);
            DateObj.X_Label.push(daystr2);
            DateObj.AllDateStamp.push(TimeStamp);
        }
    }

    if(daycount>59){
        DateObj.Xtype="month";
        for(var i=0;i<monthCount;i++){
            //然后在1号的基础上得到其他日期
            var day=null;
            if(i>0 && i==monthCount - 1){
                day= EndDay;
            }else{
                if(i==0){
                    day=  firstDay;
                }else{
                    day=  new Date(firstDay.getFullYear(),firstDay.getMonth()+i , 1);
                }

            }
            var daystr=DateToShortDate( day);
            var daystr2=DateToShortDate_year( day);
            if(i==0 || i== monthCount - 1){
                DateObj.X_Label.push(daystr);
            }else{
                DateObj.X_Label.push(daystr2);
            }


            var TimeStamp=GetTimestamp(stringToDate(daystr));
            DateObj.AllDate.push(daystr2);

            DateObj.AllDateStamp.push(TimeStamp);
        }
    }


    return   DateObj;
}