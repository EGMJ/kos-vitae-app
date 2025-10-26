# Node 20 para Next.js
FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

# Opcional: pnpm ou yarn (comente/descomente)
# RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /workspaces/kos-vitae

# Cache inteligente (se já tiver package.json)
COPY apps/web/package*.json apps/web/
RUN cd apps/web && npm ci || true
