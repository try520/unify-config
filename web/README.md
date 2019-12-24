# control-project 项目源码

> 静态资源服务

## 下载
Get http://10.8.152.6:3001/base/download/file?path=%2Fres%2Fimages%2Fgroup.png.100x100.png

参数说明
path 必须  要下载文件的路径 www以下的路径描述

## 上传图片
Post http://10.8.152.6:3001/base/upload/image?dir=%2Fres%2Fj_header
get参数说明
dir 不必须 如果存在，文件将被上传到指定的目录下
post参数说明
upfile 必须 文件路径


## 上传图片Base64
Post http://10.8.152.6:3001/base/upload/image?contentType=base64
参数说明
contentType 必须 值必须为base64
post参数说明
upfile 必须 base64编码后的图片

## 上传文件
Post http://10.8.152.6:3001/base/upload/file
post参数说明
upfile 必须 文件路径

## 上传zip文件并解压到指定目录
Post http://10.8.152.6:3001/base/upload/unzip?dir=%2Fres%2Fj_header
get参数说明
dir 必须 文件将被解药到的目录 /www 下
post参数说明
upfile 必须 zip文件路径 格式只支持zip 文件名不能含有中文