FROM node:16-alpine
# Create app directory
WORKDIR /app

ARG NODE_ENV
# Install app dependencies
COPY package.json yarn.lock ./

# install dev dependencies too
RUN set -x && yarn --prod=false

# Copy app source code
COPY . .

RUN set -x && yarn run prestart:prod
# Expose port and start application
EXPOSE 5000

CMD [ "node", "dist/app.js" ]