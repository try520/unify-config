module.exports = class extends baseRouter {
    constructor() {
        super();
        this.config = require("../../config");
        this.nameSpace = '/base';
    }

    static init() {
        return new this();
    }
    GetRouter(app) {
        //接口跨域访问支持
        //=======跨域支持=======
        app.use(this.nameSpace, function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Credentials', true); //告诉客户端可以在HTTP请求中带上Cookie
            res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
            if (req.method === 'OPTIONS') {
                res.send(200);
            } else {
                next();
            }
        });
        //=======自动路由==按照目录结构进行路由=======
        this.autoUserRouter(this.nameSpace, app, __dirname + "/controls");
        //======= 自动路由 之后=========
        app.use(this.nameSpace, function (req, res) {
            var CB = {
                Result: 0,
                Msg: '404 page no find'
            };
            res.json(CB);
        });
    }
}