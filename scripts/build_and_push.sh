#!/bin/sh
# Usage: ./scripts/build_and_push.sh your-dockerhub-username/your-repo:tag
if [ -z "$1" ]; then
  echo "Usage: $0 <image:tag>"
  exit 1
fi
IMAGE=$1
docker build -t $IMAGE .
docker push $IMAGE
