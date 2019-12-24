

var manage=require('./web/manage');
module.exports=function(IO){
    manage.CreateSocket(IO);
}