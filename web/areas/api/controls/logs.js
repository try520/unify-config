module.exports = class extends baseController {
    constructor(){
        super();
        this.logsLogic=this.loadLogic("logs");
        this.router.post('/add', this.add.bind(this));
        return this.router;
    }

    static init() {
        return new this();
    }

    /**
     *
     * @api {post} api/logs/add 提交log日志
     * @apiDescription 此方式为restFul提交，不建议使用，正式环境中请使用mqtt方式提交，topic：logs/[appCode]/[level],qos:0,消息体，见下面的参数部分
     * @apiVersion 1.0.0
     * @apiName add
     * @apiGroup logs
     * @apiParam {String} appCode 设备编码
     * @apiParam {String} level 等级  debug < info < warn < error < fatal < mark
     * @apiParam {String} content 内容
     *
     * @apiSuccessExample mqtt message body:
     *
     *     {
     *       "appCode":"app标识",
     *       "level":"日志等级",
     *       "content":"日志内容"
     *     }
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       Result:1
     *     }
     *
     *
     */
    async add(req, res) {
        let Result = {};
        try {
            let model={
                appCode :req.params.appCode || req.body.appCode || "",
                level : req.params.level || req.body.level || "debug",
                content : req.body.content || ""
            }
            let ret = await this.logsLogic.add(model);
            Result = this.Success(1,ret);
        } catch (err) {
            Result = this.Error("提交失败",JSON.stringify(err.message));
        }
        res.json(Result);
    }
}