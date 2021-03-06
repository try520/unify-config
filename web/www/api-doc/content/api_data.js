define({ "api": [
  {
    "type": "post",
    "url": "api/config/getAppInfo",
    "title": "获取应用的详情",
    "version": "1.0.0",
    "name": "getAppInfo",
    "group": "Config",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "appCode",
            "description": "<p>设备编码</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"Result\": 1,//1:成功，0:失败\n  \"Data\": { \n  \"app_id\": \"C874DD7E-B870-0001-97CD-2F601CF03870\",\n  \"app_name\": \"一站式综合管理系统\",\n  \"app_code\": \"imp\",\n  \"app_label\": \"应用\",\n  \"app_order\": 1,\n  \"app_configDev\":\"\",\n  \"app_configProd\":\"\",\n  \"app_configMico\":\"\"\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "areas/api/controls/config.js",
    "groupTitle": "Config",
    "sampleRequest": [
      {
        "url": "/api/config/getAppInfo"
      }
    ]
  },
  {
    "type": "post",
    "url": "api/config/getConfig",
    "title": "获取应用的配置信息",
    "description": "<p>支持 http://xxxxx/api/config/:appCode/:env 进行get获取</p>",
    "version": "1.0.0",
    "name": "getConfig",
    "group": "Config",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "appCode",
            "description": "<p>设备编码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "env",
            "description": "<p>环境 (dev:开发环境,prod:生产环境,mico:微服务环境) 默认 prod</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  ... //直接返回配置文件字符串 前端配置可直接使用<script>标签引用\n}",
          "type": "json"
        }
      ]
    },
    "filename": "areas/api/controls/config.js",
    "groupTitle": "Config",
    "sampleRequest": [
      {
        "url": "/api/config/getConfig"
      }
    ]
  },
  {
    "type": "get",
    "url": "base/download/file",
    "title": "下载文件",
    "version": "1.0.0",
    "name": "downLoadFile",
    "group": "File",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<p>url编码后的文件路径</p> <p>下载文件 http: //localhost:3001/base/download/file?path=%2Fres%2Fimages%2Fgroup.png.100x100.png</p>"
          }
        ]
      }
    },
    "filename": "areas/base/controls/download.js",
    "groupTitle": "File",
    "sampleRequest": [
      {
        "url": "/base/download/file"
      }
    ]
  },
  {
    "type": "get",
    "url": "base/upload/config",
    "title": "获取上传配置",
    "version": "1.0.0",
    "name": "getConfig",
    "group": "File",
    "filename": "areas/base/controls/upload.js",
    "groupTitle": "File",
    "sampleRequest": [
      {
        "url": "/base/upload/config"
      }
    ]
  },
  {
    "type": "post",
    "url": "base/upload/uploadFile",
    "title": "上传文件",
    "version": "1.0.0",
    "name": "uploadFile",
    "group": "File",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "file",
            "optional": false,
            "field": "upfile",
            "description": "<p>存放文件的域</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success - Response:",
          "content": "\n           HTTP / 1.1 200 OK *\n           {\n\"state\": 0, //0:成功，-1:超出大小限制,-2:不允许的类型,-3:文件访问出错，请检查写入权限,-4:网络错误\n\"relativeUrl\": \"/res/upload/file/20170101/xxx.doc\" //上传后的相对路径地址\n\"absolutelyUrl\": \"http://xxxx/res/upload/file/20170101/xxx.doc\" //上传后的绝对路径地址\n           }",
          "type": "json"
        }
      ]
    },
    "filename": "areas/base/controls/upload.js",
    "groupTitle": "File",
    "sampleRequest": [
      {
        "url": "/base/upload/uploadFile"
      }
    ]
  },
  {
    "type": "post",
    "url": "base/upload/uploadImage",
    "title": "上传图片",
    "version": "1.0.0",
    "name": "uploadImage",
    "group": "File",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "contentType",
            "description": "<p>内容形式 (可为空，如果图片是base64编码字符串，那么contentType=&quot;base64&quot;)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "upfile",
            "description": "<p>存放图片的域或存放base64字符串的字段</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success - Response:",
          "content": "\n           HTTP / 1.1 200 OK *\n           {\n\"state\": 0, //0:成功，-1:超出大小限制,-2:不允许的类型,-3:文件访问出错，请检查写入权限,-4:网络错误\n\"relativeUrl\": \"/res/upload/img/20170101/xxx.jpg\" //上传后的相对路径地址\n\"absolutelyUrl\": \"http://xxxx/res/upload/img/20170101/xxx.jpg\" //上传后的绝对路径地址\n           }",
          "type": "json"
        }
      ]
    },
    "filename": "areas/base/controls/upload.js",
    "groupTitle": "File",
    "sampleRequest": [
      {
        "url": "/base/upload/uploadImage"
      }
    ]
  },
  {
    "type": "post",
    "url": "base/upload/unzip?dir=xxxx",
    "title": "上传文件并解压 只支持zip",
    "version": "1.0.0",
    "name": "uploadUnzip",
    "group": "File",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dir",
            "description": "<p>解压目录 需要urlEncode 这是get参数 跟在url 后面 ?dir=xxxx</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "upfile",
            "description": "<p>保存文件的域 这是post参数</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success - Response:",
          "content": "\n           HTTP / 1.1 200 OK *\n           {\n\"state\": 0 //0:成功，-1:超出大小限制,-2:不允许的类型,-3:文件访问出错，请检查写入权限,-4:网络错误\n\n           }",
          "type": "json"
        }
      ]
    },
    "filename": "areas/base/controls/upload.js",
    "groupTitle": "File",
    "sampleRequest": [
      {
        "url": "/base/upload/unzip?dir=xxxx"
      }
    ]
  },
  {
    "type": "post",
    "url": "api/logs/add",
    "title": "提交log日志",
    "description": "<p>此方式为restFul提交，不建议使用，正式环境中请使用mqtt方式提交，topic：logs/[appCode]/[level],qos:0,消息体，见下面的参数部分</p>",
    "version": "1.0.0",
    "name": "add",
    "group": "logs",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "appCode",
            "description": "<p>设备编码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "level",
            "description": "<p>等级  debug &lt; info &lt; warn &lt; error &lt; fatal &lt; mark</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>内容</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "mqtt message body:",
          "content": "\n{\n  \"appCode\":\"app标识\",\n  \"level\":\"日志等级\",\n  \"content\":\"日志内容\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  Result:1\n}",
          "type": "json"
        }
      ]
    },
    "filename": "areas/api/controls/logs.js",
    "groupTitle": "logs",
    "sampleRequest": [
      {
        "url": "/api/logs/add"
      }
    ]
  }
] });
