FROM node:12-alpine
WORKDIR /opt/app
ADD . .
RUN npm ci
CMD [ "npm", "start" ]
