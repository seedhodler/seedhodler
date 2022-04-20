#!/usr/bin/env bash

bash ../.common/add-env-file-if-not-exists.sh

set -e

PROJECT_NAME='seedholder'

docker network create common || true

docker-compose --project-name $PROJECT_NAME build --pull

docker-compose --project-name $PROJECT_NAME kill
docker-compose --project-name $PROJECT_NAME rm -f
docker-compose --project-name $PROJECT_NAME up -d
