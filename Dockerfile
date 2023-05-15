FROM node:alpine

WORKDIR /usr/src/app

COPY ./ .

RUN npm install

RUN npm run build