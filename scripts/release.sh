#!/usr/bin/env sh

# This exists to create new releases in GitHub and upload assets

set -e

VERSION="v$(cat VERSION)"

echo "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases/${VERSION}"

# Check for existing release
release=$(curl --location \
  --header "Content-Type: application/json" \
  --header "Authorization: token ${GITHUB_DEPLOY_TOKEN}" \
  --request GET "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases/tags/${VERSION}")

releaseId=$(echo "${release}" | jq '.id')

if [ "$releaseId" = "null" ]; then
  echo "No release - creating"
  # Create the release
  release=$(curl --location \
    --fail \
    --request POST "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases" \
    --header "Content-Type: application/json" \
    --header "Authorization: token ${GITHUB_DEPLOY_TOKEN}" \
    --data-raw "{ \"tag_name\": \"${VERSION}\" }")

  releaseId=$(echo "${release}" | jq '.id')
fi

# Zip and upload the dist
echo "Zipping ${VERSION}"

artifact="open-apiary-${VERSION}.zip"

rm -Rf ./open-apiary
cp -Rf ./dist ./open-apiary

zip -r "./${artifact}" ./open-apiary

# Check if asset currently exists, delete if it does
assets=$(curl --location \
  --fail \
  --header "Content-Type: application/json" \
  --header "Authorization: token ${GITHUB_DEPLOY_TOKEN}" \
  "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases/${releaseId}/assets")

for asset in $(echo $assets | jq -rc 'map(.id) | .[]'); do
  echo "Deleting ${asset}"

  curl --location \
    --fail \
    --header "Content-Type: application/json" \
    --header "Authorization: token ${GITHUB_DEPLOY_TOKEN}" \
    --request DELETE "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases/assets/${asset}"
done

## Uploading the artifact
echo "Uploading artifact - ${artifact} to ${VERSION}"
curl --location \
  --fail \
  --request POST "https://uploads.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases/${releaseId}/assets?name=${artifact}" \
  --header "Authorization: token ${GITHUB_DEPLOY_TOKEN}" \
  --header "Content-Type: application/zip" \
  --data-binary "@${PWD}/${artifact}"

echo "Finished"
