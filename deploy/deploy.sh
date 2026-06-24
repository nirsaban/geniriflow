#!/usr/bin/env bash
# Git-based deploy for geniriflow.miltech.cloud
# Pulls latest main and rebuilds the container behind the shared yogev-nginx proxy.
set -euo pipefail

APP_DIR="/opt/geniriflow-landing"

cd "$APP_DIR"
echo "==> Pulling latest main"
git fetch --quiet origin main
git reset --hard origin/main

echo "==> Building and (re)starting container"
docker compose up -d --build

echo "==> Waiting for health"
for i in $(seq 1 20); do
  if docker exec geniriflow-landing wget -q -O /dev/null http://localhost:3000/ 2>/dev/null; then
    echo "    app healthy"; break
  fi
  sleep 1
done

echo "==> Live check"
curl -s -o /dev/null -w 'https://geniriflow.miltech.cloud -> HTTP %{http_code}\n' https://geniriflow.miltech.cloud/
echo "Done."
