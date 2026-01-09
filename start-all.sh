#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

if [ ! -f ".env" ]; then
  echo "Arquivo .env nao encontrado. Copie .env.example para .env." >&2
  exit 1
fi

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  docker compose up -d db >/dev/null 2>&1 || true
elif command -v brew >/dev/null 2>&1; then
  brew services start mysql >/dev/null 2>&1 || true
fi

if [ ! -d ".next" ]; then
  npm run build
fi

if [ ! -d "server/dist" ]; then
  npm run build:server
fi

start_service() {
  local name="$1"
  local cmd="$2"
  local log="$3"
  local pidfile="$4"

  if [ -f "$pidfile" ] && kill -0 "$(cat "$pidfile")" >/dev/null 2>&1; then
    echo "$name ja esta rodando."
    return
  fi

  nohup bash -c "$cmd" > "$log" 2>&1 &
  echo $! > "$pidfile"
}

start_service "Backend" "npm run start:server" "/tmp/vagagoold-server.log" "/tmp/vagagoold-server.pid"
start_service "Frontend" "npm run start" "/tmp/vagagoold-web.log" "/tmp/vagagoold-web.pid"

echo "Backend: http://localhost:3001/api"
echo "Frontend: http://localhost:3000"
echo "Logs: /tmp/vagagoold-server.log /tmp/vagagoold-web.log"
