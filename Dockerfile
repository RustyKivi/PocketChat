FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY pocketchat.js ./
COPY config.json ./
COPY public ./public
COPY pages ./pages

EXPOSE 3040

CMD ["node", "pocketchat.js"]