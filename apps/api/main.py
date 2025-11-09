from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse, Response
import uvicorn
import os
from config import Settings, get_settings
from middleware.request_context import RequestContextMiddleware
from core.errors import install_exception_handlers

try:
    from prometheus_fastapi_instrumentator import Instrumentator
except Exception:  # pragma: no cover
    Instrumentator = None  # type: ignore

app = FastAPI(
    title="Kos Vitae API",
    version=os.getenv("APP_VERSION", "0.1.0"),
    description="Backend Kos Vitae com RLS por requisição.",
    contact={"name": "Kos Vitae", "email": "dev@kosvitae.local"},
    license_info={"name": "Proprietary"},
    openapi_tags=[
        {"name": "Auth", "description": "Autenticação e sessão"},
        {"name": "Infra", "description": "Saúde, métricas, versão"},
        {"name": "Plataforma", "description": "Usuários, profissionais, consentimentos, documentos"},
        {"name": "Clínico", "description": "Pacientes, responsáveis, prontuários"},
        {"name": "Operação", "description": "Agenda, ponto, rotas do dia"},
        {"name": "Financeiro", "description": "Lançamentos, resumos, projeções"},
        {"name": "Admin", "description": "Papéis, auditoria e diagnósticos"},
    ],
)

settings: Settings = get_settings()

# Middlewares
app.add_middleware(RequestContextMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

install_exception_handlers(app)

# Infra routers
@app.get("/healthz", tags=["Infra"], operation_id="infra_healthz")
async def healthz() -> JSONResponse:
    # DB ping pode ser adicionado depois
    return JSONResponse({"status": "ok"})

@app.get("/version", tags=["Infra"], operation_id="infra_version")
async def version() -> JSONResponse:
    return JSONResponse({
        "name": os.getenv("APP_NAME", "kos-vitae"),
        "version": os.getenv("APP_VERSION", "0.1.0"),
        "env": os.getenv("ENV", "dev"),
    })

# Metrics
if Instrumentator:
    Instrumentator().instrument(app).expose(app, endpoint="/metrics", tags=["Infra"], include_in_schema=False)
else:
    @app.get("/metrics", tags=["Infra"], include_in_schema=False)
    async def metrics_fallback() -> Response:  # pragma: no cover
        return Response("", media_type="text/plain")

# Domain routers placeholders (to be implemented)
from modules.plataforma.routers import router as plataforma_router  # noqa: E402
from modules.clinico.routers import router as clinico_router  # noqa: E402
from modules.operacao.routers import router as operacao_router  # noqa: E402
from modules.financeiro.routers import router as financeiro_router  # noqa: E402
from modules.admin.routers import router as admin_router  # noqa: E402
from core.auth import router as auth_router  # noqa: E402

app.include_router(auth_router, prefix="/auth")
app.include_router(plataforma_router, prefix="/plataforma")
app.include_router(clinico_router, prefix="/clinico")
app.include_router(operacao_router, prefix="/operacao")
app.include_router(financeiro_router, prefix="/financeiro")
app.include_router(admin_router, prefix="/admin")


if __name__ == "__main__":  # pragma: no cover
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)
