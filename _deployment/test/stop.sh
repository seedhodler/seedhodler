#!/usr/bin/env bash

set -e

PROJECT_NAME='seedholder'

docker-compose --project-name $PROJECT_NAME down
