FROM node:22-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .env ./
RUN npm install -g pnpm@9.6.0
RUN pnpm install

COPY src/ ./src/
COPY static/ ./static/
COPY svelte.config.js ./
COPY vite.config.js ./
COPY jsconfig.json ./
COPY theme/ ./theme/

RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

RUN pnpm build
RUN pnpm prune --prod

# Switch to node user
RUN chown node:node .
USER node

EXPOSE 3366

ENV NODE_ENV=production
ENV BODY_SIZE_LIMIT=50000000

CMD ["node", "build/index.js"]
