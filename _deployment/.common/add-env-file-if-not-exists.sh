#!/usr/bin/env bash

_SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
 
(
  cd "${_SCRIPT_DIR}/../../"

  FILE=.env

  if [ ! -f "$FILE" ]; then
    touch .env
    echo Empty .env file has been added into project root
  fi
)
