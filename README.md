# Killer game generator

This application generate Killer game for a party.

Each party have a set of players and actions. Then the application allow you to print card like bellow for each players:

![Example of a killer card](https://raw.githubusercontent.com/madeindjs/killer-game/main/app/assets/images/card-example.png)

The QR code link to the application wherein player:

1. can validates his mission
2. follow the evolution of the party through a funny dashboard

## Setup

~~~sh
npm i
npm run dev
~~~

you might run database migrations

~~~sh
cd api
npx knex migrate:up
~~~

### Docker

~~~sh
docker build . -f frontend.Dockerfile -t killer-frontend


docker build . -f api.Dockerfile -t killer-api
docker run -p 3001:3001 killer-api
~~~

> see [build.sh](./build.sh) to build images

To run the project

~~~sh
docker run -p 3000:3000 -d arousseau/killer-game-frontend
# using a volume for the sqlite database
docker run -p 3001:3001 -v "$PWD/db:/app/api/db" arousseau/killer-game-api
~~~


