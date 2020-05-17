FROM node:lts-alpine as build-stage
MAINTAINER Hannes Hochreiner <hannes@hochreiner.net>
RUN mkdir /app
WORKDIR /app
COPY ./src ./src
COPY ./public ./public
COPY babel.config.js ./
COPY package*.json ./
COPY vue.config.js ./
COPY .eslintrc.js ./
COPY .browserslistrc ./
RUN npm install && npm run build

FROM nginx:alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
