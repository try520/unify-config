FROM  mhart/alpine-node:10.15.1
 WORKDIR /app

COPY global.js /app/global.js
COPY startup /app/startup
COPY package-lock.json /app/package-lock.json
COPY package.json /app/package.json
COPY bin /app/bin
COPY www /app/www
COPY logs /app/logs
COPY socket /app/socket
COPY server /app/server
COPY views /app/views
COPY app.js /app/app.js
COPY router.js /app/router.js
COPY common /app/common
COPY config /app/config
COPY areas /app/areas
COPY logic /app/logic
RUN  npm install

EXPOSE 3001
CMD [ "npm", "start","micro" ]
