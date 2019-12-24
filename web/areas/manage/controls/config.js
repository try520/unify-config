var multiparty = require("multiparty");
module.exports = class extends baseController {
    constructor() {
        super();
        this.configLogic = this.loadLogic("config");
        this.router.get('/index', this.index.bind(this));
        this.router.get('/appInfo', this.appInfo.bind(this));
        this.router.get('/importOrExport', this.importOrExport.bind(this));
        this.router.post('/recovery', this.recovery.bind(this));
        this.router.get("/exportConfig", this.exportConfig.bind(this));
        this.router.post('/doAppEdit', this.doAppEdit.bind(this));
        this.router.post('/doCheckAppCode', this.doCheckAppCode.bind(this));
        this.router.post('/delApp', this.delApp.bind(this));
        this.router.post("/doEditAppConfig", this.doEditAppConfig.bind(this));
        this.router.post("/doDelAppConfig", this.doDelAppConfig.bind(this));
        this.router.post("/docheckConfigEnv",this.docheckConfigEnv.bind(this));
        return this.router;
    }

    static init() {
        return new this();
    }

    /**
     * 统一配置模块-首页
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async index(req, res, next) {
        try {
            let viewData = {};
            let tmp = require('../views/config/index.marko');
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
    async appInfo(req, res, next) {
        try {
            let viewData = {
                host: req.headers.host
            };
            let tmp = require('../views/config/app-info.marko');
            let appId = req.query.id || '';
            if (appId !== '') {
                viewData.appInfo = await this.configLogic.getAppInfo(appId);
                if (viewData.appInfo) {
                    viewData.configItems = await this.configLogic.getAppConfigByAppCode(viewData.appInfo.app_code);
                }
            }
            let data = {
                viewData: viewData
            };
            tmp.render(data, res);

        } catch (err) {
            next(err);
        }
    }

    async importOrExport(req, res, next) {
        try {
            let viewData = {};
            let tmp = require('../views/config/import-or-export.marko');
            let data = {
                viewData: viewData
            };
            tmp.render(data, res);

        } catch (err) {
            next(err);
        }
    }

    async doCheckAppCode(req, res, next) {
        let Result = {};
        try {
            let appCode = req.body.appCode || '';
            let appId = req.body.appId || '';
            let count = await this.configLogic.checkAppCode(appCode, appId);
            if (count == 0) {
                Result = this.Success(1);
            } else {
                Result = this.Success(0);
            }
        } catch (err) {
            Result = this.Error("查询失败", err);
        }
        res.json(Result);
    }

    async docheckConfigEnv(req, res, next) {
        let Result = {};
        try {
            let ac_appCode=req.body.ac_appCode || '';
            let ac_id = req.body.ac_id || '';
            let ac_env = req.body.ac_env || '';
            let count = await this.configLogic.checkConfigEnv(ac_appCode,ac_id, ac_env);
            if (count == 0) {
                Result = this.Success(1);
            } else {
                Result = this.Success(0);
            }
        } catch (err) {
            Result = this.Error("查询失败", err);
        }
        res.json(Result);
    }



    async doAppEdit(req, res, next) {
        let Result = {};
        try {

            let _model = {
                app_id: req.body.app_id || '',
                app_name: req.body.app_name || '',
                app_code: req.body.app_code || '',
                app_label: req.body.app_label || '',
                app_order: req.body.app_order || 0,
                app_configDev: req.body.app_configDev || '',
                app_configProd: req.body.app_configProd || '',
                app_configMico: req.body.app_configMico || '',
                app_configFront: req.body.app_configFront || '',
            };
            let model = await this.configLogic.insertOrUpdateApp(_model);
            if (model) {
                Result = this.Success(1, model);
            } else {
                Result = this.Error("记录不存在，修改失败");
            }

        } catch (err) {
            Result = this.Error("保存错误", err);
        }
        res.json(Result);
    }

    async delApp(req, res, next) {
        let Result = {};
        try {
            let appId = req.body.id || '';
            await this.configLogic.delApp([appId]);
            Result = this.Success(1);
        } catch (err) {
            Result = this.Error("保存错误", err);
        }
        res.json(Result);
    }

    /**
     * 恢复数据
     * @param {*} req
     * @param {*} res
     */
    async recovery(req, res) {
        let config = require('../../base/upload-handler/config');
        let fs = require("fs");
        let form = new multiparty.Form({
            maxFilesSize: config.fileMaxSize,
            uploadDir: req.app.get("RootPath") + '/www/res/upload-temp'
        });
        form.parse(req, async (err, fields, files) => {
            let Result = {};
            try {
                if (err) {
                    switch (err.ETOOBIG) {
                        case 'ETOOBIG':
                            Result = this.Error("文件大小超过限制", err);
                            break;
                        default:
                            Result = this.Error("未知错误", err);
                            break;
                    }
                } else {
                    if (files[config.fileFieldName]) {
                        let file = files[config.fileFieldName][0];
                        if (file) {
                            let content = fs.readFileSync(file.path);
                            let jsonData = JSON.parse(content);
                            await this.staticRes.app.Access.destroy({
                                where: {
                                    app_id: {
                                        '$ne': ''
                                    }
                                }
                            });
                            await this.staticRes.app_config.Access.destroy({
                                where: {
                                    ac_id: {
                                        '$ne': ''
                                    }
                                }
                            });
                            await this.staticRes.app.Access.bulkCreate(jsonData.app); //批量插入
                            await this.staticRes.app_config.Access.bulkCreate(jsonData.appConfig); //批量插入
                            Result = this.Success(1);


                        } else {
                            Result = this.Error("没有提交文件");
                        }
                    } else {
                        Result = this.Error("文件存储域错误，文件存储域为->" + config.fileFieldName);
                    }

                }
            } catch (err) {
                Result = this.Error("上传失败", err);
            }
            res.json(Result);
        })
    };

    async exportConfig(req, res, next) {
        try {
            let content = {};
            content.app = await this.staticRes.app.Access.findAll({
                raw: true
            });
            content.appConfig = await this.staticRes.app_config.Access.findAll({
                raw: true
            });
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename=appItems.json',
                'Content-Length': JSON.stringify(content).length
            });
            res.send(content);
        } catch (err) {
            next(err);
        }
    }

    async doEditAppConfig(req, res) {
        let Result = {};
        try {
            let _model = {
                ac_id: req.body.ac_id || '',
                ac_appCode: req.body.ac_appCode || '',
                ac_name: req.body.ac_name || '',
                ac_env: req.body.ac_env || '',
                ac_config: req.body.ac_config || ''
            };
            let model = await this.configLogic.insertOrUpdateAppConfig(_model);
            if (model) {
                Result = this.Success(1, model);
            } else {
                Result = this.Error("记录不存在，修改失败");
            }
        } catch (e) {
            Result = this.Error(e.message, e);
        }
        return res.json(Result);
    }

    async doDelAppConfig(req, res) {
        let Result = {};
        try {
            let appId = req.body.id || '';
            await this.configLogic.delAppConfig([appId]);
            Result = this.Success(1);
        } catch (err) {
            Result = this.Error("保存错误", err);
        }
        res.json(Result);
    }


};
