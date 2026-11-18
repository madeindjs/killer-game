FROM node:24-alpine

# Install dependencies only when needed

# RUN apt install sqlite
RUN apk add --no-cache sqlite libgcc
# RUN sqlite3 -version
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch --prod

COPY types types
COPY client client
COPY api api

RUN pnpm install --offline --frozen-lockfile --prod --filter @killer-game/api...

WORKDIR api

RUN rm db/*.sqlite3 || true

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "--experimental-strip-types", "src/main.ts"]
