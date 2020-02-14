#!/usr/bin/env sh

# This exists to create new releases in GitHub and upload assets

set -e

VERSION=$(cat VERSION)

# Create the release
release=$(curl --location \
  --fail \
  --request POST "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases" \
  --header "Content-Type: application/json" \
  --header "Authorization: token ${GITHUB_TOKEN}" \
  --data-raw "{ \"tag_name\": \"${VERSION}\" }")

releaseId=$(echo "${release}" | jq '.id')

# Zip and upload the artifacts
rm -f ./artifacts/*.zip
cd ./artifacts
for i in *
do
  echo "Zipping ${i}"
  cd "${i}"

  artifact="${VERSION}-${i}.zip"

  zip -r "../${artifact}" .
  cd ../

  # Uploading the artifact
  curl --location \
    --fail \
    --request POST "https://uploads.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases/${releaseId}/assets?name=${artifact}" \
    --header "Authorization: token ${GITHUB_TOKEN}" \
    --header "Content-Type: application/zip" \
    --data-binary "@${PWD}/${artifact}"
done
cd ..

echo "Finished"
