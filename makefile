# Caminhos/variáveis
COMPOSE := docker compose -f .devcontainer/docker-compose.yml
DB_USER ?= postgres
DB_PASS ?= postgres
DB_NAME ?= kosvitae

# -------------------------
# Infra: subir/parar
# -------------------------
db-up:
	$(COMPOSE) up -d db pgadmin

db-down:
	$(COMPOSE) down

# -------------------------
# Flyway: migrações
# -------------------------
migrate:  ## Executa migrações (migrations + repeatable; em dev inclui seed)
	FLYWAY_USER=$(DB_USER) FLYWAY_PASSWORD=$(DB_PASS) \
	$(COMPOSE) run --rm flyway

repair:   ## Repara histórico (checksums) se necessário
	FLYWAY_USER=$(DB_USER) FLYWAY_PASSWORD=$(DB_PASS) \
	$(COMPOSE) run --rm flyway -q repair

# -------------------------
# App: API e Web
# -------------------------
api-up:
	$(COMPOSE) up -d api

web-up:
	$(COMPOSE) up -d web

app-up: db-up migrate api-up web-up

logs:
	$(COMPOSE) logs -f

psql:
	$(COMPOSE) exec -e PSQLRC=/dev/null db psql -U $(DB_USER) -d $(DB_NAME)

# -------------------------
# Smoke-test de RLS (exemplo)
# -------------------------
check-rls:
	@echo "SET app.current_is_admin = 'false';"                                >  /tmp/rls.sql
	@echo "SET app.current_user_id = '00000000-0000-0000-0000-000000000001';" >> /tmp/rls.sql
	@echo "SET app.current_profissional_id = '00000000-0000-0000-0000-0000000000AA';" >> /tmp/rls.sql
	@echo "SELECT id, nome FROM clinico.paciente LIMIT 5;"                    >> /tmp/rls.sql
	$(COMPOSE) exec -T db psql -U $(DB_USER) -d $(DB_NAME) -f /tmp/rls.sql
	@rm -f /tmp/rls.sql

.PHONY: db-up db-down migrate repair api-up web-up app-up logs psql check-rls


# testes

# Executa todos os testes pgTAP (estrutura, constraints, RLS, fluxos)
test:
	$(COMPOSE) run --rm pgtap

# Executa um arquivo/pasta de testes específicos (ex.: tests/clinico)
test-%:
	$(COMPOSE) run --rm pgtap bash -lc "pg_prove -v /tests/$*/**/*.sql || true"

# Só prepara extensão pgtap no banco (útil no 1º run)
pgtap-ext:
	$(COMPOSE) exec -T db psql -U $(DB_USER) -d $(DB_NAME) -c 'CREATE EXTENSION IF NOT EXISTS pgtap;'