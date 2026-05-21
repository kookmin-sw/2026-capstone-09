FROM node:22-alpine
WORKDIR /app
RUN corepack enable pnpm
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY --chown=node:node index.mjs ./
USER node
EXPOSE 1234
CMD ["node", "index.mjs"]