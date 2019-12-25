# control-project 项目源码
https://github.com/try520/unify-config

# 项目简介

统一配置系统和统一日志系统，日志存储使用clickhouse,docker 镜像含有 mysql5.7,redis,clickhouse,emqx3.2 等组件。公开端口后，可用于测试环境。
mysql默认用户名 root ,密码 123456。
统一配置中心：
用户名 admin
密码 123456


# Docker 测试

docker push try520/unity-config:v1.0

## 简单测试
docker run  -d --name unify-config -p 3000:80  --restart always unity-config:v1.0

## 生产环境
首先从测试环境中拷贝出 数据目录，然后进行挂载
docker cp xx:/var/lib/mysql /data/mysql
docker cp xx:/var/lib/clickhouse /data/clickhouse
docker run  -d --name unify-config  -p 3000:80 -p 3308:3306 -p 8123:8123 -p 9000:9000 -p 9009:9009 -p 1883:1883 -p 8083:8083  -p 18083:18083  -v /data/mysql:/var/lib/mysql -v /data/clickhouse:/var/lib/clickhouse  --restart always unify-config:v1.0

使用外部的数据持久化组件
docker run  -d --name unify-config  -p 3000:80  -v /data/mysql:/var/lib/mysql -v /data/clickhouse:/var/lib/clickhouse -e mqtt {"host":"mqtt://192.168.12.6:30398"} -e  StaticRes {"port":3306,"host":"192.168.12.6","user":"root","pwd":"123456","dbName":"static_res","dialect":"mysql","dirName":"static-res","logging":true} -e clickHouse {"url":"http://192.168.12.6","port":31731,"user":"kmlc","password":"Kmlc3302133","clusterName":"default_cluster","clusterCount":3,"basicAuth":null,"isUseGzip":false,"debug":false} -e frontWebConfig {"mqtt":{"host":"192.168.12.6","port":31282,"auth":{"username":"admin","password":"public"}}} -e manage {"username":"admin","pwd":"123456"} --restart always unify-config:v1.0

> 静态资源服务接口

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