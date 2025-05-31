FROM node:18-alpine
WORKDIR /app
COPY . .
RUN corepack enable 
RUN pnpm install
CMD ["pnpm dev"]