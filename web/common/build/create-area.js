var fs = require("fs");
var path = require('path');
var params = process.argv.splice(2); //获取命令中带入的参数
var subjectName = params[0]; //项目名称

var createHander = function () {

    var areaSubjectPath = path.resolve(__dirname, '../../areas/' + subjectName);
    var start = function () {
        var isExist = fs.existsSync(areaSubjectPath);
        if (isExist) {
            console.log('区域已经存在');
            return;
        }
        console.log('创建项目目录-' + subjectName);
        fs.mkdirSync(areaSubjectPath);
        console.log('创建控制器目录-' + subjectName + '/controls');
        fs.mkdirSync(areaSubjectPath+'/controls');
        console.log('创建模块引导页-' + subjectName + '/launch.js');
        fs.appendFileSync(areaSubjectPath + '/launch.js',`
        module.exports=new class{
        constructor(){

            }

        };

        `);
        console.log('创建路由控制-' + subjectName + '/router.js');
        let nameSpace="/"+subjectName;
        if(subjectName==='home'){
            nameSpace="/";
        }
        fs.appendFileSync(areaSubjectPath + '/router.js', `
        module.exports = class extends baseRouter{
            constructor() {
                super();
                this.nameSpace = '${nameSpace}';
            }
        
            static init() {
                return new this();
            }
            GetRouter(app) {
                let self=this;
                 //=======自动路由==按照目录结构进行路由=======
                 this.autoUserRouter(this.nameSpace, app, __dirname + "/controls");
                 //======= 自动路由 之后=========
                  app.use(this.nameSpace,  (req, res,next)=> {
                     let msg="404 page no find. router.js -> this.nameSpace = "+this.nameSpace+", url wrong";
                     if(req.xhr){
                         var CB = {
                             Result: 0,
                             Msg:msg
                         };
                         res.json(CB);
                     }else{
                         let err=new Error(msg);
                         err.status=404;
                         next(err);
                     }
                   
                 });
             }
        }
        `);

        console.log('创建控制器实例-' + subjectName + '/controls/demo.js');
        fs.appendFileSync(areaSubjectPath + '/controls/demo.js', `
        module.exports = class extends baseController {
            constructor() {
                super();
                this.router.all('/index', this.index.bind(this));
                return this.router;
            }
        
            static init() {
                return new this();
            }

            index(req,res){
                let ret = this.Success(1,{text:'hello world'});
                res.json(ret);
            }
        };
        `);

    };

    return {
        start:start
    }
};


createHander().start();
module.exports = createHander;
