# Base Python com utilitários de devcontainers
FROM mcr.microsoft.com/devcontainers/python:3.11-bookworm

WORKDIR /workspaces/kos-vitae

# Dependências de sistema (psycopg, Pillow etc., ajuste conforme sua stack)
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Ambiente virtual em /home/vscode/.venv (persistido via volume)
RUN python -m venv /home/vscode/.venv
ENV PATH="/home/vscode/.venv/bin:${PATH}"

# Pré-instala requirements para cache (se existir)
COPY apps/api/requirements.txt apps/api/requirements.txt
RUN if [ -f "apps/api/requirements.txt" ]; then pip install -r apps/api/requirements.txt; fi
