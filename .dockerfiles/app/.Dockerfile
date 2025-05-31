FROM node:18-alpine

COPY ./ ./

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_SKIP_CONFIRMATIONS=true
RUN pnpm install --registry=https://registry.npmjs.org --config.confirmModulesPurge=false

CMD ["ls"]
# CMD ["pnpm","dev"]