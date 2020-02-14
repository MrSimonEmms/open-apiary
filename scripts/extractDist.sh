#!/usr/bin/env sh

set -e

docker_img_name() {
  if [ -n "${CIT_DOCKER_IMG_NAME}" ];
  then
    echo "${CIT_DOCKER_IMG_NAME}"
  else
    echo "${CI_REGISTRY}/${CI_PROJECT_PATH}${CIT_REGISTRY_PATH:+/$CIT_REGISTRY_PATH}" | tr '[:upper:]' '[:lower:]'
  fi
}

docker_img_name_next() {
  echo "$(docker_img_name)${CIT_DOCKER_IMG_NAME_NEXT}"
}

containerId=$(docker create "$(docker_img_name_next):${CI_COMMIT_SHA}-${CIT_DOCKER_ARCH}")

rm -Rf ./artifacts
mkdir -p ./artifacts
docker cp "${containerId}:/opt/app" "./artifacts/${CIT_DOCKER_ARCH}"
docker stop "${containerId}"
docker rm "${containerId}"
