## AppKey的获取
在使用WebApi接口前，需向监狱管理方申请，数据访问的密钥，该密钥称为AppKey。

联系人：xxx 
电话：xxxxx

----------
## 访问令牌
访问令牌是您获取数据时的鉴权凭证，在通过WebApi获取数据时，需在header中携带您申请到的AppKey和令牌信息。

### 令牌信息的获取方式
接口地址：http://10.9.152.251:30377/center/authorization

请求方法：POST 

请求参数：

| 字段 | 类型 | 描述 
| :----: | :--: | :--: 
|key|String|您申请访问钥匙
----------
#### 返回信息
```json
 {
  "result": {
        "token":"xxxxxxxxx"
    },
"msg": "成功",
"errorno": 0,
"success": true
}
```
