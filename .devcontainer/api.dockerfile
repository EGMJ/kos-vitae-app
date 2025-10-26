FROM mcr.microsoft.com/devcontainers/python:3.11-bookworm

WORKDIR /workspaces/kos-vitae

RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# venv
RUN python -m venv /home/vscode/.venv
ENV PATH="/home/vscode/.venv/bin:${PATH}"

# Copia só o requirements e instala (cache-friendly)
COPY apps/api/requirements.txt /tmp/requirements.txt
RUN /home/vscode/.venv/bin/pip install --upgrade pip && \
    /home/vscode/.venv/bin/pip install -r /tmp/requirements.txt