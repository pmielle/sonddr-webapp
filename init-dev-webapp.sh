#!/usr/bin/env bash
set -euo pipefail

docker build -t sonddr-webapp .

docker run -d --rm -p 4200:4200 --name sonddr-webapp \
  sonddr-webapp
