FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json jest.config.ts ./
COPY src ./src
COPY tests ./tests
COPY storage ./storage

RUN npm run build
RUN npm prune --production

FROM node:20-alpine
WORKDIR /app

COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/storage ./storage

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/server.js"]

