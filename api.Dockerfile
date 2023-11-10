FROM node:20.8-alpine

# Install dependencies only when needed

# RUN apt install sqlite
RUN apk add --no-cache sqlite libgcc
# RUN sqlite3 -version
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci


COPY types types
COPY client clients
COPY api api


WORKDIR api

RUN npm ci

ENV NODE_ENV production

EXPOSE 3001

CMD ["node", "src/main.js"]