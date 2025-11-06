CREATE SCHEMA IF NOT EXISTS plataforma;
CREATE SCHEMA IF NOT EXISTS clinico;
CREATE SCHEMA IF NOT EXISTS operacao;
CREATE SCHEMA IF NOT EXISTS financeiro;
CREATE SCHEMA IF NOT EXISTS admin;

CREATE EXTENSION IF NOT EXISTS citext;            -- :contentReference[oaicite:1]{index=1}
CREATE EXTENSION IF NOT EXISTS pg_trgm;           -- :contentReference[oaicite:2]{index=2}
CREATE EXTENSION IF NOT EXISTS pgcrypto;          -- para gen_random_uuid()  :contentReference[oaicite:3]{index=3}

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_ro') THEN CREATE ROLE app_ro NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_rw') THEN CREATE ROLE app_rw NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'migrator') THEN CREATE ROLE migrator NOLOGIN; END IF;
END$$;

GRANT USAGE ON SCHEMA plataforma, clinico, operacao, financeiro, admin TO app_ro, app_rw;
