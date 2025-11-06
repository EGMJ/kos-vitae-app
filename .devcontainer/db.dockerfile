# db.Dockerfile
FROM postgres:16-bookworm

# Instala dependências para adicionar o repositório com chave assinada
RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends curl gnupg ca-certificates lsb-release; \
  install -d -m 0755 /etc/apt/keyrings; \
  curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
    | gpg --dearmor -o /etc/apt/keyrings/pgdg.gpg; \
  echo "deb [signed-by=/etc/apt/keyrings/pgdg.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
    > /etc/apt/sources.list.d/pgdg.list; \
  apt-get update; \
  apt-get install -y --no-install-recommends postgresql-16-pgtap; \
  rm -rf /var/lib/apt/lists/*
