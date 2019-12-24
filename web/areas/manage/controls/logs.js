module.exports = class extends baseController {
    constructor() {
        super();
        this.configLogic = this.loadLogic("config");
        this.logsLogic = this.loadLogic("logs");
        this.router.get('/index', this.index.bind(this));
        this.router.get('/logInfo',this.logInfo.bind(this));
        this.router.post('/getLogs',this.getLogs.bind(this));
        return this.router;
    }

    static init() {
        return new this();
    }

    async index(req, res, next) {
        try {
            let viewData = {};
            let tmp = require('../views/logs/index.marko');
            let appLabels = await this.configLogic.getAppLabels();
            viewData.appItems = await this.configLogic.getAppItems();
            viewData.appLabels = [];
            for (let i = 0; i < appLabels.length; i++) {
                viewData.appLabels.push(appLabels[i].app_label);
            }
            let data = {
                viewData: viewData
            };
            tmp.render(data, res);

        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    /**
     * 统一配置模块-编辑App页面
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async logInfo(req, res, next) {
        try {
            let viewData = {};
            let tmp = require('../views/logs/log-info.marko');
            let params={
                appId:req.query.appId || "",
            };
            let appInfo=await this.configLogic.getAppInfo(params.appId);

            let data = {
                viewData: viewData,
                appInfo:appInfo
            };
            tmp.render(data, res);

        } catch (err) {
            next(err);
        }
    }

    /**
     * 统一配置模块-编辑App页面
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async getLogs(req, res, next) {
        let Result = {};
        try {
            let params={
                curPage:Number(req.body.curPage) || 1,
                pageSize:Number(req.body.pageSize) || 50,
                appId:req.body.appId || '',
                appCode:req.body.appCode || '',
                level:req.body.level || '',
                beginTime:req.body.beginTime || moment().format("YYYY-MM-DD 00:00:00"),
                endTime:req.body.endTime || moment().format("YYYY-MM-DD 23:59:59")
            };
            let logItems = await this.logsLogic.getLogs(params.curPage,params.pageSize,params.appCode,params.level,params.beginTime,params.endTime);
            Result = this.Success(1, logItems);


        } catch (err) {
            Result = this.Error('获取失败', err);
        }
        res.json(Result);
    }
}