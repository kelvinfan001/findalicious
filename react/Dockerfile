# Dockerfile for React frontend.

FROM node:14.15.3-alpine3.12

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
RUN npm install --silent --production

EXPOSE 5000

CMD ["npm","start"]
