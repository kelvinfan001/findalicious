## Prerequisites
- Docker daemon or Podman
- Google API Key
- Yelp API Key

## Local Development Build Using Docker
In the project's root directory, simply issue the following commands:
```terminal
GOOGLE_MAPS_API_KEY=<your key> YELP_API_KEY=<your key> docker-compose build && docker-compose up
```

A React development server will be spun up to serve the front end in development mode at `localhost:5000`.
Hot-reloading is supported; simply make your front end edits in your code editor and changes should be rendered automatically. 

A local express server will also be spun up at `localhost:3000` and connected to a MongoDB database.
To develop on the backend, you would need to restart the express server container to see changes: 
```terminal
GOOGLE_MAPS_API_KEY=<your key> YELP_API_KEY=<your key> docker-compose restart backend
```

For both frontend and backend, if new packages are installed, you would need to rebuild the container images.

Once you are done, you can remove the containers with `docker-compose down`.
Database-related volumes will be created and persisted for future use. If you would like to bring down those volumes, as well, use the `-v` flag. Similarly, the container images can be removed with `--rmi`. E.g `docker-compose down -v --rmi all`. 
