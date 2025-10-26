#!/usr/bin/env bash
set -euo pipefail

echo "▶ Post-create: preparando ambiente…"

# Node deps (idempotente)
if [ -f "apps/web/package.json" ]; then
  echo "→ Instalando deps do web…"
  cd apps/web
  npm install
  cd - >/dev/null
fi

# Python deps (idempotente)
if [ -f "apps/api/requirements.txt" ]; then
  echo "→ Instalando deps do api…"
  cd apps/api
  pip install -r requirements.txt
  cd - >/dev/null
fi

echo "✓ Post-create finalizado."
