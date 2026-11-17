FROM node:22-alpine

WORKDIR /app

ARG BUILD_ENV=production

COPY certs/cloudflare-ca.crt /tmp/cloudflare-ca.crt
# Alpine's apk index fetch is HTTPS and gets blocked by the same untrusted-proxy-cert
# problem we're trying to fix, so bootstrap ca-certificates over plain HTTP first.
RUN if [ "$BUILD_ENV" = "development" ]; then \
      sed -i 's/https:/http:/' /etc/apk/repositories \
      && apk add --no-cache ca-certificates \
      && sed -i 's/http:/https:/' /etc/apk/repositories \
      && cp /tmp/cloudflare-ca.crt /usr/local/share/ca-certificates/cloudflare-ca.crt \
      && update-ca-certificates; \
    fi
ENV NODE_EXTRA_CA_CERTS=/tmp/cloudflare-ca.crt

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

COPY frontend/. .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
