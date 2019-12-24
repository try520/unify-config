/**
 * Created by tianling on 2016/11/24.
 */

module.exports=function (req) {

    var pageModel={
        user:req.user,
        devPath:req.app.locals.devPath,
        PageData:{}
    }
    return pageModel;
}