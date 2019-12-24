const database=require('../database');
module.exports=class extends database{
    constructor(){
        super();
        this.moment=require('moment');
        this.tableName='app_log';
    }

    static init(){
        return new this();
    }

    get fields(){
        return {
           column:{
            date:{ type:'Date',default:this.moment().format('YYYY-MM-DD')},
            appCode:{ type:'String',isPrimary:true},
            logLevel:{type:'String',default:"DEBUG",isPrimary:true},
            content:{type:'String',default:""},
            createTime:{type:'DateTime',isPrimary:true,default:this.moment().format('YYYY-MM-DD HH:mm:ss')}
           },
           engine:'MergeTree',
           partition:'toDate(createTime)'
        };
    };



};
