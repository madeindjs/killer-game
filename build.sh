#!/bin/bash

USER=arousseau

build() {
  local VERSION=$(cat "$1/package.json" | jq -r .version)
  local REPO="$USER/killer-game-$1"

  docker build . -f "$1.Dockerfile" -t "$REPO:latest" -t "$REPO:v$VERSION"

  # docker push "$REPO:latest"
  # docker push "$REPO:v$VERSION"
  echo "## pushed $REPO:v$VERSION"
}

build "api"
build "frontend"

