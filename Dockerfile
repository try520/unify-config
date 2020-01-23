FROM  hub.c.163.com/library/mysql:5.7
WORKDIR /app
ADD ./tools /tools
ADD ./node-v12.13.0-linux-x64.tar.xz /
ADD ./redis-5.0.3 /redis-5.0.3
ADD ./start.sh /
ADD ./mysql /var/lib/mysql

COPY ./web/global.js /app/global.js
COPY ./web/startup /app/startup
COPY ./web/package-lock.json /app/package-lock.json
COPY ./web/package.json /app/package.json
COPY ./web/bin /app/bin
COPY ./web/www /app/www
COPY ./web/logs /app/logs
COPY ./web/socket /app/socket
COPY ./web/server /app/server
COPY ./web/views /app/views
COPY ./web/app.js /app/app.js
COPY ./web/router.js /app/router.js
COPY ./web/common /app/common
COPY ./web/config /app/config
COPY ./web/areas /app/areas
COPY ./web/logic /app/logic
ADD ./profile /etc/profile
RUN dpkg -i /tools/clickhouse-server-base_1.1.54362_amd64.deb &&  dpkg -i /tools/clickhouse-server-common_1.1.54362_amd64.deb &&  dpkg -i /tools/clickhouse-client_1.1.54362_amd64.deb && dpkg -i /tools/emqx-debian8-v3.2.7_amd64.deb 
RUN chmod 777 -R /redis-5.0.3
RUN ln -s /node-v12.13.0-linux-x64/bin/node /usr/local/bin/node &&  ln -s /node-v12.13.0-linux-x64/bin/npm /usr/local/bin/npm && ln -s /etc/init.d/clickhouse-server /usr/local/bin/clickhouse-server && ln -s /redis-5.0.3/src/redis-server /usr/local/bin/redis-server
RUN sed -i 's/\r//' /start.sh
RUN cd /app && npm install

VOLUME ["/var/lib/mysql"]
VOLUME ["/var/lib/clickhouse"]
VOLUME ["/app/www/res"]
VOLUME ["/app/www/upload"]

EXPOSE 80
EXPOSE 6379
EXPOSE 8123
EXPOSE 9000
EXPOSE 9009
EXPOSE 3306
EXPOSE 1883
EXPOSE 8083
EXPOSE 8080
EXPOSE 18083

ENTRYPOINT /bin/bash -C '/start.sh'
