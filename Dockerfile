# This expects the "make build" script to have been run first

ARG ARCH="amd64"
FROM ${ARCH}/node:12-alpine
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
ADD dist .
ADD node_modules node_modules
ENV APP_NAME="${APP_NAME}"
ENV BUILD_ID="${BUILD_ID}"
ENV VERSION="${VERSION}"
ENV PORT=3000
ENV DATA_PATH=/data
ENV UPLOAD_PATH=/uploads
ENV LOG_DESTINATION=STDOUT
ENV LOG_LEVEL=info
# This manually builds the npm SQLite3 package using SQLite alpine package
RUN apk add --no-cache g++ git jq make python sqlite sqlite-dev \
  && NODE_SQLITE_VERSION=$(cat node_modules/sqlite3/package.json | jq '.version' --raw-output) \
  && npm un sqlite3 \
  && npm prune --production \
  && wget https://github.com/mapbox/node-sqlite3/archive/v${NODE_SQLITE_VERSION}.zip -O /opt/sqlite3.zip \
  && mkdir -p /opt/sqlite3 \
  && unzip /opt/sqlite3.zip -d /opt/sqlite3 \
  && cd /opt/sqlite3/node-sqlite3-${NODE_SQLITE_VERSION} \
  && npm install \
  && ./node_modules/.bin/node-pre-gyp install --fallback-to-build --build-from-source --sqlite=/usr/bin --python=$(which python) \
  && mv /opt/sqlite3/node-sqlite3-${NODE_SQLITE_VERSION} /opt/app/node_modules/sqlite3 \
  && apk del g++ git jq make python \
  && rm -Rf /opt/sqlite3 /opt/sqlite3.zip
EXPOSE 3000
USER node
VOLUME /uploads
VOLUME /data
HEALTHCHECK --interval=10s --timeout=3s --retries=5 --start-period=10s \
  CMD curl -f http://localhost:${PORT}/api/health || exit 1
CMD [ "npm", "start" ]
