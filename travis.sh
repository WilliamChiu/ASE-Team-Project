#!/bin/bash
MAX_TRIES=5

function ready() {
  docker-compose  -f travis-docker-compose.yml logs  backend
  docker-compose  -f travis-docker-compose.yml logs  backend | grep "Initializing in-memory rooms.."
}

# https://www.marksayson.com/blog/wait-until-docker-containers-initialized/
function waitUntilServiceIsReady() {
  attempt=1
  while [ $attempt -le $MAX_TRIES ]; do
    if "$@"; then
      echo "$2 container is up!"
      break
    fi
    echo "Waiting for $2 container... (attempt: $((attempt++)))"
    sleep 10s
  done

  if [ $attempt -gt $MAX_TRIES ]; then
    echo "Error: $2 not responding, cancelling set up"
    exit 1
  fi
}

waitUntilServiceIsReady ready "Backend"
