FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:0.11.3 /uv /uvx /bin/

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_PROJECT_ENVIRONMENT=/usr/local

ARG BUILD_ENV=production
# uv bundles its own root store and ignores the system CAs unless told otherwise.
ENV UV_NATIVE_TLS=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY certs/cloudflare-ca.crt /tmp/cloudflare-ca.crt
RUN if [ "$BUILD_ENV" = "development" ]; then \
      cp /tmp/cloudflare-ca.crt /usr/local/share/ca-certificates/cloudflare-ca.crt \
      && update-ca-certificates; \
    fi

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --locked --no-install-project

COPY backend/. .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
