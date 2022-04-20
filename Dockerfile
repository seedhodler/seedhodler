FROM node:17-alpine AS build-stage
LABEL maintainer="Oleg Orlenko (oleg.or@room4.team)"

ARG PROD='1'

WORKDIR /app

COPY ./*.json /app/
COPY ./.env /app/

RUN apk add --no-cache make gcc g++ python3
RUN npm install

COPY ./src /app/src/
COPY ./public /app/public/

RUN if [ $PROD = '1' ]; then \
        npm run build:prod; \
    else \
        npm run build; \
    fi


# ------------------- NginX build -------------------
FROM nginx:1.17.6-alpine

COPY --from=build-stage /app/build/ /usr/share/nginx/html
