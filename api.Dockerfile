FROM node:20.14-alpine

# Install dependencies only when needed

# RUN apt install sqlite
RUN apk add --no-cache sqlite libgcc
# RUN sqlite3 -version
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci


COPY types types
COPY client client
COPY api api


WORKDIR api

RUN npm ci

RUN rm db/*.sqlite3 || true

ENV NODE_ENV production

EXPOSE 3001

CMD ["node", "src/main.js"]