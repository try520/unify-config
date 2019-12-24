const base=require('../base');
module.exports=class extends base{
    constructor(){
   
        global.Config.clickHouse.dbName="static_res"
        super(global.Config.clickHouse);
    }
};
