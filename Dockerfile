# This expects the "make build" script to have been run first

ARG ARCH="amd64"
FROM ${ARCH}/node:12-alpine
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
ADD dist .
ENV APP_NAME="${APP_NAME}"
ENV BUILD_ID="${BUILD_ID}"
ENV VERSION="${VERSION}"
ENV UPLOAD_PATH=/uploads
VOLUME "/uploads"
RUN apk add --no-cache g++ git make python \
  && npm install --production \
  && apk del g++ git make python \
  && chmod 777 "${UPLOAD_PATH}"
EXPOSE 3000
USER node
CMD [ "npm", "start" ]
