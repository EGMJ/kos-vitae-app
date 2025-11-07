from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

class APIError(Exception):
    def __init__(self, status_code: int = 400, code: str = "bad_request", message: str = "Invalid request"):
        self.status_code = status_code
        self.code = code
        self.message = message


def install_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(APIError)
    async def api_error_handler(_: Request, exc: APIError):
        return JSONResponse(status_code=exc.status_code, content={"error": exc.code, "message": exc.message})

    @app.exception_handler(Exception)
    async def unhandled(_: Request, exc: Exception):  # pragma: no cover
        return JSONResponse(status_code=500, content={"error": "internal_error", "message": str(exc)})
