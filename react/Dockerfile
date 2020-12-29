# Dockerfile for React frontend.

FROM node:14.15.3-alpine3.12

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
# Note dev dependencies are also installed because `react-scripts` actually
# requires eslint.
RUN npm install --silent

EXPOSE 5000

CMD ["npm","start"]
