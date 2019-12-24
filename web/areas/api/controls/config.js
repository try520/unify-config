module.exports = class extends baseController {
    constructor() {
        super();
        this.configLogic = this.loadLogic("config");
        this.router.post('/getAppInfo', this.getAppInfo.bind(this));
        this.router.post('/getConfig', this.getConfig.bind(this));
        this.router.all('/:appCode/:env', this.getConfig.bind(this));
        return this.router;
    }

    static init() {
        return new this();
    }

    /**
     *
     * @api {post} api/config/getConfig 获取应用的配置信息 
     * @apiDescription 支持 http://xxxxx/api/config/:appCode/:env 进行get获取
     * @apiVersion 1.0.0
     * @apiName getConfig
     * @apiGroup Config
     * @apiParam {String} appCode 设备编码
     * @apiParam {String} env 环境 (dev:开发环境,prod:生产环境,mico:微服务环境) 默认 prod
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       ... //直接返回配置文件字符串 前端配置可直接使用<script>标签引用
     *     }
     *
     *
     */
    async getConfig(req, res) {
        let Result = {};
        try {
            let appCode = req.params.appCode || req.body.appCode || "";
            let env = req.params.env || req.body.env || "prod";
            let ret = await this.configLogic.getAppConfigByappCode(appCode, env);
            Result = eval("("+ret+")");
        } catch (err) {
            Result = JSON.stringify(err.message);
        }
        res.json(Result);
    }

    /**
     *
     * @api {post} api/config/getAppInfo 获取应用的详情
     * @apiVersion 1.0.0
     * @apiName getAppInfo
     * @apiGroup Config
     * @apiParam {String} appCode 设备编码
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "Result": 1,//1:成功，0:失败
     *       "Data": { 
     *       "app_id": "C874DD7E-B870-0001-97CD-2F601CF03870",
     *       "app_name": "一站式综合管理系统",
     *       "app_code": "imp",
     *       "app_label": "应用",
     *       "app_order": 1,
     *       "app_configDev":"",
     *       "app_configProd":"",
     *       "app_configMico":""
     *        }
     *     }
     */
    async getAppInfo(req, res) {
        let Result = {};
        try {
            let appCode = req.body.appCode || "";
            let ret = await this.configLogic.getAppInfoByCode(appCode);
            Result = this.Success(1, ret);
        } catch (err) {
            Result = this.Error('获取失败', err);
        }
        res.json(Result);
    }
};