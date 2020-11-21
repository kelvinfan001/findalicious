## Prerequisites
- Docker
- Google API Key
- Yelp API Key

## Local Development Build Using Docker
In the project's root directory, simply issue the following commands:
```shell
GOOGLE_MAPS_API_KEY=<your key> YELP_API_KEY=<your key> docker-compose build
docker-compose up
```
A React development server will be spun up to serve the front end in development
mode at `localhost:5000`.
Hot-reloading is supported; simply make your front end edits in your
code editor and changes should be rendered automatically. 

A local express server will also be spun up at `localhost:3000` and connected to
a MongoDB database.
To develop on the backend, you would need to stop the containers (`docker-compose down`)
and start them up again (`docker-compose up`) to restart the express server
container to see changes.
