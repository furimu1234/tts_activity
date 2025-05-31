FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_SKIP_CONFIRMATIONS=true
RUN pnpm install --reporter=ndjson --frozen-lockfile --registry=https://registry.npmjs.org
# CMD ["pwd"]
CMD ["pnpm","dev"]