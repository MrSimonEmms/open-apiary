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
  && apk add --no-cache curl \
  && npm install --production \
  && apk del g++ git make python \
  && chmod 777 "${UPLOAD_PATH}"
ENV PORT=3000
EXPOSE 3000
USER node
HEALTHCHECK --interval=10s --timeout=3s --retries=5 --start-period=10s \
  CMD curl -f http://localhost:${PORT}/api/health || exit 1
CMD [ "npm", "start" ]
