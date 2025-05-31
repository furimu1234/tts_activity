FROM node:18-alpine
WORKDIR /app
COPY . .
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --reporter=ndjson --frozen-lockfile --registry=https://registry.npmjs.org
CMD ["pnpm dev"]