# this is my manual process to deploy manually my project until I learn Docker Swarm..

cd ~/killer-game/

# API
docker pull arousseau/killer-game-api
docker stop "$(docker ps -q --filter ancestor=arousseau/killer-game-api)"
docker run -p 3001:3001 -d -v "$PWD/db:/app/api/db" arousseau/killer-game-api

# frontend
docker pull arousseau/killer-game-frontend
docker stop "$(docker ps -q --filter ancestor=arousseau/killer-game-frontend)"
docker run -p 3000:3000 -d arousseau/killer-game-frontend
