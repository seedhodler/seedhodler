# A self-contained Seedhodler you can run yourself.
#
# There is deliberately no public preview of dev: an unreviewed build of a seed
# splitting tool should not be reachable by anyone who might mistake it for the
# real one. This image is the alternative. Run it on your own machine, look at
# it, throw it away.
#
#   docker build -t seedhodler .
#   docker run --rm -p 8080:80 seedhodler
#
# It also serves the offline case the README asks for: the image carries
# everything it needs, so it runs on a machine with no route to the internet.

FROM node:20-alpine AS build

WORKDIR /app

# Dependencies first, so a source change does not reinstall them.
COPY package.json package-lock.json ./
# npm ci installs exactly what the lockfile pins. The bundle must not depend on
# the day it was built.
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
