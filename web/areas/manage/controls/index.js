
        module.exports = class extends baseController {
            constructor() {
                super();
                this.router.get('/', this.login.bind(this));
                this.router.post('/doLogin', this.doLogin.bind(this));
                this.router.get('/loginOut', this.loginOut.bind(this));
                this.router.all('/getFrontWebConfig',this.getFrontWebConfig.bind(this));
                return this.router;
            }
        
            static init() {
                return new this();
            }

            /**
             * 获取前端配置信息
             * @param req
             * @param res
             * @param next
             */
            getFrontWebConfig(req,res,next){
                let Result={};
                try{
                    let frontWebConfig=Config.frontWebConfig;
                    Result=this.Success(1,frontWebConfig);
                }catch (e) {
                    Result=this.Error("获取失败",e.message);
                }
                res.json(Result);
            }

            login(req,res,next){
                try {
                    let viewData={}
                    let tmp = require('../views/index/login.marko');
                    tmp.render(viewData, res);

                } catch (err) {
                    next(err);
                }
            }

            doLogin(req,res,next){
                try{
                    let viewData={}
                    let tmp = require('../views/index/login.marko');
                    let userName=req.body.username || "";
                    let pwd=req.body.password || "";
                    if(userName=="" || pwd==""){
                        viewData.errInfo="账号和密码不能为空";
                    }else{
                        if(userName==Config.manage.username && pwd==Config.manage.pwd){
                            req.session.isLogin=true;
                            res.redirect('/manage/config/index');
                        }else{
                            viewData.errInfo="账号或密码错误"
                        }
                    }

                    tmp.render(viewData, res);

                }catch(err){
                    next(err);
                }
            }

            loginOut(req,res,next){
                try {
                    req.session.isLogin=null;
                    res.redirect('/manage');
        
                } catch (err) {
                    next(err);
                }
            }
        };
        