# Dockerfile for React frontend.

FROM node:14.15-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
RUN npm install --silent

EXPOSE 5000

CMD ["npm","start"]
