FROM node:20-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @nestjs/cli \
    && npm install \
    && npm cache clean --force

COPY . /usr/src/app

EXPOSE 3000

CMD npm run migration:run \
    && npm run start:dev