# Kos Vitae API

Backend FastAPI com PostgreSQL + RLS (Row-Level Security), autenticação JWT, e arquitetura modular por domínios.

## 🏗️ Arquitetura

```
apps/api/
├── main.py                    # FastAPI app principal
├── config.py                  # Configuração (Pydantic Settings)
├── core/                      # Utilitários cross-domain
│   ├── auth.py               # JWT, login, user scaffolds
│   ├── security.py           # Permissões e guards
│   ├── errors.py             # Exception handlers
│   ├── pagination.py         # Modelos de paginação
│   └── filtering.py          # Modelos de filtros
├── db/                        # Database
│   ├── session.py            # Engine e AsyncSession
│   └── rls.py                # Context manager para RLS
├── middleware/                # Middlewares
│   ├── request_context.py   # Request ID e logging
│   └── rls_context.py       # Dependency get_rls_session
├── modules/                   # Domínios de negócio
│   ├── plataforma/           # Usuários, consentimentos, docs
│   ├── clinico/              # Pacientes, prontuários
│   ├── operacao/             # Agenda, ponto, rotas
│   ├── financeiro/           # Lançamentos, projeções
│   └── admin/                # Papéis, auditoria
├── workers/                   # Background jobs
│   └── scheduler.py          # APScheduler
└── tests/                     # Testes
    ├── unit/
    ├── integration/
    └── e2e/
```

## 🚀 Como rodar

### Pré-requisitos
- Docker e Docker Compose
- Make (opcional, facilita comandos)

### Setup inicial

1. **Subir banco e aplicar migrações:**
   ```bash
   make db-up
   make migrate
   ```

2. **Build da API (primeira vez ou quando requirements mudar):**
   ```bash
   make api-build
   ```

3. **Subir API:**
   ```bash
   make api-up
   ```

4. **Ver logs:**
   ```bash
   make api-logs
   ```

### Comandos úteis

```bash
make api-build      # Rebuild da imagem quando requirements.txt muda
make api-up         # Sobe o container da API
make api-restart    # Restart rápido
make api-logs       # Logs em tempo real
make api-shell      # Shell no container
make app-up         # Sobe DB + Flyway + API + Web
```

## 🔗 Endpoints

Com a API rodando em `http://localhost:8000`:

- **Swagger UI**: http://localhost:8000/docs
- **OpenAPI JSON**: http://localhost:8000/openapi.json
- **Health Check**: http://localhost:8000/healthz
- **Versão**: http://localhost:8000/version
- **Métricas (Prometheus)**: http://localhost:8000/metrics

### Auth (scaffold)
- `POST /auth/login` - Login (aceita qualquer user/pass por enquanto)
- `GET /auth/me` - Perfil do usuário

## 🔐 RLS (Row-Level Security)

Toda requisição autenticada:
1. Extrai o usuário do JWT (via `get_current_user`)
2. Descobre `profissional_id` e `is_admin`
3. Abre transação e executa:
   ```sql
   SET LOCAL app.current_user_id = '<user_id>';
   SET LOCAL app.current_profissional_id = '<profissional_id>';
   SET LOCAL app.current_is_admin = 'true'|'false';
   SET LOCAL app.request_id = '<request_id>';
   ```
4. Todas as queries dentro da transação respeitam as policies RLS

### Como usar em routers

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from middleware.rls_context import get_rls_session

router = APIRouter()

@router.get("/patients")
async def list_patients(session: AsyncSession = Depends(get_rls_session)):
    # A session já tem o contexto RLS aplicado
    result = await session.execute("SELECT * FROM clinico.paciente")
    return result.scalars().all()
```

## ⚙️ Configuração

Variáveis de ambiente (`.env` ou `.env.development`):

```env
APP_NAME=kos-vitae
ENV=dev

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=kosvitae

# Auth
JWT_SECRET=change-me-in-production
JWT_EXPIRES_MIN=15
REFRESH_EXPIRES_DAYS=7

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=kosvitae
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
```

## 🧪 Testes

```bash
# Testes do banco (pgTAP)
make test

# Testes específicos
make test-clinico
make test-plataforma
```

## 📦 Dependências principais

- **fastapi** - Framework web assíncrono
- **uvicorn** - ASGI server
- **sqlalchemy>=2** - ORM async
- **psycopg[binary]** - Driver PostgreSQL async
- **pydantic-settings** - Configuração type-safe
- **python-jose** - JWT
- **python-multipart** - Form data (OAuth2)
- **prometheus-fastapi-instrumentator** - Métricas
- **structlog** - Logging estruturado
- **apscheduler** - Background jobs

## 🎯 Próximos passos

### Auth completo
- [ ] Verificação real de JWT em `get_current_user`
- [ ] Endpoints: register, refresh, logout, password recovery
- [ ] OAuth (Google/Apple) start/callback

### Domínios
- [ ] **Plataforma**: consentimentos LGPD, documentos com presign S3
- [ ] **Clínico**: pacientes (busca trigram), responsáveis, prontuários
- [ ] **Operação**: agenda, check-in/out (idempotência), rotas do dia
- [ ] **Financeiro**: lançamentos, resumo, projeção por competência
- [ ] **Admin**: papéis, auditoria, diagnóstico RLS

### Observabilidade
- [ ] structlog configurado
- [ ] OpenTelemetry tracing
- [ ] DB health check em `/healthz`

### Testes
- [ ] Unit tests (services isolados)
- [ ] Integration tests (Testcontainers + Flyway + RLS real)
- [ ] Contract tests (OpenAPI validation)

## 📝 Notas técnicas

### Por que imports absolutos?
O uvicorn roda com `cd apps/api`, então imports relativos (`.config`) quebram. Todos os imports são absolutos (`config`, `modules.clinico`, etc.).

### Rebuild quando?
Sempre que modificar `requirements.txt`, faça:
```bash
make api-build
make api-up
```

Se mudar apenas código Python, o uvicorn com `--reload` detecta automaticamente.

### Troubleshooting

**API não sobe / Connection reset:**
1. Veja os logs: `make api-logs`
2. Verifique se há erros de import
3. Se mudou requirements: `make api-build`

**Dependências não instaladas:**
```bash
# Remove o volume antigo e rebuilda
docker compose -f .devcontainer/docker-compose.yml down api
docker volume rm devcontainer_api_venv
make api-build
make api-up
```

## 📄 Licença

Proprietary - Kos Vitae
