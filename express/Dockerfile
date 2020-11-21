# Dockerfile for Express backend.

FROM node:10.16-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./

# Install dependencies
RUN npm install --silent

# Copy local files to app folder
COPY . .

EXPOSE 3000

CMD ["npm","start"]
