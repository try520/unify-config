module.exports = class extends baseRouter {
    constructor() {
        super();
        this.nameSpace = '/manage';
        this.UrlList = ['/', '/doLogin']; //白名单
    }

    static init() {
        return new this();
    }
    GetRouter(app) {
        let self = this;
        //=======登录鉴权=======
        app.use(this.nameSpace, (req, res, next) => {
            let isPass = false;

            this.UrlList.forEach((item) => {
                if (item.toLocaleLowerCase() === req.path.toLocaleLowerCase()) {
                    isPass = true;
                }
            });
            if(isPass){
                next();
            }else{
                if (!req.session.isLogin) {
                    res.redirect('/manage');
                }else{
                    next();
                }
            }


        });
        //=======自动路由==按照目录结构进行路由=======
        this.autoUserRouter(this.nameSpace, app, __dirname + "/controls");
        //======= 自动路由 之后=========
        app.use(this.nameSpace, (req, res, next) => {
            let msg = "404 page no find. router.js -> this.nameSpace = " + this.nameSpace + ", url wrong";
            if (req.xhr) {
                var CB = {
                    Result: 0,
                    Msg: msg
                };
                res.json(CB);
            } else {
                let err = new Error(msg);
                err.status = 404;
                next(err);
            }

        });
    }
}