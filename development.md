## Local Build Using Docker
To get a local build running, you would need Docker, a Google API
Key, and a Yelp API Key. Edit `docker-compose.yml`'s environment
variables in the `server` service.
Then, in the project's root dir, simply issue the following commands:
- `docker-compose build`
- `docker-compose up`

Point your browser to `localhost:5000`.
