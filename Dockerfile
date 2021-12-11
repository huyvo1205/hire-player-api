FROM node:lts-alpine
# Create app directory
WORKDIR /app
# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then yarn install; \
        else yarn install --production; \
        fi
# Copy app source code
COPY . .
# Expose port and start application
EXPOSE 3000

CMD [ "yarn", "start" ]