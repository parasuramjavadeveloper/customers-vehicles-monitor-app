FROM node:11.6.0-alpine AS builder
EXPOSE 3002
COPY . ./vehicle-tracker-app
WORKDIR /vehicle-tracker-app
RUN npm i
RUN npm run build 
ENTRYPOINT ["node","server.js"]
