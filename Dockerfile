FROM node:lts-alpine
# Create app directory
WORKDIR /app
# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

ARG NODE_ENV

# install dev dependencies too
RUN set -x && yarn --prod=false

# Copy app source code
COPY . .
RUN set -x && yarn run prestart:prod
# Expose port and start application
EXPOSE 3000

CMD [ "node", "dist/app.js" ]