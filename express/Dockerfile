# Dockerfile for Express backend.

FROM node:14.15.3-alpine3.12

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
RUN npm install --silent --production

EXPOSE 3000

CMD ["npm","start"]
