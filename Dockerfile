# Multi-Stage
# Stage 1: build
FROM node:16-alpine as build

WORKDIR /app

COPY . .

RUN set -x && yarn install && yarn run prestart:prod

# Stage 2: prod
FROM node:16-alpine as prod

WORKDIR /app

RUN chown -R node:node /app

USER node

COPY --chown=node:node --from=build /app/dist /app/dist

COPY --chown=node:node --from=build /app/package*.json /app/yarn.lock /app/

RUN yarn install --only=prod

EXPOSE 5000

CMD [ "node", "dist/app.js" ]