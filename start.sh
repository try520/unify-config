#!/bin/bash
redis-server /redis-5.0.3/redis.conf 
clickhouse-server start 
emqx start 
docker-entrypoint.sh mysqld & 
npm start micro