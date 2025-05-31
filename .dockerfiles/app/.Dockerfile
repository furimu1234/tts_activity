FROM node:18-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install &&pnpm dev