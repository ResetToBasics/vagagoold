#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

stop_service() {
  local name="$1"
  local pidfile="$2"

  if [ -f "$pidfile" ]; then
    local pid
    pid="$(cat "$pidfile")"
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill "$pid" >/dev/null 2>&1 || true
      echo "$name parado."
    fi
    rm -f "$pidfile"
  fi
}

stop_service "Backend" "/tmp/vagagoold-server.pid"
stop_service "Frontend" "/tmp/vagagoold-web.pid"
stop_service "Backend (dev)" "/tmp/vagagoold-server-dev.pid"
stop_service "Frontend (dev)" "/tmp/vagagoold-web-dev.pid"

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  docker compose down >/dev/null 2>&1 || true
elif command -v brew >/dev/null 2>&1; then
  brew services stop mysql >/dev/null 2>&1 || true
fi
