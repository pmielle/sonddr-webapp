#!/usr/bin/env bash
set -euo pipefail

docker build -t angular .

docker run -d --rm --network sonddr -p 4200:4200 --name angular\
  angular
