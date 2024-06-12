# Killer game generator

This application generate Killer game for a party.

![Example of a killer card](./screenshot.png)

## Setup

```sh
npm i
npm run dev
```

you might run database migrations

```sh
cd api
npx knex migrate:up
```

### Docker

```sh
docker build . -f frontend.Dockerfile -t killer-frontend


docker build . -f api.Dockerfile -t killer-api
docker run -p 3001:3001 killer-api
```

> see [build.sh](./build.sh) to build images

To run the project

```sh
docker run -p 3000:3000 -d arousseau/killer-game-frontend
# using a volume for the sqlite database
docker run -p 3001:3001 -v "$PWD/db:/app/api/db" arousseau/killer-game-api
```

### Docker Swarm

Deploy it quickly using

```sh
docker stack deploy -c docker-compose.yml killer-game
```

> Check [the Github workflow](./.github/workflows/api.yml) to see how Docker Swarm is used for the deployment of [the-killer.online]
